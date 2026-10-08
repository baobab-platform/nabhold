import { NextResponse, type NextRequest } from "next/server";

import {
  buildCsp,
  cspHeaderName,
  generateNonce,
  surfaceForPath,
} from "@/lib/security/csp";

/**
 * Applies the Content-Security-Policy. The policy is also set on the
 * *request* so Next.js can read the nonce and stamp it on its own scripts
 * when it renders a dynamic page.
 */
export function middleware(request: NextRequest) {
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
