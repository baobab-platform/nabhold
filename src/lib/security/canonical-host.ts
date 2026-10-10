/**
 * Canonical-host redirect. The estate answers on both `nabhold.com` and
 * `www.nabhold.com`; one is canonical and the other redirects to it with a
 * permanent redirect so search engines and cookies see a single origin.
 *
 * Only the exact `www.<canonical>` host is redirected. The redirect target is
 * built from configuration plus the request path, never from the Host header,
 * so it cannot be turned into an open redirect.
 */
export interface CanonicalHostConfig {
  /** Bare hostname, for example "nabhold.com". Unset disables the redirect. */
  canonicalHost: string | undefined;
}

function normaliseHost(host: string): string {
  return host.trim().toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
}

export function canonicalRedirectUrl(
  requestHost: string | null | undefined,
  pathnameAndSearch: string,
  config: CanonicalHostConfig,
): string | null {
  if (!config.canonicalHost || !requestHost) return null;

  const canonical = normaliseHost(config.canonicalHost);
  if (!/^[a-z0-9.-]+$/.test(canonical) || canonical.startsWith("www.")) {
    return null;
  }

  if (normaliseHost(requestHost) !== `www.${canonical}`) return null;
  if (!pathnameAndSearch.startsWith("/")) return null;

  return `https://${canonical}${pathnameAndSearch}`;
}
