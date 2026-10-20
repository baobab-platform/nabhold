// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
vi.mock("server-only", () => ({}));
import { proxy } from "./proxy";

const environment = {
  NABHOLD_OIDC_ENABLED: "true", NABHOLD_OIDC_ENVIRONMENT: "integration",
  NABHOLD_OIDC_ORIGIN: "https://estate.example.test", NABHOLD_OIDC_ISSUER: "https://iam.example.test/realms/reviewed",
  NABHOLD_OIDC_CLIENT_ID: "nabhold-reviewed", NABHOLD_OIDC_CLIENT_SECRET: "synthetic-client-secret",
  NABHOLD_OIDC_INTROSPECTION_ENDPOINT: "https://iam.example.test/introspect",
  NABHOLD_OIDC_CP_ORIGIN: "https://cp.example.test", NABHOLD_CANONICAL_HOST: "",
};
function formAction(path: string) {
  const response = proxy(new NextRequest("https://estate.example.test" + path));
  return response.headers.get("Content-Security-Policy")!.split("; ").find(d => d.startsWith("form-action "));
}
afterEach(() => vi.unstubAllEnvs());
describe("federated sign-in CSP", () => {
  it("uses only the server-configured issuer on the exact sign-in page", () => {
    for (const [key, value] of Object.entries(environment)) vi.stubEnv(key, value);
    expect(formAction("/sign-in?issuer=https://attacker.test")).toBe("form-action 'self' https://iam.example.test");
    for (const path of ["/", "/account", "/dashboard", "/sign-in/other"]) expect(formAction(path)).toBe("form-action 'self'");
  });
  it.each(["false", "invalid"])("keeps disabled/malformed authentication closed: %s", enabled => {
    for (const [key, value] of Object.entries(environment)) vi.stubEnv(key, value);
    vi.stubEnv("NABHOLD_OIDC_ENABLED", enabled);
    expect(formAction("/sign-in")).toBe("form-action 'self'");
    vi.stubEnv("NABHOLD_OIDC_ENABLED", "true"); vi.stubEnv("NABHOLD_OIDC_ISSUER", "http://iam.example.test");
    expect(formAction("/sign-in")).toBe("form-action 'self'");
  });
});
