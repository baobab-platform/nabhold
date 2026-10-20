# Nabhold Go-Live Register — v2.0

**Masterplan:** [NAB-GOLIVE-MP-001 v2.0](NAB-GOLIVE-MP-001.md)  
**Baseline:** 14 October 2026; latest source reconciliation 19 October 2026
**Status model:** architecture, contract, code, migration, synthetic test, protected staging, external evidence and operational certification are tracked separately.

**Current reconciliation:** [19 October fresh implementation audit](evidence/progress-audit-2026-10-19.md)
supersedes older claims that Infrastructure #35/INT-02 remains open. INT-02 is
accepted only for its frozen real-component/synthetic Actions source set.
C4-03 protected Kratos/Hydra→CP, full INT-03 and every protected release remain
unaccepted. See section 23 for the next dependency-ordered work.

This register records source/runtime evidence known from the repositories. It is not live production telemetry.
The [16 October Finance F1 source evidence](evidence/finance-f1-source-2026-10-16.md) and section 18 supersede older Finance source/PR-status claims while preserving their dated history.

## 1. Programme gates

| Gate | Current status | Evidence / current fact | Next decisive exit |
|---|---|---|---|
| G00 Programme control | ACCEPTED | Masterplan v2.0 accepted; ADR-NAB-0014 accepted; v1.0 retired | Keep register/evidence current |
| G01A documentary identity | PARTIAL | Nabhold and Thamani CIPC documentary references recorded in Shared; Nabhold evidence file present | Reviewer/legal governance completion |
| G01B independent verification | IMPLEMENTATION PARTIAL / EXECUTION DEFERRED | Real Nabhold/Thamani registration packet, validation and offline CP request preparation implemented; no independently accepted real case yet | Later authorised source/custody intake + independent CP decision |
| G01C group relationships/mandates | BLOCKED | CP relationship/mandate machinery exists; no accepted real control/mandate evidence for programme use | Evidence-backed relationships/mandates |
| G02 Organisation-first onboarding | IMPLEMENTED-NOT-EXECUTED | CP progressive application, independent review/decision, TenantOnboardingRequest v2 and RegisterProgressiveTenantV2 implemented; synthetic four-business PG17 acceptance exists | Execute real Nabhold controlled staging flow |
| G03 capability programme | IN PROGRESS | Shared catalogue has 25 keys including three DRAFT/EXPERIMENTAL F1 entries; ADR-SHARED-033 remains Proposed | F1 semantic/provider acceptance + subsequent domains |
| G04 IAM | PARTIAL | Provider bootstrap, OIDC/TLS Redis custody, current IAM/CP self-identity, executive authorisation seam and repaired dormant human profile implemented; C4 evidence/readiness source exists; nabhold-backend stays PROVISIONED | Actual registered native C4 qualification, real Principals/SoD, governed workload/CMS and connected BFF acceptance remain |
| G05 CMS / R0 | PARTIAL | Organisation-first consumer/provider source convergence implemented; CMS support PARTIAL and production_permitted=false | P0-04 protected identity + P0-06 live IAM/CP/binding + P0-07 R0 acceptance |
| G06 ERP finance | BLOCKED | Shared #319/#321 merged F1 DRAFT wire contracts; no certified ERP F1 provider | FinanceBaseline + F1 + live iDempiere |
| G07 Workforce/HR | BLOCKED | No accepted canonical workforce contract/provider surface | Shared/domain decision + implementation |
| G08 Payroll | BLOCKED | No accepted production payroll capability/provider | Statutory/provider acceptance |
| G09 Procurement/assets/projects | BLOCKED | Required corporate contracts incomplete | Contracts + ERP adapters |
| G10 Subscriptions | BLOCKED FOR R2 | Current provider simulated; production_permitted=false | Production billing provider + certification |
| G11 Payments | BLOCKED FOR R2 | Runtime hardening advanced; declared provider remains sandbox and production_permitted=false | Merchant/PSP acceptance + live settlement |
| G12 Group reporting | BLOCKED | Option B and CP group model accepted; real reporting grants/consolidation absent | Portfolio projection + grants + finance model |
| G13 Governance/documents/risk | BLOCKED | Nabhold ADR boundaries exist; canonical owner/provider not selected | Shared domain/provider decision |
| G14 Pulse/Regulations | PARTIAL | Pulse canonical evidence/research IMPLEMENTED source; Regulations canonical capabilities PARTIAL | Nabhold bindings; verified regulatory coverage |
| G15 Digital Estate | IN PROGRESS | Release guards, capability client and content adapter merged; executive session preview-only | Real auth/context/capability journeys |
| G16 Infrastructure/EA-09 | PARTIAL / EXTERNAL | af-south-1 staging architecture exists; protected staging/external account evidence incomplete | Real account/roles/KMS/DNS + qualification |
| G17 Acceptance | TECHNICAL TOOLING IMPLEMENTED / PROTECTED EXECUTION BLOCKED | Ordered identity/PRIMARY-Tenant/CP→CMS observations and dispatch-only protected workflow implemented; no real acceptance pack signed | Per-release UAT/security/ops GO |
| G18 Production | NOT AUTHORISED | EA v2.1 production activation remains not authorised | Signed release-specific activation |

## 2. Platform EA gates

| EA gate | Nabhold interpretation | State |
|---|---|---|
| A Architecture/contracts | Contract and consumer convergence | NOT PASSED platform-wide |
| B Developer unfreeze | Estate may implement without shadow authority | NOT PASSED |
| C Controlled founding onboarding | Real non-production Organisation/Tenant lifecycle | CODE READY; REAL NABHOLD NOT EXECUTED |
| D Capability staging qualification | One real capability through full authority chain | NONE QUALIFIED FOR NABHOLD |
| E Production activation | EA-09B | NOT AUTHORISED |

