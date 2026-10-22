import "server-only";
import { z } from "zod";
import { requireCurrentIdentity } from "../oidc/authority";
import { AuthenticationDenied, secureUrl, type AuthSettings } from "../oidc/settings";
import { fetchJson } from "../oidc/transport";
import type { ConfidentialSession } from "../store/confidential-store";

/** CP CX-03B / ADR-BCP-020/026/027: navigation consumes human read models.
 * It never issues or redeems a workload PlatformContext. In particular this
 * result cannot implement CurrentExecutiveContextResolver or authorise a command.
 */
const selectionSchema = z.object({
  organisationId: z.string().uuid(),
  tenantId: z.string().regex(/^tn_[a-z0-9]{3,60}$(?![\s\S])/),
  countryCode: z.string().regex(/^[A-Z]{2}$(?![\s\S])/),
  environment: z.enum(["development", "integration", "staging"]),
}).strict();
export type ExecutiveNavigationSelection = z.infer<typeof selectionSchema>;

/** Only trusted server configuration selects this estate's own scope. Missing
 * configuration stays unavailable; names, group ownership and browser IDs do
 * not stand in for independently created CP references or permission grants.
 */
export function readExecutiveNavigationSelection(env: Record<string, string | undefined> = process.env): ExecutiveNavigationSelection | null {
  if (env.NABHOLD_EXECUTIVE_CONTEXT_ENABLED !== "true") return null;
  try {
    return selectionSchema.parse({
      organisationId: env.NABHOLD_EXECUTIVE_ORGANISATION_ID,
      tenantId: env.NABHOLD_EXECUTIVE_TENANT_ID,
      countryCode: env.NABHOLD_EXECUTIVE_COUNTRY_CODE,
      environment: env.NABHOLD_OIDC_ENVIRONMENT,
    });
  } catch { throw new AuthenticationDenied(); }
}

const time = z.string().datetime({ offset: true });
const label = z.string().min(1).max(256).regex(/^[^\u0000-\u001f\u007f]+$(?![\s\S])/);
const reference = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$(?![\s\S])/);
const authoritySchema = z.object({
  principal_id: z.string().uuid(), evaluated_at: time,
  grants: z.array(z.object({
    grant_id: reference, permission: z.string(),
    scope: z.object({ level: z.string(), mode: z.string().optional(),
      organisation_id: z.string().optional(), tenant_id: z.string().optional(), environment: z.string().optional(),
    }).passthrough(),
    grant_type: z.enum(["STANDING", "TIME_BOUND", "JUST_IN_TIME"]),
    source: z.enum(["DIRECT", "PROFILE", "DELEGATION", "BOOTSTRAP"]),
    risk_class: z.enum(["LOW", "MODERATE", "HIGH", "CRITICAL"]), valid_until: time.optional(),
  })).max(500),
});
const activeState = z.enum(["active", "ACTIVE"]);
const overviewSchema = z.object({
  organisation_id: z.string().uuid(), evaluated_at: time,
  profile: z.object({ canonical_entity_id: z.string().uuid(), display_name: label, status: z.literal("ACTIVE") }),
  tenants: z.array(z.object({ tenant_id: z.string(), mapping_role: z.string(), mapping_provenance: z.string().min(1).max(512),
    desired_state: z.string(), observed_state: z.string(), markets_visible: z.boolean(),
    market_participations: z.array(z.object({ country_code: z.string(), registry_market_id: reference,
      currency_code: z.string().regex(/^[A-Z]{3}$(?![\s\S])/) })).max(100),
  })).max(100),
});
const tenantSchema = z.object({ tenant_id: z.string(), display_name: label, desired_state: activeState, observed_state: activeState });
const FRESHNESS = 30_000;

function fresh(raw: string, now: number): number {
  const at = Date.parse(raw);
  if (!Number.isFinite(now) || at > now + 5_000 || at + FRESHNESS <= now) throw new AuthenticationDenied();
  return at + FRESHNESS;
}

function exactAuthority(input: unknown, principal: string, selected: ExecutiveNavigationSelection, now: number): number {
  const value = authoritySchema.parse(input);
  if (value.principal_id !== principal || new Set(value.grants.map(g => g.grant_id)).size !== value.grants.length) throw new AuthenticationDenied();
  let expiry = fresh(value.evaluated_at, now);
  for (const [permission, level, key, id] of [
    ["organisation.view", "ORGANISATION", "organisation_id", selected.organisationId],
    ["tenant.view", "TENANT", "tenant_id", selected.tenantId],
    ["market.view", "TENANT", "tenant_id", selected.tenantId],
  ] as const) {
    const grant = value.grants.find(g => g.permission === permission && g.scope.level === level &&
      (g.scope.mode === undefined || g.scope.mode === "EXACT") && g.scope[key] === id &&
      (g.scope.environment === undefined || g.scope.environment === selected.environment) &&
      Object.keys(g.scope).every(field => ["level", "mode", "environment", key].includes(field)) &&
      (g.grant_type === "STANDING" || g.valid_until !== undefined) &&
      (g.valid_until === undefined || Date.parse(g.valid_until) > now));
    if (!grant) throw new AuthenticationDenied();
    // Effective-authority observations may bound a standing grant too; honour
    // any current expiry without treating that bound as a new grant lifetime.
    if (grant.valid_until) expiry = Math.min(expiry, Date.parse(grant.valid_until));
  }
  return expiry;
}

