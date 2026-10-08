# ADR-NAB-0013 — Corporate Capability Consumption, Required Product Compositions and Rollout Classification

**Status:** Proposed (implemented in code; Acceptance requires architecture review)
**Date:** 2026-10-08
**Decision Owners:** Baobab Platform Architecture / Nabhold frontend
**Repository:** `baobab-platform/nabhold`
**Masterplan:** NAB-GOLIVE-MP-001, gates G02, G03, G15
**Depends On:** ADR-NAB-0003, ADR-NAB-0006, ADR-BCP-003, ADR-BCP-007, ADR-SHARED-017

## Context

The estate must ship in independently releasable classes (R0 institutional, R1 corporate, R2 platform commercial, R3 group oversight). Most capabilities R1 to R3 need are not canonical, and none has a proven active binding. Without an enforced boundary, a protected route or prototype could be reached because a public release is live.

## Decision (proposed)

1. **Release classes are enforced server-side.** `src/lib/release/release-class.ts` enables R0 by default and R1 to R3 only when the matching `NABHOLD_RELEASE_Rn` variable is exactly `"true"`. Classes are never inferred from one another. `/dashboard` requires R1; the Pulse overview requires R3. Disabled routes return 404.
2. **A flag is not acceptance.** Enabling a class requires the signed GO in masterplan §11 and the evidence in `docs/go-live/evidence/`. The flag only makes that decision enforceable and reversible.
3. **Capabilities are consumed by canonical key only.** The estate requests only keys present in the Shared catalogue (`src/lib/estate/onboarding-profile.ts` holds a reviewed snapshot). Proposed keys in `docs/go-live/capability-demand-census.md` are not requested until Shared registers them (G03).
4. **Resolution goes through the Control Plane.** `src/lib/control-plane/` implements the Shared resolution contract. It sends no tenant, legal-entity or principal identity, fails closed without a workload token provider, and refuses mismatched, expired or non-`RESOLVED` decisions. It never proxies business payloads.
5. **Capability states are distinct.** Every capability is tracked as canonical (`C`), proposed (`P`) or active (`A`). Source code, a provider declaration or a green CI run does not make a capability `A`.
6. **Transitional exceptions are explicit.** The direct Payload gateway and the Pulse `/v1/executive-overview` prototype remain only as recorded exceptions (B-03, B-13) until their canonical replacements exist.

## Alternatives rejected

- A single `NABHOLD_PRODUCTION` switch: cannot release R0 without exposing R1 to R3.
- Hiding unreleased routes only in navigation: not enforcement.
- Adding proposed keys to the estate so screens can be built: duplicates semantics Shared must own.

## Consequences

- Positive: R0 can proceed on its own path; protected routes fail closed.
- Negative: an unset flag hides routes that preview users could previously see; local work now sets the flags in `.env.local`.
- Follow-up: replace the transitional Payload gateway after `content.entry.resolve` is live (G05); add a nonce-based CSP.

## Supersedes / amends

Partially supersedes nothing. It operationalises ADR-NAB-0003 and ADR-NAB-0006.
