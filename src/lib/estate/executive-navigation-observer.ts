import { createHash } from "node:crypto";
import { z } from "zod";
import { boundedJSON } from "./protected-acceptance.ts";

/** G04B-05 qualification preparation: independently read the existing CP human
 * projections and compare the real BFF result. No provisioning, token issuance,
 * CP mutation, logout, PlatformContext redemption or acceptance signing occurs.
 * A plan/approval reference is an operator declaration, never approval itself.
 */
const uuid = z.string().uuid();
const sha = z.string().regex(/^[a-f0-9]{40}$(?![\s\S])/);
const reference = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$(?![\s\S])/);
const time = z.string().datetime({ offset: true });
const origin = z.string().url().refine(value => {
  const url = new URL(value);
  return url.protocol === "https:" && url.origin === value && !url.username && !url.password;
});
export const executiveObservationPlanSchema = z.object({
  version: z.literal("1.0"), environment: z.enum(["integration", "staging"]),
  run_id: z.string().regex(/^[a-f0-9]{32}$(?![\s\S])/), deadline: time,
  approval_reference: reference,
  bff_origin: origin, cp_origin: origin,
  expected: z.object({ owner_principal_id: uuid, denied_principal_id: uuid, organisation_id: uuid,
    tenant_id: z.string().regex(/^tn_[a-z0-9]{3,60}$(?![\s\S])/),
    country_code: z.string().regex(/^[A-Z]{2}$(?![\s\S])/), market_id: reference,
    currency_code: z.string().regex(/^[A-Z]{3}$(?![\s\S])/) }).strict(),
  sources: z.object({ nabhold: sha, cp: sha, iam: sha, shared: sha, infrastructure: sha }).strict(),
}).strict().refine(p => p.bff_origin !== p.cp_origin && p.expected.owner_principal_id !== p.expected.denied_principal_id);

export type ExecutiveObservationPlan = z.infer<typeof executiveObservationPlanSchema>;
export interface ExecutiveObservationCredentials {
  owner_session?: string; denied_session?: string; owner_cp_token?: string; denied_cp_token?: string;
}
const session = z.object({ principalId: uuid, expiresAt: z.number().int().safe().positive(),
  csrfToken: z.string().regex(/^[A-Za-z0-9_-]{43}$(?![\s\S])/) }).strict();
const scope = z.object({ level: z.string(), mode: z.string().optional(), environment: z.string().optional(),
  organisation_id: z.string().optional(), tenant_id: z.string().optional() }).passthrough();
const authority = z.object({ principal_id: uuid, evaluated_at: time, grants: z.array(z.object({
  grant_id: reference, permission: z.string(), scope, grant_type: z.enum(["STANDING", "TIME_BOUND", "JUST_IN_TIME"]),
  valid_until: time.optional(), source: z.enum(["DIRECT", "PROFILE", "DELEGATION", "BOOTSTRAP"]),
  risk_class: z.enum(["LOW", "MODERATE", "HIGH", "CRITICAL"]),
})).max(500) });
const tenant = z.object({ tenant_id: z.string(), display_name: z.string().min(1).max(256), desired_state: z.string(), observed_state: z.string() });
const overview = z.object({ organisation_id: uuid, evaluated_at: time,
  profile: z.object({ canonical_entity_id: uuid, display_name: z.string().min(1).max(256), status: z.literal("ACTIVE") }),
  tenants: z.array(z.object({ tenant_id: z.string(), mapping_role: z.string(), mapping_provenance: z.string().min(1).max(512),
    desired_state: z.string(), observed_state: z.string(), markets_visible: z.boolean(),
    market_participations: z.array(z.object({ country_code: z.string(), registry_market_id: reference, currency_code: z.string() })).max(100),
  })).max(100),
});
const context = z.object({ kind: z.literal("EXECUTIVE_NAVIGATION"), organisationId: uuid,
  organisationName: z.string().min(1).max(256), tenantId: z.string(), tenantName: z.string().min(1).max(256),
  market: z.object({ countryCode: z.string(), marketId: reference, currencyCode: z.string() }).strict(),
  evaluatedAt: time, expiresAt: z.number().int().safe().positive(), executionAuthority: z.literal(false),
}).strict();
const denial = z.object({ code: z.literal("AUTHENTICATION_UNAVAILABLE_OR_DENIED") }).strict();
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
const CHECKS = ["CURRENT_SESSIONS_AND_GRANTS", "CP_PRIMARY_MAPPING", "ANONYMOUS_DENIED", "CALLER_SELECTOR_DENIED",
  "FOREIGN_ORIGIN_DENIED", "UNGRANTED_SESSION_DENIED", "POST_DENIAL_IDENTITIES", "CONTEXT_MATCHES_CP",
  "CURRENT_FINAL_GRANTS", "OBSERVATION_FRESHNESS"] as const;
type Observation = { label: string; http_status?: number; response_sha256?: string };

