import { afterEach, describe, expect, it, vi } from "vitest";

import { CapabilityClient } from "@/lib/control-plane/capability-client";

import type { BaobabContentConfig } from "./config";
import { ContentEntryResolver } from "./entry-resolver";

const CORR = "7a8b9c0d-1e2f-4a3b-8c5d-6e7f8a9b0c1d";
const CTX = "11111111-2222-4333-8444-555555555555";
const now = () => new Date("2026-10-09T10:00:00Z");

const config: BaobabContentConfig = {
  tenantId: "tn_nabhold1",
  platformContextId: CTX,
  legalEntityId: "NABHOLD",
  digitalEstateId: "DE-1",
  locale: "en-ZA",
  timeoutMs: 1000,
  serviceOrigins: { "baobab-cms": "https://cms.example" },
};

const resolution = (over: Record<string, unknown> = {}, invocation: Record<string, unknown> = {}) => ({
  resolution_id: "res_1",
  context_id: CTX,
  capability_key: "content.entry.resolve",
  contract_version: 1,
  decision: "RESOLVED",
  grant_id: "g1",
  binding_id: "b1",
  invocation: {
    service_reference: "service://baobab-cms/content",
    route_reference: "/v1/content/resolve",
    protocol: "http",
    contract_version: 1,
    provider_id: "p1",
    engine_instance_id: "ei1",
    ...invocation,
  },
  resolved_at: "2026-10-09T10:00:00Z",
  expires_at: "2026-10-09T10:05:00Z",
  correlation_id: CORR,
  ...over,
});

const record = (over: Record<string, unknown> = {}) => ({
  record: {
    id: "rec1",
    tenant_id: "tn_nabhold1",
    content_key: "navigation",
    publication_state: "PUBLISHED",
    data: { navigationItems: [{ label: "Portfolio", href: "/portfolio" }] },
    ...over,
  },
  matched_scope: "EXACT",
  provenance: { trace: [], inheritance_mode: "OVERRIDE" },
});

function build(opts: {
  cpResponse?: (req: Request | RequestInit) => Response | Promise<Response>;
  cmsResponse?: () => Response | Promise<Response>;
  cmsToken?: () => Promise<string>;
  cfg?: BaobabContentConfig;
}) {
  const cmsCalls: Array<{ url: string; init: RequestInit }> = [];
  const cpFetch = vi.fn(async (_url: unknown, init: RequestInit) => {
    const body = JSON.parse(String(init.body));
    return (
      opts.cpResponse?.(init) ??
      new Response(JSON.stringify(resolution({ correlation_id: body.correlation_id })), { status: 200 })
    );
  }) as unknown as typeof fetch;
  const cmsFetch = vi.fn(async (url: unknown, init: RequestInit) => {
    cmsCalls.push({ url: String(url), init });
    return opts.cmsResponse?.() ?? new Response(JSON.stringify(record()), { status: 200 });
  }) as unknown as typeof fetch;
  const capabilities = new CapabilityClient({
    baseUrl: "https://cp.example",
    tokens: { getToken: async () => "resolve-token" },
    fetch: cpFetch,
    now,
  });
  const resolver = new ContentEntryResolver({
    config: opts.cfg ?? config,
    capabilities,
    contentTokens: { getToken: opts.cmsToken ?? (async () => "content-token") },
    fetch: cmsFetch,
    now,
  });
  return { resolver, cmsCalls, cpFetch, cmsFetch };
}

afterEach(() => vi.restoreAllMocks());

