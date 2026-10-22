# Nabhold v2.0 implementation audit against EA v2.3 — 22 October 2026

**Class:** source and programme reconciliation by the automated engineering
implementer; not independent security, legal, provider or operations acceptance.
**Programme:** Accepted NAB-GOLIVE-MP-001 v2.0. **Platform authority:** Accepted
[EA v2.3](https://github.com/baobab-platform/shared/blob/6938b16d63805d3cf07e492aa574ac076bbee423/docs/architecture/EA-implementation-plan-v2.3-2026-10-20.md).
v2.2 remains the normative L4 scenario identifier registry, not the current
execution roadmap. This audit supplements the frozen component evidence and
supersedes historical statements that CP #427 or IAM #137 remain open.
Shared #354 itself is Accepted and merged at
`409d780d05f7825ab1228649541032d42a7b0b13`; its CMS registry activation is
HELD. Approval of that decision and activation are different facts.

## Method and immutable observations

Inspected the full programme plan, live register, latest CMS component receipt,
EA v2.3, Shared's Accepted INT-03C decision, Infrastructure #49 and its comments,
current affected PRs and exact-final-head CI. Inspected Nabhold release guards,
OIDC current identity, executive authorisation and operation boundary, workload
issuance/context, CP resolution, content resolver/gateway, onboarding/finance
preparation, G17 observer and workflows. Reviewed Infrastructure #48's complete
change and surrounding INT-03 source suite; checked current CP platform-context
and Principal lifecycle routes. This is targeted critical-path auditing, not
line-by-line certification of every file in every engine.

| Repository | Observed immutable main / source |
|---|---|
| Nabhold | `f3ec2043938c4410ff0bb591302d3dce03ea5766` |
| Shared | `6938b16d63805d3cf07e492aa574ac076bbee423`; INT-03C decision/registry baseline `74dd98d47e678fc479bb4bfc4138d601fb53319e` |
| Infrastructure before review | `2ede1b1747383296d70f8af493c84a7dd48821b7` |
| Infrastructure after #48 merge | `9ba30c410ffcc6a46f5d912bf03853532f7adf0c` |
| Infrastructure #50 local-tested source | `bbd29e34b9263337f0be05782619073a41f7d4f6`; 190 source tests, no live acceptance |
| Infrastructure #50 head after operator-guide review | `8ada9777bd0dddf8b2e121aa17a3c9468331b148`; documentation-only follow-up |
| CP | `bcea71bd9909be3672dfcb7ce78d04d6feb0e748` (#427 merged) |
| IAM | `ca5eb723c7845ed9a60e19fd0ef1a1e900d7b97a` (#137 merged) |
| CMS | `a712797177924c875e50ed63a9c01ec34bd632c8` |
| ERP | `856c02343de499fa2ce287fe6238c2e097fd933e` |
| Subscriptions | `52c69906343d7b1afee08a88b8d3afe118af0428` |
| Payments | `0eb75baa4aeabaa103a527ecaf63200c17324c69` |
| Pulse | `6f4271d7b43db8d9c81e04d4f5dcc4cf50b27172` |
| Trade | `8ae7ac39324a86af76ede6f6d24fac56aa71276e` |

Engine head presence is not evidence of certified native finance, payroll,
merchant or provider readiness. New Trade commercial-authority work does not
make non-trading Nabhold a goods buyer/seller or a direct Trade consumer.

## Findings and implementation response

| Priority | Finding and consequence | Response / remaining exit |
|---|---|---|
| P0 | Infrastructure #49 contains an approval request, no independent topology approval. Its single engineering update is not permission to provision. | Runtime remains HELD. Obtain independent approved private host/network, two existing CP administrative operators, lawful synthetic admission inputs, private credentials, external shutdown and evidence custody. |
| P0 | CP #427 and IAM #137 are merged with successful applicable exact-final-head checks. Older register/issue comments still describe them as pending. | Reconcile source status only. Their live seven-case execution, actual governed topology and independent certification remain absent. |
| P0 | INT-03C observers use the older CMS source lock. It cannot represent the governed Shared #366 / IAM #137 / CP #427 combination. | [Infrastructure #50](https://github.com/baobab-platform/infrastructure/pull/50) implements a separate closed source lock, exact clean Infrastructure revision and merged-baseline ancestry checks. CMS lock and activation remain unchanged. Candidate until its own final CI/review/merge. |
| P0 | The CP diagnostic's current-human GET is not canonical workload issuer/subject provenance. Denials alone do not prove revocation or deactivation. | Keep separate workload provenance, positive control, same-token issuer ACTIVE→INACTIVE before expiry, CP status/link changes and actual denial originals mandatory. Source lock correction does not close this execution gap. |
| P0 | Actual source-built CMS/PG17 component and bounded identity smoke exist at older frozen pins; all 14 connected NAB-03 cases remain BLOCKED. | Preserve those receipts without inheriting their results at newer pins. Independently approved INT-03C is a distinct prerequisite; it does not release Shared #354. |
| P1 | Current plan/README/register governance still cites EA v2.1 in places despite EA v2.3 adoption. | Add explicit v2.3 governing interpretation, retain 14 October baseline/history and normative v2.2 L4 registry. No release status promotion. |
| P1 | Executive capability enforcement has a deliberate unresolved `CurrentExecutiveContextResolver` production adapter. IAM self-identity does not provide executive rights. | Pin CP-owned human/context protocol and explicit organisation/tenant/capability authority before implementing the concrete adapter. No invented endpoint or groups-as-permissions mapping. |
| P1 | Canonical singleton content has exact-scope/published proof controls, but portfolio/sectors/insights retain a transitional provider seam and defaults exist outside proof mode. | Do not call the whole R0 estate provider-neutral or CMS-qualified. Extend accepted contracts/provider adapters separately and prove withdrawal, outage and revalidation in browser execution. |
| P1 | Toolchain adoption is partly complete: Nabhold uses pinned baobab-dev 1.4.4, Node 24 selection and private experience packages; CMS Node 24 is merged. | No blanket pnpm/Node upgrade here. Assess centrally in baobab-dev under ENG-01..03, then migrate consumers through their own locks and mandatory checks. |
| P1 | G17 is an HTTP observation collector, explicitly not browser, revocation, legal ceremony or independent signoff. | Keep OBSERVED_NOT_ACCEPTED separate from signed G17 acceptance and from Infrastructure's 14-case connected matrix. |

## Gate-by-gate reconciliation and EA dependency mapping

The following preserves the live register's conservative business status. Domain
rows describe remaining evidence, not a new certification of engine internals.

| Nabhold gate | Demonstrated implementation | Remaining / EA workstream |
|---|---|---|
| G00 | Accepted v2.0 programme; evidence/register mechanism | Current v2.3 interpretation and exact receipts; EA-R00 |
| G01A/B/C | Documentary references and offline legal verification preparation | Independent official-source verification, accountable human decisions and effective-dated mandates; EA-R02 |
| G02 | Organisation-first planning and CP progressive onboarding source | Actual independent admission, CP-generated Organisation/Tenant, PRIMARY mapping and capability-specific grants; controlled onboarding |
| G03 | Canonical capability demand/census and versioned resolution source | Contract/provider/entitlement/binding qualification per capability; EA-01/02 |
| G04 | Confidential OIDC/session custody, current identity and development workload source; merged CP/IAM proof safeguards | #49 topology approval, seven actual INT-03C cases, native protected C4 and real executive principals/context |
| G05 | Real CMS/PG17 component at frozen pins, reusable estate profiles, published-content proof mode | CMS registry activation under Accepted CMS activation under Shared #354 HELD; full connected 14-case NAB-03, owner-approved provider lifecycle/binding; INT-03 / L4-02 |
| G06 | Finance baseline input and F1 source preparation | Semantic contract acceptance, accountant-approved baseline and certified native ledger/journal/balance evidence; Finance F1 / EA-R03 |
| G07/G08 | ERP #110 People direction/PG17 repair merged | Workforce/provider contracts, country-specific statutory qualification, privacy and practitioner signoff; BP-00..07. Keep provider-first payroll fallback. |
| G09 | Requirements identified | Canonical procurement/assets/projects contracts, provider operations and execution vetoes |
| G10/G11 | Subscription/payment integration requirements recorded | Real billing/merchant/PSP approval, settlement and ERP reconciliation; independent R2 activation |
| G12 | Option B and relationship/grant boundaries | Accepted subsidiary-specific reporting authority, effective dates, consolidation and eliminations; R3 |
| G13 | Governance/document/risk ADR boundaries | Owning canonical domains, protected document classification and qualified provider |
| G14 | Intelligence/regulatory consumption seams | Current approved bindings and provenance-backed domain/provider qualification; no advisory-to-enforcement promotion |
| G15 | Server-side composition, release flags and protected operation seam | Concrete current executive context adapter and real authorised journeys; BXS consumer/browser qualification |
| G16 | Deployment architecture and local integration tooling | Actual approved account/roles/state/KMS/DNS/identity, operational recovery; EA-09A/B |
| G17 | Technical observer and dispatch-only protected workflow | Browser, revocation, publication/withdrawal/rollback, independent security/ops/user signoff |
| G18 | No production authority | Signed release-specific Gate E; R0/R1/R2/R3 all NOT RELEASED |

R0 is the first business release target. R1 corporate finance/people, R2 service
commerce and R3 group oversight remain separate, capability-specific programmes.
TMS, SCF, subsidiary goods trading and first-party payroll R&D are not universal
prerequisites for Nabhold's institutional website. INT-07 external zero-estate
consumption remains a platform-wide parallel obligation, not a fabricated Nabhold
estate integration case.

## Source quality and private contract consumption

Inspected security-sensitive paths explain authority boundaries, freshness,
credential secrecy, bounded transport/body handling and failure semantics.
They use current IAM introspection and CP resolution rather than browser claims
or corporate ownership. `withExecutiveCapability` checks expiry before dispatch;
providers retain their own final enforcement. Development workload source binds
CP/CMS audiences to one verified subject and run deadline. Production remains
separately restricted. This is good source discipline, not operational proof.

Nabhold declares private `@baobab-platform/experience-tokens` and
`@baobab-platform/experience-geo-core` at `0.3.1`, and uses immutable baobab-dev
container digests in CI. Narrow Zod response validators are consumer read-model
checks, not new authority. Protocol changes must follow Shared/CP owners; do not
mechanically add speculative SDKs or loosen schemas. Tenant identifier forms in
legacy G17/executive schemas and current CP provisioning must be reconciled
against the exact owning contract before a new adapter is enabled.

Comments are sufficient in the inspected high-risk paths. Do not add narration
of obvious statements merely to increase comment count. Update stale version
comments as their owning feature changes. A full source lint/typecheck/browser
suite was not run locally in this audit's partial connector-backed source
snapshot; existing CI remains the source for those checks.

## Work completed and validation

- Reviewed all six changed files of Infrastructure #48 at
  `10db631021d86e52bfcc9f887368e321fbf4f77a`, surrounding governance/issuer/custody
  code, exact-head checks and both resolved review threads. All 31 applicable
  check runs succeeded; six non-applicable jobs were skipped. GitHub reported
  the PR clean/mergeable. Branch-protection configuration is not readable by this
  integration (403), so no claim is made about hidden protection settings.
- All 185 INT-03 source tests passed locally with the fetched immutable source
  dependencies. Merged #48 and independently re-read its merged state and SHA
  `9ba30c410ffcc6a46f5d912bf03853532f7adf0c` before dependent work.
- Implemented Infrastructure #50. All 190 source tests pass against source
  `bbd29e34b9263337f0be05782619073a41f7d4f6`; the later
  `8ada9777bd0dddf8b2e121aa17a3c9468331b148` changes only operator guides.
  No separate immutable local test receipt is claimed. Coverage includes real
  temporary Git histories: exact refs, missing/extra/old CMS pins, dirty source,
  nonexistent/unrelated baseline and duplicate/authority-widening lock fields.
  Tests use synthetic plans and do not contact approved runtime services.
- Refreshed current programme authority and queue without modifying release
  flags, registry lifecycle, credentials or runtime resources.

## Next execution order

1. Finish #50 final-head mandatory CI and review; merge only when satisfactory.
2. Obtain the separately authorised #49 topology, distinct CP operators,
   governed Tenant/Organisation/Principal creation, exact source/image/run-window
   approval, private secrets and independent immutable custody. Engineering
   merge does not provide this approval.
3. Execute and retain all seven real INT-03C cases, with same-token revocation
   before expiry, current CP provenance/deactivation, independently witnessed
   teardown and independently retrieved/rehashed originals. Report only
   OBSERVED_UNATTESTED until the authorised independent reviewer accepts them.
4. Keep CMS registry activation under Accepted Shared #354 HELD and all 14 NAB-03 cases BLOCKED. CMS identity activation
   requires its own reviewed governance; only then run the complete connected
   matrix, followed by separately authorised protected staging and R0 acceptance.
5. Continue independently scoped executive-context contract convergence,
   canonical content coverage, Finance F1, official legal evidence preparation
   and ENG/BXS work. Do not invent INT-03D: no accepted written scope was found
   in the inspected governing source.

Rollback source-lock work by reverting its PR. Never compensate for missing
history by relaxing source checks, rewriting the held CMS lock or fabricating
approval/evidence. Infrastructure #49 remains APPROVAL REQUIRED / RUNTIME HELD;
CMS registry activation under Accepted Shared #354 HELD; NAB-03 14/14 BLOCKED; production NOT AUTHORISED.
