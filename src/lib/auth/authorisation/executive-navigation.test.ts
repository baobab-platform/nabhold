// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
vi.mock("server-only", () => ({}));
import { readExecutiveNavigationSelection, resolveExecutiveNavigation, type ExecutiveNavigationSelection } from "./executive-navigation";
import { AuthenticationDenied, type AuthSettings } from "../oidc/settings";
import type { ConfidentialSession, ConfidentialSessionStore } from "../store/confidential-store";
import { authHandlers, SESSION } from "../oidc/handlers";

const principal = "019a0915-a8c0-7000-8000-000000000001";
const organisation = "019a0915-a8c0-7000-8000-000000000002";
const selected: ExecutiveNavigationSelection = { organisationId: organisation, tenantId: "tn_nabholdfixture", countryCode: "ZA", environment: "integration" };
const settings: AuthSettings = { origin: "https://estate.example.test", issuer: "https://iam.example.test/",
  cpOrigin: "https://cp.example.test", introspectionEndpoint: "https://iam.example.test/introspect",
  clientId: "synthetic-human-client", clientSecret: "synthetic-only-long-secret", algorithm: "RS256",
  redirectUri: "https://estate.example.test/api/auth/callback" };
const handle = "h".repeat(43);
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllEnvs(); });

function fixture() {
  const start = Date.now();
  const clock = { now: start };
  vi.spyOn(Date, "now").mockImplementation(() => clock.now);
  const session: ConfidentialSession = { issuer: settings.issuer, subject: "independent-human-subject", accessToken: "PRIVATE-HUMAN-TOKEN",
    csrfToken: "c".repeat(43), createdAt: start - 1000, expiresAt: start + 300_000 };
  const grant = (permission: string, scope: Record<string, string>, n: number) => ({ grant_id: `agr_fixture${n}`, permission, scope,
    grant_type: "STANDING", source: "DIRECT", risk_class: "LOW" });
  const authority = { principal_id: principal, evaluated_at: new Date(start).toISOString(), grants: [
    grant("organisation.view", { level: "ORGANISATION", organisation_id: organisation }, 1),
    grant("tenant.view", { level: "TENANT", tenant_id: selected.tenantId }, 2),
    grant("market.view", { level: "TENANT", tenant_id: selected.tenantId }, 3),
  ] };
  const mapping = { tenant_id: selected.tenantId, mapping_role: "PRIMARY_ORGANISATION", mapping_provenance: "CP-owned-current-source",
    desired_state: "active", observed_state: "active", markets_visible: true,
    market_participations: [{ country_code: "ZA", registry_market_id: "mkt_za", currency_code: "ZAR" }] };
  const overview = { organisation_id: organisation, evaluated_at: new Date(start).toISOString(),
    profile: { canonical_entity_id: organisation, display_name: "Synthetic holding", status: "ACTIVE" }, tenants: [mapping],
    legal_entities: [{ private_field: "MUST-NOT-ESCAPE" }], corporate_relationships: [{ private_field: "MUST-NOT-ESCAPE" }] };
  const tenant = { tenant_id: selected.tenantId, display_name: "Synthetic tenant", desired_state: "active", observed_state: "active" };
  let introspections = 0, authorityReads = 0;
  const hooks = { before: (_url: string) => {}, active: (_read: number) => true,
    authority: (_read: number): unknown => authority, overview: (): unknown => overview, tenant: (): unknown => tenant };
  const fetcher = vi.fn<typeof fetch>(async (url, init) => {
    const target = String(url);
    hooks.before(target);
    expect(init?.cache).toBe("no-store"); expect(init?.redirect).toBe("error");
    if (target === settings.introspectionEndpoint) return Response.json({
      active: hooks.active(++introspections), iss: settings.issuer, sub: session.subject, aud: "baobab-control-plane",
      exp: Math.floor((start + 120_000) / 1000), client_id: settings.clientId, scope: "openid authority:self" });
    expect(new Headers(init?.headers).get("authorization")).toBe(`Bearer ${session.accessToken}`);
    if (target === settings.cpOrigin + "/v1/admin/effective-authority") return Response.json(hooks.authority(++authorityReads));
    if (target === settings.cpOrigin + `/v1/organisations/${organisation}/overview`) return Response.json(hooks.overview());
    if (target === settings.cpOrigin + `/v1/tenants/${selected.tenantId}`) return Response.json(hooks.tenant());
    throw new Error("Unexpected credential destination");
  });
  const resolve = (input = selected, auth = settings) => resolveExecutiveNavigation(session, input, auth, { fetcher, now: () => clock.now });
  const readSession = vi.fn(async () => session as ConfidentialSession | null);
  const handlers = authHandlers({ settings: () => settings, store: () => ({ readSession } as unknown as ConfidentialSessionStore),
    navigationSelection: () => selected, fetcher });
  const request = (suffix = "", headers: Record<string, string> = {}) => new NextRequest(`${settings.origin}/api/auth/context${suffix}`,
    { headers: { cookie: `${SESSION}=${handle}`, ...headers } });
  return { start, clock, session, authority, mapping, overview, tenant, hooks, fetcher, resolve, handlers, request, readSession };
}