describe("ContentEntryResolver", () => {
  it("resolves the capability, then calls the mapped provider route with the content token", async () => {
    const { resolver, cmsCalls } = build({});
    const out = await resolver.resolveEntry("navigation");
    expect(out.status).toBe("ok");
    if (out.status === "ok") expect(out.dto.navigationItems).toEqual([{ label: "Portfolio", href: "/portfolio" }]);
    expect(cmsCalls).toHaveLength(1);
    expect(cmsCalls[0].url).toBe(`https://cms.example/v1/content/resolve?context_id=${CTX}`);
    expect((cmsCalls[0].init.headers as Record<string, string>).authorization).toBe("Bearer content-token");
    expect(JSON.parse(String(cmsCalls[0].init.body))).toEqual({
      tenant_id: "tn_nabhold1",
      content_key: "navigation",
      legal_entity_id: "NABHOLD",
      digital_estate_id: "DE-1",
      locale: "en-ZA",
    });
    expect(String(cmsCalls[0].init.body)).not.toContain("preview");
    expect(cmsCalls[0].init.redirect).toBe("error");
  });

  it("reuses the resolution until the Control Plane expiry", async () => {
    const { resolver, cpFetch } = build({});
    await resolver.resolveEntry("navigation");
    await resolver.resolveEntry("footer");
    expect(cpFetch).toHaveBeenCalledTimes(1);
  });

  it("fails closed when the capability is not resolved", async () => {
    const { resolver, cmsFetch } = build({
      cpResponse: () =>
        new Response(
          JSON.stringify({
            resolution_id: "r",
            context_id: CTX,
            capability_key: "content.entry.resolve",
            decision: "DENIED",
            reason_code: "NO_BINDING",
            resolved_at: "2026-10-09T10:00:00Z",
            correlation_id: CORR,
          }),
          { status: 200 },
        ),
    });
    expect(await resolver.resolveEntry("home")).toEqual({ status: "unavailable", reason: "CAPABILITY_NOT_RESOLVED" });
    expect(cmsFetch).not.toHaveBeenCalled();
  });

  it("fails closed with no content token and never calls the provider", async () => {
    const { resolver, cmsFetch } = build({ cmsToken: async () => { throw new Error("none"); } });
    expect(await resolver.resolveEntry("home")).toEqual({ status: "unavailable", reason: "CONTENT_TOKEN_UNAVAILABLE" });
    expect(cmsFetch).not.toHaveBeenCalled();
  });

  it("refuses an unmapped service name, an untrusted https origin and a route that changes origin", async () => {
    for (const invocation of [
      { service_reference: "service://other/content" },
      { service_reference: "https://evil.example/content" },
      { route_reference: "https://evil.example/v1/content/resolve" },
    ]) {
      const { resolver, cmsFetch } = build({
        cpResponse: () => new Response(JSON.stringify(resolution({}, invocation)), { status: 200 }),
      });
      const out = await resolver.resolveEntry("home");
      expect(out.status).toBe("unavailable");
      expect(cmsFetch).not.toHaveBeenCalled();
    }
  });

  it("treats a provider error, redirect failure and malformed answer as unavailable", async () => {
    expect(await build({ cmsResponse: () => new Response("{}", { status: 503 }) }).resolver.resolveEntry("home")).toEqual({
      status: "unavailable",
      reason: "PROVIDER_HTTP_503",
    });
    expect((await build({ cmsResponse: () => new Response("nope", { status: 200 }) }).resolver.resolveEntry("home")).status).toBe(
      "unavailable",
    );
    expect(
      (await build({ cmsResponse: () => new Response(JSON.stringify({ record: 1 }), { status: 200 }) }).resolver.resolveEntry("home")).status,
    ).toBe("unavailable");
  });

  it("returns none when nothing matches", async () => {
    const { resolver } = build({
      cmsResponse: () => new Response(JSON.stringify({ record: null, matched_scope: "NONE", provenance: {} }), { status: 200 }),
    });
    expect(await resolver.resolveEntry("home")).toEqual({ status: "none" });
  });

  it("rejects a record for another tenant, another key or an unpublished state", async () => {
    for (const over of [{ tenant_id: "tn_other" }, { content_key: "footer" }, { publication_state: "DRAFT" }]) {
      const { resolver } = build({ cmsResponse: () => new Response(JSON.stringify(record(over)), { status: 200 }) });
      expect(await resolver.resolveEntry("navigation")).toEqual({ status: "unavailable", reason: "PROVIDER_RECORD_REJECTED" });
    }
  });

  it("rejects record data that does not fit the page contract", async () => {
    const { resolver } = build({
      cmsResponse: () => new Response(JSON.stringify(record({ data: { navigationItems: "not a list" } })), { status: 200 }),
    });
    expect(await resolver.resolveEntry("navigation")).toEqual({ status: "unavailable", reason: "RECORD_DATA_INVALID" });
  });
});
