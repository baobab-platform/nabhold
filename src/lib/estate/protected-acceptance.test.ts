// @vitest-environment node
import { createServer } from "node:http";
import { once } from "node:events";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile, symlink, chmod } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OPERATOR_ROLES, OPERATOR_PERMISSIONS } from "./operator-preflight";
import { runProtectedAcceptance, type AcceptancePlan } from "./protected-acceptance";
import { assertProtectedStagingEnvironment } from "./staging-protection";

// All IDs, credentials and facts are isolated synthetic observations. No
// fixture may be promoted into the real plan or a staging environment secret.
const instant = Date.parse("2026-10-14T14:00:00Z");
const uuid = (n: number) => `019a0000-0000-7000-8000-${String(n).padStart(12, "0")}`;
const principals = Object.fromEntries(OPERATOR_ROLES.map((r, i) => [r, uuid(i + 1)])) as AcceptancePlan["operators"]["principals"];
const plan: AcceptancePlan = { version: "1.0", operators: { version: "1.0", masterplan: "NAB-GOLIVE-MP-001-v2.0",
  environment: "staging", cp_origin: "https://cp.example.test", principals },
  onboarding: { organisation_id: uuid(10), tenant_id: "tn_fixture1", isolation_strategy: "schema_per_tenant", residency_region: "af-south-1" },
  cms: { origin: "https://cms.example.test", context_id: uuid(20), forbidden_context_id: uuid(21), forbidden_tenant_id: "tn_fixture2",
    digital_estate_id: "de_fixture", content_key: "navigation", locale: "en-ZA", expected_record_id: "rec_fixture",
    expected_binding_id: "binding_fixture", expected_provider_id: "provider_fixture", expected_engine_instance_id: "instance_fixture" } };
const credentials = { operators: Object.fromEntries(OPERATOR_ROLES.map((r) => [r, `private-synthetic-${r}-token`])),
  workloads: { resolve: "private-synthetic-resolve-token", content: "private-synthetic-content-token",
    missing_scope: "private-synthetic-missing-scope-token", rejected: "private-synthetic-rejected-token" } };
const content = { record: { id: plan.cms.expected_record_id, tenant_id: plan.onboarding.tenant_id, content_key: plan.cms.content_key,
  legal_entity_id: null, digital_estate_id: plan.cms.digital_estate_id, market_id: null, locale: plan.cms.locale,
  publication_state: "PUBLISHED", effective_from: null, effective_to: null, data: { privateEditorialData: "never-in-artifact" } },
  matched_scope: "EXACT", provenance: { trace: [], inheritance_mode: "OVERRIDE" } };
const overview = { organisation_id: plan.onboarding.organisation_id, evaluated_at: new Date(instant).toISOString(),
  profile: { canonical_entity_id: plan.onboarding.organisation_id, status: "ACTIVE" },
  tenants: [{ tenant_id: plan.onboarding.tenant_id, mapping_role: "PRIMARY_ORGANISATION", mapping_provenance: "controlled-fixture",
    residency_region: "af-south-1", isolation_strategy: "schema_per_tenant", desired_state: "active", observed_state: "provisioning" }] };
