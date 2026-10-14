# Nabhold go-live programme

The controlling programme baseline is **[NAB-GOLIVE-MP-001 v2.0](NAB-GOLIVE-MP-001.md)**, Accepted 14 October 2026.

The former [v1.0 masterplan](NAB-GOLIVE-MP-001-masterplan-v1.0.md) is **HISTORICAL / RETIRED** and remains in the repository only for audit traceability.

v2.0 is aligned to accepted ADR-BCP-026, ADR-BCP-027, Baobab EA Implementation Plan v2.1 and ADR-NAB-0014. It adopts Organisation-first progressive onboarding, Option B subsidiary autonomy, separate legal-actor authority and capability-specific activation.

| Document | Purpose |
|---|---|
| [NAB-GOLIVE-MP-001.md](NAB-GOLIVE-MP-001.md) | Accepted v2.0 programme authority |
| [register.md](register.md) | Live gate/blocker/decision status; update whenever a gate materially changes |
| [evidence/README.md](evidence/README.md) | Evidence-index rules and immutable acceptance pointers |
| [capability-demand-census.md](capability-demand-census.md) | Direct/conditional/indirect capability demand by release |
| [erp-scope.md](erp-scope.md) | ERP corporate finance/people/payroll scope; subordinate to v2.0 and current Shared contracts |
| [onboarding/nabhold-internal-onboarding-profile.json](onboarding/nabhold-internal-onboarding-profile.json) | Fail-closed v2 planning input for the real progressive onboarding workflow |
| [NAB-GOLIVE-MP-001-evidence-delta-2026-10-10.md](NAB-GOLIVE-MP-001-evidence-delta-2026-10-10.md) | Historical evidence delta against v1.0; not current status |

## Architectural rules

- Organisation, Tenant, LegalEntity, CorporateRelationship and legal-actor mandate are distinct.
- A documented CIPC certificate is not an independently accepted Control Plane verification.
- A name is not a Control Plane Principal.
- A Tenant is not proof that any capability is production-ready.
- One capability becoming ready does not activate another.
- Corporate ownership does not grant cross-tenant access.
- Nabhold is a non-trading holding-company consumer; Trade/TMS/Trade Docs/SCF are not default direct dependencies.
- Production provider selection goes through canonical contracts and Control Plane authority.
- No source declaration, CI result or feature flag is production acceptance.

## What the current estate code enforces

| Control | Behaviour |
|---|---|
| Release classes | R0 default; R1-R3 explicitly gated server-side |
| Capability resolution | Server-only Control Plane client; fails closed without workload identity |
| Content adapter | Canonical content adapter exists but remains unqualified for production |
| Security headers/CSP | Applied through the estate proxy/security helpers |
| Canonical host | nabhold.com is the declared canonical host when configured |
| Onboarding profile | v2 profile refuses fake Organisation/Tenant IDs and records missing independent verification/Principals as blockers |

## Current release status

| Release | Status |
|---|---|
| R0 Institutional | NOT RELEASED |
| R1 Corporate | NOT RELEASED |
| R2 Platform Commercial | NOT RELEASED |
| R3 Group Oversight | NOT RELEASED |

See [register.md](register.md) for the current blockers and implementation queue.
