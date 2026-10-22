import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { OPERATOR_ROLES, observeOperatorAuthority, operatorPlanSchema, type OperatorRole } from "./operator-preflight.ts";
import { resolutionSchema } from "../control-plane/resolution.ts";

/**
 * G17 collects live technical observations across G04/G02/G05; it never makes
 * an admission/legal decision or activates a workload, Tenant or provider.
 * All identifiers are reviewed expectations to compare with authenticated CP
 * responses, not newly minted authority. Independent ceremony, browser login,
 * publication/revalidation/rollback and release signoff remain separate exits.
 *
 * Consulted: Accepted NAB-0004/0006/0014, CP BCP-007/009/026/027 and its
 * permission-filtered Organisation overview, Shared capability/content v1,
 * CMS ADR-0012/0017 and its real route pipeline. Tokens stay opaque; JWT claims
 * and email addresses never supply canonical identity in this consumer.
 */
const uuid = z.string().uuid().transform((s) => s.toLowerCase());
const tenant = z.string().regex(/^tn_[a-z0-9]+$(?![\s\S])/).max(63);
const reference = z.string().min(1).max(128);
export const acceptancePlanSchema = z.object({
  version: z.literal("1.0"),
  operators: operatorPlanSchema,
  onboarding: z.object({ organisation_id: uuid, tenant_id: tenant,
    isolation_strategy: z.enum(["schema_per_tenant", "row_level_security"]),
    residency_region: z.literal("af-south-1") }).strict(),
  cms: z.object({ origin: z.string().url(), context_id: uuid, forbidden_context_id: uuid,
    forbidden_tenant_id: tenant, digital_estate_id: reference,
    content_key: z.enum(["home", "navigation", "footer", "site-settings", "group-profile"]),
    locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$(?![\s\S])/),
    expected_record_id: reference, expected_binding_id: reference,
    expected_provider_id: reference, expected_engine_instance_id: reference }).strict(),
}).strict().superRefine((p, ctx) => {
  if (p.cms.context_id === p.cms.forbidden_context_id || p.onboarding.tenant_id === p.cms.forbidden_tenant_id) {
    ctx.addIssue({ code: "custom", message: "Independent controlled negative contexts required" });
  }
});
export type AcceptancePlan = z.infer<typeof acceptancePlanSchema>;
export const WORKLOAD_CREDENTIALS = ["resolve", "content", "missing_scope", "rejected"] as const;
export type AcceptanceCredentials = {
  operators: Partial<Record<OperatorRole, string>>;
  workloads: Partial<Record<typeof WORKLOAD_CREDENTIALS[number], string>>;
};
type Check = { gate: string; name: string; passed: boolean; code: string;
  correlation_id?: string; http_status?: number; response_sha256?: string };
const digest = (data: string | Uint8Array) => createHash("sha256").update(data).digest("hex");
const MAX_BODY_BYTES = 1024 * 1024;

/** Origin validation precedes every credential use, including local rehearsals. */
function trustedOrigin(raw: string, environment: string): string {
  const url = new URL(raw);
  const local = environment === "local" && url.protocol === "http:" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) && process.env.NODE_ENV !== "production";
  if ((!local && url.protocol !== "https:") || url.username || url.password ||
      url.pathname !== "/" || url.search || url.hash) throw new Error("Unsafe origin");
  return url.origin;
}

/**
 * Bounded streamed JSON, including structured negative responses. Content-
 * Length is not trusted; one deadline covers headers and body. Abort cancels a
 * stalled read; cleanup does not wait for a remote cancellation acknowledgement.
 * Only a digest leaves this boundary: response bodies and transport errors are
 * never copied to reports, logs, artifacts or exception causes.
 */
// Shared by the read-only executive observer. Credential-bearing session
// bodies suppress digest calculation; existing protected observations keep
// their original default hashing behaviour. Callers never retain raw bodies.
export async function boundedJSON(response: Response, signal: AbortSignal, includeDigest = true) {
  if (!response.body || !/^application\/(?:json|problem\+json)(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")) {
    void response.body?.cancel().catch(() => undefined);
    throw new Error("Invalid media type");
  }
  const reader = response.body.getReader();
  const cancel = () => { void reader.cancel().catch(() => undefined); };
  signal.addEventListener("abort", cancel, { once: true });
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      signal.throwIfAborted();
      const chunk = await reader.read();
      signal.throwIfAborted();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > MAX_BODY_BYTES) throw new Error("Response too large");
      if (chunk.value.byteLength) chunks.push(chunk.value);
    }
    const bytes = new Uint8Array(size);
    let at = 0;
    for (const chunk of chunks) { bytes.set(chunk, at); at += chunk.byteLength; }
    return { body: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown,
      sha: includeDigest ? digest(bytes) : undefined };
  } finally { signal.removeEventListener("abort", cancel); cancel(); reader.releaseLock(); }
}

