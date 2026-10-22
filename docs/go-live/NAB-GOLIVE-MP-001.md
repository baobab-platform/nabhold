# NABHOLD GROUP AFRICA
## Corporate Digital Estate & Baobab Platform Go-Live Master Plan

**Document ID:** NAB-GOLIVE-MP-001  
**Version:** 2.0  
**Status:** ACCEPTED  
**Acceptance date:** 14 October 2026  
**Primary implementation repository:** baobab-platform/nabhold  
**Platform architecture and contract authority:** baobab-platform/shared  
**Tenant, organisation, relationship, entitlement, binding and readiness authority:** baobab-platform/baobab-cp  
**Identity authority:** baobab-platform/baobab-iam  
**Infrastructure authority:** baobab-platform/infrastructure  
**Supersedes:** NAB-GOLIVE-MP-001 v1.0, baseline 8 October 2026, now HISTORICAL  
**Governing platform decisions:** ADR-BCP-026, ADR-BCP-027, accepted Baobab EA Implementation Plan v2.3 (successor to the v2.1 adoption baseline)  
**Governing Nabhold decisions:** ADR-NAB-0003 through ADR-NAB-0014, as amended by ADR-NAB-0014  

**Current platform interpretation (22 October 2026):** EA v2.3 is the governing
execution plan; the accepted v2.2 L4 matrix retains normative scenario identifiers.
The 14 October v2.0 acceptance date and historical snapshots remain unchanged.
See the [current source audit](evidence/ea-v2.3-progress-audit-2026-10-22.md).
Infrastructure #49 remains an independent approval request, CMS registry activation under Accepted Shared #354 remains
HELD and all 14 connected NAB-03 cases remain BLOCKED.

> **Master rule:** architecture acceptance, contract convergence, source implementation, database migration, synthetic testing, protected staging, independent legal/provider evidence, Control Plane activation and production authorisation are different facts. No one of them implies the others.

---

# 1. Executive decision

This v2.0 master plan is the controlling Nabhold go-live programme baseline.

It replaces v1.0 because the accepted Organisation-first and progressive-onboarding architecture in ADR-BCP-026 and ADR-BCP-027 materially changed the authority boundary assumed by the 8 October plan.

The following decisions are now fixed for Nabhold:

1. **Organisation-first tenancy.** An Organisation is the enduring business identity. A Tenant is an isolation and operating boundary. A LegalEntity is a legal person. A legal-actor mandate records when a legal person is authorised to act for an Organisation, activity, market and period. These are related but not interchangeable.
2. **Option B group autonomy.** Nabhold, Thamani, ZuriBeans and any separately governed operating company or business have independent Tenants where justified. Corporate affiliation is a relationship, not a shared tenant and not an IAM grant.
3. **Subsidiary autonomy.** Each subsidiary controls its own market entry, market exit, day-to-day business decisions, operational data and platform capability adoption, subject to lawful board or shareholder reserved matters. Leaving Nabhold must not require re-keying the subsidiary Organisation or Tenant.
4. **Nabhold is non-trading in goods.** Nabhold is a holding company and Baobab platform owner/operator. It does not directly consume Trade cart, RFQ, quotation, buyer-membership, inventory, logistics or trade-document capabilities merely because subsidiaries do.
5. **Nabhold may sell corporate/platform services.** R2 may include Baobab subscriptions, licences, implementation, support or other board-approved services. That is services/platform commerce, not goods trading.
6. **Group visibility is explicit.** Ownership or control never creates cross-tenant data access. Group reporting requires effective-dated relationship authority, explicit grants, purpose, data classification, domain permission and lawful information-sharing.
7. **Progressive onboarding.** Admission, Organisation creation/recognition, TenantOnboardingRequest, Tenant registration, legal-actor authority, product entitlement, capability qualification, provider readiness and production activation are separate decisions.
8. **Capability-specific activation.** There is no valid whole-tenant shortcut from APPROVED to ACTIVE. A tenant can exist while individual capabilities remain blocked, restricted, staged or unavailable.
9. **Provider neutrality.** Nabhold consumes canonical capability contracts and Control Plane resolution. It does not make Payload, iDempiere, Kratos, Hydra, Keycloak, Kill Bill, HyperSwitch or another provider part of its business contract.
10. **Production follows independent evidence.** Real government, tax, payroll, merchant, banking and provider evidence is never inferred from repository fixtures, a Shared registry row or green CI.

---

# 2. Corporate operating model

## 2.1 Current declared group posture

| Business | Business identity | Current declared legal posture | Baobab posture |
|---|---|---|---|
| Nabhold Group Africa | Holding company and Baobab owner/operator | South African private company; documentary CIPC evidence recorded; independent CP verification still required | Own Organisation and independent Tenant |
| Thamani Global | Autonomous B2C/logistics subsidiary | South African company documented; corporate control must be independently established; Uganda incorporation planned separately | Own Organisation and independent Tenant |
| ZuriBeans | Autonomous B2B cross-border trading business | South African incorporation application pending; no incorporated company may be fabricated; Uganda incorporation follows its own evidence when established | Own Organisation and independent Tenant |
| Equator & Estate Co. | Autonomous property/construction/hospitality operating business | Current Shared declaration is operating business without separate incorporation evidence | Own Organisation and independent Tenant where justified |