export async function observeExecutiveNavigation(input: unknown, credentials: ExecutiveObservationCredentials,
  dependencies: { fetch?: typeof fetch; now?: () => number } = {}) {
  const plan = executiveObservationPlanSchema.parse(input);
  const now = dependencies.now ?? Date.now;
  const started = now(), end = Date.parse(plan.deadline);
  if (end <= started || end > started + 90 * 60_000 || process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0" ||
    process.env.NODE_OPTIONS || process.env.NODE_DEBUG || process.env.DEBUG || process.env.PWDEBUG) throw new Error("Observation refused");
  const checks = CHECKS.map(name => ({ name, passed: false }));
  const observations: Observation[] = [];
  let validUntil = Math.min(end, started + 30_000);
  const report = () => ({ work_item: "G04B-05-NAVIGATION-OBSERVATIONS", run_id: plan.run_id, environment: plan.environment,
    evidence_class: dependencies.fetch ? "SYNTHETIC" : "HTTP_OBSERVATIONS_UNATTESTED",
    status: checks.every(c => c.passed) && now() >= started && now() < validUntil ? "OBSERVED_NOT_ACCEPTED" : "BLOCKED",
    observed_at: new Date(now()).toISOString(), valid_until: new Date(validUntil).toISOString(),
    plan_sha256: digest(JSON.stringify(plan)), declared_sources: plan.sources, checks, observations,
    source_runtime_attested: false, topology_approval_attested: false, independent_acceptance: false,
    execution_authority: false, int03c_qualified: false, nab03_qualified: false, production_authorized: false,
    remaining_acceptance: ["INDEPENDENT_TOPOLOGY_AND_HUMAN_FIXTURE_APPROVAL_VERIFICATION", "REAL_BROWSER_LOGIN_AND_REVOCATION",
      "INDEPENDENT_SOURCE_IMAGE_AND_EVIDENCE_CUSTODY", "INDEPENDENT_FIXTURE_TEARDOWN_AND_SECRET_DISPOSAL",
      "PROTECTED_STAGING_AND_HUMAN_SIGNOFF"],
  });
  const handles = [credentials.owner_session, credentials.denied_session];
  const tokens = [credentials.owner_cp_token, credentials.denied_cp_token];
  if (handles.some(h => typeof h !== "string" || !/^[A-Za-z0-9_-]{43}$(?![\s\S])/.test(h)) ||
    tokens.some(t => typeof t !== "string" || t.length < 16 || t.length > 16384 || !/^[A-Za-z0-9\-._~+/]+=*$(?![\s\S])/.test(t)) ||
    new Set([...handles, ...tokens]).size !== 4) return report();
  const send = dependencies.fetch ?? fetch;
  const deadline = AbortSignal.timeout(Math.min(30_000, end - started));
  const mark = (name: typeof CHECKS[number]) => { checks.find(c => c.name === name)!.passed = true; };
  const fresh = (value: string) => {
    const at = Date.parse(value);
    if (at > now() + 5000 || at + 30_000 <= now()) throw new Error();
    validUntil = Math.min(validUntil, at + 30_000);
  };
  async function read(label: string, path: string, actor: "owner" | "denied" | "anonymous", cp = false,
    extra: Record<string, string> = {}, secretBody = false) {
    deadline.throwIfAborted();
    if (now() < started || now() >= validUntil) throw new Error();
    const headers: Record<string, string> = { Accept: "application/json", ...extra };
    if (actor !== "anonymous") {
      if (cp) headers.Authorization = `Bearer ${actor === "owner" ? credentials.owner_cp_token : credentials.denied_cp_token}`;
      else headers.Cookie = `__Host-nabhold-session=${actor === "owner" ? credentials.owner_session : credentials.denied_session}`;
    }
    const signal = AbortSignal.any([deadline, AbortSignal.timeout(5000)]);
    const result = await send(new URL(path, cp ? plan.cp_origin : plan.bff_origin).href,
      { method: "GET", headers, redirect: "error", cache: "no-store", signal });
    if (result.redirected) { void result.body?.cancel().catch(() => undefined); throw new Error(); }
    const decoded = await boundedJSON(result, signal, !secretBody);
    if (now() >= validUntil) throw new Error();
    // Session bodies contain CSRF secrets: neither bytes nor their digest is retained.
    observations.push({ label, http_status: result.status, ...(secretBody ? {} : { response_sha256: decoded.sha }) });
    return { status: result.status, body: decoded.body, headers: result.headers };
  }
  async function identity(actor: "owner" | "denied", phase: string) {
    const result = await read(`${phase}_${actor}_session`, "/api/auth/session", actor, false, {}, true);
    const value = session.parse(result.body);
    const expected = actor === "owner" ? plan.expected.owner_principal_id : plan.expected.denied_principal_id;
    if (result.status !== 200 || value.principalId !== expected || value.expiresAt <= now()) throw new Error();
    validUntil = Math.min(validUntil, value.expiresAt);
  }
  async function grants(actor: "owner" | "denied", phase: string) {
    const result = await read(`${phase}_${actor}_cp_grants`, "/v1/admin/effective-authority", actor, true);
    const value = authority.parse(result.body);
    const expected = actor === "owner" ? plan.expected.owner_principal_id : plan.expected.denied_principal_id;
    if (result.status !== 200 || value.principal_id !== expected || new Set(value.grants.map(g => g.grant_id)).size !== value.grants.length) throw new Error();
    fresh(value.evaluated_at);
    const matched = ([
      ["organisation.view", "ORGANISATION", "organisation_id", plan.expected.organisation_id],
      ["tenant.view", "TENANT", "tenant_id", plan.expected.tenant_id],
      ["market.view", "TENANT", "tenant_id", plan.expected.tenant_id],
    ] as const).map(([permission, level, key, id]) => value.grants.find(g => g.permission === permission && g.scope.level === level &&
      (g.scope.mode === undefined || g.scope.mode === "EXACT") && g.scope[key] === id &&
      (g.scope.environment === undefined || g.scope.environment === plan.environment) &&
      Object.keys(g.scope).every(k => ["level", "mode", "environment", key].includes(k)) &&
      (g.grant_type === "STANDING" || g.valid_until !== undefined) && (!g.valid_until || Date.parse(g.valid_until) > now())));
    if (actor === "owner" ? matched.some(g => !g) : matched.every(Boolean)) throw new Error();
    if (actor === "owner") for (const g of matched) if (g?.valid_until) validUntil = Math.min(validUntil, Date.parse(g.valid_until));
  }
  async function refused(name: typeof CHECKS[number], path: string, actor: "owner" | "denied" | "anonymous", headers = {}) {
    const value = await read(name, path, actor, false, headers);
    if (value.status !== 401 || !denial.safeParse(value.body).success) throw new Error();
    mark(name);
  }
  try {
    await identity("owner", "before"); await identity("denied", "before");
    await grants("owner", "before"); await grants("denied", "before"); mark("CURRENT_SESSIONS_AND_GRANTS");
    const a = await read("cp_organisation", `/v1/organisations/${plan.expected.organisation_id}/overview`, "owner", true);
    const b = await read("cp_tenant", `/v1/tenants/${plan.expected.tenant_id}`, "owner", true);
    const org = overview.parse(a.body), t = tenant.parse(b.body);
    const mappings = org.tenants.filter(row => row.tenant_id === plan.expected.tenant_id);
    if (a.status !== 200 || b.status !== 200 || org.organisation_id !== plan.expected.organisation_id ||
      org.profile.canonical_entity_id !== plan.expected.organisation_id || t.tenant_id !== plan.expected.tenant_id || mappings.length !== 1) throw new Error();
    fresh(org.evaluated_at);
    const mapping = mappings[0];
    const active = (s: string) => s === "active" || s === "ACTIVE";
    if (mapping.mapping_role !== "PRIMARY_ORGANISATION" || !mapping.mapping_provenance.trim() || !mapping.markets_visible ||
      !active(t.desired_state) || !active(t.observed_state) || mapping.desired_state !== t.desired_state || mapping.observed_state !== t.observed_state ||
      new Set(mapping.market_participations.map(m => m.country_code)).size !== mapping.market_participations.length) throw new Error();
    const markets = mapping.market_participations.filter(m => m.country_code === plan.expected.country_code &&
      m.registry_market_id === plan.expected.market_id && m.currency_code === plan.expected.currency_code);
    if (markets.length !== 1) throw new Error();
    mark("CP_PRIMARY_MAPPING");
    await refused("ANONYMOUS_DENIED", "/api/auth/context", "anonymous");
    await refused("CALLER_SELECTOR_DENIED", "/api/auth/context?tenant_id=tn_untrustedselector", "owner");
    const foreign = plan.bff_origin === "https://foreign-origin.invalid" ? "https://other-origin.invalid" : "https://foreign-origin.invalid";
    await refused("FOREIGN_ORIGIN_DENIED", "/api/auth/context", "owner", { Origin: foreign });
    await refused("UNGRANTED_SESSION_DENIED", "/api/auth/context", "denied");
    await identity("owner", "after"); await identity("denied", "after"); mark("POST_DENIAL_IDENTITIES");
    const result = await read("owner_context", "/api/auth/context", "owner");
    const value = context.parse(result.body);
    if (result.status !== 200 || value.organisationId !== plan.expected.organisation_id || value.tenantId !== plan.expected.tenant_id ||
      value.organisationName !== org.profile.display_name || value.tenantName !== t.display_name ||
      value.market.countryCode !== plan.expected.country_code || value.market.marketId !== plan.expected.market_id ||
      value.market.currencyCode !== plan.expected.currency_code || value.expiresAt <= now() || value.expiresAt > now() + 10_000 ||
      result.headers.get("cache-control") !== "private, no-store" || result.headers.get("vary")?.toLowerCase() !== "cookie" ||
      result.headers.has("access-control-allow-origin")) throw new Error();
    fresh(value.evaluatedAt); validUntil = Math.min(validUntil, value.expiresAt); mark("CONTEXT_MATCHES_CP");
    await grants("owner", "after"); await grants("denied", "after"); mark("CURRENT_FINAL_GRANTS");
    deadline.throwIfAborted(); if (now() >= started && now() < validUntil) mark("OBSERVATION_FRESHNESS");
  } catch { /* Preserve only bounded facts and incomplete checks; never raw errors. */ }
  return report();
}
