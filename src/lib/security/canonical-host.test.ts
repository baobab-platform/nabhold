import { describe, expect, it } from "vitest";

import { canonicalRedirectUrl } from "./canonical-host";

const config = { canonicalHost: "nabhold.com" };

describe("canonical host redirect", () => {
  it("redirects www to the apex, keeping path and query", () => {
    expect(canonicalRedirectUrl("www.nabhold.com", "/portfolio?x=1", config)).toBe(
      "https://nabhold.com/portfolio?x=1",
    );
  });

  it("ignores case, port and trailing dot in the request host", () => {
    expect(canonicalRedirectUrl("WWW.Nabhold.com:443", "/", config)).toBe(
      "https://nabhold.com/",
    );
    expect(canonicalRedirectUrl("www.nabhold.com.", "/", config)).toBe(
      "https://nabhold.com/",
    );
  });

  it("does not redirect the canonical host itself", () => {
    expect(canonicalRedirectUrl("nabhold.com", "/", config)).toBeNull();
  });

  it("does not redirect other hosts, including look-alikes and localhost", () => {
    for (const host of [
      "localhost:3000",
      "127.0.0.1",
      "www.nabhold.com.evil.test",
      "evilwww.nabhold.com",
      "www.other.com",
      "nabhold.com.evil.test",
    ]) {
      expect(canonicalRedirectUrl(host, "/", config), host).toBeNull();
    }
  });

  it("is disabled when no canonical host is configured", () => {
    expect(
      canonicalRedirectUrl("www.nabhold.com", "/", { canonicalHost: undefined }),
    ).toBeNull();
    expect(canonicalRedirectUrl("www.nabhold.com", "/", { canonicalHost: "" })).toBeNull();
  });

  it("never builds the target from the Host header or an unsafe path", () => {
    expect(
      canonicalRedirectUrl("www.nabhold.com", "//evil.test/x", config),
    ).toBe("https://nabhold.com//evil.test/x");
    expect(canonicalRedirectUrl("www.nabhold.com", "evil.test", config)).toBeNull();
  });

  it("rejects an invalid or www-prefixed canonical configuration", () => {
    for (const canonicalHost of ["www.nabhold.com", "nab hold.com", "nabhold.com/x"]) {
      expect(
        canonicalRedirectUrl("www.nabhold.com", "/", { canonicalHost }),
        canonicalHost,
      ).toBeNull();
    }
  });
});
