// @vitest-environment node
import { chmodSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { readAuthSettings } from "../../src/lib/auth/oidc/settings";
import { createConfidentialStoreFromEnv } from "../../src/lib/auth/store/redis-backend";
import { IntegrationConfigurationError, integrationSettings, loadIntegrationEnvironment } from "./config";

function fixture(): Record<string, string | undefined> {
  return {
    NABHOLD_INTEGRATION_PROFILE: "keycloak-identity-smoke", NABHOLD_INTEGRATION_SYNTHETIC: "true",
    ...Object.fromEntries(["INFRASTRUCTURE", "IAM", "CP", "SHARED"].map(k => [`NABHOLD_INTEGRATION_${k}_SHA`, "a".repeat(40)])),
    NEXT_PUBLIC_SITE_URL: "https://nabhold.integration.test",
    NABHOLD_OIDC_ENABLED: "true", NABHOLD_OIDC_ENVIRONMENT: "integration",
    NABHOLD_OIDC_ORIGIN: "https://nabhold.integration.test", NABHOLD_OIDC_ISSUER: "https://iam.integration.test/realms/baobab",
    NABHOLD_OIDC_CLIENT_ID: "nabhold-integration", NABHOLD_OIDC_CLIENT_SECRET: "synthetic-client-secret",
    NABHOLD_OIDC_ID_TOKEN_ALGORITHM: "RS256", NABHOLD_OIDC_INTROSPECTION_ENDPOINT: "https://iam.integration.test/realms/baobab/protocol/openid-connect/token/introspect",
    NABHOLD_OIDC_CP_ORIGIN: "https://cp.integration.test", BAOBAB_CONTROL_PLANE_API_URL: "https://cp.integration.test",
    NABHOLD_BFF_STORE_ENABLED: "true", NABHOLD_BFF_REDIS_HOST: "redis.integration.test", NABHOLD_BFF_REDIS_PORT: "6379",
    NABHOLD_BFF_REDIS_USERNAME: "nabhold", NABHOLD_BFF_REDIS_PASSWORD: "synthetic-redis-secret",
    NABHOLD_BFF_STORE_KEYS_JSON: JSON.stringify({ local: Buffer.alloc(32, 7).toString("base64") }),
    NABHOLD_BFF_STORE_ACTIVE_KEY: "local", NABHOLD_BFF_STORE_EPOCH: "integration",
    NODE_EXTRA_CA_CERTS: "/private/ca.pem", NABHOLD_CONTENT_DEV_FALLBACK: "false", NABHOLD_DASHBOARD_PREVIEW: "false",
    NABHOLD_CONTENT_SOURCE: "", NABHOLD_CANONICAL_HOST: "", NABHOLD_RELEASE_R0: "true", NABHOLD_RELEASE_R1: "false",
    NABHOLD_RELEASE_R2: "false", NABHOLD_RELEASE_R3: "false", NABHOLD_INTEGRATION_USERNAME: "synthetic-human",
    NABHOLD_INTEGRATION_PASSWORD: "synthetic-browser-password", NABHOLD_INTEGRATION_PRINCIPAL_ID: "019a0915-a8c0-7000-8000-000000000001",
  };
}
const directories: string[] = [];
afterEach(() => { for (const dir of directories.splice(0)) rmSync(dir, { recursive: true, force: true }); });
function privateFile(text: string) {
  const dir = mkdtempSync(join(tmpdir(), "nabhold-harness-")); directories.push(dir);
  const path = join(dir, "integration.env"); writeFileSync(path, text, { mode: 0o600 }); return path;
}
const dotenv = (env: Record<string, string | undefined>) => Object.entries(env).map(([k, v]) => `${k}='${v}'`).join("\n");

describe("integration configuration boundary", () => {
  it("matches the actual OIDC and confidential-store factories without opening sockets", () => {
    const env = fixture();
    expect(integrationSettings(env).NABHOLD_INTEGRATION_PROFILE).toBe("keycloak-identity-smoke");
    expect(readAuthSettings(env)?.redirectUri).toBe("https://nabhold.integration.test/api/auth/callback");
    expect(createConfidentialStoreFromEnv(env)).not.toBeNull();
  });
  it.each([
    ["NABHOLD_CONTENT_DEV_FALLBACK", "true"], ["NABHOLD_DASHBOARD_PREVIEW", "true"],
    ["NABHOLD_RELEASE_R1", "true"], ["NABHOLD_RELEASE_R2", "true"], ["NABHOLD_RELEASE_R3", "true"],
    ["NABHOLD_OIDC_ENVIRONMENT", "production"], ["NABHOLD_OIDC_ORIGIN", "http://localhost:3000"],
    ["NEXT_PUBLIC_SITE_URL", "https://different.integration.test"],
    ["NABHOLD_OIDC_ISSUER", "https://user:password@iam.integration.test/realm"],
    ["NABHOLD_OIDC_INTROSPECTION_ENDPOINT", "https://untrusted.integration.test/introspect"],
    ["BAOBAB_CONTROL_PLANE_API_URL", "https://different.integration.test"],
    ["NABHOLD_OIDC_CP_ORIGIN", "https://nabhold.integration.test"],
    ["NABHOLD_INTEGRATION_CP_SHA", "main"], ["NABHOLD_BFF_STORE_ENABLED", "false"],
    ["NABHOLD_BFF_STORE_ACTIVE_KEY", "local\n"], ["NABHOLD_INTEGRATION_CP_SHA", "a".repeat(40) + "\n"],
    ["NABHOLD_OIDC_CLIENT_ID", "nabhold-integration\n"], ["NABHOLD_BFF_REDIS_PORT", "6379\n"],
    ["NABHOLD_BFF_STORE_ACTIVE_KEY", "missing"], ["NABHOLD_BFF_STORE_KEYS_JSON", "not-json"],
    ["NODE_TLS_REJECT_UNAUTHORIZED", "0"], ["NODE_OPTIONS", "--inspect"], ["DEBUG", "pw:*"], ["PWDEBUG", "1"],
  ])("refuses unsafe %s", (key, value) => {
    expect(() => integrationSettings({ ...fixture(), [key]: value })).toThrow(IntegrationConfigurationError);
  });
  it("refuses every missing required value without printing supplied secrets", () => {
    const env = fixture();
    for (const key of Object.keys(env)) {
      const partial = { ...env }; delete partial[key];
      expect(() => integrationSettings(partial)).toThrow("Integration configuration refused;");
    }
  });
  it("requires an explicit private file and preserves literal dollar signs", () => {
    const env = fixture(); env.NABHOLD_OIDC_CLIENT_SECRET = "synthetic-$unexpanded-secret";
    const path = privateFile(dotenv(env));
    const loaded = loadIntegrationEnvironment({ NABHOLD_INTEGRATION_ENV_FILE: path, NABHOLD_CONTENT_DEV_FALLBACK: "true" });
    expect(loaded.NABHOLD_OIDC_CLIENT_SECRET).toBe(env.NABHOLD_OIDC_CLIENT_SECRET);
    expect(loaded.NABHOLD_CONTENT_DEV_FALLBACK).toBe("false");
    expect(() => loadIntegrationEnvironment({})).toThrow(IntegrationConfigurationError);
    chmodSync(path, 0o644);
    expect(() => loadIntegrationEnvironment({ NABHOLD_INTEGRATION_ENV_FILE: path })).toThrow(IntegrationConfigurationError);
  });
  it("rejects symlinks, oversized files and undocumented loader settings", () => {
    const path = privateFile(dotenv(fixture())); const link = `${path}.link`; symlinkSync(path, link);
    expect(() => loadIntegrationEnvironment({ NABHOLD_INTEGRATION_ENV_FILE: link })).toThrow(IntegrationConfigurationError);
    writeFileSync(path, `${dotenv(fixture())}\nNODE_OPTIONS=--inspect\n`);
    expect(() => loadIntegrationEnvironment({ NABHOLD_INTEGRATION_ENV_FILE: path })).toThrow(IntegrationConfigurationError);
    writeFileSync(path, "a".repeat(32769));
    expect(() => loadIntegrationEnvironment({ NABHOLD_INTEGRATION_ENV_FILE: path })).toThrow(IntegrationConfigurationError);
  });
});
