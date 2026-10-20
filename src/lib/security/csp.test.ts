import { describe, expect, it } from "vitest";

import {
  buildCsp,
  cspHeaderName,
  generateNonce,
  surfaceForPath,
} from "./csp";

function directive(policy: string, name: string): string[] {
  const found = policy
    .split("; ")
    .map((d) => d.split(" "))
    .find(([n]) => n === name);

  return found ? found.slice(1) : [];
}

describe("content security policy", () => {
  it("uses a nonce and strict-dynamic, with no unsafe-inline scripts, on the protected surface", () => {
    const policy = buildCsp({ surface: "protected", nonce: "abc123" });
    const script = directive(policy, "script-src");

    expect(script).toEqual(["'self'", "'nonce-abc123'", "'strict-dynamic'"]);
    expect(script).not.toContain("'unsafe-inline'");
    expect(script).not.toContain("'unsafe-eval'");
  });

  it("refuses to build a protected policy without a nonce", () => {
    expect(() => buildCsp({ surface: "protected" })).toThrow(/nonce/);
  });

  it("keeps the public surface locked down apart from inline scripts", () => {
    const policy = buildCsp({ surface: "public" });

    expect(directive(policy, "script-src")).toEqual(["'self'", "'unsafe-inline'"]);
    expect(directive(policy, "connect-src")).toEqual(["'self'"]);
    expect(directive(policy, "object-src")).toEqual(["'none'"]);
    expect(directive(policy, "frame-ancestors")).toEqual(["'none'"]);
    expect(directive(policy, "base-uri")).toEqual(["'self'"]);
    expect(directive(policy, "form-action")).toEqual(["'self'"]);
    expect(policy).toContain("upgrade-insecure-requests");
  });

  it("never allows a wildcard or remote script host", () => {
    for (const surface of ["public", "protected"] as const) {
      const policy = buildCsp({ surface, nonce: "n" });

      expect(policy).not.toMatch(/\*|https?:\/\//);
    }
  });

  it("allows the configured IAM origin only as a form navigation destination", () => {
    const policy = buildCsp({ surface: "public", formActionOrigin: "https://iam.example.test" });
    expect(directive(policy, "form-action")).toEqual(["'self'", "https://iam.example.test"]);
    for (const name of ["script-src", "connect-src", "frame-ancestors", "base-uri", "img-src"]) {
      expect(directive(policy, name)).not.toContain("https://iam.example.test");
    }
  });

  it.each(["http://iam.test", "//iam.test", "https://*.test", "https://user:pass@iam.test",
    "https://iam.test/path", "https://iam.test?x=1", "https://iam.test#fragment",
    "https://iam.test;script-src", "https://iam.test,evil.test", "https://iam.test evil.test",
    "https://iam.test\n", "https://iam.test/", "https://iam.test:99999"])(
    "rejects unsafe CSP form origin %j", value => {
      expect(() => buildCsp({ surface: "public", formActionOrigin: value })).toThrow();
    },
  );

  it("allows eval and plain HTTP only in development", () => {
    const dev = buildCsp({ surface: "public", development: true });
    const prod = buildCsp({ surface: "public", development: false });

    expect(directive(dev, "script-src")).toContain("'unsafe-eval'");
    expect(dev).not.toContain("upgrade-insecure-requests");
    expect(directive(prod, "script-src")).not.toContain("'unsafe-eval'");
  });

  it("generates unique, unguessable nonces", () => {
    const a = generateNonce();
    const b = generateNonce();

    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9+/]{22}==$/);
  });

  it("selects the protected surface only for the workspace", () => {
    expect(surfaceForPath("/dashboard")).toBe("protected");
    expect(surfaceForPath("/account")).toBe("protected");
    expect(surfaceForPath("/dashboard/reports")).toBe("protected");
    expect(surfaceForPath("/dashboards")).toBe("public");
    expect(surfaceForPath("/")).toBe("public");
    expect(surfaceForPath("/insights/x")).toBe("public");
  });

  it("supports a report-only rollout mode", () => {
    expect(cspHeaderName("report-only")).toBe(
      "Content-Security-Policy-Report-Only",
    );
    expect(cspHeaderName(undefined)).toBe("Content-Security-Policy");
    expect(cspHeaderName("enforce")).toBe("Content-Security-Policy");
  });
});