describe("G04B-05 concrete read-only human executive navigation", () => {
  it("reads exact current grants and PRIMARY/market sources with one human bearer and rechecks both boundaries", async () => {
    const f = fixture();
    const result = await f.resolve();
    expect(f.fetcher).toHaveBeenCalledTimes(8);
    expect(result).toEqual({ kind: "EXECUTIVE_NAVIGATION", organisationId: organisation, organisationName: "Synthetic holding",
      tenantId: selected.tenantId, tenantName: "Synthetic tenant", market: { countryCode: "ZA", marketId: "mkt_za", currencyCode: "ZAR" },
      evaluatedAt: f.overview.evaluated_at, expiresAt: f.start + 10_000, executionAuthority: false });
    expect(JSON.stringify(result)).not.toMatch(/TOKEN|MUST-NOT-ESCAPE|grant_id|context_id|authorised/);
    expect(f.fetcher.mock.calls.every(call => String(call[0]).includes("introspect") || !String(call[0]).includes("context/resolve"))).toBe(true);
  });

  for (const mutation of ["missing", "group", "other-tenant", "extra-anchor", "environment", "expired", "duplicate", "stale", "future", "principal"] as const) {
    it(`refuses ${mutation} authority before resource reads`, async () => {
      const f = fixture();
      if (mutation === "missing") f.authority.grants.pop();
      if (mutation === "group") f.authority.grants[0].scope = { level: "CORPORATE_GROUP", corporate_group_id: "group_fixture", mode: "DYNAMIC_GROUP_DESCENDANTS" };
      if (mutation === "other-tenant") f.authority.grants[1].scope.tenant_id = "tn_neighbourfixture";
      if (mutation === "extra-anchor") f.authority.grants[0].scope.tenant_id = selected.tenantId;
      if (mutation === "environment") f.authority.grants[0].scope.environment = "production";
      if (mutation === "expired") Object.assign(f.authority.grants[0], { grant_type: "TIME_BOUND", valid_until: new Date(f.start - 1).toISOString() });
      if (mutation === "duplicate") f.authority.grants[1].grant_id = f.authority.grants[0].grant_id;
      if (mutation === "stale") f.authority.evaluated_at = new Date(f.start - 30_001).toISOString();
      if (mutation === "future") f.authority.evaluated_at = new Date(f.start + 5001).toISOString();
      if (mutation === "principal") f.hooks.authority = n => ({ ...f.authority, principal_id: n === 1 ? principal : organisation });
      await expect(f.resolve()).rejects.toBeInstanceOf(AuthenticationDenied);
      expect(f.fetcher.mock.calls.some(call => String(call[0]).includes("/v1/organisations/"))).toBe(false);
    });
  }

  for (const mutation of ["organisation", "tenant", "duplicate-primary", "secondary", "invisible-market", "missing-market", "duplicate-market", "suspended", "unknown-state", "stale-overview", "wrong-tenant-record"] as const) {
    it(`refuses ${mutation} resource observations`, async () => {
      const f = fixture();
      if (mutation === "organisation") f.overview.profile.canonical_entity_id = principal;
      if (mutation === "tenant") f.mapping.tenant_id = "tn_otherfixture";
      if (mutation === "duplicate-primary") f.overview.tenants.push({ ...f.mapping });
      if (mutation === "secondary") f.mapping.mapping_role = "SECONDARY";
      if (mutation === "invisible-market") f.mapping.markets_visible = false;
      if (mutation === "missing-market") f.mapping.market_participations = [];
      if (mutation === "duplicate-market") f.mapping.market_participations.push({ ...f.mapping.market_participations[0] });
      if (mutation === "suspended") f.tenant.observed_state = "suspended";
      if (mutation === "unknown-state") f.mapping.desired_state = "mystery";
      if (mutation === "stale-overview") f.overview.evaluated_at = new Date(f.start - 30_001).toISOString();
      if (mutation === "wrong-tenant-record") f.tenant.tenant_id = "tn_neighbourfixture";
      await expect(f.resolve()).rejects.toBeInstanceOf(AuthenticationDenied);
    });
  }

  it("refuses revocation, grant withdrawal or identity replacement during the source reads", async () => {
    for (const mutation of ["revoked", "withdrawn", "replaced"]) {
      const f = fixture();
      if (mutation === "revoked") f.hooks.active = n => n === 1;
      if (mutation === "withdrawn") f.hooks.authority = n => ({ ...f.authority, grants: n < 4 ? f.authority.grants : [] });
      if (mutation === "replaced") f.hooks.authority = n => ({ ...f.authority, principal_id: n < 3 ? principal : organisation });
      await expect(f.resolve()).rejects.toBeInstanceOf(AuthenticationDenied);
    }
  });

  it("caps the observation by time-bound grants and refuses expiry or deadline crossing during reads", async () => {
    const f = fixture();
    Object.assign(f.authority.grants[0], { grant_type: "TIME_BOUND", valid_until: new Date(f.start + 1000).toISOString() });
    expect((await f.resolve()).expiresAt).toBe(f.start + 1000);
    f.hooks.before = url => { if (url.endsWith(`/v1/tenants/${selected.tenantId}`)) f.clock.now = f.start + 1001; };
    await expect(f.resolve()).rejects.toBeInstanceOf(AuthenticationDenied);
    const g = fixture();
    g.hooks.before = url => { if (url.endsWith(`/v1/tenants/${selected.tenantId}`)) g.clock.now = g.start + 10_001; };
    await expect(g.resolve()).rejects.toBeInstanceOf(AuthenticationDenied);
  });

  it("honours an optional future standing-grant bound and refuses an expired bound", async () => {
    const f = fixture();
    Object.assign(f.authority.grants[0], { valid_until: new Date(f.start + 1000).toISOString() });
    expect((await f.resolve()).expiresAt).toBe(f.start + 1000);
    Object.assign(f.authority.grants[0], { valid_until: new Date(f.start - 1).toISOString() });
    await expect(f.resolve()).rejects.toBeInstanceOf(AuthenticationDenied);
  });

  for (const grantType of ["TIME_BOUND", "JUST_IN_TIME"]) {
    it(`requires an explicit expiry for ${grantType} grants`, async () => {
      const f = fixture();
      f.authority.grants[0].grant_type = grantType;
      await expect(f.resolve()).rejects.toBeInstanceOf(AuthenticationDenied);
      expect(f.fetcher.mock.calls.some(call => String(call[0]).includes("/v1/organisations/"))).toBe(false);
    });
  }

  it("bounds bodies and refuses redirects, malformed source and dependency failures without disclosing them", async () => {
    for (const kind of ["oversized", "redirect", "malformed", "unavailable"]) {
      const f = fixture(), original = f.fetcher.getMockImplementation()!;
      f.fetcher.mockImplementation(async (url, init) => {
        if (!String(url).includes("/v1/organisations/")) return original(url, init);
        if (kind === "unavailable") return Response.json({ private: "SECRET" }, { status: 503 });
        if (kind === "oversized") return new Response("x".repeat(65537), { headers: { "Content-Type": "application/json" } });
        if (kind === "malformed") return new Response("PRIVATE-INVALID-JSON", { headers: { "Content-Type": "application/json" } });
        const response = Response.json(f.overview); Object.defineProperty(response, "redirected", { value: true }); return response;
      });
      await expect(f.resolve()).rejects.toEqual(new AuthenticationDenied());
    }
  });

  it("cancels a body that stalls after successful headers at the transport deadline", async () => {
    vi.useFakeTimers();
    // Node's AbortSignal.timeout uses internal timers; make only that clock
    // controllable while retaining the real signal and stalled stream reader.
    vi.spyOn(AbortSignal, "timeout").mockImplementation(delay => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new DOMException("deadline", "TimeoutError")), delay);
      return controller.signal;
    });
    const f = fixture(), original = f.fetcher.getMockImplementation()!;
    const cancel = vi.fn();
    f.fetcher.mockImplementation(async (url, init) => String(url).includes("/v1/organisations/")
      ? new Response(new ReadableStream({ start() { /* Peer never closes the body. */ }, cancel }),
        { headers: { "Content-Type": "application/json" } }) : original(url, init));
    const rejected = expect(f.resolve()).rejects.toBeInstanceOf(AuthenticationDenied);
    await vi.advanceTimersByTimeAsync(5001);
    await rejected;
    expect(cancel).toHaveBeenCalled();
  });

  it("does not infer permission from another scope or let another mapped tenant change the selection", async () => {
    const f = fixture();
    f.overview.tenants.push({ ...f.mapping, tenant_id: "tn_unrelatedfixture", desired_state: "suspended", observed_state: "suspended" });
    expect((await f.resolve()).tenantId).toBe(selected.tenantId);
    const g = fixture();
    g.hooks.authority = () => ({ ...g.authority, grants: g.authority.grants.map(item => ({ ...item,
      scope: { level: "PLATFORM" } })) });
    await expect(g.resolve()).rejects.toBeInstanceOf(AuthenticationDenied);
  });

  it("rejects malformed selectors and unsafe CP destinations before credentialed I/O", async () => {
    const f = fixture();
    for (const tenantId of ["tn_", "tn_AAA", organisation, "tn_abc/escape"]) {
      await expect(f.resolve({ ...selected, tenantId })).rejects.toBeInstanceOf(AuthenticationDenied);
    }
    for (const cpOrigin of ["http://cp.example.test", settings.origin, "https://cp.example.test/base", "https://user:pass@cp.example.test"]) {
      await expect(f.resolve(selected, { ...settings, cpOrigin })).rejects.toBeInstanceOf(AuthenticationDenied);
    }
    expect(f.fetcher).not.toHaveBeenCalled();
  });
});

