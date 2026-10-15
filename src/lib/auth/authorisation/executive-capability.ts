import "server-only";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { ConfidentialSession } from "../store/confidential-store";
import { requireCurrentIdentity } from "../oidc/authority";
import type { AuthSettings } from "../oidc/settings";
import { AuthenticationDenied } from "../oidc/settings";
import type { CapabilityClient } from "../../control-plane/capability-client";
import { capabilityKeySchema } from "../../control-plane/resolution";

/**
 * G04B-04 / EA v2.2: executive access is a CP-governed decision, never a
 * property inferred from IAM login, shareholding, provider groups or the
 * existence of a Nabhold-branded frontend.
 *
 * The context adapter MUST consult CP's current effective principal/tenant
 * authority. This interface is deliberately not an invented HTTP endpoint:
 * its production implementation cannot be activated until the CP owner pins
 * the exact contract. Injecting a test adapter produces SOURCE evidence only.
 */
const contextSchema = z.object({
  principal_id: z.string().uuid(),
  organisation_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  context_id: z.string().min(1).max(512),
  evaluated_at: z.string().datetime({ offset: true }),
  expires_at: z.string().datetime({ offset: true }),
  authorised: z.literal(true),
}).strict();

export type ExecutiveContext = z.infer<typeof contextSchema>;
export interface CurrentExecutiveContextResolver {
  resolveCurrent(input: { principalId: string; expectedOrganisationId: string; expectedTenantId: string }): Promise<unknown>;
}
export interface ExecutiveAccessDependencies {
  settings: AuthSettings;
  context: CurrentExecutiveContextResolver;
  capabilities: Pick<CapabilityClient, "resolve">;
  fetcher?: typeof fetch;
  now?: () => number;
}

export interface ExecutiveAccessRequest {
  /** These are application configuration / trusted route parameters, NEVER user session claims. */
  expectedOrganisationId: string;
  expectedTenantId: string;
  capabilityKey: string;
  contractVersion: number;
}

/**
 * Check revocation and CP identity on each invocation; fetch a CURRENT CP
 * context for exactly the expected tenant and Organisation; resolve the
 * specific capability with CP. Fail closed on all missing, malformed, stale,
 * ambiguous, denied or unavailable evidence. Do not cache grants in cookies.
 */
export async function requireExecutiveCapability(
  session: ConfidentialSession,
  request: ExecutiveAccessRequest,
  deps: ExecutiveAccessDependencies,
): Promise<{ principalId: string; contextId: string; expiresAt: number }> {
  try {
    const expected = z.object({
      expectedOrganisationId: z.string().uuid(),
      expectedTenantId: z.string().uuid(),
      capabilityKey: capabilityKeySchema,
      contractVersion: z.number().int().positive(),
    }).strict().parse(request);
    const now = deps.now?.() ?? Date.now();
    const identity = await requireCurrentIdentity(session, deps.settings, deps.fetcher);
    if (identity.expiresAt <= now) throw new Error("Expired identity");
    const raw = await deps.context.resolveCurrent({
      principalId: identity.principalId,
      expectedOrganisationId: expected.expectedOrganisationId,
      expectedTenantId: expected.expectedTenantId,
    });
    const context = contextSchema.parse(raw);
    if (context.principal_id !== identity.principalId ||
      context.organisation_id !== expected.expectedOrganisationId ||
      context.tenant_id !== expected.expectedTenantId) throw new Error("Wrong context");
    const evaluatedAt = Date.parse(context.evaluated_at);
    const contextExpiry = Date.parse(context.expires_at);
    if (Math.abs(now - evaluatedAt) > 30_000 || contextExpiry <= now ||
      contextExpiry > now + 5 * 60_000) throw new Error("Stale context");
    const resolution = await deps.capabilities.resolve({
      capability_key: expected.capabilityKey,
      required_contract_version: expected.contractVersion,
      context_id: context.context_id,
      correlation_id: randomUUID(),
    });
    // The canonical CP client already checks request/response correlation,
    // contract version, decision, expiry, grant, binding and invocation.
    if (resolution.context_id !== context.context_id ||
      resolution.capability_key !== expected.capabilityKey ||
      resolution.decision !== "RESOLVED" || !resolution.grant_id ||
      !resolution.binding_id || !resolution.invocation ||
      resolution.invocation.contract_version !== expected.contractVersion ||
      (resolution.expires_at && Date.parse(resolution.expires_at) <= now)) {
      throw new Error("Denied capability");
    }
    const expiresAt = Math.min(identity.expiresAt, contextExpiry,
      resolution.expires_at ? Date.parse(resolution.expires_at) : contextExpiry);
    if (expiresAt <= now) throw new Error("Expired authority");
    return { principalId: identity.principalId, contextId: context.context_id, expiresAt };
  } catch {
    // Never disclose CP tenancy, grant identifiers or provider configuration.
    throw new AuthenticationDenied();
  }
}