Future incorporation is additive. When ZuriBeans or another operating business becomes a legal person, the platform links the new LegalEntity to the existing Organisation and preserves the OrganisationID, TenantID, audit history and historic legal-actor attribution.

## 2.2 Canonical topology

    Nabhold Corporate Group
        |
        +-- Nabhold Organisation -------- Nabhold Tenant
        |       |
        |       +-- Nabhold ZA LegalEntity
        |
        +-- Thamani Organisation -------- Thamani Tenant
        |       |
        |       +-- Thamani ZA LegalEntity
        |       +-- future Uganda LegalEntity
        |
        +-- ZuriBeans Organisation ------- ZuriBeans Tenant
        |       |
        |       +-- ZA LegalEntity when incorporation completes
        |       +-- future Uganda LegalEntity
        |
        +-- Equator & Estate Organisation - independent Tenant
                |
                +-- LegalEntity only when independently established

CorporateRelationship records group membership, control or ownership when independently evidenced. It never grants IAM or domain access.

## 2.3 Market autonomy

Market participation is owned by the relevant Organisation/Tenant context.

Nabhold may operate in South Africa for its own holding-company, employer, intellectual-property, corporate-services and Baobab-platform activities. Thamani and ZuriBeans independently decide whether to enter, remain in or exit South Africa, Uganda or later markets. A subsidiary leaving the group changes relationship and future group authority, not its canonical business identity.

---

# 3. Authority hierarchy

| Concern | Authority |
|---|---|
| Canonical contracts, capability vocabulary, events, workload registry | Shared |
| Organisation, Tenant, CorporateRelationship, PlatformAccount, subscriptions, contexts, grants, provider registrations, bindings, readiness and drift | Control Plane |
| Human and workload authentication, federation and token issuance | IAM |
| Corporate editorial content | CMS capability domain |
| Accounting, finance, procurement, assets, projects and approved people/payroll integration boundary | ERP domain |
| Executive evidence, research and derived intelligence | Pulse |
| Subscription lifecycle, usage and billing semantics | Subscriptions |
| Payment intent, authorisation, capture, refund and later settlement/dispute semantics | Payments |
| Regulatory requirement/evidence/decision support | Regulations |
| Deployment, AWS, secrets, network, runtime identity, backup and restore | Infrastructure |
| Presentation, server-side composition and user journey | Nabhold Digital Estate |
| Corporate/statutory legal facts | Independently accepted authoritative sources and qualified human decision makers |

The Digital Estate must not become a shadow authority for any item above.

---

# 4. Release classes

Release flags enforce availability; they do not constitute approval.

| Release | Scope | Minimum business outcome |
|---|---|---|
| R0 Institutional | Public corporate website | Approved legal/corporate content, CMS publication, accessibility, security and production operations |
| R1 Corporate | Protected Nabhold workplace | Real sign-in, own-company finance, workforce/HR, payroll when enabled, procurement/assets/projects, governance and internal reporting |
| R2 Platform Commercial | Baobab customer commercial operations | Plans, subscriptions, metering, invoices, collections, refunds, settlement, ERP accounting and reconciliation |
| R3 Group Oversight | Parent-level authorised portfolio oversight | Effective-dated portfolio scope, subsidiary reporting grants, group finance/consolidation, risk/governance, intelligence and compliance support |

R0 may launch independently. R1 may be internally phased by signed feature flags, but R1 is not complete until its mandatory corporate functions are accepted. R2 is not inferred from R0/R1. R3 requires subsidiary-specific authority and may remain later.

---

# 5. Readiness model

Baobab EA v2.3 governs current readiness through separate decisions. The v2.1
references in dated historical snapshots describe the original acceptance baseline.

## 5.1 Platform gates

| Gate | Meaning | Nabhold consequence |
|---|---|---|
| A | Architecture and contract readiness | Required contracts and consumer compatibility are accepted |
| B | Platform developer unfreeze | Estate code may progress without inventing platform authority |
| C | Controlled founding-group onboarding | Real Organisations/Tenants can be admitted in controlled non-production paths |
| D | Capability-specific staging qualification | One capability is proven with IAM, context, entitlement, provider, mandate and protected staging |
| E | Production activation / EA-09B | External evidence, operations, recovery and signed go/no-go permit production use |

As of 14 October 2026, Shared's live EA dashboard records Gate B as not passed and production activation as not authorised. This master plan does not override that platform decision.

## 5.2 Nabhold readiness dimensions

Every gate record must distinguish at least:

- architecture accepted;
- contracts converged;
- source merged;
- database migrated;
- synthetic/integration tests passed;
- protected staging passed;
- independent legal/provider evidence accepted;
- operational certification signed.

A row may be YES in one dimension and NO in another.

---

# 6. G00 — programme governance and evidence

**Owner:** Nabhold programme sponsor + architecture + release management.

Required:

1. This v2.0 plan is the accepted programme baseline.
2. v1.0 is retained only as historical evidence.
3. docs/go-live/register.md is the live programme register and must be refreshed whenever a gate changes.
4. Evidence pointers live under docs/go-live/evidence and must not contain credentials, private payroll data or unnecessary personal information.
5. Every implementation PR names the gate, authority, exact Shared pin, acceptance evidence, negative tests and rollback.
6. No branch, PR or code comment may claim production readiness without the corresponding Control Plane and operational evidence.
7. External decisions are recorded with owner, effective date, source, expiry/review date and affected systems.

