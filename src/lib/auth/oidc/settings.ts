import "server-only";
import { z } from "zod";

/** No provider URL, client or credential may come from a browser parameter. */
export class AuthenticationDenied extends Error {
  constructor() { super("Authentication unavailable or denied"); this.name = "AuthenticationDenied"; }
}
export function secureUrl(value: string): URL {
  const u = new URL(value);
  if (u.protocol !== "https:" || u.username || u.password || u.search || u.hash) throw new AuthenticationDenied();
  return u;
}
export interface AuthSettings {
  trustProxy?: boolean;
  origin: string; issuer: string; clientId: string; clientSecret: string;
  redirectUri: string; introspectionEndpoint: string; cpOrigin: string; algorithm: "RS256" | "ES256";
}
/** Deployment opt-in is separate from source readiness. No insecure local URL exception. */
export function readAuthSettings(env: Record<string, string | undefined> = process.env): AuthSettings | null {
  if (env.NABHOLD_OIDC_ENABLED !== "true") return null;
  try {
    // Acceptance must precede production activation; NODE_ENV=production is also
    // used by protected staging builds, so use an explicit deployment boundary.
    if (!["integration", "staging", "development"].includes(env.NABHOLD_OIDC_ENVIRONMENT ?? "") || env.NODE_TLS_REJECT_UNAUTHORIZED === "0") throw new Error();
    const origin = secureUrl(env.NABHOLD_OIDC_ORIGIN ?? "");
    const cp = secureUrl(env.NABHOLD_OIDC_CP_ORIGIN ?? "");
    if (origin.pathname !== "/" || cp.pathname !== "/" || origin.origin === cp.origin) throw new Error();
    // OIDC issuer equality is exact, including a bare origin without slash.
    const issuer = env.NABHOLD_OIDC_ISSUER ?? "";
    secureUrl(issuer);
    const introspection = secureUrl(env.NABHOLD_OIDC_INTROSPECTION_ENDPOINT ?? "");
    if (introspection.origin !== new URL(issuer).origin) throw new Error();
    const clientId = z.string().min(1).max(256).regex(/^\S+$/).parse(env.NABHOLD_OIDC_CLIENT_ID);
    const clientSecret = z.string().min(16).max(4096).parse(env.NABHOLD_OIDC_CLIENT_SECRET);
    const algorithm = z.enum(["RS256", "ES256"]).parse(env.NABHOLD_OIDC_ID_TOKEN_ALGORITHM ?? "RS256");
    const trustProxy = z.enum(["true", "false"]).parse(env.NABHOLD_OIDC_TRUST_PROXY ?? "false") === "true";
    return { origin: origin.origin, issuer, cpOrigin: cp.origin, clientId, clientSecret,
      redirectUri: new URL("/api/auth/callback", origin).href, introspectionEndpoint: introspection.href, algorithm, trustProxy };
  } catch { throw new AuthenticationDenied(); }
}
