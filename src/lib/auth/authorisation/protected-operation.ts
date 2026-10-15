import "server-only";
import type { ConfidentialSession } from "../store/confidential-store";
import {
  requireExecutiveCapability,
  type ExecutiveAccessDependencies,
  type ExecutiveAccessRequest,
} from "./executive-capability";
import { AuthenticationDenied } from "../oidc/settings";

/**
 * G04B-04 operation-level enforcement. Page navigation, presence of a session
 * cookie and group affiliation do not grant rights to a protected operation.
 * Every invocation performs current IAM+CP checks before the callback runs.
 *
 * Callers MUST supply a server-owned, audited static operation mapping, not a
 * capability key or tenant ID accepted from browser input. No authorisation
 * result is cached beyond the current invocation. A downstream provider still
 * has to independently enforce its resource-server policy (EA v2.2).
 */
export async function withExecutiveCapability<T>(
  session: ConfidentialSession | null,
  mapping: Readonly<ExecutiveAccessRequest>,
  dependencies: ExecutiveAccessDependencies,
  operation: (authority: Readonly<{ principalId: string; contextId: string; expiresAt: number }>) => Promise<T>,
): Promise<T> {
  if (!session) throw new AuthenticationDenied();
  const authority = await requireExecutiveCapability(session, mapping, dependencies);
  // A context/decision that expires between CP resolution and execution cannot
  // authorise a delayed operation. The provider remains the final PEP.
  if (authority.expiresAt <= Date.now()) throw new AuthenticationDenied();
  return operation(authority);
}