**Exit:** programme baseline, authority, evidence policy, task register and owners are accepted.

---

# 7. G01 — truthful corporate identity, group authority and legal posture

G01 is no longer one monolithic prerequisite.

## G01A — documentary business identity

For Nabhold:

- preserve CIPC documentary evidence and non-sensitive registry facts;
- confirm current legal name, number, status, directors/authorised office holders as required;
- keep beneficial ownership, annual-return status, tax, VAT, employer and privacy facts separate;
- never treat a source document merely stored in GitHub as independent verification.

For Thamani and other group businesses, keep their own evidence separate.

**Exit:** documentary claims are complete enough to open the independent verification case.

## G01B — independent legal verification

Control Plane must independently accept the relevant official-source verification for Nabhold before an operation requires verified legal-person standing.

This includes:

- current source provenance;
- exact registration identifier and legal name;
- immutable evidence/custody references where required;
- independent reviewer decision;
- expiry/revalidation policy;
- negative tests for stale, mismatched, applicant-supplied or forged evidence.

**Important:** Nabhold's own tenant onboarding does not require proof of every subsidiary relationship. It requires the legal/evidence posture relevant to Nabhold's own admission and requested capabilities.

## G01C — group relationships, autonomy and legal-actor mandates

Independently establish, only where needed:

- Nabhold to Thamani ownership/control;
- Nabhold to ZuriBeans relationship and any lawful operating/legal-actor mandate while ZuriBeans is not incorporated;
- future subsidiary joins, disposals and exits;
- data-sharing/reporting authority;
- intercompany agreements;
- IP ownership/licensing;
- reserved matters and delegated authority.

These facts primarily gate R3 and any transaction where Nabhold acts for another operating business. They are not a universal blocker on the existence of Nabhold's own Tenant.

**Exit:** each relationship/mandate used by a release has independent evidence and effective dates.

---

# 8. G02 — Organisation-first Nabhold onboarding

The v1.0 legal-entity-first flow is retired.

## G02A — progressive application

Create a real ClientApplication v2 for Nabhold through the governed INTERNAL_GROUP/assisted path.

The application describes:

- Nabhold business identity;
- requested ZA market;
- business needs, not engine/provider IDs;
- requested release composition;
- documentary evidence references;
- accountable applicant/sponsor Principal.

A person name in a JSON file is not a Principal.

## G02B — PRIMARY Organisation and admission decision

Establish or recognise Nabhold's PRIMARY Organisation.

Require:

- independent review;
- admission decision;
- no applicant self-approval;
- no fabricated verification;
- correlation and immutable decision evidence.

## G02C — TenantOnboardingRequest v2

Generate the Organisation-bound TenantOnboardingRequest v2 from the approved decision.

Require:

- organisation_id;
- exact desired state;
- reason and correlation;
- requester Principal;
- independent authoriser Principal;
- immutable desired-state digest;
- no caller-supplied tenant ID.

## G02D — progressive Tenant registration

Use the governed RegisterProgressiveTenantV2 path.

Validate:

- authorised request;
- one Tenant per intended PRIMARY Organisation;
- stable TenantID;
- PRIMARY Organisation mapping;
- optional DEFAULT LegalEntity mapping only when justified by accepted authority;
- no implicit legal-actor mandate;
- idempotent replay;
- no cross-tenant grants.

The completion label for this stage is:

**IDENTITY_TENANT_ACCEPTED_NOT_PRODUCTION**

It is deliberately not ACTIVE production.

## G02E — INTERNAL product, Digital Estate and desired state

Establish Nabhold's INTERNAL platform relationship and product intent:

- zero platform charge for approved internal use where policy says so;
- usage metering remains enabled;
- audit, entitlement, isolation and readiness remain enabled;
- Nabhold Digital Estate identity and canonical domains;
- ZA residency/market intent as approved;
- workload identities;
- requested product/capability composition.

A Digital Estate repository does not create a Tenant.

## G02F — capability-specific qualification

For every enabled capability, independently prove:

1. canonical Shared contract;
2. supported contract version;
3. real provider declaration;
4. provider/release/EngineInstance status;
5. Nabhold ProductSubscription/entitlement;
6. CapabilityGrant and binding;
7. current health/readiness;
8. IAM audience/scope;
9. valid PlatformContext;
10. legal actor/mandate where the operation requires one;
11. protected staging positive and negative proof.

One capability passing does not promote another.

**G02 exit:** the Nabhold identity/Tenant is accepted in governed state and each release has an explicit list of qualified and blocked capabilities. Production remains a later decision.

---

# 9. Capability governance

## 9.1 Status vocabulary

- **C:** canonical Shared capability.
- **P:** proposed/candidate; not canonical and must not be called by production code.
- **I:** implemented source evidence in provider repo.
- **Q:** capability-specific protected staging qualification.
- **A:** active for Nabhold in an accepted production context.

Source IMPLEMENTED is not A.

## 9.2 Current canonical catalogue and Nabhold use

The current Shared catalogue contains 22 keys.