## 3. Founding-group truth

| Business | Current declared posture | What remains |
|---|---|---|
| Nabhold | ZA company documentary evidence; own Organisation/Tenant intended | Independent CP verification and real controlled onboarding |
| Thamani | ZA company documentary evidence; own Organisation/Tenant | Independent company verification and Nabhold-control evidence |
| ZuriBeans | Operating business; ZA incorporation pending; own Organisation/Tenant | No fabricated company; add LegalEntity when independently established |
| Equator & Estate | Operating business in current Shared declaration | Legal posture/mandates only when independently evidenced |

Group membership never grants cross-tenant access.

## 4. Current high-priority blockers

| ID | Blocker | Owner lane |
|---|---|---|
| V2-B01 | Verification preparation implemented; real independently accepted case deferred pending authorised execution | CP / IAM / governance / source integration |
| V2-B02 | Real onboarding human Principals/SoD not established for the journey | IAM / CP |
| V2-B03 | Progressive/Organisation-first production routes deliberately closed pending certification | CP / security |
| V2-B04 | EA developer-unfreeze Gate B not passed | Shared / platform |
| V2-B05 | nabhold-backend workload PROVISIONED, not operationally accepted | IAM / CP / Nabhold |
| V2-B06 | CMS consumer/provider source converged; live qualification remains absent | CMS / IAM / CP / Nabhold |
| V2-B07 | Executive sign-in remains preview-only | IAM / Nabhold |
| V2-B08 | F1 DRAFT wire contracts merged; semantic acceptance and ERP native/provider support remain absent | Shared / ERP |
| V2-B09 | Workforce/HR boundary absent | Shared / ERP / IAM |
| V2-B10 | Payroll boundary/provider/statutory evidence absent | ERP / payroll / finance |
| V2-B11 | Procurement/assets/projects contracts absent | Shared / ERP |
| V2-B12 | Subscriptions provider simulated | Subscriptions |
| V2-B13 | Payments provider sandbox-only | Payments |
| V2-B14 | R2 invoice/payment/settlement/ERP reconciliation unproven | Subscriptions / Payments / ERP / CP |
| V2-B15 | Group reporting consent/control/consolidation incomplete | CP / Finance / Legal |
| V2-B16 | Governance/DMS/risk owner/provider unresolved | Shared / Nabhold governance |
| V2-B17 | Pulse executive prototype is noncanonical | Pulse / Shared / Nabhold |
| V2-B18 | Regulations production ZA source coverage unaccepted | Regulations / governance |
| V2-B19 | Real AWS account/roles/KMS/DNS protected acceptance incomplete | Infrastructure |
| V2-B20 | No source/provider declaration alone proves a Nabhold active binding | All |

## 5. Immediate implementation queue

