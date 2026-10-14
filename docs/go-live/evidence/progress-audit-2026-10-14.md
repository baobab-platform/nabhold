# Go-Live v2.0 progress audit — 14 October 2026

This is a source and CI audit, not a protected staging or production certificate.

## Inspected source snapshots

| Repository | Main source snapshot | Finding |
|---|---|---|
| Nabhold | 5d9df31a967e734f7df486983f1a0c64581bb71d | Current v2.0 plan, P0-03 preparation, P0-04A records, canonical CMS consumer, repaired institutional UI and aligned dependency updates |
| Shared | 92541c92321abde72dea7deb7d42e70d0b6acafb | EA v2.1 register still denies Gate B/production; corporate F1 ADR-SHARED-033 remains Proposed |
| CP | 366fe6e549a6c5e7f62b551829438daaa1aa6647 | Progressive onboarding machinery, active-Principal self-authority projection and scoped bootstrap exist; real Nabhold onboarding remains unexecuted |
| IAM | 5dae8c44e943fc0106c1d4a8867a1c8a999a2234 | Secure local provider bootstrap and registered hierarchical scope convergence merged; these do not create founding human Principals |

The broader provider postures in the live register remain the recorded baseline;
this audit did not independently recertify every engine or query deployment
telemetry. It concentrates on the current critical path and open Nabhold PRs.

## Open PR takeover and closure

| PR | Defect / disposition | Exact checked head and successful workflows |
|---|---|---|
| [#43](https://github.com/baobab-platform/nabhold/pull/43) | Fixed nested breadcrumb `<li>` hydration errors, stale sectors E2E assertion, invalid form ARIA, unused import, generator CLI in production dependencies and rollback of merged progress records. Merged. | c8cc10e1feacd1c56ef37ab30a44347321b2b4d8; CI 38556385517, Security 38556385218, Foundation 38556386946 |
| [#37](https://github.com/baobab-platform/nabhold/pull/37) | Replaced unsupported Node 26 typings bump with policy retaining Node 22 typings until reviewed runtime migration. Rebased; merged. | de0bab2bebc12a35a3173465729b48ec687e414e; CI 38556868881, Security 38556868526, Foundation 38556869829 |
| [#36](https://github.com/baobab-platform/nabhold/pull/36) | Rebased minor dependency updates onto repaired UI; regenerated lockfile; lint/typecheck/133 unit tests/build passed locally. Merged. | db019f9c5e7b282dcc81192d103de5ed8c081dd4; CI 38556930402, Security 38556929871, Foundation 38556931272 |

No check was disabled and no security exception was added for these repairs.
The runtime generator dependency was removed rather than ignoring its finding.
The Node 24 platform migration remains a reviewed G15/G16 task: the current
package engine and deployment image still target Node 22.

## Current critical path

| Queue item | Source progress | Actual exit still needed |
|---|---|---|
| P0-01 | Accepted v2.0 authority and retired v1.0 | Keep status/evidence current |
| P0-02 | Organisation-first content contract convergence merged | Live IAM/CP/content qualification belongs to later items |
| P0-03 | Real documentary packet and offline request preparation merged | Independent official-source/custody intake and real CP review/decision |
| P0-04A | Secure local provider bootstrap merged | Native/federated human identities, real CP mappings and operator grants |
| P0-04B-01 | Authenticated read-only operator diagnostic implemented in this increment | Run with real identities/credentials; separately prove IAM scopes/roles, independent human authority and CP action checks |
| P0-05 | CP controlled progressive onboarding source exists | Execute real approved Nabhold application→Organisation→onboarding request→Tenant journey |
| P0-06 | CMS consumer/provider source exists | Actual Nabhold workload, audience/scope, entitlement, context, binding and provider qualification |
| P0-07 | Browser/security source checks improved | Protected production-shaped R0 CMS E2E, deployment/rollback and signed acceptance |
| P1-01 | Finance namespace proposal exists | Accepted canonical F1 contracts before financial consumer/provider implementation |

## Evidence dimensions for this increment

| Dimension | Assessment |
|---|---|
| Architecture | Uses existing Accepted masterplan/ADRs; no new authority boundary |
| Contract | Consumes existing Shared administrative projection; source snapshot recorded in runbook |
| Source | Implemented in the P0-04B-01 PR; its merged state follows repository history |
| Database | No migration or writes |
| Synthetic/integration | 163 local tests pass, including CLI→loopback CP-shaped service and refusal/security cases |
| Protected staging | Not executed |
| Independent legal/human evidence | Not accepted by this diagnostic |
| Operational certification | Not signed |

R0/R1/R2/R3 remain NOT RELEASED. A diagnostic exit 0 never promotes P0-04,
onboarding or production. The next credential-dependent action is the real
human/CP operator ceremony, followed by independent legal verification and the
controlled onboarding journey. Independent non-staging work can continue where
canonical contracts and domain authority are already accepted.