function reply(rawUrl: string, options: RequestInit, clockNow = instant, environment = plan.operators.environment): Response {
  const url = new URL(rawUrl);
  const headers = new Headers(options.headers);
  const bearer = headers.get("authorization");
  const body = options.body ? JSON.parse(String(options.body)) : undefined;
  const problem = (status: number, code: string) => Response.json({ status, code,
    correlation_id: headers.get("x-correlation-id"), detail: "private-upstream-detail" }, { status });
  if (url.pathname === "/v1/admin/effective-authority") {
    const role = OPERATOR_ROLES.find((r) => bearer === `Bearer ${credentials.operators[r]}`)!;
    return Response.json({ principal_id: principals[role], evaluated_at: new Date(clockNow).toISOString(),
      grants: OPERATOR_PERMISSIONS[role].map((permission, i) => ({ grant_id: `agr_fixture${i}`, permission,
        scope: { level: "PLATFORM", environment }, grant_type: "TIME_BOUND", source: "BOOTSTRAP",
        risk_class: "HIGH", valid_until: new Date(clockNow + 120000).toISOString() })) });
  }
  if (url.pathname.endsWith("/overview")) return Response.json({ ...overview, evaluated_at: new Date(clockNow).toISOString() });
  if (url.pathname === "/v1/capabilities/resolve") return Response.json({ resolution_id: "res_fixture", context_id: body.context_id,
    capability_key: body.capability_key, contract_version: 1, decision: "RESOLVED", grant_id: "grant_fixture",
    binding_id: plan.cms.expected_binding_id, correlation_id: body.correlation_id, resolved_at: new Date(clockNow).toISOString(),
    expires_at: new Date(clockNow + 60000).toISOString(), invocation: { protocol: "http", contract_version: 1,
      service_reference: "service://baobab-cms/content", route_reference: "/v1/content/resolve",
      provider_id: plan.cms.expected_provider_id, engine_instance_id: plan.cms.expected_engine_instance_id } });
  if (url.pathname !== "/v1/content/resolve") throw new Error("Unexpected fixture route");
  if (!bearer || bearer === `Bearer ${credentials.workloads.resolve}` || bearer === `Bearer ${credentials.workloads.rejected}`) return problem(401, "AUTHENTICATION_REQUIRED");
  if (bearer === `Bearer ${credentials.workloads.missing_scope}`) return problem(403, "CONTENT_CONTEXT_REJECTED");
  if (!url.searchParams.has("context_id")) return problem(400, "CONTENT_REQUEST_INVALID");
  if (url.searchParams.get("context_id") !== plan.cms.context_id || body.tenant_id !== plan.onboarding.tenant_id) return problem(403, "CONTENT_CONTEXT_REJECTED");
  if (body.preview_mode) return problem(403, "CONTENT_PREVIEW_NOT_PERMITTED");
  return Response.json(content);
}
const transport = () => vi.fn<typeof fetch>(async (url, options) => reply(String(url), options!));
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("G17 protected technical observations", () => {
  it("runs the ordered authority chain and all eight security negatives without authority or secret output", async () => {
    const send = transport();
    const report = await runProtectedAcceptance(plan, credentials, { fetch: send, now: () => instant });
    expect(report.status).toBe("OBSERVED_NOT_ACCEPTED");
    expect(report.checks).toHaveLength(19);
    expect(report.checks.every((c) => c.passed)).toBe(true);
    expect(report.evidence_class).toBe("SYNTHETIC");
    expect(report.protected_staging_accepted).toBe(false);
    expect(report.onboarding_accepted).toBe(false);
    expect(report.production_authorized).toBe(false);
    const output = JSON.stringify(report);
    for (const token of [...Object.values(credentials.operators), ...Object.values(credentials.workloads)]) expect(output).not.toContain(token);
    expect(output).not.toContain("privateEditorialData");
    expect(output).not.toContain("private-upstream-detail");
    expect(output).not.toContain(plan.onboarding.organisation_id);
    for (const [url, options] of send.mock.calls) {
      expect(String(url)).not.toContain("token");
      expect(options).toMatchObject({ redirect: "error", cache: "no-store" });
      expect(options?.method).toBe(String(url).includes("/effective-authority") || String(url).endsWith("/overview") ? "GET" : "POST");
    }
  });
  it("refuses missing, reused and injected credentials before any network call", async () => {
    for (const workloads of [{ ...credentials.workloads, content: undefined },
      { ...credentials.workloads, content: credentials.workloads.resolve },
      { ...credentials.workloads, content: `${credentials.workloads.content}\n` }]) {
      const send = transport();
      const report = await runProtectedAcceptance(plan, { ...credentials, workloads }, { fetch: send });
      expect(report.status).toBe("BLOCKED");
      expect(send).not.toHaveBeenCalled();
    }
  });
  it("does not proceed to onboarding or CMS after identity denial", async () => {
    const send = vi.fn<typeof fetch>(async () => Response.json({ code: "denied" }, { status: 403 }));
    const report = await runProtectedAcceptance(plan, credentials, { fetch: send, now: () => instant });
    expect(report.status).toBe("BLOCKED");
    expect(send).toHaveBeenCalledTimes(7);
  });
  it.each([
    { tenants: [] }, { tenants: [overview.tenants[0], overview.tenants[0]] },
    { organisation_id: uuid(99) }, { evaluated_at: new Date(instant - 61000).toISOString() },
    { tenants: [{ ...overview.tenants[0], observed_state: "suspended" }] },
    { tenants: [{ ...overview.tenants[0], residency_region: "eu-west-1" }] },
  ])("fails closed on missing, duplicate, stale or mismatched PRIMARY mapping %j", async (change) => {
    const send = vi.fn<typeof fetch>(async (url, opts) => String(url).endsWith("/overview") ? Response.json({ ...overview, ...change }) : reply(String(url), opts!));
    const report = await runProtectedAcceptance(plan, credentials, { fetch: send, now: () => instant });
    expect(report.status).toBe("BLOCKED");
    expect(send).toHaveBeenCalledTimes(8);
  });
  it.each(["binding_id", "correlation_id", "context_id", "expires_at"])("cannot invoke CMS on a mismatched CP %s", async (field) => {
    const send = vi.fn<typeof fetch>(async (url, opts) => {
      const response = reply(String(url), opts!);
      if (!String(url).includes("/capabilities/resolve")) return response;
      return Response.json({ ...await response.json(), [field]: field === "expires_at" ? new Date(instant).toISOString() : "wrong" });
    });
    const report = await runProtectedAcceptance(plan, credentials, { fetch: send, now: () => instant });
    expect(report.status).toBe("BLOCKED");
    expect(send).toHaveBeenCalledTimes(9);
  });
  it("does not count a 5xx or unexpected allow as an expected security denial", async () => {
    for (const status of [200, 503]) {
      const send = vi.fn<typeof fetch>(async (url, opts) => {
        if (String(url).includes("/content/resolve") && !new Headers(opts?.headers).has("authorization")) return Response.json({ code: "AUTHENTICATION_REQUIRED", status }, { status });
        return reply(String(url), opts!);
      });
      expect((await runProtectedAcceptance(plan, credentials, { fetch: send, now: () => instant })).status).toBe("BLOCKED");
    }
  });
  it("refuses unpublished or cross-tenant content even if CP resolution succeeded", async () => {
    for (const change of [{ publication_state: "DRAFT" }, { tenant_id: "tn_fixture2" }, { id: "other-record" }]) {
      const send = vi.fn<typeof fetch>(async (url, opts) => {
        const response = reply(String(url), opts!);
        return String(url).includes("/content/resolve") && response.status === 200 ? Response.json({ ...content, record: { ...content.record, ...change } }) : response;
      });
      expect((await runProtectedAcceptance(plan, credentials, { fetch: send, now: () => instant })).status).toBe("BLOCKED");
    }
  });
  it("refuses unsafe origins, production and TLS bypass before any token transmission", async () => {
    const send = transport();
    for (const origin of ["http://cms.example.test", "https://user:secret@cms.example.test", "https://cms.example.test/path"]) {
      await expect(runProtectedAcceptance({ ...plan, cms: { ...plan.cms, origin } }, credentials, { fetch: send })).rejects.toThrow();
    }
    await expect(runProtectedAcceptance({ ...plan, operators: { ...plan.operators, environment: "production" } }, credentials, { fetch: send })).rejects.toThrow();
    vi.stubEnv("NODE_TLS_REJECT_UNAUTHORIZED", "0");
    await expect(runProtectedAcceptance(plan, credentials, { fetch: send })).rejects.toThrow();
    expect(send).not.toHaveBeenCalled();
  });
  it("bounds body size and excludes private transport errors", async () => {
    const send = vi.fn<typeof fetch>(async (url, opts) => String(url).endsWith("/overview") ?
      new Response("x".repeat(1024 * 1024 + 1), { headers: { "content-type": "application/json" } }) : reply(String(url), opts!));
    const report = await runProtectedAcceptance(plan, credentials, { fetch: send, now: () => instant });
    expect(report.status).toBe("BLOCKED");
    expect(report.checks.at(-1)?.code).toBe("PRIMARY_MAPPING_NOT_OBSERVED");
  });
  it("cancels a stalled body on deadline without exposing transport details", async () => {
    const controller = new AbortController();
    vi.stubGlobal("AbortSignal", { timeout: () => controller.signal });
    const cancelled = vi.fn();
    const send = vi.fn<typeof fetch>(async (url, opts) => {
      if (!String(url).endsWith("/overview")) return reply(String(url), opts!);
      setTimeout(() => controller.abort(), 20);
      return new Response(new ReadableStream<Uint8Array>({ cancel: cancelled }),
        { headers: { "content-type": "application/json" } });
    });
    const report = await runProtectedAcceptance(plan, credentials, { fetch: send, now: () => instant });
    expect(report.status).toBe("BLOCKED");
    expect(cancelled).toHaveBeenCalledOnce();
    expect(send).toHaveBeenCalledTimes(8);
  });
  it("expires the aggregate if observations become stale during collection", async () => {
    let time = instant;
    const send = vi.fn<typeof fetch>(async (url, opts) => { const res = reply(String(url), opts!); if (String(url).includes("/content/resolve")) time = instant + 61000; return res; });
    const report = await runProtectedAcceptance(plan, credentials, { fetch: send, now: () => time });
    expect(report.status).toBe("BLOCKED");
    expect(report.checks.at(-1)?.code).toBe("EXPIRED_DURING_COLLECTION");
  });
});