export type ExecutiveNavigationContext = Readonly<{
  kind: "EXECUTIVE_NAVIGATION";
  organisationId: string; organisationName: string; tenantId: string; tenantName: string;
  market: Readonly<{ countryCode: string; marketId: string; currencyCode: string }>;
  evaluatedAt: string; expiresAt: number; executionAuthority: false;
}>;

/** Concrete same-human CP adapter. Eight bounded reads recheck IAM, canonical
 * identity and exact grants before and after the resource reads. CP independently
 * authorises each source request; no grants or selection are cached in cookies.
 * A bounded observation is still not an atomic execution permit or a mandate.
 */
export async function resolveExecutiveNavigation(session: ConfidentialSession, input: ExecutiveNavigationSelection,
  settings: AuthSettings, dependencies: { fetcher?: typeof fetch; now?: () => number } = {}): Promise<ExecutiveNavigationContext> {
  try {
    const selected = selectionSchema.parse(input);
    const cp = secureUrl(settings.cpOrigin);
    if (cp.pathname !== "/" || cp.origin === new URL(settings.origin).origin || process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") throw new Error();
    const now = dependencies.now ?? Date.now;
    const started = now();
    const signal = AbortSignal.timeout(10_000);
    const send = dependencies.fetcher ?? fetch;
    const bounded: typeof fetch = async (url, init) => {
      signal.throwIfAborted();
      const response = await send(url, { ...init, signal: AbortSignal.any([signal, ...(init?.signal ? [init.signal] : [])]) });
      if (response.redirected) { void response.body?.cancel().catch(() => undefined); throw new AuthenticationDenied(); }
      return response;
    };
    const identity = await requireCurrentIdentity(session, settings, bounded);
    const read = (path: string) => fetchJson(new URL(path, cp).href,
      { headers: { Authorization: `Bearer ${session.accessToken}`, Accept: "application/json" } }, bounded);
    const initialExpiry = exactAuthority(await read("/v1/admin/effective-authority"), identity.principalId, selected, now());
    const overview = overviewSchema.parse(await read(`/v1/organisations/${selected.organisationId}/overview`));
    const tenant = tenantSchema.parse(await read(`/v1/tenants/${selected.tenantId}`));
    if (overview.organisation_id !== selected.organisationId || overview.profile.canonical_entity_id !== selected.organisationId ||
      tenant.tenant_id !== selected.tenantId) throw new Error();
    const rows = overview.tenants.filter(t => t.tenant_id === selected.tenantId);
    if (rows.length !== 1) throw new Error();
    const mapping = rows[0];
    if (mapping.mapping_role !== "PRIMARY_ORGANISATION" || !mapping.mapping_provenance.trim() || !mapping.markets_visible ||
      !activeState.safeParse(mapping.desired_state).success || !activeState.safeParse(mapping.observed_state).success ||
      mapping.desired_state !== tenant.desired_state || mapping.observed_state !== tenant.observed_state ||
      new Set(mapping.market_participations.map(m => m.country_code)).size !== mapping.market_participations.length) throw new Error();
    const markets = mapping.market_participations.filter(m => m.country_code === selected.countryCode);
    if (markets.length !== 1) throw new Error();
    const current = await requireCurrentIdentity(session, settings, bounded);
    if (current.principalId !== identity.principalId) throw new Error();
    const finalExpiry = exactAuthority(await read("/v1/admin/effective-authority"), current.principalId, selected, now());
    const expiresAt = Math.min(identity.expiresAt, current.expiresAt, initialExpiry, finalExpiry,
      fresh(overview.evaluated_at, now()), started + 10_000);
    signal.throwIfAborted();
    if (expiresAt <= now()) throw new Error();
    return { kind: "EXECUTIVE_NAVIGATION", organisationId: selected.organisationId, organisationName: overview.profile.display_name,
      tenantId: selected.tenantId, tenantName: tenant.display_name, evaluatedAt: overview.evaluated_at, expiresAt,
      market: { countryCode: markets[0].country_code, marketId: markets[0].registry_market_id, currencyCode: markets[0].currency_code },
      executionAuthority: false };
  } catch { throw new AuthenticationDenied(); }
}
