// @vitest-environment node
import { mkdtempSync, writeFileSync, chmodSync, symlinkSync, linkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it, vi } from "vitest";
import { executiveObservationPlanSchema, observeExecutiveNavigation, type ExecutiveObservationPlan } from "./executive-navigation-observer";

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); vi.unstubAllEnvs(); });
function fixture() {
  // Synthetic peers use a controlled environment; refusal of unsafe ambient
  // options is exercised separately without weakening the real CLI boundary.
  for (const key of ["NODE_OPTIONS", "NODE_DEBUG", "DEBUG", "PWDEBUG", "NODE_TLS_REJECT_UNAUTHORIZED"]) vi.stubEnv(key, "");
  const started = Date.now(), clock = { now: started };
  const plan: ExecutiveObservationPlan = { version: "1.0", environment: "integration", run_id: "a".repeat(32),
    deadline: new Date(started + 60_000).toISOString(), approval_reference: "UNATTESTED_reference",
    bff_origin: "https://estate.example.test", cp_origin: "https://cp.example.test",
    expected: { owner_principal_id: "019a0915-a8c0-7000-8000-000000000001", denied_principal_id: "019a0915-a8c0-7000-8000-000000000002",
      organisation_id: "019a0915-a8c0-7000-8000-000000000003", tenant_id: "tn_ownfixture", country_code: "ZA", market_id: "mkt_za", currency_code: "ZAR" },
    sources: { nabhold: "b".repeat(40), cp: "c".repeat(40), iam: "d".repeat(40), shared: "e".repeat(40), infrastructure: "f".repeat(40) } };
  const credentials = { owner_session: "o".repeat(43), denied_session: "d".repeat(43),
    owner_cp_token: "PRIVATE_OWNER_TOKEN_" + "x".repeat(32), denied_cp_token: "PRIVATE_DENIED_TOKEN_" + "y".repeat(32) };
  const grants = [
    { grant_id: "agr_own1", permission: "organisation.view", scope: { level: "ORGANISATION", organisation_id: plan.expected.organisation_id }, grant_type: "STANDING", source: "DIRECT", risk_class: "LOW" },
    { grant_id: "agr_own2", permission: "tenant.view", scope: { level: "TENANT", tenant_id: plan.expected.tenant_id }, grant_type: "STANDING", source: "DIRECT", risk_class: "LOW" },
    { grant_id: "agr_own3", permission: "market.view", scope: { level: "TENANT", tenant_id: plan.expected.tenant_id }, grant_type: "STANDING", source: "DIRECT", risk_class: "LOW" },
  ];
  const mapping = { tenant_id: plan.expected.tenant_id, mapping_role: "PRIMARY_ORGANISATION", mapping_provenance: "CP_source",
    desired_state: "active", observed_state: "active", markets_visible: true,
    market_participations: [{ country_code: "ZA", registry_market_id: "mkt_za", currency_code: "ZAR" }] };
  const org = { organisation_id: plan.expected.organisation_id, evaluated_at: new Date(started).toISOString(),
    profile: { canonical_entity_id: plan.expected.organisation_id, display_name: "Own synthetic organisation", status: "ACTIVE" },
    tenants: [mapping], private_extra: "MUST_NOT_BE_RETAINED" };
  const tenant = { tenant_id: plan.expected.tenant_id, display_name: "Own synthetic tenant", desired_state: "active", observed_state: "active" };
  const context = { kind: "EXECUTIVE_NAVIGATION", organisationId: plan.expected.organisation_id, organisationName: org.profile.display_name,
    tenantId: plan.expected.tenant_id, tenantName: tenant.display_name, market: { countryCode: "ZA", marketId: "mkt_za", currencyCode: "ZAR" },
    evaluatedAt: new Date(started).toISOString(), expiresAt: started + 9000, executionAuthority: false };
  const hooks = { before: (_path: string) => {}, ownerGrants: (_n: number): unknown => grants, deniedGrants: (_n: number): unknown => [],
    context: (): unknown => context, negativeStatus: 401, negativeBody: { code: "AUTHENTICATION_UNAVAILABLE_OR_DENIED" },
    csrf: "c".repeat(43), peerActive: true, contextHeaders: { "cache-control": "private, no-store", vary: "Cookie" } as Record<string, string>,
    sessionHeaders: { "cache-control": "private, no-store" } as Record<string, string> };
  let ownCalls = 0, peerCalls = 0;
  const send = vi.fn<typeof fetch>(async (input, init) => {
    const url = new URL(String(input)), headers = new Headers(init?.headers);
    hooks.before(url.pathname);
    expect(init?.method).toBe("GET"); expect(init?.cache).toBe("no-store"); expect(init?.redirect).toBe("error");
    const cp = url.origin === plan.cp_origin;
    expect(cp || url.origin === plan.bff_origin).toBe(true);
    if (cp) expect(headers.has("cookie")).toBe(false);
    else expect(headers.has("authorization")).toBe(false);
    const denied = cp ? headers.get("authorization") === `Bearer ${credentials.denied_cp_token}`
      : headers.get("cookie") === `__Host-nabhold-session=${credentials.denied_session}`;
    const id = denied ? plan.expected.denied_principal_id : plan.expected.owner_principal_id;
    if (url.pathname === "/api/auth/session") return Response.json({ principalId: id, expiresAt: started + 120_000, csrfToken: hooks.csrf },
      { status: denied && !hooks.peerActive ? 401 : 200, headers: hooks.sessionHeaders });
    if (url.pathname === "/v1/admin/effective-authority") return Response.json({ principal_id: id, evaluated_at: new Date(started).toISOString(),
      grants: denied ? hooks.deniedGrants(++peerCalls) : hooks.ownerGrants(++ownCalls) });
    if (url.pathname.includes("/v1/organisations/")) return Response.json(org);
    if (url.pathname.includes("/v1/tenants/")) return Response.json(tenant);
    if (url.pathname === "/api/auth/context") {
      if (!headers.has("cookie") || denied || url.search || headers.has("origin")) return Response.json(hooks.negativeBody, { status: hooks.negativeStatus });
      return Response.json(hooks.context(), { headers: hooks.contextHeaders });
    }
    throw new Error("PRIVATE transport error must not escape");
  });
  const run = () => observeExecutiveNavigation(plan, credentials, { fetch: send, now: () => clock.now });
  return { plan, credentials, grants, mapping, org, tenant, context, hooks, send, run, clock, started };
}

