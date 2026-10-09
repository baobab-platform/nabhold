import { randomUUID } from "node:crypto";
import { z } from "zod";

import {
  CapabilityClient,
  type WorkloadTokenProvider,
} from "@/lib/control-plane/capability-client";
import { pageDtoSchema, type PageDto } from "@/integrations/payload/dto/page.dto";

import type { BaobabContentConfig } from "./config";

/**
 * Reads one content entry through `content.entry.resolve`:
 *
 *   1. ask the Control Plane to resolve the capability for the platform
 *      context (it answers with a provider invocation, never content);
 *   2. call the resolved provider route with a workload token that carries
 *      the content scope (a different scope from the one resolution needs);
 *   3. accept only a PUBLISHED record for this tenant and content key.
 *
 * Every failure returns `null` and a reason code; the caller serves estate
 * defaults. Nothing is retried, cached beyond the Control Plane's own expiry,
 * or logged with a token, a context id or a response body. Preview mode is
 * never requested.
 */
export type EntryOutcome =
  | { status: "ok"; dto: PageDto }
  | { status: "none" }
  | { status: "unavailable"; reason: string };

const CAPABILITY_KEY = "content.entry.resolve";
const CONTRACT_VERSION = 1;

const recordSchema = z
  .object({
    id: z.string().min(1),
    tenant_id: z.string().min(1),
    content_key: z.string().min(1),
    publication_state: z.string(),
    data: z.record(z.string(), z.unknown()),
  })
  .passthrough();

const responseSchema = z
  .object({
    record: recordSchema.nullable(),
    matched_scope: z.enum(["EXACT", "FALLBACK", "NONE"]),
  })
  .passthrough();

interface CachedInvocation {
  url: string;
  expiresAt: number;
}

export interface EntryResolverOptions {
  config: BaobabContentConfig;
  capabilities: CapabilityClient;
  contentTokens: WorkloadTokenProvider;
  fetch?: typeof fetch;
  now?: () => Date;
}

export class ContentEntryResolver {
  private readonly config: BaobabContentConfig;
  private readonly capabilities: CapabilityClient;
  private readonly tokens: WorkloadTokenProvider;
  private readonly fetchImpl: typeof fetch;
  private readonly now: () => Date;
  private cached: CachedInvocation | null = null;

  constructor(options: EntryResolverOptions) {
    this.config = options.config;
    this.capabilities = options.capabilities;
    this.tokens = options.contentTokens;
    this.fetchImpl = options.fetch ?? fetch;
    this.now = options.now ?? (() => new Date());
  }

  async resolveEntry(contentKey: string): Promise<EntryOutcome> {
    let target: string;
    try {
      target = await this.target();
    } catch {
      return { status: "unavailable", reason: "CAPABILITY_NOT_RESOLVED" };
    }

    let token: string;
    try {
      token = await this.tokens.getToken();
    } catch {
      return { status: "unavailable", reason: "CONTENT_TOKEN_UNAVAILABLE" };
    }

    const correlationId = randomUUID();
    let response: Response;
    try {
      response = await this.fetchImpl(target, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
          "x-correlation-id": correlationId,
        },
        body: JSON.stringify({
          tenant_id: this.config.tenantId,
          content_key: contentKey,
          legal_entity_id: this.config.legalEntityId,
          digital_estate_id: this.config.digitalEstateId,
          ...(this.config.marketId ? { market_id: this.config.marketId } : {}),
          locale: this.config.locale,
        }),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(this.config.timeoutMs),
      });
    } catch {
      return { status: "unavailable", reason: "PROVIDER_UNREACHABLE" };
    }

    if (!response.ok) {
      return { status: "unavailable", reason: `PROVIDER_HTTP_${response.status}` };
    }

    let parsed;
    try {
      parsed = responseSchema.safeParse(await response.json());
    } catch {
      return { status: "unavailable", reason: "PROVIDER_RESPONSE_NOT_JSON" };
    }
    if (!parsed.success) {
      return { status: "unavailable", reason: "PROVIDER_RESPONSE_INVALID" };
    }

    const { record, matched_scope } = parsed.data;
    if (!record || matched_scope === "NONE") return { status: "none" };

    // Defence in depth: the provider already filters, but this estate trusts only its own tenant and key.
    if (
      record.tenant_id !== this.config.tenantId ||
      record.content_key !== contentKey ||
      record.publication_state !== "PUBLISHED"
    ) {
      return { status: "unavailable", reason: "PROVIDER_RECORD_REJECTED" };
    }

    const dto = pageDtoSchema.safeParse({
      ...record.data,
      id: record.id,
      contentKey: record.content_key,
      status: "published",
    });
    if (!dto.success) {
      return { status: "unavailable", reason: "RECORD_DATA_INVALID" };
    }
    return { status: "ok", dto: dto.data };
  }

  /** The provider URL from a fresh RESOLVED decision; reused only until the Control Plane's expiry. */
  private async target(): Promise<string> {
    const nowMs = this.now().getTime();
    if (this.cached && this.cached.expiresAt > nowMs) return this.cached.url;

    const resolved = await this.capabilities.resolve({
      capability_key: CAPABILITY_KEY,
      required_contract_version: CONTRACT_VERSION,
      context_id: this.config.platformContextId,
      correlation_id: randomUUID(),
    });

    if (resolved.invocation.protocol !== "http") {
      throw new Error("unsupported protocol");
    }
    const reference = new URL(resolved.invocation.service_reference);
    let origin: string;
    if (reference.protocol === "service:") {
      const mapped = this.config.serviceOrigins[reference.hostname];
      if (!mapped) throw new Error("unmapped service");
      origin = mapped;
    } else if (reference.protocol === "https:") {
      // A direct URL is accepted only for an origin this estate already trusts with its content token.
      if (!Object.values(this.config.serviceOrigins).includes(reference.origin)) {
        throw new Error("untrusted origin");
      }
      origin = reference.origin;
    } else {
      throw new Error("unsupported service reference");
    }
    // The route is relative to the provider origin; it may not move the call to another origin.
    const url = new URL(resolved.invocation.route_reference ?? "", origin);
    if (url.origin !== new URL(origin).origin) throw new Error("origin changed");
    url.searchParams.set("context_id", this.config.platformContextId);

    const expiresAt = resolved.expires_at
      ? Date.parse(resolved.expires_at)
      : nowMs;
    this.cached = { url: url.toString(), expiresAt };
    return url.toString();
  }
}