/**
 * A deliberately narrow read model, not a competing CP domain contract. These
 * are the exact fields consumed from the existing overview; other domains are
 * ignored and never inferred as empty or accepted. A hidden Tenant means that
 * the observer lacks exact tenant.view authority, not that it does not exist.
 */
const overview = z.object({ organisation_id: uuid, evaluated_at: z.string().datetime({ offset: true }),
  profile: z.object({ canonical_entity_id: uuid, status: z.literal("ACTIVE") }),
  tenants: z.array(z.object({ tenant_id: tenant, mapping_role: z.literal("PRIMARY_ORGANISATION"),
    mapping_provenance: z.string().min(1), residency_region: z.string(), isolation_strategy: z.string(),
    desired_state: z.string(), observed_state: z.string() })).max(100) });
const nullable = z.string().nullable();
// Closed content/v1 response mirror. Content data remains opaque and is never
// returned as evidence. No Organisation or legal-actor authority is added to
// the request body; that identity pair is attested by CP at the CMS provider.
const contentResponse = z.object({
  record: z.object({ id: z.string(), tenant_id: tenant, content_key: z.string(),
    legal_entity_id: nullable, digital_estate_id: nullable, market_id: nullable, locale: nullable,
    publication_state: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    effective_from: nullable, effective_to: nullable, data: z.record(z.string(), z.unknown()) }).strict().nullable(),
  matched_scope: z.enum(["EXACT", "FALLBACK", "NONE"]),
  provenance: z.object({ trace: z.array(z.object({ scope_level: z.record(z.string(), nullable),
    locale_attempted: nullable, match_count: z.number().int().nonnegative() }).strict()),
    inheritance_mode: z.enum(["NONE", "INHERIT", "OVERRIDE", "COMPOSE"]) }).strict(),
}).strict();