describe("executive navigation independent read observations", () => {
  it("compares BFF context with current direct CP sources and keeps every acceptance gate false", async () => {
    const f = fixture(), report = await f.run();
    expect(report.status).toBe("OBSERVED_NOT_ACCEPTED"); expect(report.evidence_class).toBe("SYNTHETIC");
    expect(report.checks.every(c => c.passed)).toBe(true); expect(report.checks).toHaveLength(10);
    expect(report.independent_acceptance || report.execution_authority || report.topology_approval_attested || report.source_runtime_attested ||
      report.int03c_qualified || report.nab03_qualified || report.production_authorized).toBe(false);
    for (const o of report.observations.filter(o => o.label.endsWith("_session"))) expect(o.response_sha256).toBeUndefined();
    const text = JSON.stringify(report);
    for (const value of [...Object.values(f.credentials), f.hooks.csrf, f.plan.bff_origin, f.plan.expected.owner_principal_id, "MUST_NOT_BE_RETAINED"]) expect(text).not.toContain(value);
    expect(report.observations.some(o => o.label === "cp_organisation" && o.response_sha256)).toBe(true);
  });

  it("requires four independent valid credentials before any network call", async () => {
    for (const key of Object.keys(fixture().credentials)) {
      const f = fixture(); Object.assign(f.credentials, { [key]: "invalid PRIVATE\n" });
      expect((await f.run()).status).toBe("BLOCKED"); expect(f.send).not.toHaveBeenCalled();
    }
    const f = fixture(); f.credentials.denied_session = f.credentials.owner_session;
    expect((await f.run()).status).toBe("BLOCKED"); expect(f.send).not.toHaveBeenCalled();
  });

  it("refuses a dead negative session or one currently authorised for the own scope", async () => {
    const f = fixture(); f.hooks.peerActive = false;
    expect((await f.run()).status).toBe("BLOCKED");
    const g = fixture(); g.hooks.deniedGrants = () => g.grants;
    expect((await g.run()).status).toBe("BLOCKED");
    expect(g.send.mock.calls.some(c => String(c[0]).includes("/api/auth/context"))).toBe(false);
  });

  for (const mutation of ["missing-grant", "group", "mixed-anchor", "environment", "expiry", "duplicate", "expired-source"] as const) {
    it(`blocks ${mutation} CP authority`, async () => {
      const f = fixture();
      if (mutation === "missing-grant") f.grants.pop();
      if (mutation === "group") Object.assign(f.grants[0].scope, { level: "CORPORATE_GROUP" });
      if (mutation === "mixed-anchor") Object.assign(f.grants[0].scope, { tenant_id: f.plan.expected.tenant_id });
      if (mutation === "environment") Object.assign(f.grants[0].scope, { environment: "production" });
      if (mutation === "expiry") Object.assign(f.grants[0], { valid_until: new Date(f.started - 1).toISOString() });
      if (mutation === "duplicate") f.grants[1].grant_id = f.grants[0].grant_id;
      if (mutation === "expired-source") f.clock.now = f.started + 30_001;
      expect((await f.run()).status).toBe("BLOCKED");
    });
  }

  it("refuses final grant withdrawal or a newly granted denial peer", async () => {
    for (const peer of [false, true]) {
      const f = fixture();
      if (peer) f.hooks.deniedGrants = n => n === 1 ? [] : f.grants;
      else f.hooks.ownerGrants = n => n === 1 ? f.grants : [];
      const result = await f.run();
      expect(result.status).toBe("BLOCKED"); expect(result.checks.find(c => c.name === "CURRENT_FINAL_GRANTS")?.passed).toBe(false);
    }
  });

  it("requires stable grant facts even when permissions or missing-permission outcomes are unchanged", async () => {
    for (const actor of ["owner", "denied"] as const) {
      const f = fixture();
      if (actor === "owner") f.hooks.ownerGrants = n => n === 1 ? f.grants : f.grants.map(g => ({ ...g, grant_id: g.grant_id + "replacement" }));
      else f.hooks.deniedGrants = n => n === 1 ? [f.grants[0]] : [{ ...f.grants[0], grant_id: "agr_replacement" }];
      const result = await f.run(); expect(result.status).toBe("BLOCKED");
      expect(result.checks.find(c => c.name === "CURRENT_FINAL_GRANTS")?.passed).toBe(false);
    }
  });

  it("normalises harmless grant ordering and omitted EXACT mode when comparing snapshots", async () => {
    const f = fixture();
    f.hooks.ownerGrants = n => n === 1 ? f.grants : [...f.grants].reverse().map(g => ({ ...g, scope: { ...g.scope, mode: "EXACT" } }));
    expect((await f.run()).status).toBe("OBSERVED_NOT_ACCEPTED");
  });

  it("refuses unsafe secret-bearing session cache/CORS headers before and after denial observations", async () => {
    for (const after of [false, true]) for (const variant of ["cache", "cors-origin", "cors-credentials"]) {
      const f = fixture();
      const unsafe = () => {
        if (variant === "cache") f.hooks.sessionHeaders["cache-control"] = "public";
        if (variant === "cors-origin") f.hooks.sessionHeaders["access-control-allow-origin"] = "*";
        if (variant === "cors-credentials") f.hooks.sessionHeaders["access-control-allow-credentials"] = "true";
      };
      if (after) f.hooks.before = path => { if (path === "/api/auth/context") unsafe(); };
      else unsafe();
      const result = await f.run(); expect(result.status).toBe("BLOCKED");
      expect(result.checks.find(c => c.name === (after ? "POST_DENIAL_IDENTITIES" : "CURRENT_SESSIONS_AND_GRANTS"))?.passed).not.toBe(true);
    }
  });

  for (const mutation of ["duplicate", "secondary", "hidden-market", "foreign-market", "wrong-tenant", "wrong-org", "suspended"] as const) {
    it(`refuses ${mutation} independent CP mapping`, async () => {
      const f = fixture();
      if (mutation === "duplicate") f.org.tenants.push({ ...f.mapping });
      if (mutation === "secondary") f.mapping.mapping_role = "SECONDARY";
      if (mutation === "hidden-market") f.mapping.markets_visible = false;
      if (mutation === "foreign-market") f.mapping.market_participations[0].registry_market_id = "mkt_other";
      if (mutation === "wrong-tenant") f.tenant.tenant_id = "tn_otherfixture";
      if (mutation === "wrong-org") f.org.profile.canonical_entity_id = f.plan.expected.denied_principal_id;
      if (mutation === "suspended") f.mapping.observed_state = "suspended";
      expect((await f.run()).status).toBe("BLOCKED");
    });
  }

  it("never accepts a bare status, 404 feature hold, unrelated denial code or false BFF authority", async () => {
    for (const variant of ["disabled", "status-only", "extra-authority", "commands-enabled", "wrong-market", "bad-cache", "cors", "old-context"]) {
      const f = fixture();
      if (variant === "disabled") f.hooks.negativeStatus = 404;
      if (variant === "status-only") f.hooks.negativeBody.code = "UNRELATED_DENIAL";
      if (variant === "extra-authority") f.hooks.context = () => ({ ...f.context, context_id: "forged-execution-handle" });
      if (variant === "commands-enabled") f.context.executionAuthority = true;
      if (variant === "wrong-market") f.context.market.marketId = "mkt_other";
      if (variant === "bad-cache") f.hooks.contextHeaders["cache-control"] = "public";
      if (variant === "cors") f.hooks.contextHeaders["access-control-allow-origin"] = "*";
      if (variant === "old-context") f.context.expiresAt = f.started - 1;
      expect((await f.run()).status).toBe("BLOCKED");
    }
  });

  it("bounds transport errors and oversized/malformed/redirected observations without retaining error data", async () => {
    for (const mode of ["error", "oversized", "malformed", "redirect"]) {
      const f = fixture(), original = f.send.getMockImplementation()!;
      f.send.mockImplementation(async (url, init) => {
        if (!String(url).includes("/v1/organisations/")) return original(url, init);
        if (mode === "error") throw new Error("PRIVATE unexpected transport");
        if (mode === "oversized") return new Response("x".repeat(1024 * 1024 + 1), { headers: { "Content-Type": "application/json" } });
        if (mode === "malformed") return new Response("PRIVATE-NON-JSON", { headers: { "Content-Type": "application/json" } });
        const r = Response.json(f.org); Object.defineProperty(r, "redirected", { value: true }); return r;
      });
      const result = await f.run(); expect(result.status).toBe("BLOCKED"); expect(JSON.stringify(result)).not.toContain("PRIVATE");
    }
  });

  it("requires a future bounded deadline and rejects unsafe plans before I/O", async () => {
    const f = fixture();
    for (const bff_origin of ["http://localhost:3000", f.plan.cp_origin, "https://user:pass@estate.example.test", "https://estate.example.test/path"]) {
      await expect(observeExecutiveNavigation({ ...f.plan, bff_origin }, f.credentials, { fetch: f.send })).rejects.toThrow();
    }
    for (const deadline of [new Date(f.started - 1).toISOString(), new Date(f.started + 91 * 60_000).toISOString()]) {
      await expect(observeExecutiveNavigation({ ...f.plan, deadline }, f.credentials, { fetch: f.send, now: () => f.started })).rejects.toThrow();
    }
    expect(executiveObservationPlanSchema.safeParse({ ...f.plan, approved: true }).success).toBe(false);
    expect(executiveObservationPlanSchema.safeParse({ ...f.plan, sources: { ...f.plan.sources, cp: "main" } }).success).toBe(false);
    expect(f.send).not.toHaveBeenCalled();
  });

  it("refuses diagnostic logging or disabled TLS before using credentials", async () => {
    for (const key of ["NODE_OPTIONS", "NODE_DEBUG", "DEBUG", "PWDEBUG", "NODE_TLS_REJECT_UNAUTHORIZED"]) {
      const f = fixture(); vi.stubEnv(key, key === "NODE_TLS_REJECT_UNAUTHORIZED" ? "0" : "enabled");
      await expect(f.run()).rejects.toThrow(); expect(f.send).not.toHaveBeenCalled(); vi.unstubAllEnvs();
    }
  });

  it("refuses clock rollback or an overall deadline crossing during a collection", async () => {
    for (const elapsed of [-1, 30_001]) {
      const f = fixture(); f.hooks.before = path => { if (path.includes("/v1/tenants/")) f.clock.now = f.started + elapsed; };
      const result = await f.run();
      expect(result.status).toBe("BLOCKED"); expect(result.checks.find(c => c.name === "OBSERVATION_FRESHNESS")?.passed).toBe(false);
    }
  });

  it("cancels a stalled CP response body before any successful observation can be claimed", async () => {
    vi.useFakeTimers();
    vi.spyOn(AbortSignal, "timeout").mockImplementation(delay => {
      const controller = new AbortController(); setTimeout(() => controller.abort(new DOMException("timeout", "TimeoutError")), delay); return controller.signal;
    });
    const f = fixture(), original = f.send.getMockImplementation()!, cancel = vi.fn();
    f.send.mockImplementation(async (url, init) => String(url).includes("/v1/organisations/")
      ? new Response(new ReadableStream({ start() { /* Peer never finishes JSON. */ }, cancel }), { headers: { "Content-Type": "application/json" } })
      : original(url, init));
    const pending = f.run(); await vi.advanceTimersByTimeAsync(5001);
    expect((await pending).status).toBe("BLOCKED"); expect(cancel).toHaveBeenCalled();
  });
});

