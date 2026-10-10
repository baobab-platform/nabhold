import { NextResponse, type NextRequest } from "next/server";

import { canonicalRedirectUrl } from "@/lib/security/canonical-host";
import {
  buildCsp,
  cspHeaderName,
  generateNonce,
  surfaceForPath,
} from "@/lib/security/csp";

/**
 * Redirects `www.<canonical host>` to the canonical host, then applies the
 * Content-Security-Policy. The policy is also set on the
 * *request* so Next.js can read the nonce and stamp it on its own scripts
 * when it renders a dynamic page.
 */
export function proxy(request: NextRequest) {
  const redirectTo = canonicalRedirectUrl(
    request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    { canonicalHost: process.env.NABHOLD_CANONICAL_HOST },
  );
  if (redirectTo) return NextResponse.redirect(redirectTo, 308);

  const surface = surfaceForPath(request.nextUrl.pathname);
  const nonce = surface === "protected" ? generateNonce() : undefined;
  const policy = buildCsp({
    surface,
    nonce,
    development: process.env.NODE_ENV !== "production",
  });
  const headerName = cspHeaderName(process.env.NABHOLD_CSP_MODE);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(headerName, policy);
  if (nonce) requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(headerName, policy);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