| Capability | Nabhold use | Current provider posture |
|---|---|---|
| billing.subscription.manage | Direct R2; also relevant to governed internal subscriptions | Subscriptions IMPLEMENTED, simulated provider, production not permitted |
| billing.usage.record | Direct server-side R2/internal metering | IMPLEMENTED, simulated provider |
| commerce.cart.manage | No direct use | Trade only; Nabhold does not trade goods |
| commercial.rfq.manage | No direct use | Subsidiary commerce |
| commercial.quotation.manage | No direct use | Subsidiary commerce |
| content.entry.resolve | Direct R0+ | CMS PARTIAL; route exists, production not permitted |
| customer.buyer-application.manage | No direct use | Subsidiary commerce |
| customer.buyer-membership.manage | No direct use | Subsidiary commerce |
| finance.order-consequence.process | No direct use | ERP PARTIAL; goods order consequence |
| inventory.availability.query | No direct use | ERP IMPLEMENTED source; not a holding-company dependency |
| identity.authentication.perform | Direct R1-R3 | IAM PARTIAL |
| identity.workload-token.issue | Direct server-side R0-R3 | IAM PARTIAL |
| intelligence.evidence.search | Direct/authorised R3 | Pulse IMPLEMENTED source |
| intelligence.research-mission.manage | Direct/authorised R3 | Pulse IMPLEMENTED source |
| payment.intent.create | Direct R2 | Payments IMPLEMENTED sandbox; production not permitted |
| payment.intent.cancel | Direct R2 | sandbox only |
| payment.payment.authorize | Direct R2 | sandbox only |
| payment.payment.capture | Direct R2 | sandbox only |
| payment.refund.create | Direct R2 | sandbox only |
| regulations.requirement.resolve | Conditional | Regulations PARTIAL |
| regulations.evidence.assess | Conditional | Regulations PARTIAL |
| regulations.decision.evaluate | Conditional | Regulations PARTIAL |

## 9.3 Engines Nabhold is expected to consume directly

| Engine/domain | Direct use | Purpose |
|---|---|---|
| IAM | Yes | executive/staff authentication, federation, workload identity, session and lifecycle control |
| CMS | Yes | corporate public/editorial content |
| ERP | Yes | Nabhold finance, accounting, procurement, expenses, assets, projects, workforce integration and payroll boundary |
| Pulse | Yes, governed | executive research, evidence and later portfolio intelligence |
| Subscriptions | Yes | Nabhold internal product entitlement and R2 customer subscription/metering/billing |
| Payments | Yes | R2 collections, refunds, settlement/reconciliation |
| Regulations | Conditional | requirement/evidence/decision support when verified policy/source coverage exists |

## 9.4 Engines not directly consumed by default

Trade, Trade Docs, TMS and SCF are not default Nabhold business capabilities.

Nabhold may later consume **authorised aggregates or reporting projections** originating from these domains for R3 oversight, but it must not call subsidiary operational mutations merely because it owns the subsidiary.

A future move into central trading, logistics operation, supply-chain finance or another materially different business model requires a master-plan/ADR amendment and explicit capability census.

---

# 10. G03 — canonical corporate capability programme

Nabhold requires more corporate capabilities than the current catalogue provides.

## 10.1 Finance — first priority

ADR-SHARED-033 is currently Proposed and defines the preferred finance inventory.

**F1: first mandatory tranche**
- finance.ledger.read
- finance.journal.manage
- finance.statement.read

**F2**
- finance.payable.manage
- finance.receivable.manage
- finance.bank-reconciliation.manage
- finance.cash-position.read
- finance.expense.manage
- finance.budget.manage

**F3**
- finance.reporting-export.create
- finance.project-cost.read
- finance.consolidation.run

These names are proposed until Shared registers each contract.

## 10.2 Workforce and HR

Required operations include:

- employee/work relationship;
- organisational position and reporting line;
- joiner/mover/leaver state;
- leave and absence;
- attendance/time where required;
- compensation inputs;
- benefits and employee documents;
- manager approvals;
- controlled export to payroll/IAM.

The physical provider may be ERP-native or external behind an ERP-owned canonical boundary. The Nabhold estate must not integrate directly with an HR vendor.

## 10.3 Payroll

Required operations include:

- payroll period;
- approved earning/deduction inputs;
- statutory calculation through an approved provider;
- pay-run draft, review, approval and finalisation;
- payslip access;
- employer/statutory exports;
- payroll liability posting to ERP;
- payment instruction handoff under independent treasury authority;
- correction/reversal and immutable audit.

Payroll data must not leak through generic finance statements or group dashboards.

## 10.4 Procurement, expenses, projects and assets

Required operations include:

- requisition;
- purchase approval;
- supplier record/reference;
- purchase order;
- receipt/service confirmation;
- vendor bill;
- employee expense;
- project/cost-centre tracking;
- fixed-asset register;
- depreciation;
- custody assignment;
- transfer/disposal;
- capitalisation policy.

These are Nabhold's own corporate purchases and assets, not Trade RFQ/commerce.

## 10.5 CMS evolution

Future contract review may add publication, media and preview operations. Prefer reuse of content.entry.resolve where semantics fit.

The content contract must be reconciled with Organisation-first tenancy. Any remaining assumption that legal_entity_id is the primary business identity must be amended before broad reuse.

## 10.6 IAM evolution

IAM's proposed lifecycle capabilities include human provision/disable, session revoke, workload provision/disable/rotate and migration mapping. Promotion requires Shared contracts and operational acceptance.

## 10.7 Billing and payments evolution

R2 requires contracts beyond the current minimum:

- billing catalogue/pricing;
- invoice read/outcome;
- credit adjustments;
- dunning;
- billing reconciliation;
- payment settlement;
- payment reconciliation;
- disputes/chargebacks;
- merchant/account readiness.

Billing calculation, payment capture, settlement and ERP revenue recognition remain different facts.

## 10.8 Governance, documents, risk and notifications

Nabhold needs canonical business contracts for:

- board/committee matters and resolutions;
- delegated approvals;
- capital allocation;
- risk register and treatment;
- policy acknowledgements;
- corporate records/documents, classification and retention;
- legal hold;
- notifications and actionable tasks.

No engine/provider is accepted as authority for these domains yet. G03 must decide the semantic owner before implementation.

## 10.9 Group reporting and executive intelligence

R3 requires:

- CP-authorised portfolio projection;
- effective-dated relationship scope;
- ERP reporting exports and later consolidation;
- authorised domain aggregates from subsidiary engines;
- Pulse evidence/research and future portfolio summaries;
- clear actual/forecast/advisory labels.

The frontend must never query every tenant and filter locally.

---

# 11. G04 — IAM and executive/workload authority

Two distinct identity tracks are required.

## G04A — onboarding/operator identities

Control Plane progressive onboarding requires real authenticated Principals for the relevant roles, with separation of duties across applicant/sponsor, reviewer, decision maker, onboarding requester, authoriser and registrar/operator.

No JSON display name satisfies this requirement.

## G04B — Nabhold estate identities

Implement:

- confidential OIDC/BFF;
- Kratos native-human path;
- permanent Keycloak federation where applicable;
- Hydra workload tokens;
- audience-specific tokens;
- secure server sessions;
- logout and revocation;
- step-up assurance for high-risk approvals;
- joiner/mover/leaver integration.

Current nabhold-backend workload registration is a scope ceiling, not proof of an issued or accepted credential.

**Exit:** real protected login and workload journeys pass with revocation, wrong-audience, stale-session and cross-tenant negative tests.

---

# 12. G05 — CMS and R0 publication

Required:

1. Organisation-first compatible content context contract.
2. CMS provider contract lock at accepted Shared version.
3. content.entry.resolve provider support with live IAM and CP context validation.
4. approved corporate content models and legal pages.
5. signed/idempotent publication and revalidation.
6. Nabhold server-side capability adapter; no browser-provider direct call.
7. accessibility, SEO, canonical-host and security acceptance.
8. provider certification/binding for R0.

The direct Payload gateway is a migration adapter only. It must have a dated removal/exception decision if used in production.

**Exit:** R0 content path works through accepted authority, with publish/unpublish and rollback evidence.

---

# 13. G06 — ERP finance and accounting

Nabhold's own ERP path is independent of subsidiary commerce.

Required sequence:

1. approved FinanceBaseline;
2. live iDempiere tenant/client mapping;
3. F1 finance contracts and provider implementation;
4. real trial-balance and statement tie-out;
5. journal maker/checker and closed-period controls;
6. F2 AP/AR/cash/bank/expense/budget;
7. R2 subscription-invoice to receivable event path;
8. payment/settlement outcome accounting;
9. F3 reporting/export/project cost;
10. consolidation only after approved group accounting policy.

No Digital Estate code calculates ledger balances, tax, depreciation or revenue recognition.

---

# 14. G07 — workforce/HR

ERP remains the intended enterprise boundary unless a later ADR chooses another domain owner.

Required before production employee data:

- accepted workforce contracts;
- authoritative employment record;
- data minimisation and POPIA basis;
- IAM joiner/mover/leaver link;
- manager authority;
- retention;
- role and organisation separation;
- no automatic privilege from employment.

---

# 15. G08 — payroll

Payroll activation is capability-specific and later than workforce identity.

Require:

- qualified payroll/provider decision;
- employer registrations and evidence applicable at activation;
- effective-dated tax/statutory configuration;
- approved pay calendar;
- maker/checker finalisation;
- employee confidentiality;
- aggregate ERP posting;
- bank/payment release separation;
- reconciliation and correction procedures;
- signed payroll UAT.

Statutory values must be effective-dated configuration, not hard-coded constants.

---

# 16. G09 — procurement, expenses, projects and assets

Implement canonical contracts and ERP adapters for Nabhold corporate administration.

Tests must cover unauthorised PO creation, three-way-match exceptions, duplicate vendor bills, asset custody changes, depreciation/reversal, disposal approval and cross-tenant denial.

---

# 17. G10 — subscriptions

R2 requires a production-permitted subscription/billing provider.

Current TemporaryProvider is simulated and cannot support production.

Required:

- product/plan catalogue;
- subscription lifecycle;
- metering;
- invoice semantics;
- credits/dunning;
- replay-safe usage;
- CP authority/routing;
- ERP receivable handoff;
- billing reconciliation.

The Control Plane owns authority and routing; it does not transport invoice payloads as an accounting system.

---

# 18. G11 — payments

Current payment support is sandbox-only despite substantial runtime work.

Production requires:

- approved merchant legal entity;
- real HyperSwitch/PSP/acquirer path or accepted alternative;
- bank/settlement account;
- current legal-actor/merchant readiness;
- TLS/webhook authenticity;
- idempotent money lifecycle;
- refund authority;
- settlement and fee evidence;
- dispute path;
- ERP reconciliation;
- negative proof for mismatched merchant, currency, account and stale authority.

