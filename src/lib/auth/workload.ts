import "server-only";
import * as oauth from "openid-client";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { WorkloadTokenProvider } from "@/lib/control-plane/capability-client";
import { AuthenticationDenied, secureUrl } from "./oidc/settings";
import { credentialFetch, fetchJson } from "./oidc/transport";

const CALLER = "baobab-int03-cms-consumer";
const scopes = { "baobab-control-plane": "context:resolve", "baobab-cms": "content:entry:resolve" } as const;
type Audience = keyof typeof scopes;

export interface DevelopmentWorkloadSettings {
  issuer: string;
  tokenEndpoint: string;
  introspectionEndpoint: string;
  clientSecret: string;
  cpOrigin: string;
  tenantId: string;
  organisationId: string;
  countryCode: string;
  deadline: number;
}

/** Named development evidence producer only. No product activation, human token,
 * token exchange, validator permission or implicit corporate authority. The
 * harness owns the fixed deadline and destroys issuer trust/runtime on closure.
 */
export function readDevelopmentWorkloadSettings(env: Record<string, string | undefined> = process.env): DevelopmentWorkloadSettings | null {
  if (env.NABHOLD_CMS_PROOF_ENABLED !== "true") return null;
  try {
    if (env.NABHOLD_WORKLOAD_ENVIRONMENT !== "development" || env.NABHOLD_WORKLOAD_CLIENT_ID !== CALLER ||
        env.NODE_TLS_REJECT_UNAUTHORIZED === "0") throw new Error();
    const issuer = secureUrl(env.NABHOLD_WORKLOAD_ISSUER ?? "").href;
    const tokenEndpoint = secureUrl(env.NABHOLD_WORKLOAD_TOKEN_ENDPOINT ?? "").href;
    const introspectionEndpoint = secureUrl(env.NABHOLD_WORKLOAD_INTROSPECTION_ENDPOINT ?? "").href;
    const cp = secureUrl(env.BAOBAB_CONTROL_PLANE_API_URL ?? "");
    if (cp.pathname !== "/" || [tokenEndpoint, introspectionEndpoint].some(u => new URL(u).origin !== new URL(issuer).origin)) throw new Error();
    const clientSecret = z.string().min(32).max(4096).parse(env.NABHOLD_WORKLOAD_CLIENT_SECRET);
    const tenantId = z.string().regex(/^tn_[a-z0-9]+$/).parse(env.NABHOLD_CONTENT_TENANT_ID);
    const organisationId = z.uuid().parse(env.NABHOLD_CONTENT_ORGANISATION_ID);
    const countryCode = z.string().regex(/^[A-Z]{2}$/).parse(env.NABHOLD_CONTENT_COUNTRY_CODE);
    const deadline = Date.parse(z.iso.datetime({ offset: true }).parse(env.NABHOLD_CMS_PROOF_DEADLINE));
    if (deadline <= Date.now() || deadline > Date.now() + 90 * 60_000) throw new Error();
    return { issuer, tokenEndpoint, introspectionEndpoint, clientSecret, cpOrigin: cp.origin, tenantId, organisationId, countryCode, deadline };
  } catch { throw new AuthenticationDenied(); }
}

/** Reuse the maintained OAuth client and existing bounded HTTPS transport. Each
 * acquisition is fresh and independently introspected: no positive revocation
 * cache, refresh token, caller-selected destination or token-bearing log. CP and
 * CMS must still verify their own audience and current authority independently.
 */
export class DevelopmentContentWorkload {
  private readonly config: oauth.Configuration;
  private subject: string | undefined;

