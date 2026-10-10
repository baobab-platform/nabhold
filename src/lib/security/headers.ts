/**
 * Baseline response headers for every route (masterplan G16 task 6). A
 * nonce-based Content-Security-Policy is deliberately not set here: it needs
 * per-request nonce plumbing through the App Router and is tracked as open in
 * docs/go-live/register.md.
 */
export interface HeaderRule {
  source: string;
  headers: { key: string; value: string }[];
}

export const BASELINE_HEADERS: { key: string; value: string }[] = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

/** Authenticated workspace pages must never be indexed or cached by shared caches. */
export const PROTECTED_HEADERS: { key: string; value: string }[] = [
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "Cache-Control", value: "no-store" },
];

export function securityHeaderRules(): HeaderRule[] {
  return [
    { source: "/(.*)", headers: BASELINE_HEADERS },
    { source: "/dashboard/:path*", headers: PROTECTED_HEADERS },
  ];
}