describe("private executive observer CLI", () => {
  it("inspects offline, refuses unsafe files and never treats missing credentials as a live pass", () => {
    const f = fixture(), root = mkdtempSync(join(tmpdir(), "navigation-observer-")), input = join(root, "PRIVATE-handoff.json");
    try {
      chmodSync(root, 0o700); writeFileSync(input, JSON.stringify(f.plan), { mode: 0o600 });
      const env = { ...process.env };
      for (const key of Object.keys(env)) if (key.startsWith("NABHOLD_NAVIGATION_")) delete env[key];
      for (const key of ["NODE_OPTIONS", "NODE_DEBUG", "DEBUG", "PWDEBUG", "NODE_TLS_REJECT_UNAUTHORIZED"]) delete env[key];
      const run = (action: string, path = input) => spawnSync(process.execPath,
        ["--experimental-strip-types", fileURLToPath(new URL("../../../scripts/observe-executive-navigation.mjs", import.meta.url)), action, "--input", path],
        { env, encoding: "utf8", timeout: 5000 });
      const inspected = run("inspect"); expect(inspected.status).toBe(0); expect(inspected.stdout).toContain("approval=false; runtime_observed=false");
      const observed = run("observe"); expect(observed.status).toBe(2); expect(JSON.parse(observed.stdout).status).toBe("BLOCKED");
      const alias = join(root, "symlink.json"); symlinkSync(input, alias); expect(run("inspect", alias).status).toBe(2);
      const hard = join(root, "hardlink.json"); linkSync(input, hard); expect(run("inspect").status).toBe(2); rmSync(hard);
      chmodSync(input, 0o644); const unsafe = run("inspect"); expect(unsafe.status).toBe(2);
      expect(unsafe.stderr).not.toContain("PRIVATE"); expect(unsafe.stdout).toBe("");
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});
