// @vitest-environment node
import { createServer } from "node:http";
import { once } from "node:events";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it, vi } from "vitest";
import { OPERATOR_PERMISSIONS, OPERATOR_ROLES, observeOperatorAuthority } from "./operator-preflight";

// Synthetic identities exercise the consumer refusal boundaries; none is an
// accepted Nabhold Principal or a staging evidence claim.
const now = Date.parse("2026-10-14T12:00:00Z");
const principals = Object.fromEntries(OPERATOR_ROLES.map((role, i) =>
  [role, `019a0000-0000-7000-8000-${String(i + 1).padStart(12, "0")}`]));
const plan = { version: "1.0", masterplan: "NAB-GOLIVE-MP-001-v2.0", environment: "staging",
  cp_origin: "https://cp.example.test", principals };
const credentials = Object.fromEntries(OPERATOR_ROLES.map((role) => [role, `isolated-fixture-${role}-credential`]));

function projection(role: typeof OPERATOR_ROLES[number]) {
  return { principal_id: principals[role], evaluated_at: new Date(now).toISOString(),
    grants: OPERATOR_PERMISSIONS[role].map((permission, i) => ({
      grant_id: `agr_fixture${i}`, permission, scope: { level: "PLATFORM", environment: "staging" },
      grant_type: "TIME_BOUND", source: "BOOTSTRAP", risk_class: "HIGH", elevated: false,
      valid_until: new Date(now + 120_000).toISOString(),
    })) };
}
function transport(mutate: (p: ReturnType<typeof projection>) => unknown = (p) => p) {
  return vi.fn<typeof fetch>(async (_url, options) => {
    const bearer = new Headers(options?.headers).get("Authorization");
    const role = OPERATOR_ROLES.find((r) => bearer === `Bearer ${credentials[r]}`)!;
    return Response.json(mutate(projection(role)));
  });
}

