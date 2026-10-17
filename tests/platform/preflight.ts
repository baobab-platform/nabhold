import { integrationSettings } from "../../scripts/integration/config";

/** Public discovery is read with strict TLS, no credentials and no redirects.
 * This rejects an obviously incompatible/unready issuer before browser login.
 * CP/Redis functionality is proved by the actual BFF login/session test, not a
 * health endpoint or an unauthenticated 401 (which can mask a broken provider).
 */
export default async function preflight() {
  try {
    const s = integrationSettings(process.env);
    const response = await fetch(`${s.NABHOLD_OIDC_ISSUER.replace(/\/$/, "")}/.well-known/openid-configuration`, {
      redirect: "error", signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error();
    const discovery = await response.json();
    if (discovery.issuer !== s.NABHOLD_OIDC_ISSUER ||
        !discovery.code_challenge_methods_supported?.includes("S256")) throw new Error();
    for (const name of ["authorization_endpoint", "token_endpoint", "jwks_uri"]) {
      const url = new URL(discovery[name]);
      if (url.origin !== new URL(s.NABHOLD_OIDC_ISSUER).origin || url.username || url.password || url.search || url.hash) throw new Error();
    }
  } catch { throw new Error("Integration issuer preflight failed; no acceptance evidence produced."); }
}
