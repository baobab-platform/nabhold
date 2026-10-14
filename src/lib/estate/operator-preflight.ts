import { randomUUID } from "node:crypto";
import { z } from "zod";

/**
 * P0-04B-01 is an operator diagnostic, never an authorisation service. CP owns
 * canonical Principal mapping, grant eligibility and every action decision.
 * This module is deliberately outside browser/authentication flows: it accepts
 * opaque, separately obtained CP-audience human credentials and only reads the
 * caller's own /v1/admin/effective-authority projection. It never decodes token
 * claims to invent identity, creates a Principal, or grants a permission.
 *
 * Reviewed sources: Shared administration/v1 at 92541c92321abde72dea7deb7d42e70d0b6acafb,
 * CP at 366fe6e549a6c5e7f62b551829438daaa1aa6647, IAM ADR-IAM-0031/0033,
 * and Nabhold masterplan v2.0 G04. Permission names are a consumer demand list,
 * not a new catalogue. V2 route authorisation, OAuth scopes/client roles, MFA,
 * independent natural-person authority and maker/checker remain CP/IAM gates.
 */
export const OPERATOR_PERMISSIONS = {
  verification_reviewer: ["verification.view", "verification.review"],
  verification_decider: ["verification.view", "verification.decide"],
  admission_reviewer: ["application.review"],
  admission_decider: ["application.decide"],
  onboarding_requester: ["tenant.provision"],
  onboarding_authoriser: ["changeset.approve"],
  tenant_registrar: ["tenant.provision"],
} as const;

export type OperatorRole = keyof typeof OPERATOR_PERMISSIONS;
export const OPERATOR_ROLES = Object.keys(OPERATOR_PERMISSIONS) as OperatorRole[];

// IDs must come from CP's registered human identities, not names/email or a
// provider-internal user ID. Matching a supplied UUID does not prove that two
// humans are independent; the ceremony still needs an independent review.
const principalSchema = z.string().uuid().transform((id) => id.toLowerCase());
export const operatorPlanSchema = z.object({
  version: z.literal("1.0"),
  masterplan: z.literal("NAB-GOLIVE-MP-001-v2.0"),
  environment: z.enum(["local", "staging"]),
  cp_origin: z.string().url(),
  principals: z.object({
    verification_reviewer: principalSchema,
    verification_decider: principalSchema,
    admission_reviewer: principalSchema,
    admission_decider: principalSchema,
    onboarding_requester: principalSchema,
    onboarding_authoriser: principalSchema,
    tenant_registrar: principalSchema,
  }).strict(),
}).strict().superRefine((plan, ctx) => {
  if (new Set(Object.values(plan.principals)).size !== OPERATOR_ROLES.length) {
    ctx.addIssue({ code: "custom", path: ["principals"], message: "Distinct CP Principals required" });
  }
});
export type OperatorPlan = z.infer<typeof operatorPlanSchema>;

// Mirror the closed EffectiveAuthority envelope. Unrelated scope anchors are
// retained only as opaque projection data and can never qualify below. The
// selector accepts ONLY an exact, environment-qualified PLATFORM scope, so an
// extra tenant/group/resource anchor is not silently treated as global access.
const authoritySchema = z.object({
  principal_id: principalSchema,
  evaluated_at: z.string().datetime({ offset: true }),
  elevated_until: z.string().datetime({ offset: true }).optional(),
  grants: z.array(z.object({
    grant_id: z.string().min(8).max(63).regex(/^agr_[a-z0-9]+$/),
    permission: z.string().min(3).max(96).regex(/^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/),
    scope: z.record(z.string(), z.unknown()),
    grant_type: z.enum(["STANDING", "TIME_BOUND", "JUST_IN_TIME"]),
    source: z.enum(["DIRECT", "PROFILE", "DELEGATION", "BOOTSTRAP"]),
    risk_class: z.enum(["LOW", "MODERATE", "HIGH", "CRITICAL"]),
    profile_key: z.string().min(3).max(63).optional(),
    valid_until: z.string().datetime({ offset: true }).optional(),
    elevated: z.boolean().optional(),
  }).strict()).max(500),
}).strict();
const ceremonyScopeSchema = z.object({
  level: z.literal("PLATFORM"),
  mode: z.literal("EXACT").optional(),
  environment: z.enum(["local", "staging"]),
}).strict();

type GrantPointer = { permission: string; grant_id: string; valid_until?: string };
export type OperatorObservation = {
  role: OperatorRole;
  expected_principal_id: string;
  code: "OBSERVED" | "CREDENTIAL_MISSING_OR_INVALID" | "CREDENTIAL_REUSED" |
    "TRANSPORT_REFUSED" | "CP_REFUSED" | "PROJECTION_INVALID" |
    "PRINCIPAL_MISMATCH" | "PROJECTION_STALE" | "SCOPED_GRANTS_MISSING";
  evaluated_at?: string;
  grants: GrantPointer[];
};

const MAX_RESPONSE_BYTES = 128 * 1024;
const OBSERVATION_LIFETIME_MS = 60_000;
const CLOCK_SKEW_MS = 5_000;

/** A fixed CP origin is operator-controlled metadata, never browser input. */
function authorityURL(plan: OperatorPlan): URL {
  const origin = new URL(plan.cp_origin);
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
  if (origin.username || origin.password || origin.search || origin.hash || origin.pathname !== "/" ||
      (origin.protocol !== "https:" && !(plan.environment === "local" && loopback && origin.protocol === "http:"))) {
    throw new Error("Operator plan transport refused");
  }
  return new URL("/v1/admin/effective-authority", origin);
}

