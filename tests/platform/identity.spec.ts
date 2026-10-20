import { expect, test } from "@playwright/test";
import { integrationSettings } from "../../scripts/integration/config";

const s = integrationSettings(process.env);
const sessionName = "__Host-nabhold-session";

test("anonymous sessions are denied", { annotation: { type: "nabhold-scenario", description: "NAB-ID-01" } }, async ({ request }) => {
  const session = await request.get("/api/auth/session");
  expect(session.status()).toBe(401);
});
test("unsolicited callbacks are denied", { annotation: { type: "nabhold-scenario", description: "NAB-ID-02" } }, async ({ request }) => {
  const callback = await request.get("/api/auth/callback?code=unsolicited&state=unsolicited");
  expect(callback.status()).toBe(401);
});
test("cross-origin login initiation is denied", { annotation: { type: "nabhold-scenario", description: "NAB-ID-03" } }, async ({ request }) => {
  const crossOrigin = await request.post("/api/auth/login", { headers: { Origin: "https://untrusted.example.test" }, maxRedirects: 0 });
  expect(crossOrigin.status()).toBe(401);
});

test("real federation login checks CP identity and local logout revokes custody", { annotation: { type: "nabhold-scenario", description: "NAB-ID-04" } }, async ({ page, context }) => {
  await page.goto("/contact");
  // Exercise the ordinary header journey. CSP belongs to the browser document;
  // an RSC/client transition cannot replace the previous page's form policy.
  const navigation = page.waitForResponse(response => response.request().isNavigationRequest() &&
    new URL(response.url()).pathname === "/sign-in");
  await page.getByRole("banner").getByRole("link", { name: "Executive login", exact: true }).click();
  const signIn = await navigation;
  // Chromium also applies form-action to the confidential POST's redirect.
  // The browser may navigate only to self and the server-configured IAM origin.
  const formAction = (signIn?.headers()["content-security-policy"] ?? "").split(";")
    .map(value => value.trim().split(/\s+/)).find(parts => parts[0] === "form-action");
  expect(formAction?.slice(1).join(" ") === `'self' ${new URL(s.NABHOLD_OIDC_ISSUER).origin}`).toBe(true);
  await page.getByRole("button", { name: "Continue with Baobab IAM" }).click();
  // This adapter deliberately targets the real Keycloak federation profile.
  // Kratos/native login and step-up/MFA need separate provider-owned fixtures;
  // no request interception, preloaded sessions, token minting or UI bypass.
  await page.waitForURL(url => url.origin === new URL(s.NABHOLD_OIDC_ISSUER).origin);
  const authorization = new URL(page.url());
  expect(authorization.searchParams.get("response_type") === "code" &&
    authorization.searchParams.get("code_challenge_method") === "S256" &&
    authorization.searchParams.get("redirect_uri") === `${s.NABHOLD_OIDC_ORIGIN}/api/auth/callback`).toBe(true);
  await page.locator("#username").fill(s.NABHOLD_INTEGRATION_USERNAME);
  await page.locator("#password").fill(s.NABHOLD_INTEGRATION_PASSWORD);
  await page.locator("#kc-login").click();
  await page.waitForURL(`${s.NABHOLD_OIDC_ORIGIN}/account`);
  await expect(page.getByRole("heading", { name: "Identity checked", exact: true })).toBeVisible();
  const response = await context.request.get(`${s.NABHOLD_OIDC_ORIGIN}/api/auth/session`);
  expect(response.status()).toBe(200);
  const identity = await response.json();
  // Boolean assertion keeps returned identity/CSRF values out of failure text.
  expect(identity.principalId === s.NABHOLD_INTEGRATION_PRINCIPAL_ID).toBe(true);
  expect(Object.keys(identity).sort().join(",") === "csrfToken,expiresAt,principalId").toBe(true);
  const cookie = (await context.cookies()).find(c => c.name === sessionName);
  expect(Boolean(cookie && cookie.secure && cookie.httpOnly && cookie.path === "/" && cookie.sameSite === "Strict" && /^[A-Za-z0-9_-]{43}$/.test(cookie.value))).toBe(true);
  const csrfDenied = await context.request.post(`${s.NABHOLD_OIDC_ORIGIN}/api/auth/logout`, {
    headers: { Origin: s.NABHOLD_OIDC_ORIGIN }, form: { csrfToken: "invalid" }, maxRedirects: 0,
  });
  expect(csrfDenied.status()).toBe(401);
  // Preserve the old opaque handle privately to prove server-side revocation,
  // rather than counting deletion of the browser cookie as successful logout.
  const stale = cookie!;
  await page.getByRole("button", { name: "Sign out of Nabhold", exact: true }).click();
  await page.waitForURL(`${s.NABHOLD_OIDC_ORIGIN}/sign-in`);
  await context.addCookies([stale]);
  const revoked = await context.request.get(`${s.NABHOLD_OIDC_ORIGIN}/api/auth/session`);
  expect(revoked.status()).toBe(401);
});
