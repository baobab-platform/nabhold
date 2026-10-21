# G04B-04 — Current executive context and capability boundary

**State:** source increment, NOT operationally accepted. **G04/P0-04 remains PARTIAL.**
**Governing:** Nabhold Go-Live MP v2.0; Shared EA implementation plan v2.2; Accepted ADR-SHARED-036; CP-owned Organisation, Tenant, effective-grant, context and binding contracts; IAM ADR-IAM-0033.

## Implemented
- A server-only, deny-by-default authorisation primitive layered on existing G04B-03 IAM introspection and CP self-identity.
- It requires a **current CP-derived canonical principal/Organisation/Tenant/context**, rejects mismatches and stale decisions, and resolves a *specific* canonical capability using the pre-existing CP capability client.
- Context is deliberately injected behind a narrow interface. A bearer-authenticated CP `authority:self` identity observation **is not** an executive grant. A subsidiary corporate relationship is **not** a cross-tenant grant.
- No new scope, grant, token, CP URL, provider binding, fictional identity or R1 release flag is introduced.

## Remaining production integration — explicitly blocked
1. CP owner must publish/verify the exact authorised human-to-tenant context contract and its IAM audience/scope policy. Do not manufacture a `/v1/...` endpoint.
2. Implement the concrete adapter against that accepted route with the same TLS/deadline/response limits as the existing CP client; test with *real CP*.
3. Attach this guard to each protected operation using trusted application-registered Organisation/Tenant and operation-capability mappings, not caller-controlled IDs or arbitrary capability strings.
4. Replace the dashboard's existing `getSession` preview-only gate only once a real R1 authority path and feature acceptance are demonstrated. Never silently promote a signed-in identity to executive.
5. Run EA v2.2 INT-02 (real IAM↔CP) and INT-03 (IAM↔CP↔Nabhold confidential BFF↔CMS) in Infrastructure's shared pinned L4 harness, with wrong-audience, revoked, ungranted, wrong-tenant, wrong-Organisation and unavailable-provider denial.
6. Protected staging and independent G17 release approval remain separate. No source test counts as production approval.

**Fail-closed principle:** missing adapter or absent current resolution means no authorisation. The public R0 website and API-only external clients must not require or inherit Nabhold's executive estate.

## Cross-service context ownership finding (15 October 2026)

CP commit `babae209` binds a stored context to the principal that resolved it. CP capability resolution checks that the authenticated caller owns the context. Consequently, a **human-owned context_id is not redeemable using a different Nabhold workload token**. The G04B-04 `requireExecutiveCapability` function is therefore only a seam until a CP-approved same-principal human capability request, explicit delegated-authority protocol, or another canonical owner-approved pattern is established. A hypothetical `context_id` in an internal BFF is not an authorisation grant. Do not wire the default workload-backed `CapabilityClient` to a human-owned context, and do not weaken CP context-owner enforcement to make that work.

The new `withExecutiveCapability` helper requires current-authority checks before a protected operation callback, and keeps the provider's own execution-point controls independent. No dashboard route is activated by the helper; callers must use server-registered mappings. This is implementation progress, not INT-02/INT-03 success.

**Required CP/Shared convergence decision:** document the exact protocol for an authorised human principal acting through Nabhold's confidential BFF, with current grants, capability resolution, context owner, token audience and resource-server verification. Add real-component positive and cross-tenant/revoked/wrong-audience negatives to Infrastructure's L4 harness before enabling an R1 endpoint.

## Canonical tenant selector convergence (21 October 2026)

The source guard now accepts CP-issued `tn_[a-z0-9]+` Tenant IDs, while Principal and Organisation retain UUID validation. The former UUID-only Tenant schema rejected valid canonical contexts. Regression tests require canonical Tenant IDs and reject UUID, uppercase, empty-suffix, malformed and mismatched selectors before capability use. No identifier is derived from a company or IAM subject, and no context, mandate or grant is issued by this validation.

EA v2.3 retains v2.2's normative L4 matrix. Same-principal human context redemption, live native IAM↔CP proof, executive mandate/grant acceptance, registry activation, actual staging, production and R0–R3 remain independently open. This change enables no route or release flag.