/**
 * Bound actual streamed bytes, not merely Content-Length (which may lie or be
 * absent). Abort the reader on oversize/cancellation. Neither error messages nor
 * raw CP response bodies escape into the diagnostic report or CLI logs.
 */
async function readProjection(response: Response): Promise<unknown> {
  if (!response.body || !/^application\/json(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")) {
    throw new Error("Invalid projection media type");
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_RESPONSE_BYTES) throw new Error("Projection size exceeded");
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

/**
 * Every role is observed independently, with no token substitution, redirect,
 * retry or cached-authority fallback. A failed request cannot promote another
 * role. Tokens are excluded from the returned object even on transport errors.
 * The injectable transport/clock support isolated negative tests; the CLI uses
 * the real fetch implementation and wall clock.
 */
export async function observeOperatorAuthority(
  input: unknown,
  credentials: Partial<Record<OperatorRole, string>>,
  dependencies: { fetch?: typeof fetch; now?: () => number } = {},
) {
  const plan = operatorPlanSchema.parse(input);
  const endpoint = authorityURL(plan); // Validate before sending any credential.
  const send = dependencies.fetch ?? fetch;
  const clock = dependencies.now ?? Date.now;
  const startedAt = clock();
  const tokens = OPERATOR_ROLES.map((role) => credentials[role]?.trim());
  const observations = await Promise.all(OPERATOR_ROLES.map(async (role, index): Promise<OperatorObservation> => {
    const result: OperatorObservation = {
      role, expected_principal_id: plan.principals[role], code: "CREDENTIAL_MISSING_OR_INVALID", grants: [],
    };
    const token = tokens[index];
    // RFC 6750 b64token grammar also supports opaque tokens. Never interpret
    // an unverified JWT's sub, roles or scope as canonical CP authority.
    if (!token || token.length < 16 || token.length > 16_384 || !/^[A-Za-z0-9\-._~+/]+=*$/.test(token)) return result;
    if (tokens.filter((other) => other === token).length > 1) return { ...result, code: "CREDENTIAL_REUSED" };

    let response: Response;
    const timeout = AbortSignal.timeout(5_000);
    try {
      response = await send(endpoint, {
        method: "GET", redirect: "error", cache: "no-store", signal: timeout,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "X-Correlation-ID": randomUUID() },
      });
    } catch { return { ...result, code: "TRANSPORT_REFUSED" }; }
    if (response.status !== 200 || response.redirected) {
      await response.body?.cancel().catch(() => undefined);
      return { ...result, code: "CP_REFUSED" };
    }
    let projection: z.infer<typeof authoritySchema>;
    try { projection = authoritySchema.parse(await readProjection(response)); }
    catch { return { ...result, code: "PROJECTION_INVALID" }; }
    if (projection.principal_id !== result.expected_principal_id) return { ...result, code: "PRINCIPAL_MISMATCH" };
    const evaluatedAt = Date.parse(projection.evaluated_at);
    const now = clock();
    if (now - evaluatedAt > OBSERVATION_LIFETIME_MS || evaluatedAt - now > CLOCK_SKEW_MS) {
      return { ...result, code: "PROJECTION_STALE" };
    }
    // A grant cannot be selected twice through a duplicated projection entry.
    if (new Set(projection.grants.map((g) => g.grant_id)).size !== projection.grants.length) {
      return { ...result, code: "PROJECTION_INVALID" };
    }
    const grants: GrantPointer[] = [];
    for (const permission of OPERATOR_PERMISSIONS[role]) {
      const qualifying = projection.grants.find((grant) => {
        const scope = ceremonyScopeSchema.safeParse(grant.scope);
        if (grant.permission !== permission || !scope.success || scope.data.environment !== plan.environment ||
            grant.risk_class === "CRITICAL") return false;
        // Temporary authority needs a real future expiry. Even standing grants
        // cannot be used if CP returned an explicit, already-expired boundary.
        if (grant.grant_type !== "STANDING" && !grant.valid_until) return false;
        return !grant.valid_until || Date.parse(grant.valid_until) > now;
      });
      if (qualifying) grants.push({ permission, grant_id: qualifying.grant_id,
        ...(qualifying.valid_until ? { valid_until: qualifying.valid_until } : {}) });
    }
    return { ...result, code: grants.length === OPERATOR_PERMISSIONS[role].length ? "OBSERVED" : "SCOPED_GRANTS_MISSING",
      evaluated_at: projection.evaluated_at, grants };
  }));
  const finishedAt = clock();
  // The aggregate expires when ANY selected grant/projection expires, not a
  // minute after the slowest request. This is diagnostic freshness only.
  const validUntil = Math.min(startedAt + OBSERVATION_LIFETIME_MS,
    ...observations.flatMap((o) => [
      ...(o.evaluated_at ? [Date.parse(o.evaluated_at) + OBSERVATION_LIFETIME_MS] : []),
      ...o.grants.flatMap((g) => g.valid_until ? [Date.parse(g.valid_until)] : []),
    ]));
  return {
    gate: "G04", work_item: "P0-04B-01", environment: plan.environment,
    status: "DIAGNOSTIC_ONLY_NOT_AUTHORIZATION",
    observed_at: new Date(finishedAt).toISOString(), valid_until: new Date(validUntil).toISOString(),
    all_required_grants_observed: observations.every((o) => o.code === "OBSERVED") && finishedAt < validUntil,
    protected_staging_accepted: false, onboarding_authorized: false, production_authorized: false,
    observations,
  };
}