describe("P0-04B-01 operator authority observations", () => {
  it("uses separate opaque credentials, fixed GET routing and no authorization claim", async () => {
    const send = transport();
    const result = await observeOperatorAuthority(plan, credentials, { fetch: send, now: () => now });
    expect(result.all_required_grants_observed).toBe(true);
    expect(result.onboarding_authorized).toBe(false);
    expect(result.protected_staging_accepted).toBe(false);
    expect(result.production_authorized).toBe(false);
    expect(send).toHaveBeenCalledTimes(7);
    for (const [url, options] of send.mock.calls) {
      expect(String(url)).toBe("https://cp.example.test/v1/admin/effective-authority");
      expect(options).toMatchObject({ method: "GET", redirect: "error", cache: "no-store" });
      expect(new Headers(options?.headers).get("X-Correlation-ID")).toMatch(/^[0-9a-f-]{36}$/);
    }
    for (const credential of Object.values(credentials)) expect(JSON.stringify(result)).not.toContain(credential);
  });

  it.each([
    "http://cp.example.test", "https://user:secret@cp.example.test", "https://cp.example.test/path",
    "https://cp.example.test/?secret=token", "https://cp.example.test/#token", "http://localhost:3000",
  ])("refuses unsafe staging origin before credential transmission: %s", async (cp_origin) => {
    const send = transport();
    await expect(observeOperatorAuthority({ ...plan, cp_origin }, credentials, { fetch: send })).rejects.toThrow();
    expect(send).not.toHaveBeenCalled();
  });

  it("refuses reused planned Principals before any request", async () => {
    const send = transport();
    await expect(observeOperatorAuthority({ ...plan, principals: { ...principals, admission_decider: principals.admission_reviewer } },
      credentials, { fetch: send })).rejects.toThrow();
    expect(send).not.toHaveBeenCalled();
  });

  it("cannot replace missing credentials, send malformed tokens or reuse a token for two roles", async () => {
    const send = transport();
    const result = await observeOperatorAuthority(plan, { ...credentials, verification_reviewer: undefined,
      admission_decider: credentials.admission_reviewer, tenant_registrar: "invalid\r\nAuthorization: other" },
    { fetch: send, now: () => now });
    expect(result.all_required_grants_observed).toBe(false);
    expect(result.observations.map((r) => r.code)).toEqual([
      "CREDENTIAL_MISSING_OR_INVALID", "OBSERVED", "CREDENTIAL_REUSED", "CREDENTIAL_REUSED",
      "OBSERVED", "OBSERVED", "CREDENTIAL_MISSING_OR_INVALID",
    ]);
    expect(send).toHaveBeenCalledTimes(3);
  });

  it.each([
    ["wrong Principal", (p: ReturnType<typeof projection>) => ({ ...p, principal_id: "019a0000-0000-7000-8000-000000000099" }), "PRINCIPAL_MISMATCH"],
    ["old projection", (p: ReturnType<typeof projection>) => ({ ...p, evaluated_at: new Date(now - 61_000).toISOString() }), "PROJECTION_STALE"],
    ["future projection", (p: ReturnType<typeof projection>) => ({ ...p, evaluated_at: new Date(now + 6_000).toISOString() }), "PROJECTION_STALE"],
    ["unknown fields", (p: ReturnType<typeof projection>) => ({ ...p, token: "do-not-echo-this" }), "PROJECTION_INVALID"],
    ["duplicate grants", (p: ReturnType<typeof projection>) => ({ ...p, grants: [...p.grants, p.grants[0]] }), "PROJECTION_INVALID"],
  ] as const)("rejects %s", async (_label, mutate, code) => {
    const result = await observeOperatorAuthority(plan, credentials, { fetch: transport(mutate), now: () => now });
    expect(result.all_required_grants_observed).toBe(false);
    expect(result.observations.every((r) => r.code === code)).toBe(true);
    expect(JSON.stringify(result)).not.toContain("do-not-echo-this");
  });

  it.each([
    { scope: { level: "PLATFORM" } },
    { scope: { level: "PLATFORM", environment: "production" } },
    { scope: { level: "PLATFORM", environment: "staging", tenant_id: "tn_other" } },
    { scope: { level: "TENANT", environment: "staging", tenant_id: "tn_other" } },
    { valid_until: new Date(now).toISOString() },
    { valid_until: undefined },
    { risk_class: "CRITICAL" },
    { permission: "tenant.activate" },
  ])("cannot qualify inappropriate or expired authority: %j", async (changes) => {
    const result = await observeOperatorAuthority(plan, credentials, { fetch: transport((p) =>
      ({ ...p, grants: p.grants.map((g) => ({ ...g, ...changes })) })), now: () => now });
    expect(result.all_required_grants_observed).toBe(false);
    expect(result.observations.every((r) => r.code === "SCOPED_GRANTS_MISSING")).toBe(true);
  });

  it("does not resurrect a grant that expires during collection", async () => {
    let time = now;
    const send = transport((p) => ({ ...p, grants: p.grants.map((g) => ({ ...g, valid_until: new Date(now + 1000).toISOString() })) }));
    const result = await observeOperatorAuthority(plan, credentials, { fetch: async (...args) => {
      const response = await send(...args); time = now + 2000; return response;
    }, now: () => time });
    expect(result.all_required_grants_observed).toBe(false);
  });

  it.each([401, 403, 302, 500])("fails closed on CP status %s without exposing body text", async (status) => {
    const send = vi.fn<typeof fetch>(async () => new Response("secret-error-body", { status }));
    const report = await observeOperatorAuthority(plan, credentials, { fetch: send, now: () => now });
    expect(report.all_required_grants_observed).toBe(false);
    expect(report.observations.every((r) => r.code === "CP_REFUSED")).toBe(true);
    expect(JSON.stringify(report)).not.toContain("secret-error-body");
  });

  it("bounds streamed response bytes and suppresses provider/transport exceptions", async () => {
    const large = await observeOperatorAuthority(plan, credentials, { fetch: async () =>
      new Response("x".repeat(128 * 1024 + 1), { headers: { "content-type": "application/json" } }), now: () => now });
    expect(large.observations.every((r) => r.code === "PROJECTION_INVALID")).toBe(true);
    const failed = await observeOperatorAuthority(plan, credentials, { fetch: async () => {
      throw new Error(`error includes ${credentials.verification_reviewer}`);
    }, now: () => now });
    expect(failed.observations.every((r) => r.code === "TRANSPORT_REFUSED")).toBe(true);
    expect(JSON.stringify(failed)).not.toContain(credentials.verification_reviewer);
  });

  it("runs the actual CLI against a loopback CP-shaped service with no mutations", async () => {
    const requests: string[] = [];
    const server = createServer((request, response) => {
      requests.push(`${request.method} ${request.url}`);
      const role = OPERATOR_ROLES.find((r) => request.headers.authorization === `Bearer ${credentials[r]}`)!;
      const p = projection(role);
      p.evaluated_at = new Date().toISOString();
      for (const g of p.grants) {
        g.scope.environment = "local";
        g.valid_until = new Date(Date.now() + 120_000).toISOString();
      }
      response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "private, no-store" });
      response.end(JSON.stringify(p));
    });
    const directory = await mkdtemp(join(tmpdir(), "nabhold-preflight-"));
    try {
      server.listen(0, "127.0.0.1"); await once(server, "listening");
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("No test server");
      const input = join(directory, "plan.json");
      await writeFile(input, JSON.stringify({ ...plan, environment: "local", cp_origin: `http://127.0.0.1:${address.port}` }));
      const env = { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: "1", ...Object.fromEntries(OPERATOR_ROLES.map((r) =>
        [`NABHOLD_OPERATOR_${r.toUpperCase()}_TOKEN`, credentials[r]])) };
      const { stdout } = await promisify(execFile)(process.execPath,
        ["--experimental-strip-types", "scripts/check-onboarding-operators.mjs", "--input", input], { env });
      const report = JSON.parse(stdout);
      expect(report.all_required_grants_observed).toBe(true);
      expect(report.onboarding_authorized).toBe(false);
      expect(report.environment).toBe("local");
      expect(requests).toEqual(OPERATOR_ROLES.map(() => "GET /v1/admin/effective-authority"));
      for (const value of Object.values(credentials)) expect(stdout).not.toContain(value);
    } finally { server.close(); await rm(directory, { recursive: true, force: true }); }
  });

  it("refuses the unconfigured committed template without inventing identities", async () => {
    const result = await promisify(execFile)(process.execPath,
      ["--experimental-strip-types", "scripts/check-onboarding-operators.mjs"]).catch((e) => e);
    expect(result.code).toBe(2);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Operator preflight refused.");
  });
});