No R2 GO while production_permitted remains false or real settlement is unproven.

---

# 19. G12 — group portfolio, reporting and consolidation

R3 must preserve Option B autonomy.

Required:

1. effective-dated CP corporate relationships;
2. independently accepted control/ownership where used;
3. explicit subsidiary data/reporting grants;
4. purpose and data-classification restrictions;
5. CP authorised portfolio projection;
6. ERP/domain aggregate contracts;
7. accountant-approved consolidation policy;
8. currency, period, ownership and elimination semantics;
9. historic as-of reporting across acquisitions/disposals;
10. revocation when relationship or grant ends.

Group access never means payroll-line or customer-record access by default.

---

# 20. G13 — governance, records, risk and notifications

Select canonical domain ownership before implementation.

Required controls:

- board and committee matters;
- resolutions/minutes;
- delegated authority;
- conflicts and quorum where applicable;
- capital requests;
- risk/issues/actions;
- corporate document classification;
- retention/legal hold;
- signatures/evidence references;
- notifications with immutable causation.

The Digital Estate may present workbenches but may not become the governance system of record.

---

# 21. G14 — Pulse and Regulations

## Pulse

Current canonical capabilities intelligence.evidence.search and intelligence.research-mission.manage are IMPLEMENTED in source but still require activation for Nabhold.

The existing Nabhold prototype executive-overview endpoint is not canonical and must be retired or replaced by an accepted contract.

All intelligence output must carry provenance, classification, freshness and advisory status where appropriate.

## Regulations

Current requirement, evidence and decision capabilities are PARTIAL.

Use is conditional on:

- independently governed sources;
- verified ZA coverage;
- rule-set/version provenance;
- human/legal escalation where required;
- no claim that an AI/regulatory engine is legal advice;
- operational certification.

Regulations may inform applicability and evidence posture but cannot invent CIPC, SARS, labour or provider approval.

---

# 22. G15 — Nabhold Digital Estate composition

The estate is a thin experience/BFF layer.

Required:

- server-side capability resolution;
- no browser-selected tenant/legal actor/provider;
- no static provider routing for production;
- release-class enforcement;
- clear unavailable/restricted/stale states;
- permission-filtered navigation;
- Organisation 360/group views only from authorised contracts;
- accessible command/workbench patterns;
- source, period, entity and freshness labels;
- no local duplication of ERP/CMS/IAM/CP truth.

Current preview-only executive session is not production authentication.

Toolchain must converge to the platform runtime standard before G16 or carry an explicit reviewed exception.

---

# 23. G16 — infrastructure, protected staging and EA-09

Initial AWS region is af-south-1 under accepted Infrastructure ADRs. Region choice does not imply that account/bootstrap evidence exists.

Before release:

- real staging and production account ownership;
- protected GitHub environments;
- separate OIDC plan/apply roles;
- remote state and locking;
- immutable image digests;
- runtime workload identity;
- TLS/private-service trust;
- Secrets Manager/KMS;
- approved databases/object custody;
- backup and restore;
- logging/metrics/traces;
- vulnerability/SBOM gates;
- rollback/compensation;
- release provenance;
- EA-09 certification.

Fixture account IDs, fake role ARNs or synthetic production config are release blockers.

---

# 24. G17 — release acceptance

Each release needs a signed acceptance pack.

Minimum scenarios:

- cross-tenant and cross-Organisation denial;
- wrong audience/scope;
- session/workload revocation;
- stale/expired capability resolution;
- provider revoked after plan approval;
- duplicate onboarding;
- CMS publish/unpublish;
- finance duplicate posting and closed period;
- payroll duplicate finalisation if enabled;
- subscription usage replay;
- payment webhook replay and settlement mismatch;
- group relationship ending;
- backup restore;
- rollback;
- accessibility and browser security;
- operating runbooks exercised.

A test marked N/A must be technically excluded from that release, not simply skipped.

---

# 25. G18 — production activation

Production activation is release- and capability-specific.

No production GO if any enabled feature:

- relies on simulated/PARTIAL/not-production-permitted provider support;
- lacks real user/workload authentication;
- trusts browser-provided business authority;
- lacks independent legal/provider evidence required by the operation;
- bypasses maker/checker or idempotency for financial mutation;
- cannot reconcile monetary events;
- lacks recoverable backup/rollback;
- cannot reproduce release provenance;
- has not passed protected staging;
- lacks signed operational ownership.

---

# 26. South African compliance control plane

The architecture does not encode legal advice or fixed tax constants.

As of this baseline, official sources confirm that the compulsory VAT registration threshold administered by SARS is R2.3 million from 1 April 2026; SARS employer processes use PAYE/UIF/SDL EMP201 and EMP501 reconciliation; CIPC links annual returns with beneficial-ownership filing; the Compensation Fund requires employers to register; POPIA governs personal information and cross-border transfer conditions.

These facts are time-sensitive. Production systems must use effective-dated, reviewed policy/configuration and qualified specialist sign-off rather than hard-coded values.

Required evidence domains include:

- CIPC/Companies Act;
- beneficial ownership and annual returns;
- corporate accounting and consolidation;
- VAT/income tax/revenue recognition;
- PAYE/UIF/SDL and payroll;
- COIDA;
- POPIA and Information Officer responsibilities;
- customer terms/SLA/DPA;
- merchant/acquirer/PCI responsibilities;
- IP ownership/licensing;
- intercompany agreements.

