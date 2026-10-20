import { describe, expect, it } from "vitest";

import { securityHeaderRules } from "./headers";

function headersFor(source: string) {
  const rule = securityHeaderRules().find((r) => r.source === source);

  return Object.fromEntries(
    (rule?.headers ?? []).map((h) => [h.key, h.value]),
  );
}

describe("security headers", () => {
  it("applies clickjacking, sniffing, referrer and transport protection everywhere", () => {
    const headers = headersFor("/(.*)");

    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Cross-Origin-Opener-Policy"]).toBe("same-origin");
    expect(headers["Strict-Transport-Security"]).toMatch(/max-age=\d{7,}/);
    expect(headers["Permissions-Policy"]).toContain("camera=()");
  });

  it("keeps protocol URLs private and preserves the account form's same-origin Origin", () => {
    const account = headersFor("/account/:path*");
    const protocol = headersFor("/api/auth/:path*");
    expect(account["Referrer-Policy"]).toBe("same-origin");
    expect(protocol["Referrer-Policy"]).toBe("no-referrer");
    for (const headers of [account, protocol]) {
      expect(headers["Cache-Control"]).toBe("no-store");
      expect(headers["X-Robots-Tag"]).toBe("noindex, nofollow");
    }
  });

  it("keeps the protected workspace out of indexes and shared caches", () => {
    const headers = headersFor("/dashboard/:path*");

    expect(headers["X-Robots-Tag"]).toBe("noindex, nofollow");
    expect(headers["Cache-Control"]).toBe("no-store");
  });
});
