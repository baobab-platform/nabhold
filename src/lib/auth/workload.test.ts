// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { DevelopmentContentWorkload, readDevelopmentWorkloadSettings, type DevelopmentWorkloadSettings } from "./workload";

// Protocol peer exercises maintained OAuth client-credentials + introspection,
// not actual IAM or CP qualification. CP owns canonical Principal resolution.
const settings: DevelopmentWorkloadSettings = {
  issuer: "https://iam.example.test/", tokenEndpoint: "https://iam.example.test/token",
  introspectionEndpoint: "https://iam.example.test/introspect", cpOrigin: "https://cp.example.test",
  clientSecret: "synthetic-independent-run-secret-32bytes", tenantId: "tn_nabhold1",
  organisationId: "11111111-2222-4333-8444-555555555555", countryCode: "ZA", deadline: Date.now() + 60 * 60_000,
};
const scope = { "baobab-control-plane": "context:resolve", "baobab-control-plane baobab-cms": "context:resolve content:entry:resolve" };
function peer() {
  let audience = "", issued = 0, contexts = 0;
  const state = { claims: {} as Record<string, unknown>, token: {} as Record<string, unknown>, context: {} as Record<string, unknown>, failure: "" };
  const fetcher = vi.fn<typeof fetch>(async (input, init) => {
    const url = String(input);
    if (url === settings.tokenEndpoint || url === settings.introspectionEndpoint) {
      expect(init?.redirect).toBe("error"); expect(init?.cache).toBe("no-store");
      expect(init?.signal).toBeDefined();
      expect(new Headers(init?.headers).has("authorization")).toBe(false);
      const credentials = new URLSearchParams(String(init?.body));
      expect(credentials.getAll("client_id")).toEqual(["baobab-int03-cms-consumer"]);
      expect(credentials.getAll("client_secret")).toEqual([settings.clientSecret]);
      expect(new URL(url).search).toBe("");
    }
    if (state.failure === url) return Response.json({ private: "must not escape" }, { status: 503 });
    if (url === settings.tokenEndpoint) {
      const body = new URLSearchParams(String(init?.body));
      expect(body.get("grant_type")).toBe("client_credentials");
      expect(body.has("subject_token")).toBe(false);
      const requestedAudiences = body.getAll("audience");
      audience = requestedAudiences.join(" ");
      expect(requestedAudiences).toEqual(audience === "baobab-control-plane" ? ["baobab-control-plane"] : ["baobab-control-plane", "baobab-cms"]);
      expect(body.get("scope")).toBe(scope[audience as keyof typeof scope]);
      return Response.json({ access_token: `synthetic-private-token-${++issued}`, token_type: "Bearer", expires_in: 60, ...state.token });
    }
    if (url === settings.introspectionEndpoint) {
      expect(new URLSearchParams(String(init?.body)).get("token")).toMatch(/^synthetic-private-token-/);
      return Response.json({ active: true, iss: settings.issuer, sub: "synthetic-workload-subject", client_id: "baobab-int03-cms-consumer",
        aud: audience.split(" "), actor_type: "workload", scope: scope[audience as keyof typeof scope], exp: Math.floor(Date.now() / 1000) + 60, ...state.claims });
    }
    if (url === settings.cpOrigin + "/v1/platform-context/resolve") {
      expect(JSON.parse(String(init?.body))).toEqual({ tenant_id: settings.tenantId, organisation_id: settings.organisationId, country_code: "ZA" });
      expect(new Headers(init?.headers).get("authorization")).toMatch(/^Bearer synthetic-private-token-/);
      return Response.json({ context_id: `11111111-2222-4333-8444-${String(++contexts).padStart(12, "0")}`, tenant_id: settings.tenantId,
        organisation_id: settings.organisationId, country_code: "ZA", resolved_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60_000).toISOString(), ...state.context });
    }
    throw new Error("Unexpected protocol destination");
  });
  return { state, fetcher, workload: new DevelopmentContentWorkload(settings, fetcher) };
}
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("development content workload", () => {
  it("acquires exact CP/CMS resource audiences and resolves a new own context for every read", async () => {
    const { workload, fetcher } = peer();
    const first = await workload.currentContextId();
    await expect(workload.tokens("baobab-cms").getToken()).resolves.toMatch(/^synthetic-private-token-/);
    const second = await workload.currentContextId();
    expect(second).not.toBe(first);
    expect(fetcher.mock.calls.filter(([u]) => String(u) === settings.introspectionEndpoint)).toHaveLength(3);
  });

  it.each([
    { active: false }, { iss: "https://foreign.example/" }, { sub: "" }, { client_id: "baobab-cms-workload" },
    { actor_type: "human" }, { aud: "baobab-control-plane" }, { aud: "baobab-cms" },
    { aud: ["baobab-cms", "baobab-control-plane", "foreign"] }, { aud: ["baobab-cms", "baobab-cms"] },
    { scope: "content:entry:resolve content:entry:preview" }, { environment: "production" }, { owner: "baobab-platform/baobab-cms" },
    { exp: 1 }, { exp: Math.floor(settings.deadline / 1000) + 1 },
  ])("refuses invalid/currently denied token evidence %j", async claims => {
    const { workload, state } = peer(); state.claims = claims;
    await expect(workload.tokens("baobab-cms").getToken()).rejects.toThrow("Authentication unavailable or denied");
  });

  it("refuses a rotated token belonging to another subject", async () => {
    const { workload, state } = peer();
    await workload.currentContextId();
    state.claims = { sub: "another-workload" };
    await expect(workload.tokens("baobab-cms").getToken()).rejects.toThrow();
  });

  it.each([{ refresh_token: "private" }, { id_token: "private" }, { token_type: "DPoP" }, { expires_in: 301 }, { expires_in: 0 }])(
    "discards issuance outside the bounded client-credentials profile %j", async token => {
      const { workload, state } = peer(); state.token = token;
      await expect(workload.tokens("baobab-cms").getToken()).rejects.toThrow();
    });

  it.each([
    { tenant_id: "tn_neighbour" }, { organisation_id: "11111111-2222-4333-8444-555555555556" }, { country_code: "UG" },
    { expires_at: undefined }, { expires_at: "2020-01-01T00:00:00Z" }, { resolved_at: "2020-01-01T00:00:00Z" }, { context_id: "invented" },
    { expires_at: new Date(settings.deadline + 60_000).toISOString() },
    { expires_at: new Date(Date.now() + 30 * 60_000).toISOString() },
  ])("does not use a malformed/foreign CP context %j", async context => {
    const { workload, state } = peer(); state.context = context;
    await expect(workload.currentContextId()).rejects.toThrow();
  });

  it("does not acquire or reuse tokens after the fixed run deadline", async () => {
    const { workload, fetcher } = peer();
    await workload.tokens("baobab-cms").getToken();
    const calls = fetcher.mock.calls.length;
    vi.useFakeTimers(); vi.setSystemTime(settings.deadline);
    await expect(workload.tokens("baobab-cms").getToken()).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(calls);
  });

  it("rejects a token that would outlive the remaining run window", async () => {
    const { workload, fetcher } = peer();
    vi.useFakeTimers(); vi.setSystemTime(settings.deadline - 30_000);
    await expect(workload.tokens("baobab-cms").getToken()).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it.each([settings.tokenEndpoint, settings.introspectionEndpoint, settings.cpOrigin + "/v1/platform-context/resolve"])(
    "fails closed on dependency outage and recovers with fresh evidence: %s", async url => {
      const { workload, state } = peer(); state.failure = url;
      await expect(workload.currentContextId()).rejects.toThrow("Authentication unavailable or denied");
      state.failure = "";
      await expect(workload.currentContextId()).resolves.toMatch(/^[0-9a-f-]+$/);
    });
});

describe("development proof opt-in", () => {
  function env() { return {
    NABHOLD_CMS_PROOF_ENABLED: "true", NABHOLD_WORKLOAD_ENVIRONMENT: "development", NABHOLD_WORKLOAD_CLIENT_ID: "baobab-int03-cms-consumer",
    NABHOLD_WORKLOAD_ISSUER: settings.issuer, NABHOLD_WORKLOAD_TOKEN_ENDPOINT: settings.tokenEndpoint,
    NABHOLD_WORKLOAD_INTROSPECTION_ENDPOINT: settings.introspectionEndpoint, NABHOLD_WORKLOAD_CLIENT_SECRET: settings.clientSecret,
    BAOBAB_CONTROL_PLANE_API_URL: settings.cpOrigin, NABHOLD_CONTENT_TENANT_ID: settings.tenantId,
    NABHOLD_CONTENT_ORGANISATION_ID: settings.organisationId, NABHOLD_CONTENT_COUNTRY_CODE: "ZA", NABHOLD_CMS_PROOF_DEADLINE: new Date(settings.deadline).toISOString(),
  }; }
  it("is off by default and accepts the exact named development configuration", () => {
    expect(readDevelopmentWorkloadSettings({})).toBeNull();
    expect(readDevelopmentWorkloadSettings(env())).toEqual(settings);
    expect(readDevelopmentWorkloadSettings({ ...env(), NABHOLD_WORKLOAD_ISSUER: "https://iam.example.test" })?.issuer).toBe("https://iam.example.test");
  });
  it.each([
    ["NABHOLD_WORKLOAD_ENVIRONMENT", "production"], ["NABHOLD_WORKLOAD_CLIENT_ID", "nabhold-backend"],
    ["NABHOLD_WORKLOAD_TOKEN_ENDPOINT", "http://iam.example.test/token"], ["NABHOLD_WORKLOAD_TOKEN_ENDPOINT", "https://foreign.example/token"],
    ["NABHOLD_WORKLOAD_ISSUER", "https://iam.example.test/?secret=private"], ["BAOBAB_CONTROL_PLANE_API_URL", "https://cp.example.test/path"],
    ["NABHOLD_WORKLOAD_CLIENT_SECRET", ""], ["NABHOLD_CONTENT_ORGANISATION_ID", "invented"],
    ["NABHOLD_CMS_PROOF_DEADLINE", "2020-01-01T00:00:00Z"], ["NABHOLD_CMS_PROOF_DEADLINE", "2100-01-01T00:00:00Z"],
    ["NODE_TLS_REJECT_UNAUTHORIZED", "0"],
  ])("refuses unsafe/incomplete configuration %s", (key, value) => {
    expect(() => readDevelopmentWorkloadSettings({ ...env(), [key]: value })).toThrow();
  });
});