Official references:
- SARS VAT threshold: https://www.sars.gov.za/faq/what-is-the-new-threshold-for-vat-registration/
- SARS PAYE: https://www.sars.gov.za/types-of-tax/pay-as-you-earn/
- CIPC beneficial ownership: https://www.cipc.co.za/?p=21067
- Department of Employment and Labour Compensation Fund: https://www.labour.gov.za/DocumentCenter/Pages/Compensation-Fund--obligations-of-the-employer-.aspx
- POPIA: https://inforegulator.org.za/

---

# 27. Current critical path

## 27.1 Nabhold controlled onboarding

    G00 accepted baseline
        ->
    G01A documentary evidence
        ->
    G01B independent Nabhold verification
        ->
    G04A real CP operator Principals
        ->
    G02A progressive application
        ->
    G02B Organisation + admission decision
        ->
    G02C authorised TenantOnboardingRequest v2
        ->
    G02D progressive Tenant registration
        ->
    G02E INTERNAL/DigitalEstate desired state
        ->
    IDENTITY_TENANT_ACCEPTED_NOT_PRODUCTION

Group-control evidence runs in parallel unless a requested operation needs it.

## 27.2 R0

    Organisation-first content contract correction
        ->
    CMS live IAM/CP validation
        ->
    Nabhold workload credential
        ->
    capability binding
        ->
    public content E2E
        ->
    G16
        ->
    R0 acceptance

## 27.3 R1

Parallel longest lanes:

- IAM/BFF and workforce identity;
- ERP FinanceBaseline -> F1 finance -> F2;
- workforce -> payroll;
- procurement/assets/projects;
- governance/documents where included.

## 27.4 R2

    production billing provider
        + production payment provider
        + ERP receivable/accounting
        ->
    invoice/payment/settlement/ERP reconciliation
        ->
    R2 acceptance

## 27.5 R3

    relationship/control evidence
        + data/reporting grants
        + portfolio projection
        + ERP reporting/consolidation
        + governance
        + Pulse/Regulations qualification
        ->
    R3 acceptance

---

# 28. Revised implementation queue

Priority is dependency closure, not feature count.

| Priority | Work item | Owner repositories | Exit |
|---|---|---|---|
| P0-01 | Accept this v2.0 baseline; retire v1.0; refresh ADRs/register/profile | nabhold | Single current programme authority |
| P0-02 | Reconcile Organisation-first content context | shared, cms, nabhold | No legal-entity-first contract drift |
| P0-03 | Real Nabhold independent verification path | cp, shared, infrastructure/IAM | Accepted real case, not fixture |
| P0-04 | Establish real CP onboarding Principals and protected staging | iam, cp, infrastructure | Authenticated SoD path |
| P0-05 | Execute real Nabhold controlled staging onboarding | cp | IDENTITY_TENANT_ACCEPTED_NOT_PRODUCTION |
| P0-06 | Nabhold workload credential + R0 CMS binding | iam, cp, cms, nabhold | First qualified capability |
| P0-07 | R0 production-shaped E2E and acceptance | nabhold, cms, infrastructure | R0 G17 package |
| P1-01 | Accept/implement finance F1 contracts | shared, erp | ledger/journal/statements canonical |
| P1-02 | Nabhold FinanceBaseline + live iDempiere | erp | source-proven trial balance |
| P1-03 | Finance F2 + procurement/assets/projects | shared, erp | corporate operating backbone |
| P1-04 | Workforce/HR contracts and ERP boundary | shared, erp, iam | governed employee lifecycle |
| P1-05 | Payroll provider/contracts and acceptance | shared, erp, payments as applicable | signed payroll proof |
| P1-06 | Governance/documents/risk domain ownership | shared + selected provider | canonical authority established |
| P2-01 | Production Subscriptions provider | subscriptions, cp | production-permitted billing |
| P2-02 | Production Payments provider | payments, cp | production-permitted collections |
| P2-03 | R2 finance reconciliation | subscriptions, payments, erp, cp | invoice-to-settlement tie-out |
| P3-01 | Portfolio/reporting contracts | shared, cp, erp | authorised group read model |
| P3-02 | Consolidation policy/provider | erp/finance | accountant-approved group reporting |
| P3-03 | Pulse/Regulations group decision support | pulse, regulations, cp | qualified advisory capabilities |

Independent engine code work may proceed in parallel where contracts and authority are stable. Production activation remains gated by evidence.

---

# 29. Blocker register — 14 October 2026 baseline