export async function runProtectedAcceptance(input: unknown, credentials: AcceptanceCredentials,
  dependencies: { fetch?: typeof fetch; now?: () => number } = {}) {
  const plan = acceptancePlanSchema.parse(input);
  const environment = plan.operators.environment;
  const cp = trustedOrigin(plan.operators.cp_origin, environment);
  const cms = trustedOrigin(plan.cms.origin, environment);
  if (cp === cms || process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") throw new Error("Transport refused");
  const send = dependencies.fetch ?? fetch;
  const clock = dependencies.now ?? Date.now;
  const started = clock();
  const checks: Check[] = [];
  let validUntil = started + 60_000;
  const report = () => ({ work_item: "G17-PROTECTED-TECHNICAL-OBSERVATIONS", environment,
    evidence_class: dependencies.fetch ? "SYNTHETIC" : environment === "local" ? "LOCAL_REHEARSAL" : "STAGING_HTTP_OBSERVATIONS",
    status: checks.length > 0 && checks.every((c) => c.passed) && clock() < validUntil ? "OBSERVED_NOT_ACCEPTED" : "BLOCKED",
    observed_at: new Date(clock()).toISOString(), valid_until: new Date(validUntil).toISOString(),
    plan_sha256: digest(JSON.stringify(plan)), checks,
    protected_staging_accepted: false, onboarding_accepted: false, production_authorized: false,
    remaining_acceptance: ["INDEPENDENT_LEGAL_AND_ONBOARDING_CEREMONY", "PROTECTED_BROWSER_LOGIN_AND_SESSION_REVOCATION",
      "CONTROLLED_WORKLOAD_REVOCATION_CEREMONY", "PUBLISH_UNPUBLISH_REVALIDATION_AND_ROLLBACK", "INDEPENDENT_G17_SIGNOFF"],
  });
  // Refuse missing/reused/malformed secrets before ANY network call. Human
  // credentials cannot be substituted for workload credentials or each other.
  const all = [...OPERATOR_ROLES.map((r) => credentials.operators[r]),
    ...WORKLOAD_CREDENTIALS.map((r) => credentials.workloads[r])];
  if (all.some((t) => typeof t !== "string" || t.length < 16 || t.length > 16_384 ||
      !/^[A-Za-z0-9\-._~+/]+=*$(?![\s\S])/.test(t)) || new Set(all).size !== all.length) {
    checks.push({ gate: "G04", name: "CREDENTIAL_PREFLIGHT", passed: false, code: "MISSING_INVALID_OR_REUSED_CREDENTIAL" });
    return report();
  }
  const identity = await observeOperatorAuthority(plan.operators, credentials.operators, { fetch: send, now: clock });
  validUntil = Math.min(validUntil, Date.parse(identity.valid_until));
  checks.push(...identity.observations.map((o) => ({ gate: "G04", name: o.role, passed: o.code === "OBSERVED", code: o.code })));
  if (!identity.all_required_grants_observed) return report();

  async function exchange(gate: string, name: string, url: string, token: string | undefined, body?: unknown) {
    const correlation = (body as { correlation_id?: string } | undefined)?.correlation_id ?? randomUUID();
    const signal = AbortSignal.timeout(5000);
    const check: Check = { gate, name, passed: false, code: "TRANSPORT_OR_RESPONSE_REFUSED", correlation_id: correlation };
    checks.push(check);
    try {
      const response = await send(url, { method: body === undefined ? "GET" : "POST", redirect: "error", cache: "no-store", signal,
        headers: { accept: "application/json", "x-correlation-id": correlation,
          ...(token ? { authorization: `Bearer ${token}` } : {}), ...(body === undefined ? {} : { "content-type": "application/json" }) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      if (response.redirected) { void response.body?.cancel().catch(() => undefined); return { check }; }
      check.http_status = response.status;
      const decoded = await boundedJSON(response, signal);
      check.response_sha256 = decoded.sha;
      return { check, body: decoded.body };
    } catch { return { check }; }
  }
  const observed = await exchange("G02", "PRIMARY_TENANT_READBACK", `${cp}/v1/organisations/${plan.onboarding.organisation_id}/overview`,
    credentials.operators.tenant_registrar);
  const parsed = overview.safeParse(observed.body);
  if (observed.check.http_status === 200 && parsed.success) {
    const value = parsed.data;
    const rows = value.tenants.filter((t) => t.tenant_id === plan.onboarding.tenant_id);
    const timestamp = Date.parse(value.evaluated_at);
    observed.check.passed = value.organisation_id === plan.onboarding.organisation_id &&
      value.profile.canonical_entity_id === plan.onboarding.organisation_id && rows.length === 1 &&
      rows[0].residency_region === plan.onboarding.residency_region && rows[0].isolation_strategy === plan.onboarding.isolation_strategy &&
      ["provisioning", "active"].includes(rows[0].observed_state) && clock() - timestamp <= 60_000 && timestamp - clock() <= 5000;
    validUntil = Math.min(validUntil, timestamp + 60_000);
  }
  observed.check.code = observed.check.passed ? "PRIMARY_MAPPING_OBSERVED_NOT_CEREMONY_ACCEPTANCE" : "PRIMARY_MAPPING_NOT_OBSERVED";
  if (!observed.check.passed) return report();

  const request = { capability_key: "content.entry.resolve", required_contract_version: 1,
    context_id: plan.cms.context_id, correlation_id: randomUUID() };
  const resolution = await exchange("G05", "CP_CAPABILITY_BINDING", `${cp}/v1/capabilities/resolve`, credentials.workloads.resolve, request);
  const decision = resolutionSchema.safeParse(resolution.body);
  if (resolution.check.http_status === 200 && decision.success) {
    const r = decision.data;
    let serviceMatches = false;
    try {
      const ref = new URL(r.invocation?.service_reference ?? "");
      serviceMatches = !ref.username && !ref.password && !ref.search && !ref.hash &&
        ((ref.protocol === "service:" && ref.hostname === "baobab-cms") || (ref.protocol === "https:" && ref.origin === cms));
    } catch { /* An invalid reference is a failed check, never guessed routing. */ }
    const expiry = r.expires_at ? Date.parse(r.expires_at) : 0;
    const at = Date.parse(r.resolved_at);
    resolution.check.passed = r.decision === "RESOLVED" && r.context_id === request.context_id &&
      r.capability_key === request.capability_key && r.correlation_id === request.correlation_id &&
      r.binding_id === plan.cms.expected_binding_id && r.invocation?.provider_id === plan.cms.expected_provider_id &&
      r.invocation.engine_instance_id === plan.cms.expected_engine_instance_id && r.invocation.protocol === "http" &&
      r.invocation.contract_version === 1 && r.invocation.route_reference === "/v1/content/resolve" && serviceMatches &&
      expiry > clock() && clock() - at <= 60_000 && at - clock() <= 5000;
    validUntil = Math.min(validUntil, expiry);
  }
  resolution.check.code = resolution.check.passed ? "EXPECTED_BINDING_OBSERVED" : "CAPABILITY_BINDING_NOT_OBSERVED";
  if (!resolution.check.passed) return report();

  const url = `${cms}/v1/content/resolve?context_id=${plan.cms.context_id}`;
  const body = { tenant_id: plan.onboarding.tenant_id, content_key: plan.cms.content_key,
    digital_estate_id: plan.cms.digital_estate_id, locale: plan.cms.locale };
  const cases = [
    { name: "NO_CREDENTIAL", token: undefined, url, body, status: [401], code: "AUTHENTICATION_REQUIRED" },
    { name: "WRONG_AUDIENCE", token: credentials.workloads.resolve, url, body, status: [401], code: "AUTHENTICATION_REQUIRED" },
    { name: "MISSING_SCOPE", token: credentials.workloads.missing_scope, url, body, status: [403], code: "CONTENT_CONTEXT_REJECTED" },
    { name: "REJECTED_CREDENTIAL", token: credentials.workloads.rejected, url, body, status: [401, 403], code: undefined },
    { name: "WRONG_TENANT", token: credentials.workloads.content, url, body: { ...body, tenant_id: plan.cms.forbidden_tenant_id }, status: [403], code: "CONTENT_CONTEXT_REJECTED" },
    { name: "WRONG_CONTEXT", token: credentials.workloads.content, url: `${cms}/v1/content/resolve?context_id=${plan.cms.forbidden_context_id}`, body, status: [403], code: "CONTENT_CONTEXT_REJECTED" },
    { name: "MISSING_CONTEXT", token: credentials.workloads.content, url: `${cms}/v1/content/resolve`, body, status: [400], code: "CONTENT_REQUEST_INVALID" },
    { name: "PREVIEW_DENIED", token: credentials.workloads.content, url, body: { ...body, preview_mode: true }, status: [403], code: "CONTENT_PREVIEW_NOT_PERMITTED" },
  ];
  for (const scenario of cases) {
    const result = await exchange("G05", scenario.name, scenario.url, scenario.token, scenario.body);
    const problem = z.object({ code: z.string(), status: z.number(), correlation_id: z.string().uuid() }).safeParse(result.body);
    result.check.passed = problem.success && scenario.status.includes(result.check.http_status ?? 0) &&
      problem.data.status === result.check.http_status && problem.data.correlation_id === result.check.correlation_id &&
      (scenario.code ? problem.data.code === scenario.code : ["AUTHENTICATION_REQUIRED", "CONTENT_CONTEXT_REJECTED"].includes(problem.data.code));
    result.check.code = result.check.passed ? "EXPECTED_DENIAL_OBSERVED" : "EXPECTED_DENIAL_NOT_OBSERVED";
  }
  const published = await exchange("G05", "PUBLISHED_CONTENT", url, credentials.workloads.content, body);
  const content = contentResponse.safeParse(published.body);
  if (published.check.http_status === 200 && content.success && content.data.record) {
    const record = content.data.record;
    published.check.passed = content.data.matched_scope === "EXACT" && record.id === plan.cms.expected_record_id &&
      record.tenant_id === plan.onboarding.tenant_id && record.content_key === plan.cms.content_key &&
      record.digital_estate_id === plan.cms.digital_estate_id && record.locale === plan.cms.locale && record.publication_state === "PUBLISHED";
  }
  published.check.code = published.check.passed ? "EXPECTED_PUBLISHED_RECORD_OBSERVED" : "EXPECTED_RECORD_NOT_OBSERVED";
  checks.push({ gate: "G17", name: "OBSERVATION_FRESHNESS", passed: clock() < validUntil,
    code: clock() < validUntil ? "FRESH" : "EXPIRED_DURING_COLLECTION" });
  return report();
}
