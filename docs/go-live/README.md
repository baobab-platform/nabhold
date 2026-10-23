# Nabhold go-live programme

The controlling programme baseline is **[NAB-GOLIVE-MP-001 v2.0](NAB-GOLIVE-MP-001.md)**, Accepted 14 October 2026.

The former [v1.0 masterplan](NAB-GOLIVE-MP-001-masterplan-v1.0.md) is **HISTORICAL / RETIRED** and remains in the repository only for audit traceability.

v2.0 is aligned to accepted ADR-BCP-026, ADR-BCP-027, Baobab EA Implementation Plan v2.3 (with v2.2 retaining the normative L4 scenario matrix) and ADR-NAB-0014. It adopts Organisation-first progressive onboarding, Option B subsidiary autonomy, separate legal-actor authority and capability-specific activation.

| Document | Purpose |
|---|---|
| [NAB-GOLIVE-MP-001.md](NAB-GOLIVE-MP-001.md) | Accepted v2.0 programme authority |
| [evidence/finance-f1-source-2026-10-16.md](evidence/finance-f1-source-2026-10-16.md) | Merged independent F1 DRAFT contracts, exact CI/source pointers and outstanding native acceptance |
| [evidence/progress-audit-2026-10-19.md](evidence/progress-audit-2026-10-19.md) | Fresh merged-source, PR and acceptance reconciliation; INT-02/C4/INT-03 boundaries |
| [evidence/int03-connected-audit-2026-10-20.md](evidence/int03-connected-audit-2026-10-20.md) | Connected lifecycle progress, failed attempts and remaining acceptance exits |
| [evidence/ea-v2.3-progress-audit-2026-10-22.md](evidence/ea-v2.3-progress-audit-2026-10-22.md) | Current v2.3 audit, merged CP/IAM/#48 reconciliation, #50 source-lock work and unchanged #49 execution hold |
| [evidence/r0-canonical-content-parity-2026-10-23.md](evidence/r0-canonical-content-parity-2026-10-23.md) | Confirmed #90/#51 source merges and R0 canonical homepage mapping correction; live gates unchanged |
| [register.md](register.md) | Live gate/blocker/decision status; update whenever a gate materially changes |
| [evidence/README.md](evidence/README.md) | Evidence-index rules and immutable acceptance pointers |
| [capability-demand-census.md](capability-demand-census.md) | Direct/conditional/indirect capability demand by release |
| [erp-scope.md](erp-scope.md) | ERP corporate finance/people/payroll scope; subordinate to v2.0 and current Shared contracts |
| [onboarding/P0-03-legal-verification-runbook.md](onboarding/P0-03-legal-verification-runbook.md) | Real ZA registration verification preparation and deferred authenticated execution |
| [onboarding/G04B-03-oidc-login-callback.md](onboarding/G04B-03-oidc-login-callback.md) | Confidential OIDC routes, current IAM/CP checks and protected client prerequisites |
| [onboarding/G04B-04-executive-authorisation.md](onboarding/G04B-04-executive-authorisation.md) | Merged current-authority seam; concrete CP human/context protocol still required |
| [../testing/codespaces-integration.md](../testing/codespaces-integration.md) | Real-service identity harness, private handoff and sanitized G17 observation receipts |
| [onboarding/G04B-02-confidential-session-custody.md](onboarding/G04B-02-confidential-session-custody.md) | Encrypted BFF custody, atomic login transactions and real TLS Redis acceptance |
| [onboarding/protected-acceptance-runbook.md](onboarding/protected-acceptance-runbook.md) | G17 technical observations across operator identity, PRIMARY Tenant and CP→CMS; independent acceptance remains |
| [evidence/P0-06A-cp-transport-hardening.md](evidence/P0-06A-cp-transport-hardening.md) | Credentialed CP transport source hardening; live qualification pending |
| [onboarding/P0-04B-operator-preflight-runbook.md](onboarding/P0-04B-operator-preflight-runbook.md) | Authenticated read-only CP operator diagnostic; no action permit |
| [evidence/progress-audit-2026-10-14.md](evidence/progress-audit-2026-10-14.md) | Source snapshots, repaired PRs, exact CI and outstanding critical path |
| [onboarding/za-legal-verification-packet.json](onboarding/za-legal-verification-packet.json) | Separate non-sensitive Nabhold/Thamani documentary inputs |
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
| Capability resolution | Server-only Control Plane client; fails closed without workload identity; canonical CMS workload scope syntax converged in Shared/IAM |
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
Infrastructure #49 is an independent approval request, not permission to create
a disposable runtime. CMS registry activation under Accepted Shared #354 remains HELD; all 14 NAB-03 cases are BLOCKED.
CP #427, IAM #137 and Infrastructure #48 are merged source safeguards, not live
qualification. The separate INT-03C source-lock increment is tracked in #50.

## Local work without staging or AWS

IAM’s [local provider bootstrap](https://github.com/baobab-platform/baobab-iam/blob/main/docs/operations/local-admin-bootstrap.md)
now generates private local credentials through `make local-credentials` and
requires explicit passwords. Provider access remains separate from native
Kratos accounts and CP administrative grants. Shared/IAM also repair the
previous rejection of the existing `content:entry:resolve` scope; no workload
or capability is promoted by that syntax correction. See the register's
non-staging source increment section for exact PRs and remaining acceptance.


## Independent Finance F1 source lane — 16 October 2026

Shared #319/#321 are merged. The Shared catalogue includes three F1
DRAFT/EXPERIMENTAL keys and validated ledger/journal/statement wire schemas.
[Source evidence](evidence/finance-f1-source-2026-10-16.md) distinguishes this
completed wire increment from Proposed ADR-SHARED-033 acceptance, actual ERP
provider support and signed Finance/operational qualification. Source work was
independent of Infrastructure #35; G06 and R1 operational acceptance remain open.

The [INT-02 prerequisite source checkpoint](evidence/int02-prerequisite-source-2026-10-16.md)
records merged CP/IAM/Shared repairs without promoting Infrastructure #35 or
any protected onboarding/release gate. The [19 October audit](evidence/progress-audit-2026-10-19.md) supersedes its
historical open status: #35 is merged with frozen synthetic Actions qualification.
Full INT-03 and protected native C4 qualification remain separate outstanding gates.


[The 20 October connected identity evidence](evidence/int03-identity-qualified-2026-10-20.md)
records reviewed merged #37/#80/#81 and the successful exact-pin Actions smoke.
This advances only bounded synthetic identity integration; full INT-03, CMS,
native protected C4, legal/onboarding, staging and R0–R3 remain OPEN. The
[register](register.md) records the next CMS dependency and non-authorising
Shared bootstrap proposal.