| ID | Blocker | Primary release |
|---|---|---|
| V2-B01 | Nabhold CIPC documentary evidence not yet independently accepted in CP | all protected |
| V2-B02 | Real founding/onboarding human Principals and protected SoD acceptance incomplete | onboarding |
| V2-B03 | Organisation-first/progressive production routes intentionally closed pending certification | production |
| V2-B04 | Digital Estate development Gate B not passed platform-wide | development governance |
| V2-B05 | nabhold-backend workload is PROVISIONED, not proven active | R0+ |
| V2-B06 | CMS provider PARTIAL/production_permitted=false and content context needs Organisation-first reconciliation | R0 |
| V2-B07 | Real executive authentication remains preview-only in Nabhold | R1-R3 |
| V2-B08 | Corporate finance F1 capabilities are proposed, not canonical/implemented | R1-R3 |
| V2-B09 | Workforce/HR contracts and provider boundary incomplete | R1 |
| V2-B10 | Payroll provider/statutory acceptance incomplete | R1 |
| V2-B11 | Procurement/assets/projects canonical contracts incomplete | R1 |
| V2-B12 | Subscriptions production provider absent | R2 |
| V2-B13 | Payments production provider absent | R2 |
| V2-B14 | Billing-payment-ERP reconciliation not production-proven | R2 |
| V2-B15 | Authentic group control/reporting permissions incomplete | R3 |
| V2-B16 | Governance/DMS/risk domain owner/provider unresolved | R1/R3 |
| V2-B17 | Pulse estate composition not canonical; current prototype endpoint must be retired/recontracted | R3 |
| V2-B18 | Regulations lacks independently accepted production ZA coverage | conditional/R3 |
| V2-B19 | Real AWS account/roles/KMS/DNS and protected staging operational proof incomplete | all deployed |
| V2-B20 | Provider source status does not equal active Nabhold binding/EA-09 | all |

---

# 30. Decision register

The live register must track at least:

- legal evidence reviewer and independence;
- current Nabhold office-holder authority used for onboarding;
- group control percentages/effective dates when required;
- IP ownership/licensing;
- approved R2 commercial products;
- pricing/currency/trials;
- VAT/tax/merchant posture;
- subsidiary group-reporting data grants;
- consolidation policy;
- workforce provider boundary;
- payroll provider and statutory scope;
- procurement thresholds;
- asset capitalisation/custody policy;
- governance/DMS owner;
- production AWS account/residency/DR;
- beta users and release scope;
- SLO/RTO/RPO/on-call;
- treatment of a subsidiary after disposal;
- future Uganda entity registrations and effective dates.

Unknowns stay unknown. They are not filled with reasonable defaults when they affect authority.

---

# 31. Evidence hierarchy

| Evidence | Proves | Does not prove |
|---|---|---|
| Accepted ADR | architecture decision | implementation |
| Shared contract | canonical semantics | provider support |
| Source + unit tests | code behaviour | deployed authority |
| PostgreSQL/native integration test | runtime component behaviour | protected production-like operation |
| Protected staging | integrated technical path | external legal/provider certification |
| Independent source/provider certification | external fact/eligibility | Nabhold entitlement |
| CP registration/binding/readiness | runtime availability in context | business acceptance |
| Nabhold E2E | feature works through authority chain | statutory correctness by itself |
| Domain sign-off | business acceptance | unrelated capability readiness |
| Production observation | actual operational health | permanent future compliance |

---

# 32. Operational standards

Required across relevant releases:

- WCAG 2.2 AA;
- server-only privileged integration;
- OIDC/OAuth audience and scope isolation;
- CSP and secure headers;
- no browser-declared tenant/legal actor/provider;
- tenant/Organisation/legal-actor negative tests;
- idempotency and replay protection;
- maker/checker for consequential actions;
- immutable audit/correlation;
- effective-dated policy;
- data minimisation;
- backup/restore;
- signed releases and SBOM;
- dependency/security scanning;
- measured performance;
- explicit stale/partial/withheld states;
- privacy and retention controls;
- rollback/compensation.

---

# 33. Mandatory runbooks

- OPS-00 release/deploy/rollback
- OPS-01 IAM/session/workload compromise and revocation
- OPS-02 CP onboarding/provisioning/readiness/drift
- OPS-03 CMS publication/cache rollback
- OPS-04 ERP finance close/reversal/reconciliation
- OPS-05 workforce/payroll incident and correction
- OPS-06 procurement/assets exceptions
- OPS-07 subscriptions/invoice/metering failures
- OPS-08 payments/refunds/settlement/disputes
- OPS-09 group reporting/relationship/grant changes
- OPS-10 governance/privacy/document breach/legal hold
- OPS-11 Pulse/Regulations stale or invalid evidence/rules
- OPS-12 backup/restore/disaster/secrets rotation

---

# 34. Masterplan change control

This v2.0 baseline is Accepted.

- **Major:** operating model, authority boundary, release contract, tenancy model, legal-actor model or production activation semantics.
- **Minor:** accepted gate/domain/capability programme addition that preserves those foundations.
- **Patch:** evidence/status/link/task refresh.

Canonical semantic changes land in Shared first. Provider claims belong to provider repositories. Runtime authority belongs to CP/IAM/Infrastructure as applicable.

A future plan must not silently reinterpret Option B, Organisation-first tenancy or capability-specific production activation.

---

# 35. Definition of programme DONE

The programme is done only when the approved release scope has:

1. truthful business/legal identities;
2. governed Organisation/Tenant records;
3. accepted required legal-actor mandates;
4. real authentication and workload identities;
5. canonical contracts;
6. production-permitted certified providers;
7. active grants/bindings and current readiness;
8. live domain integrations and reconciliation;
9. protected staging evidence;
10. security/privacy/backup/restore acceptance;
11. business UAT;
12. signed G17 GO;
13. controlled G18 activation;
14. production observation and support ownership.

For R3, DONE additionally requires independently authorised group scope and explainable as-of reporting.

> **Final principle:** Nabhold may aggregate the executive experience, but it may not aggregate away corporate autonomy, legal responsibility, tenant isolation, accounting truth or capability authority.
