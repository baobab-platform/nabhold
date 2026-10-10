/**
 * Configuration for reading estate content through the canonical
 * `content.entry.resolve` capability (register item 6, CMS track).
 *
 * Off unless NABHOLD_CONTENT_SOURCE is exactly "capability". When it is on,
 * every value below is required; a missing one turns the capability path off
 * (the estate then serves its own defaults for the five singleton keys, never
 * a guess). Nothing here has a NEXT_PUBLIC_* mirror.
 *
 * The identifiers are supplied, not invented:
 * - tenantId: the Control Plane tenant id (tn_...) issued for Nabhold;
 * - platformContextId: a RUNTIME platform context the Control Plane issued for
 *   this workload (how it is issued and refreshed is not yet decided);
 * - legalEntityId / digitalEstateId / marketId: the canonical ids the CMS
 *   records are scoped to.
 */
export interface BaobabContentConfig {
  tenantId: string;
  platformContextId: string;
  legalEntityId: string;
  digitalEstateId: string;
  marketId?: string;
  locale: string;
  timeoutMs: number;
  /**
   * Explicit service name to origin map for `service://<name>/...` references (the platform has no service discovery yet).
   * A reference whose name is not listed is refused. Required in production to be https.
   */
  serviceOrigins: Record<string, string>;
}

const DEFAULT_TIMEOUT_MS = 5_000;
const TENANT_ID = /^tn_[a-z0-9]+$/;
const LOCALE = /^[a-z]{2}(?:-[A-Z]{2})?$/;

function parseServiceOrigins(raw: string | undefined): Record<string, string> | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
    const out: Record<string, string> = {};
    for (const [name, origin] of Object.entries(value)) {
      if (typeof origin !== "string") return null;
      const url = new URL(origin);
      if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) return null;
      if (process.env.NODE_ENV === "production" && url.protocol !== "https:") return null;
      out[name] = url.origin;
    }
    return Object.keys(out).length > 0 ? out : null;
  } catch {
    return null;
  }
}

export function isCapabilityContentRequested(): boolean {
  return process.env.NABHOLD_CONTENT_SOURCE === "capability";
}

export function getBaobabContentConfig(): BaobabContentConfig | null {
  if (!isCapabilityContentRequested()) return null;

  const tenantId = process.env.NABHOLD_CONTENT_TENANT_ID;
  const platformContextId = process.env.NABHOLD_CONTENT_CONTEXT_ID;
  const legalEntityId = process.env.NABHOLD_CONTENT_LEGAL_ENTITY_ID;
  const digitalEstateId = process.env.NABHOLD_CONTENT_DIGITAL_ESTATE_ID;
  const locale = process.env.NABHOLD_CONTENT_LOCALE ?? "en-ZA";
  const serviceOrigins = parseServiceOrigins(process.env.NABHOLD_SERVICE_ORIGINS);

  if (
    !tenantId ||
    !TENANT_ID.test(tenantId) ||
    !platformContextId ||
    !legalEntityId ||
    !digitalEstateId ||
    !LOCALE.test(locale) ||
    !serviceOrigins
  ) {
    return null;
  }

  const configuredTimeout = Number(process.env.NABHOLD_CONTENT_TIMEOUT_MS);

  return {
    tenantId,
    platformContextId,
    legalEntityId,
    digitalEstateId,
    marketId: process.env.NABHOLD_CONTENT_MARKET_ID || undefined,
    locale,
    timeoutMs:
      Number.isInteger(configuredTimeout) && configuredTimeout > 0
        ? configuredTimeout
        : DEFAULT_TIMEOUT_MS,
    serviceOrigins,
  };
}