describe("independent protected environment policy", () => {
  const policy = { name: "staging", can_admins_bypass: false,
    protection_rules: [{ type: "required_reviewers", prevent_self_review: true, reviewers: [{ type: "User" }] }],
    deployment_branch_policy: { protected_branches: true, custom_branch_policies: false } };
  it("accepts independent reviewers, no bypass and restricted branches", () => expect(() => assertProtectedStagingEnvironment(policy)).not.toThrow());
  it.each([{ can_admins_bypass: true }, { protection_rules: [] },
    { protection_rules: [{ type: "required_reviewers", prevent_self_review: false, reviewers: [{}] }] },
    { protection_rules: [{ type: "required_reviewers", prevent_self_review: true, reviewers: [] }] },
    { deployment_branch_policy: null }, { deployment_branch_policy: { protected_branches: false, custom_branch_policies: false } }])(
    "refuses weak or absent policy %j", (change) => expect(() => assertProtectedStagingEnvironment({ ...policy, ...change })).toThrow(),
  );
});

it("runs the actual CLI against separate loopback CP/CMS services and refuses unsafe files/staging promotion", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "nabhold-acceptance-"));
  const run = promisify(execFile);
  const paths: string[] = [];
  const server = () => createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    paths.push(req.url!);
    const response = reply(`http://127.0.0.1${req.url}`, { method: req.method,
      headers: req.headers as Record<string, string>, ...(chunks.length ? { body: Buffer.concat(chunks).toString() } : {}) }, Date.now(), "local");
    res.writeHead(response.status, Object.fromEntries(response.headers)).end(await response.text());
  });
  const cp = server(), cms = server();
  cp.listen(0, "127.0.0.1"); cms.listen(0, "127.0.0.1");
  await Promise.all([once(cp, "listening"), once(cms, "listening")]);
  const origin = (s: ReturnType<typeof server>) => { const a = s.address(); if (!a || typeof a === "string") throw new Error(); return `http://127.0.0.1:${a.port}`; };
  const input = join(temporary, "plan.json");
  const local = { ...plan, operators: { ...plan.operators, environment: "local", cp_origin: origin(cp) }, cms: { ...plan.cms, origin: origin(cms) } };
  try {
    // Real sockets and wall-clock observations exercise the complete CLI,
    // including every canonical request and negative response.
    await writeFile(input, JSON.stringify(local), { mode: 0o600 });
    const env = { ...process.env,
      ...Object.fromEntries(OPERATOR_ROLES.map((r) => [`NABHOLD_OPERATOR_${r.toUpperCase()}_TOKEN`, credentials.operators[r]])),
      ...Object.fromEntries(Object.entries(credentials.workloads).map(([r, v]) => [`NABHOLD_ACCEPTANCE_${r.toUpperCase()}_TOKEN`, v])) };
    const result = await run(process.execPath, ["--experimental-strip-types", "scripts/run-protected-acceptance.mjs", "--input", input], { env });
    const report = JSON.parse(result.stdout);
    expect(report.status).toBe("OBSERVED_NOT_ACCEPTED");
    expect(paths).toHaveLength(18);
    expect(report.evidence_class).toBe("LOCAL_REHEARSAL");
    expect(report.protected_staging_accepted).toBe(false);
    expect(result.stdout).not.toContain(credentials.workloads.content);
    const calls = paths.length;
    const staging = await run(process.execPath, ["--experimental-strip-types", "scripts/run-protected-acceptance.mjs", "--input", input, "--require-staging"], { env }).catch((e) => e);
    expect(staging.code).toBe(2);
    expect(paths).toHaveLength(calls);
    await chmod(input, 0o644);
    expect((await run(process.execPath, ["--experimental-strip-types", "scripts/run-protected-acceptance.mjs", "--input", input], { env }).catch((e) => e)).code).toBe(2);
    await chmod(input, 0o600);
    const link = join(temporary, "link.json"); await symlink(input, link);
    expect((await run(process.execPath, ["--experimental-strip-types", "scripts/run-protected-acceptance.mjs", "--input", link], { env }).catch((e) => e)).code).toBe(2);
  } finally {
    cp.closeAllConnections(); cms.closeAllConnections();
    await Promise.all([new Promise<void>((r) => cp.close(() => r())), new Promise<void>((r) => cms.close(() => r()))]);
    await rm(temporary, { recursive: true, force: true });
  }
});