**Completed source task:** P0-02 — Organisation-first content context convergence (Nabhold #39; CMS #33/#34). Exit: no legal-entity-first contract drift. G05 is still PARTIAL; protected identity and binding qualification belong to P0-04/P0-06/P0-07.

1. **P0-03 — preparation implemented; authenticated real-case execution deferred.** See [runbook](onboarding/P0-03-legal-verification-runbook.md).
2. **P0-04 — local provider bootstrap, operator diagnostic, confidential session custody and G04B-03 OIDC integration implemented; real native/CP onboarding Principals and protected identity remain.** Next: approved CP-audience human-client/profile handoff and estate/context authorisation; real protected identity acceptance remains.
3. **P0-05 — execute Nabhold progressive controlled staging onboarding to IDENTITY_TENANT_ACCEPTED_NOT_PRODUCTION.**
4. **P0-06 — activate the first qualified capability: Nabhold workload + CMS R0.**
5. **P0-07 — R0 protected E2E and acceptance pack.**
6. **P1-01 — DRAFT wire source merged in Shared #319/#321; ADR/ERP semantic acceptance and native/provider implementation remain.**
7. **P1-02 — FinanceBaseline + live iDempiere proof.**
8. **P1-03 — finance F2 plus procurement/assets/projects.**
9. **P1-04/P1-05 — workforce then payroll.**

R2 billing/payments and R3 group reporting proceed in parallel only where they do not bypass the authority prerequisites above.

## 6. Decisions still requiring evidence

- current independent Nabhold legal verification;
- office-holder/onboarding authority used for real CP Principals;
- control/ownership evidence when group privileges rely on it;
- platform IP title/licensing;
- R2 product/pricing/currency/trial policy;
- VAT/tax/merchant posture;
- subsidiary reporting/data grants;
- consolidation accounting policy;
- workforce provider boundary;
- payroll provider/statutory scope;
- procurement thresholds;
- asset capitalisation/custody policy;
- governance/DMS authority;
- production AWS account and DR;
- SLO/RTO/RPO/on-call;
- subsidiary disposal/reclassification policy;
- future ZA/UG LegalEntity evidence.

Unknown values remain unknown until accepted.

## 7. ADR status

| ADR | Status under v2.0 |
|---|---|
| ADR-NAB-0001 to 0011 | Accepted; interpreted through ADR-NAB-0014 where applicable |
| ADR-NAB-0012 | Accepted 14 Oct 2026; autonomous holdings model |
| ADR-NAB-0013 | Accepted 14 Oct 2026; capability/release model |
| ADR-NAB-0014 | Accepted 14 Oct 2026; Organisation-first/legal-actor/capability activation amendment |

## 8. Evidence rule

Nothing is marked production PASS without an immutable evidence pointer and the owning authority's acceptance. Green CI is implementation evidence, not go-live authority.

## 9. G05 / P0-02 consumer increment — 14 October 2026

Nabhold no longer requires a LegalEntity to configure canonical institutional
content resolution. The optional `legal_entity_id` remains a content filter;
no Organisation/legal-actor claim is minted by the estate. A CP-issued UUID
context, Tenant claim, Digital Estate and trusted provider origin remain required.
Negative tests cover missing/malformed context and cross-tenant provider responses.

Consulted source snapshots:

- Shared `9b8a00197ffda60a2a9d6a7be034baad791f7854`: content v1 request/README,
  control-plane v2 PlatformContext (mandatory attested PRIMARY Organisation).
- CMS `f2a94a9bb9273d56db202464437923a78c823239`: ADR-0012/0014, content route
  and CP context validator. This baseline accepted absent Organisation and
  ignored its value. CMS PR #33 adds mandatory CP-attested Organisation and
  exact active Tenant/Organisation projection checking before content reads.
- Nabhold ADR-NAB-0014 and masterplan v2.0 G05/P0-02 govern this increment.

**Gate remains PARTIAL.** P0-02 source convergence is implemented in Nabhold
PR #39 and CMS PR #33/#34. Consumer tests pass (125); provider tests pass (234),
including exact returned UUID comparison, missing/malformed Organisation, missing/duplicate/inactive projection
and database failure. CMS #34 fixes UUID casing compatibility without allowing
wildcard identity queries. Protected proof with real CP/IAM identity is still absent.
No new body field may be added to pinned
Shared content v1 without contract governance. P0-03–P0-07 require real,
independently accepted identity/Principal/staging evidence; no synthetic fixture
or local setting is accepted as that evidence. Production remains unauthorised.

## 10. P0-03 implementation — registered ZA businesses, execution deferred

Sponsor instruction (14 October 2026): proceed with P0-03 for the legally
registered Nabhold Group Africa and Thamani Global; provision authorised IAM
Principals and protected staging credentials later.

Implemented:

- [Separate real registration packet](onboarding/za-legal-verification-packet.json)
  for Nabhold `2026/029839/07` and Thamani `2026/291672/07`.
- Closed schema validation, exact business/fact/evidence association, offline
  preparation assessment and canonical CP case/claim draft compilation.
- `pnpm verification:prepare`, with no network, tokens, submission or status promotion.
- [Deferred execution runbook](onboarding/P0-03-legal-verification-runbook.md)
  covering real Organisation identities, independent reviewers, source/custody,
  registration-before-name checks, policy freshness, decisions and evidence.
- Removed the unsupported blanket requirement to formalise a Company Secretary
  appointment before independent registration review. Office-holder authority
  remains a separate claim.

P0-03's accepted-real-case exit is unchanged and pending deferred execution.
G01B is not PASS. Thamani's certificate enterprise label/full declared name are
preserved separately for official-source review. No current legal status,
ownership, director authority, tax standing or production acceptance is inferred.

## 11. Non-staging IAM/R0 source increments — 14 October 2026

Sponsor instruction: continue tasks that do not require staging or AWS credentials.

| Source increment | Implementation evidence | Actual acceptance remaining |
|---|---|---|
| Secure local provider administrator bootstrap | IAM [#113](https://github.com/baobab-platform/baobab-iam/pull/113): private OS-random credential preparation, no public password fallbacks, exclusive mode-0600 files, no secret output, local loopback ports, session cleanup and fresh CI credentials | No real native human or CP Principal/grant has been created |
| Canonical registered CMS scope grammar | Shared [#305](https://github.com/baobab-platform/shared/pull/305): hierarchical scopes and strict end-of-string validation; declared-scope regression tests | Syntax does not activate an identity or scope allocation |
| Issuer/contract convergence | IAM [#114](https://github.com/baobab-platform/baobab-iam/pull/114): exact Shared pin, Go parser, shared cross-language corpus and admission-fence tests | Nabhold remains PROVISIONED; real workload issuance/binding/context proof still required |

Use `make local-credentials` in the IAM checkout to prepare isolated Keycloak/
Postgres credentials privately, then follow its [local bootstrap runbook](https://github.com/baobab-platform/baobab-iam/blob/main/docs/operations/local-admin-bootstrap.md).
This is provider administration, not a Baobab-wide superadmin. Accepted
ADR-IAM-0031/0033 separates Kratos, Hydra, Keycloak and CP administration;
CP's existing `cmd/admin-bootstrap` grants bounded time-bound authority to
registered active, distinct operator/recipient Principals rather than deriving
business authority from a provider password.

The previous single-colon workload request grammar rejected the already
registered `content:entry:resolve` scope. Shared and IAM now represent it without
altering registry status, scope ceilings, audiences, credential requirements or
canonical admission. Tests retain denial of PROVISIONED workloads, unallocated
preview, wrong audience, wrong issuer/credential and wrong environment.

P0-03 authenticated verification, P0-04 real human/CP identity, P0-05 controlled
onboarding and P0-06/07 qualified R0 acceptance remain separate operational
steps. No production PASS, universal administrator, current legal verification
or accepted real founding-group Principal is asserted by these source changes.

## 12. Progress audit and P0-04B-01 operator diagnostic — 14 October 2026

See the [source/CI progress audit](evidence/progress-audit-2026-10-14.md) for
inspected snapshots and exact successful CI runs. Open Nabhold PRs #43, #37 and
#36 were repaired and merged before this increment. The #43 takeover restored
existing P0-04A progress records, repaired breadcrumb hydration/browser checks,
and removed the generator CLI from production dependencies.

`pnpm onboarding:operators:check` now reads each operator's current CP
`/v1/admin/effective-authority` projection independently. It checks expected
canonical Principal UUID, distinct planned Principals/credentials, freshness,
expiry and exact environment-qualified PLATFORM grants. Tokens and raw provider
errors are excluded from output. The real metadata template remains null;
no credential, Principal or runtime acceptance was invented.

The [P0-04B runbook](onboarding/P0-04B-operator-preflight-runbook.md) distinguishes
necessary projected grants from action authorisation, IAM scope/client roles,
step-up and independently established human authority. The diagnostic does not
submit onboarding, create identities/grants or alter CP grant enforcement.
Source/local acceptance: lint, typecheck and 163 tests passed, including the
actual CLI against a loopback CP-shaped service. Protected staging, legal/human
evidence, operational certification and production remain unaccepted.

**P0-04 remains PARTIAL.** Next: real native/federated humans and CP mappings,
separate operator grants and protected action acceptance, then P0-03 real-case
verification and P0-05 controlled onboarding. No R0/R1/R2/R3 GO is asserted.


## 13. P0-06A — CP transport source preparation

The capability client now refuses redirects, unsafe origins and TLS bypass,
limits decoded resolution responses to 256 KiB, and applies its bounded
deadline through body consumption. Raw upstream errors are excluded from
diagnostics. See [source evidence and acceptance boundaries](evidence/P0-06A-cp-transport-hardening.md).

This non-staging increment preserves CP/IAM authority, request/response
contracts and capability decision checks. It creates no identity, credential,
grant or binding. **P0-06 and G05 remain PARTIAL**; authenticated legal/human
ceremonies, controlled onboarding, real workload/CMS qualification and signed
R0 acceptance remain separate protected exits.


## 14. Protected identity/onboarding/CMS acceptance tooling

CMS [#35](https://github.com/baobab-platform/baobab-cms/pull/35) fixes the JWT
authenticator's one-colon scope parser, which rejected actual registered
`content:entry:resolve` credentials. Signed ES256/JWKS and route-denial tests
pass; the provider remains PARTIAL and no live binding is activated.

`pnpm acceptance:protected` now collects sequential G04 operator authority,
G02 PRIMARY Tenant mapping readback, and G05 CP binding/CMS observations with
eight negative cases. The main-only workflow validates independent staging
reviewer protections before service-credential execution and uploads sanitized
non-authorising observations/digests. See the [exact inputs, procedure and
remaining exits](onboarding/protected-acceptance-runbook.md).

**Live execution is blocked:** no real staging origins, human/CP Principal
plan, issued workload credentials, controlled negative contexts or protected
environment credentials were configured in this session. No account, grant,
admission/verification decision, tenant, binding or production activation was
created. G01B/G02/G04/G05 and P0-03 through P0-07 operational exits remain
pending. Executive BFF login, true revocation ceremony, publication/revalidation
cycle, rollback and independent G17 signoff are explicitly separate acceptance
checks rather than facts inferred from a mapping or successful content read.


## 15. Critical-path source increment — G04B-02 (15 October 2026)

The next implementable dependency after the protected-observation collector is
durable confidential BFF session custody. The new server-only module encrypts
private records, atomically consumes browser-bound login transactions, applies
absolute expiry and supports local revocation across workers. TLS-only Redis,
key rotation, recovery-epoch operation and a required real Redis integration
suite are documented in the [source/runbook](onboarding/G04B-02-confidential-session-custody.md).

P0-03 real independent verification and P0-04 real operator identities remain
the first operational blockers; source work does not waive them. G04 remains
PARTIAL. The store defaults off, the executive session remains preview-only,
and no live user, grant, Tenant or binding is created. The next source step is
the reviewed OIDC login/callback integration, followed by per-request IAM
revocation and canonical CP estate/context authorisation. Protected staging
and independent G17 acceptance remain separate exits.

## 16. Critical-path source increment — G04B-03 (15 October 2026)

Confidential OIDC login/callback now uses atomic browser-bound transactions,
S256/state/nonce and independent ID-token signature validation. Current IAM
introspection and CP self-identity checks are required before issuing a session
and on every account/session read. CSRF-protected local logout revokes custody.
See [source boundary and protected prerequisites](onboarding/G04B-03-oidc-login-callback.md).

Disabled by default; no real client/credential/identity or capability is created.
The current native handoff's identity-only scope contract is not silently expanded:
a CP-audience human token with approved authority:self is still required.
Executive and CMS authority remain separate and release-gated. P0-04 is PARTIAL.


## 17. Evidence reconciliation — 16 October 2026 (EA v2.2)

This delta is an append-only evidence correction to the 14 October register. Earlier baseline rows remain dated history; where conflicting, use these **verified PR statuses**, not the stale descriptions above.

| Nabhold gate | Verified source evidence | Gate disposition |
|---|---|---|
| G04 / executive IAM | [IAM #116](https://github.com/baobab-platform/baobab-iam/pull/116) MERGED; [Nabhold #57](https://github.com/baobab-platform/nabhold/pull/57) MERGED | Source advanced; dormant human client, no independently approved executive Principal or real access |
| G04 / L4 current authority | [Infrastructure #34](https://github.com/baobab-platform/infrastructure/pull/34) MERGED; [#35](https://github.com/baobab-platform/infrastructure/pull/35) OPEN/DRAFT | INT-01 foundation exists; INT-02 required real IAM↔CP acceptance outstanding |
| G05/R0 | Nabhold OIDC/BFF #55 merged previously; #57 source guard merged | No accepted full IAM↔CP↔CMS L4-02, binding or protected R0 evidence |
| G03/G06 Finance | Shared ADR-SHARED-033 remains **Proposed**; F1 keys are not registered | F1 is design/source work only; no finance capability activated or certified |
| EA-R03 downstream | [Shared #318](https://github.com/baobab-platform/shared/pull/318) and [CP #405](https://github.com/baobab-platform/baobab-cp/pull/405) MERGED | Trade-0 authority foundation, not a Nabhold commercial trading capability or EA Gate D |

**Execution ordering:** finish Infrastructure INT-02 mandatory IAM/CP positive and negative evidence, then INT-03 Nabhold confidential BFF, CP and CMS integration. In parallel, Shared/ERP may develop F1 contracts after contract steward/ERP decisions; native Trade-A–D, ERP, Payments D2, Subscriptions and Trade Docs enforcement remain engine-owned.

**No promotion:** G01 independent legal evidence, G02 real progressive onboarding, G04 real Principals/grants, G05 CMS provider readiness, G16 protected staging, G17 sign-off and G18 production are unchanged and unproven by these code merges. A group holding interest is not a cross-tenant grant.


## 18. Independent Finance F1 source completion — 16 October 2026

Sponsor direction: proceed with engineering that does **not** depend on
Infrastructure #35. Finance F1 wire contracts/fixtures/CI form an independent
source lane; this does not waive integration, legal, provider or release gates.

| Increment | Immutable source evidence | Readiness consequence |
|---|---|---|
| Finance design checkpoint | Shared [#319](https://github.com/baobab-platform/shared/pull/319) MERGED, `27eb77a367d6c9f2a2368cdffcae73cd5d544571` | Review-only candidate repaired; it is not the consumer contract |
| SH-NAB-FIN-02 DRAFT wire tranche | Shared [#321](https://github.com/baobab-platform/shared/pull/321) MERGED, `2aa057dcaa475450450ff1166e8e4c1cb8f5d33c` | Three DRAFT/EXPERIMENTAL keys, common types/six wire schemas, 26 synthetic examples, 27 Finance tests, offline validation and lock/CI documentation |
| Final-head contract/Foundation checks | Tested Shared `eee834ec4f97b93bb9f7975e3ea020de1e3cac28`; all 29 checks complete: 22 success, seven applicable skips | Source conformance; no provider, runtime financial or operational certification |
| Existing INT-02 workload observation | Infrastructure `0f6cbac`, [run 38929279122](https://github.com/baobab-platform/infrastructure/actions/runs/38929279122) | L4-IAM-02 PASS only; four other scenario aggregates BLOCKED; #35 remains unmerged |

Current Shared vocabulary now includes `finance.ledger.read`,
`finance.journal.manage` and `finance.statement.read`. DRAFT catalogue presence
is distinct from accepting Proposed ADR-SHARED-033 or certifying ERP support.

The wire tranche covers operation-specific journal requirements and positive/zero
instructions, typed chart/balance/entry rows, exact signed historical corrections,
ERP-owned book scope, snapshot continuation, historical baseline versions and
statement reconciliation lineage. Current CP/native authority, arithmetic balance,
precision, closed periods, maker/checker, durable idempotency, native COMMIT and
actual trial-balance reconciliation remain ERP/Finance acceptance obligations.
No estate may substitute fixture validation or metadata for those proofs.

See the [full evidence and next owner tasks](evidence/finance-f1-source-2026-10-16.md).
G03 has advanced DRAFT source. G06 remains blocked for operational F1; G01/G02,
protected G04/G05/G16/G17 and G18 are not promoted. No R0/R1/R2/R3 release is
accepted. Infrastructure #35 was not changed by this Finance increment.

## 19. INT-02 prerequisite source closure — 16 October 2026

Sponsor direction: implement the recommended repairs towards Infrastructure #35.
The [prerequisite source evidence](evidence/int02-prerequisite-source-2026-10-16.md)
records merged CP #407/#408, IAM #117 and Shared #322 with immutable commits,
review status, evidence class and synthetic/provider boundaries.

Current governed PRIMARY authority and metrics, packaged browser themes, and a
PROVISIONED Pulse test-caller ceiling are source progress. Infrastructure's
browser/code/S256/MFA, four-principal isolation and explicit workload-registry
loading remain candidates until the actual final-head run proves them.
Historical source-only or partial workload results do not establish full L4.

L4-CP-02 remains BLOCKED for an actual qualified provider and its current
health/binding/contract/market/instance/isolation negatives. Shared's proof
bootstrap requires an owner-governed decision; its only existing exception was
not broadened. No new caller was promoted to ACTIVE, and no fake provider
certification was created. #35 remains open. INT-03 depends on full INT-02.

G04 source advances; real onboarding, G05/R0, G16/G17 and G18 remain unaccepted.
This checkpoint supersedes stale prerequisite PR statuses above while retaining
the dated history. Finance DRAFT source status in section 18 is unchanged.


## 20. Independent native engineering — 17 October 2026

Trade #153's central Trade-A order-authority PEP and append-only receipts
advance the engine-owned EA-R03 / Trade-A lane without depending on
Infrastructure #35. [The source evidence record](evidence/trade-a-ta05-source-2026-10-17.md)
records its reviewed persistence-error and native class/type fixes, contract
pin, migration, validation and remaining entry-point/COMMIT acceptance work.

This is source/engine-local synthetic-authority evidence. TA-06/07/08 and
Trade-B/C/D remain; EA-R03/LA-05 are PARTIAL. Nabhold P0-04/P0-04B
operator identity, current grants and protected staging exits remain unchanged.
No Nabhold/Thamani/ZuriBeans
Principal, seller mandate, tenant access, provider certification, protected
R0/R1/R2/R3 release or production authority is created. Finance F1 source,
INT-02 acceptance and real founding-group governance retain their own gates.

## 21. INT-03 consumer harness preparation — 17 October 2026

Nabhold now prepares a distinct `keycloak-identity-smoke` Playwright configuration,
owner-private environment loading and explicit integration launch/check commands.
The [runbook](../testing/codespaces-integration.md) specifies the outstanding
Infrastructure handoff and the exact source-versus-runtime claim boundary.

**Claim/evidence class:** source and synthetic configuration unit coverage only;
real integrated browser execution is BLOCKED pending the private network,
registered Nabhold client, synthetic human/CP mapping and TLS Redis handoff.
Declared source pins are syntax-validated, not independently attested by Nabhold.
**Reviewer role/date:** automated engineering source review, 17 October 2026;
independent gate sign-off PENDING. No live provider acceptance is asserted.

Infrastructure #35/INT-02 remains a separate prerequisite; this increment does
not modify or qualify it. Real IAM revocation/MFA/context/tenant negatives,
CMS capability acceptance and future accepted ERP Finance journeys remain.
G04B/G05/G16/G17/G18 and all release acceptance statuses are unchanged.

## 22. G17 / INT-03 identity-smoke evidence preparation — 18 October 2026

Current Nabhold source `8e7bf62` already contains the G04B-04 executive
authorisation seam and merged Codespaces harness (#62), Experience adoption
and registry bootstrap (#68). No open Nabhold PR was returned by the initial
repository query. The earlier G04B-03-only queue descriptions are historical:
G04B-04 source exists, but its concrete human/context adapter remains blocked
by the CP-owned same-principal/delegation contract. Current CP
`a0fef3a05718bb7f3f41dc47746521d0bd91921e` continues to protect runtime context
and capability resolution with workload authentication; an `authority:self`
human token must not be substituted or its context redeemed by another actor.

Infrastructure #35 remains OPEN at
`272697ca96bf7aa08dbbb1b805e2b8acd4f8cc4a`. Its final-head `Real Keycloak -> CP
L4-01 acceptance` check is FAILURE even though Foundation/source checks and
L4-00 pass. INT-02 is not accepted; the full live INT-03 prerequisite remains.
Shared ADR-SHARED-036 was consulted at
`672e16ff4450b5265bb47c6ed2b6850e276e2b60` for evidence boundaries and
Infrastructure-owned orchestration. No contract or provider authority changes.

This independent source increment adds sanitized, write-once identity-smoke
receipts with the actual clean Nabhold source pin, explicitly unattested
dependency pins, fixed per-scenario results and a SHA-256 digest. Failed,
skipped, filtered, duplicate, interrupted and unexecuted checks cannot become
PASS. Reporter errors, titles, attachments and credential-bearing values never
enter the receipt. The [consumer runbook](../testing/codespaces-integration.md)
defines this estate-local observation format and its limits; this is not a
canonical Shared acceptance schema or signed operational evidence.

**Claim:** IMPLEMENTED source preparation only. **Evidence class:** source and
synthetic receipt/reporter tests; no real IAM/CP/CMS/ERP/browser journey was run
for this increment. **Reviewer role/date:** automated engineering source review,
18 October 2026; independent gate sign-off PENDING. Full local frozen package
installation was blocked by absent GitHub Packages read credentials; authenticated
final-head repository CI remains required. No mandatory check is waived.

The next runtime exit remains full INT-02, then Infrastructure's private
network/TLS/client/Redis handoff and the pinned Nabhold identity smoke, followed
by CMS qualification and the remaining INT-03 negatives. G01/G02, G04/G05,
G16/G17/G18 and R0–R3 are unchanged and unaccepted.


## 23. Fresh implementation audit and INT-03 prerequisites — 19 October 2026

[The fresh audit](evidence/progress-audit-2026-10-19.md) reconciles current merged
source, accepted Shared EA v2.2/ADR-SHARED-036, provider declarations, all open
PRs in the eight affected repositories and exact check outcomes.

- **Completed:** Infrastructure #35 merged at `03ad3f488e19ad446328ba6827363730e4252409`;
  frozen final-pin Actions run `39108198886` passes all mandatory INT-02 groups,
  actual Pulse provider assertions and teardown. Shared's accepted qualification
  register records the exact tested dependencies and evidence digests. This
  does not qualify subsequently changed IAM/CP pins automatically.
- **Source already present:** confidential encrypted Redis custody, OIDC BFF,
  current IAM/CP self-identity, G04B-04 deny-by-default authorisation seam and
  identity-smoke receipt tooling. Do not implement those seams again.
- **Current work:** IAM #126's formatting failure repaired and all 46 final-head
  checks completed successfully/applicably skipped before reviewed merge at
  `5bc1a7c4200a7b5dd029452c9d305408fb4a286e`. Ready-triggered automated
  review arrived after merge with two file-input findings; corrective IAM #128
  merged at `63db55c87fda13762fc438a6d32a885a63ddb353` after all 45 final-head
  checks and zero-finding automated review. Both original findings are resolved.
  Its C4-03E receipt verifier and
  C4-04A observation are non-authorising. IAM #127 repairs the missing Keycloak
  `basic` access-token subject mapper in the dormant Nabhold human profile;
  #127 merged at `b2e6dbe879bd2d6757287c9b03947dddbc19a024` after all 45
  final-head checks and resolved review. The real legacy suite passes 140/140,
  including pre-existing dormant-client repair; no connected BFF run is implied.
  Infrastructure #36 merged at `84079fa6720da5e1dd5f14d9d0b0d3b0dd149f28`
  after all 33 final-head checks and resolved review; its 12 handoff tests and
  actual Node/consumer validation establish source preparation only. The
  existing IAM/CP/Pulse regression and teardown pass; no Nabhold runtime run is claimed.
- **Reviewed/merged:** Nabhold #73/#74, after final-head checks, preserve Node 24,
  private Shared Experience package pins and Codespaces bootstrap boundaries.
  #71/#72 received artifact-comment/Foundation source-pin fixes and merged
  at `d684134f49c82878d7b0352719ab4153345fa8f3` /
  `eb67b9f7b6616f78edc8b4628baec10ee7203062` after all 29 final-head
  checks completed successfully/applicably skipped.
- **Still blocked:** real legal verification/SoD/onboarding; C4-03 registered
  native provider→protected CP and C4-04B/C governance/consumption; connected
  Nabhold login/session smoke; current CMS certification/binding and full
  INT-03; executive same-principal/delegation protocol; real AWS/protected
  staging, business acceptance and production activation.

Next eligible order: finish the reviewed prerequisite PRs → provide/run the
actual private INT-03 identity network/client/CP/Redis journey → independent
CMS provider/context/binding and published/preview acceptance → full INT-03
negative/teardown evidence. The native C4 protected lane keeps its own unmet
registration/credential/evidence gates. Real Nabhold progressive onboarding and
R0 require their independently accepted identities, not the disposable fixture.
F1 source design/provider work remains a separate non-production lane; ERP
native posting guards do not establish canonical F1 support. Subscriptions
still declares a simulated, non-production billing provider. G01/G02/G04/G05,
G06/G10, G16/G17/G18 and all R0–R3 release acceptance states remain unchanged.


## 24. INT-03 engineering progress review — 19 October 2026

[The focused INT-03 review](evidence/int03-implementation-review-2026-10-19.md)
rechecks all eight current main heads and open PR check inventories. INT-03A is
merged source preparation. No connected INT-03B or full NAB-01–04 execution is
evidenced. The smaller NAB-ID-01–04 smoke does not replace the mandatory matrix.
The review identifies and corrects the consumer's weaker CA ownership/shared
write/hard-link checks and credential hard-link handling; local configuration,
receipt, Codespaces and Infrastructure handoff tests pass. Exact-head CI/review
is required for this source increment; no protected gate is promoted.

Infrastructure's main INT-02 regression succeeds at run `39263711772`, scoped
to its frozen pins. A separate main-only L3 run `39263711884` fails RabbitMQ
management/queue and APISIX admin probes; root cause remains for owning-lane
triage. Do not describe all main CI as green or relabel either run INT-03.
Next: actual private IAM/CP/BFF/TLS Redis lifecycle and browser smoke, then
CMS qualification/current binding and full matrix negatives/runtime evidence.
Native protected C4, legal/SoD/onboarding, staging, production and R0–R3 remain
open. There is no authority to bypass caller-owned contexts or enable executive
operations from `authority:self` identity alone.


## 25. Connected INT-03 audit — 20 October 2026

[The connected audit](evidence/int03-connected-audit-2026-10-20.md) records the
current merged heads, Infrastructure #37's unmerged real-component lifecycle,
failed connected attempts and remaining acceptance exits. Nabhold #76 is merged;
its consumer file-trust work is complete. The new lifecycle uses actual private
IAM/CP/Pulse prerequisites, synthetic identity mapping, BFF and TLS Redis, with
observed runtime pins and cleanup. It is not accepted merely because source
tests or an earlier prerequisite stage passed. Candidate `502b9e7363a7dae22940a26c9a168ab3957bda72`
has 34 passing local tests and resolved trigger findings; final connected CI and
review are required before merge.

Full INT-03, CMS qualification, protected native C4, real legal/onboarding,
staging, production and R0–R3 remain open. The frozen accepted INT-02 scope is
unchanged. No release flag, grant, provider lifecycle or legal fact is promoted.


## 26. INT-03 trusted proxy origin correction — 20 October 2026

Infrastructure #37 head `4bf7b6f0325e4a811fde7cf302420d618958c391`,
[run 39403918329](https://github.com/baobab-platform/infrastructure/actions/runs/39403918329),
passes the selected real IAM/CP prerequisites and NAB-ID-01/02/03; valid browser
login receives 401 before IAM discovery and NAB-ID-04 fails. Teardown is true.
The artifact archive digest (`dbd6a46099a0a5b7e35c4d3ba77467911cb71a77356cc2a139188f62628de2d8`)
and own receipt sidecar were independently checked. No connected PASS is claimed.

Next 16.4.2's Node adapter builds its request URL from the private bind host/port.
The source correction adds an explicit default-off trusted TLS proxy setting,
exact Host/forwarded-host/HTTPS checks, and canonical configured callback origin
normalisation. POST Origin/Fetch Metadata, OIDC validation and Strict session
cookies remain enforced. The access-controlled ingress must overwrite these
headers and block direct application access. Seventy-eight focused OIDC/config
tests pass, including spoofed/ambiguous headers, default-off denial and the full
private-address callback. Final source CI/review and a new pinned connected run
remain required; this entry does not promote source to integration acceptance.

Shared's Accepted EA v2.3 (`ba5b4523ffc82cbf1b1d804b4d88ab69be04843a`)
is now the execution baseline; it retains v2.2's normative L4 matrix and the
INT-03 identity/CMS critical path. Full INT-03, native protected C4, CMS
qualification, real legal/onboarding, protected staging, production and R0–R3
remain OPEN. Rollback: disable the proxy opt-in and revert this source increment.


## 27. INT-03 sign-in CSP navigation correction — 20 October 2026

Nabhold #78 merged at `76e956f02bab73449b1bd3da5c31785131bce7b4` after all
29 checks and zero-finding exact-head review. Infrastructure candidate
`547250757924657bd0233bc6f77ab661094ae523`,
[run 39431429623](https://github.com/baobab-platform/infrastructure/actions/runs/39431429623),
now performs issuer discovery and returns 303 for valid login. The browser does
not reach IAM; NAB-ID-04 fails. The sign-in policy's self-only form-action blocks
the intended redirected form navigation in Chromium. The next source increment
adds only the validated configured HTTPS issuer origin to form-action on the
exact sign-in route, with malformed/disabled/auth-source injection negatives.
Script/connect/frame/base restrictions, other routes and all OIDC/current CP
authority/session controls retain their existing boundaries.

Archive digest `ae653ccbd421c4285502a67d7d92e3a5b014361a8695e9de0b53266850d2ec1b`,
own receipt digest `0b2c62eba0f75324f70184c3119efcf228817134ff2b068b25a4f11e4f9f1f37`,
prerequisite receipt and provider-proof digests were independently checked. The
selected prerequisite passes all 90 checks/five groups; NAB-ID-01/02/03 pass;
teardown true. Overall identity smoke FAIL; full INT-03 and protected/release
acceptance stay OPEN. New source CI/review and a new pinned connected run are
required. All 115 focused OIDC/config/CSP/proxy/navigation tests pass locally. Review
identified Next client-transition CSP retention; sign-in entry links now force
a document load, with desktop/mobile UI regressions. The real browser scenario
enters through the header and checks the document form policy before login.
No provider, grant, legal fact, migration or release is activated.
Rollback: revert the scoped CSP exception (federation will be blocked again).


## 28. INT-03 cross-site callback completion — 20 October 2026

Nabhold #79 merged at `5f3fb6e5703f3ef64656af7231a1e4f5c2461183` after all
29 checks and zero-finding exact-head review. Infrastructure #37 now includes a
verified disposable-client self-audience for Keycloak introspection; the dormant
product client remains unchanged. Product IAM audience convergence retains its
own outstanding qualification.

At Infrastructure head `8afe5a11c96ecfb1d8a18d1d8a5adba5b1157fbd`,
[run 39475900936](https://github.com/baobab-platform/infrastructure/actions/runs/39475900936)
passes the real prerequisite profile and reaches IAM introspection 200,
CP self-read 200 and callback 303. Account then returns 307 to sign-in, with
no subsequent introspection. The cross-site redirect chain withholds the
Strict session cookie. Overall identity smoke remains FAIL; cleanup completes.
Forty-one Infrastructure source/security tests pass. Finite HTTP diagnostics
contain only fixed route labels, methods and status codes.

The next source correction commits a fixed no-store, script-free same-origin
completion document before navigating to account, preserving Strict cookies
and every current IAM/CP validation. Unit coverage checks restrictive headers,
fixed destination, absence of reflected OAuth/identity values and replay denial;
the real browser case requires HTML completion before account/session/logout.
**Evidence class:** source candidate; CI, authorised review and pinned live
execution remain required. An earlier automated review request hit an exhausted allowance;
subsequent exact-head review is retried without waiving any merge gate. Full INT-03, CMS, native protected C4,
real legal/onboarding, protected staging, production and R0–R3 remain OPEN.
Rollback is described in the integration runbook.


## 29. INT-03 native logout policy correction — 20 October 2026

Nabhold #80 merged at `7c950c7a92762a7478b87e68549c9114c76e20c3`, preserving
qualified source `d655154872569c8573c19b5b30d047eef41afe3f` in main.
All 29 checks clear, 354 unit/five TLS Redis/22 public browser tests pass,
and exact-head automated review has zero findings.

Infrastructure #37 head `f31168f5bdf5f985005524fb10d52293555c1f99`,
[run 39478841643](https://github.com/baobab-platform/infrastructure/actions/runs/39478841643),
now observes callback HTML 200, account 200, session 200 and repeated current
IAM/CP checks. The Strict-cookie completion correction works. Both the expected
invalid-CSRF request and the native logout form return 401; overall smoke FAIL.
Teardown completes; no connected acceptance is claimed.

The account's no-referrer policy produces an opaque Origin on native POSTs
under Fetch section 3.2. The source correction uses same-origin only for account
documents, preserving suppression of external account referrers and retaining
no-referrer on protocol routes. Origin/Fetch Metadata, CSRF, Strict cookies,
current authority and custody checks are unchanged. New negatives prove valid
CSRF cannot waive missing/null/foreign Origin; header/browser checks cover
delivery, and the real form must present exact Origin and return 303.

**Evidence class:** source candidate pending CI, final-head review and fresh
pinned real-component execution. This is not full INT-03/NAB-01–04, CMS,
protected C4, legal/onboarding, staging, production or R0–R3 acceptance.
Rollback is in the integration runbook.