describe("G04B-05 confidential BFF context route", () => {
  it("returns only current read-only context with no caching or credential leakage", async () => {
    const f = fixture(), response = await f.handlers.navigation(f.request());
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("vary")).toBe("Cookie");
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
    const json = await response.json();
    expect(json.executionAuthority).toBe(false); expect(json.context_id).toBeUndefined();
    expect(JSON.stringify(json)).not.toMatch(/PRIVATE|SECRET|csrfToken|grant_id/);
    expect(f.readSession).toHaveBeenCalledTimes(2);
  });

  it("defaults to unavailable before reading custody or calling dependencies", async () => {
    const f = fixture(), deps = { settings: vi.fn(() => settings), store: vi.fn(() => null), navigationSelection: () => null, fetcher: f.fetcher };
    expect((await authHandlers(deps).navigation(f.request())).status).toBe(404);
    expect(deps.settings).not.toHaveBeenCalled(); expect(deps.store).not.toHaveBeenCalled(); expect(f.fetcher).not.toHaveBeenCalled();
    expect(readExecutiveNavigationSelection({})).toBeNull();
    expect(() => readExecutiveNavigationSelection({ NABHOLD_EXECUTIVE_CONTEXT_ENABLED: "true" })).toThrow(AuthenticationDenied);
    expect(readExecutiveNavigationSelection({ NABHOLD_EXECUTIVE_CONTEXT_ENABLED: "true",
      NABHOLD_EXECUTIVE_ORGANISATION_ID: organisation, NABHOLD_EXECUTIVE_TENANT_ID: selected.tenantId,
      NABHOLD_EXECUTIVE_COUNTRY_CODE: "ZA", NABHOLD_OIDC_ENVIRONMENT: "integration" })).toEqual(selected);
    expect(() => readExecutiveNavigationSelection({ NABHOLD_EXECUTIVE_CONTEXT_ENABLED: "true",
      NABHOLD_EXECUTIVE_ORGANISATION_ID: organisation, NABHOLD_EXECUTIVE_TENANT_ID: selected.tenantId,
      NABHOLD_EXECUTIVE_COUNTRY_CODE: "ZA", NABHOLD_OIDC_ENVIRONMENT: "production" })).toThrow(AuthenticationDenied);
  });

  it("never accepts browser scope, foreign origin or duplicate session cookies", async () => {
    const f = fixture();
    for (const request of [f.request("?tenant_id=tn_neighbourfixture"), f.request("", { origin: "https://foreign.example.test" }),
      f.request("", { "sec-fetch-site": "cross-site" }), f.request("", { cookie: `${SESSION}=${handle}; ${SESSION}=${handle}` }),
      f.request("", { cookie: "" })]) {
      const response = await f.handlers.navigation(request);
      expect(response.status).toBe(401); expect(await response.json()).toEqual({ code: "AUTHENTICATION_UNAVAILABLE_OR_DENIED" });
    }
    expect(f.fetcher).not.toHaveBeenCalled();
  });

  it("refuses local logout or custody replacement during remote reads", async () => {
    for (const current of [null, { accessToken: "different" }]) {
      const f = fixture();
      f.readSession.mockResolvedValueOnce(f.session).mockResolvedValueOnce(current ? { ...f.session, ...current } : null);
      expect((await f.handlers.navigation(f.request())).status).toBe(401);
    }
  });

  it("caps the returned observation when local custody has a shorter current lifetime", async () => {
    const f = fixture();
    f.readSession.mockResolvedValueOnce(f.session).mockResolvedValueOnce({ ...f.session, expiresAt: f.start + 500 });
    const response = await f.handlers.navigation(f.request());
    expect(response.status).toBe(200);
    expect((await response.json()).expiresAt).toBe(f.start + 500);
  });
});
