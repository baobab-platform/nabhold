import { expect, test } from "@playwright/test";

test("public pages carry a locked-down content security policy", async ({
  request,
}) => {
  const response = await request.get("/");
  const csp = response.headers()["content-security-policy"];

  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("connect-src 'self'");
  expect(csp).not.toMatch(/script-src[^;]*\*/);
  expect(response.headers()["x-frame-options"]).toBe("DENY");
});

test("public pages hydrate without content security policy violations", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as unknown as { __csp: string[] }).__csp = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      (window as unknown as { __csp: string[] }).__csp.push(
        `${event.violatedDirective} ${event.blockedURI}`,
      );
    });
  });

  for (const path of ["/", "/portfolio", "/sign-in"]) {
    await page.goto(path, { waitUntil: "networkidle" });
    const violations = await page.evaluate(
      () => (window as unknown as { __csp: string[] }).__csp,
    );

    expect(violations, path).toEqual([]);
  }
});

test("the protected workspace uses a per-request nonce and is not served while disabled", async ({
  request,
}) => {
  const first = await request.get("/dashboard", { maxRedirects: 0 });
  const second = await request.get("/dashboard", { maxRedirects: 0 });

  expect(first.status()).toBe(404);
  const nonceOf = (csp: string | undefined) =>
    /'nonce-([^']+)'/.exec(csp ?? "")?.[1];
  const a = nonceOf(first.headers()["content-security-policy"]);
  const b = nonceOf(second.headers()["content-security-policy"]);

  expect(a).toBeTruthy();
  expect(a).not.toBe(b);
  expect(first.headers()["content-security-policy"]).toContain("'strict-dynamic'");
  expect(first.headers()["cache-control"]).toContain("no-store");
});