  constructor(private readonly settings: DevelopmentWorkloadSettings, private readonly fetcher: typeof fetch = fetch) {
    // Revalidate explicit settings as well as environment input before any
    // secret can be sent. Tests may inject transport, never weaker TLS policy.
    for (const endpoint of [settings.tokenEndpoint, settings.introspectionEndpoint]) {
      if (secureUrl(endpoint).origin !== secureUrl(settings.issuer).origin) throw new AuthenticationDenied();
    }
    if (secureUrl(settings.cpOrigin).pathname !== "/") throw new AuthenticationDenied();
    if (!Number.isFinite(settings.deadline) || settings.deadline <= Date.now() || settings.deadline > Date.now() + 90 * 60_000) throw new AuthenticationDenied();
    this.config = new oauth.Configuration({ issuer: settings.issuer, token_endpoint: settings.tokenEndpoint,
      introspection_endpoint: settings.introspectionEndpoint }, CALLER, undefined, oauth.ClientSecretBasic(settings.clientSecret));
    const transport = credentialFetch([settings.tokenEndpoint, settings.introspectionEndpoint], fetcher);
    this.config[oauth.customFetch] = (url, options) => transport(url, { ...options,
      body: options.body instanceof Uint8Array ? Buffer.from(options.body) : options.body });
    this.config.timeout = 5;
  }

  tokens(audience: Audience): WorkloadTokenProvider {
    return { getToken: () => this.acquire(audience) };
  }

  private open(): void {
    if (Date.now() >= this.settings.deadline || process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") throw new AuthenticationDenied();
  }

  private async acquire(audience: Audience): Promise<string> {
    try {
      this.open();
      const result = await oauth.clientCredentialsGrant(this.config, { scope: scopes[audience], audience });
      const receivedAt = Date.now();
      if (typeof result.access_token !== "string" || !result.access_token || result.access_token.length > 8192 ||
          result.token_type.toLowerCase() !== "bearer" || !Number.isSafeInteger(result.expires_in) ||
          result.expires_in! <= 0 || result.expires_in! > 300 || receivedAt + result.expires_in! * 1000 > this.settings.deadline ||
          result.refresh_token !== undefined || result.id_token !== undefined) throw new Error();
      const claims = z.object({ active: z.literal(true), iss: z.literal(this.settings.issuer),
        sub: z.string().min(1).max(255), client_id: z.literal(CALLER), actor_type: z.literal("workload"),
        aud: z.union([z.literal(audience), z.tuple([z.literal(audience)])]),
        scope: z.literal(scopes[audience]), exp: z.number().int().positive().safe(),
        // When supplied, these must agree; CP additionally enforces the actual
        // canonical registry environment/owner regardless of token extensions.
        environment: z.literal("development").optional(),
        owner: z.literal("baobab-platform/infrastructure").optional(),
      }).parse(await oauth.tokenIntrospection(this.config, result.access_token));
      if (claims.exp * 1000 <= Date.now() || claims.exp * 1000 > this.settings.deadline ||
          claims.exp * 1000 > receivedAt + result.expires_in! * 1000 || this.subject !== undefined && this.subject !== claims.sub) throw new Error();
      this.open();
      // Both audiences must represent the same verified (issuer,subject). CP
      // resolves the canonical Principal; this client never invents its UUID.
      this.subject = claims.sub;
      return result.access_token;
    } catch { throw new AuthenticationDenied(); }
  }

  /** Obtain a new CP-owned RUNTIME context for every content read. Selectors
   * are not authority. CP attests membership, PRIMARY Organisation and market;
   * its provider validator later redeems the context against the CMS token.
   * No subject/principal/authority-purpose assertion is sent by the estate.
   */
  async currentContextId(): Promise<string> {
    try {
      const token = await this.acquire("baobab-control-plane");
      const started = Date.now();
      const context = z.object({ context_id: z.uuid(), tenant_id: z.literal(this.settings.tenantId),
        organisation_id: z.literal(this.settings.organisationId), country_code: z.literal(this.settings.countryCode),
        resolved_at: z.iso.datetime({ offset: true }), expires_at: z.iso.datetime({ offset: true }),
      }).parse(await fetchJson(new URL("/v1/platform-context/resolve", this.settings.cpOrigin).href, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-correlation-id": randomUUID() },
        body: JSON.stringify({ tenant_id: this.settings.tenantId, organisation_id: this.settings.organisationId, country_code: this.settings.countryCode }),
      }, this.fetcher));
      const resolved = Date.parse(context.resolved_at), expires = Date.parse(context.expires_at);
      if (resolved < started - 30_000 || resolved > Date.now() + 30_000 || expires <= Date.now() ||
          expires <= resolved || expires > this.settings.deadline || expires - resolved > 15 * 60_000) throw new Error();
      this.open();
      return context.context_id;
    } catch { throw new AuthenticationDenied(); }
  }
}
