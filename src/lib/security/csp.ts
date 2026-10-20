/**
 * Content-Security-Policy builder (masterplan G16 task 6).
 *
 * Two policies, chosen by route:
 *
 * - "protected" (authenticated workspace): always rendered per request and
 *   served `no-store`, so it gets a strict per-request nonce with
 *   `strict-dynamic`. No `unsafe-inline` for scripts.
 * - "public" (institutional site): pages are prerendered and cached, so a
 *   per-request nonce cannot be baked into the HTML, and reusing a nonce
 *   across cached responses would defeat it. Scripts therefore allow
 *   `'unsafe-inline'` on this surface only. Everything else is locked down:
 *   no foreign script hosts, no objects, no framing, no base/form hijack,
 *   and the browser may connect only to this origin.
 *
 * Domain API calls remain server-side, so `connect-src` stays `'self'`.
 * Federated login also requires top-level browser navigation to the configured
 * IAM origin. Only the sign-in route supplies that form-action exception;
 * see ADR-NAB-0004's CSP implementation clarification.
 */
export type CspSurface = "public" | "protected";

export interface CspOptions {
  surface: CspSurface;
  /** Required for the protected surface. */
  nonce?: string;
  /** Development needs eval for React refresh; never set in production. */
  development?: boolean;
  /** Server-validated HTTPS IAM origin; sign-in navigation only, never an API/script source. */
  formActionOrigin?: string;
}

export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary);
}

export function buildCsp(options: CspOptions): string {
  const { surface, nonce, development = false } = options;

  if (surface === "protected" && !nonce) {
    throw new Error("The protected surface requires a CSP nonce.");
  }

  const scriptSrc =
    surface === "protected"
      ? ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"]
      : ["'self'", "'unsafe-inline'"];

  if (development) scriptSrc.push("'unsafe-eval'");

  const formAction = ["'self'"];
  if (options.formActionOrigin !== undefined) {
    const value = options.formActionOrigin;
    // A CSP source is a single token, not an arbitrary URL or directive list.
    // URL canonicalisation alone does not reject every CSP delimiter in hosts.
    if (!/^https:\/\/(?:[a-z0-9.-]+|\[[a-f0-9:]+\])(?::[0-9]+)?$/i.test(value) ||
        new URL(value).origin !== value) throw new Error("Invalid IAM form origin.");
    formAction.push(value);
  }

  const directives: string[][] = [
    ["default-src", "'self'"],
    ["script-src", ...scriptSrc],
    // Framework and component styles are emitted inline; styles cannot run code.
    ["style-src", "'self'", "'unsafe-inline'"],
    ["img-src", "'self'", "data:", "blob:"],
    ["font-src", "'self'", "data:"],
    ["connect-src", "'self'"],
    ["object-src", "'none'"],
    ["base-uri", "'self'"],
    ["form-action", ...formAction],
    ["frame-ancestors", "'none'"],
    ["manifest-src", "'self'"],
  ];

  if (!development) directives.push(["upgrade-insecure-requests"]);

  return directives.map((parts) => parts.join(" ")).join("; ");
}

/** `NABHOLD_CSP_MODE=report-only` lets a rollout observe violations first. */
export function cspHeaderName(mode: string | undefined): string {
  return mode === "report-only"
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";
}

export function surfaceForPath(pathname: string): CspSurface {
  return pathname === "/account" || pathname.startsWith("/account/") || pathname === "/dashboard" || pathname.startsWith("/dashboard/")
    ? "protected"
    : "public";
}
