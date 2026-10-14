# Nabhold Go-Live Register — v2.0

**Masterplan:** [NAB-GOLIVE-MP-001 v2.0](NAB-GOLIVE-MP-001.md)  
**Baseline:** 14 October 2026  
**Status model:** architecture, contract, code, migration, synthetic test, protected staging, external evidence and operational certification are tracked separately.

This register records source/runtime evidence known from the repositories. It is not live production telemetry.

## 1. Programme gates

| Gate | Current status | Evidence / current fact | Next decisive exit |
|---|---|---|---|
| G00 Programme control | ACCEPTED | Masterplan v2.0 accepted; ADR-NAB-0014 accepted; v1.0 retired | Keep register/evidence current |
| G01A documentary identity | PARTIAL | Nabhold and Thamani CIPC documentary references recorded in Shared; Nabhold evidence file present | Reviewer/legal governance completion |
| G01B independent verification | BLOCKED | CP verification/custody machinery exists; no independently accepted real Nabhold verification case | Real source + independent decision |
| G01C group relationships/mandates | BLOCKED | CP relationship/mandate machinery exists; no accepted real control/mandate evidence for programme use | Evidence-backed relationships/mandates |
| G02 Organisation-first onboarding | IMPLEMENTED-NOT-EXECUTED | CP progressive application, independent review/decision, TenantOnboardingRequest v2 and RegisterProgressiveTenantV2 implemented; synthetic four-business PG17 acceptance exists | Execute real Nabhold controlled staging flow |
| G03 capability programme | IN PROGRESS | Shared catalogue has 22 keys; ADR-SHARED-033 finance inventory remains Proposed | Finance F1 contracts + subsequent domains |
| G04 IAM | PARTIAL | IAM provider support remains PARTIAL; nabhold-backend workload is PROVISIONED in Shared | Real Principal/workload credentials and protected acceptance |
| G05 CMS / R0 | PARTIAL | POST /v1/content/resolve merged; CMS support PARTIAL and production_permitted=false | Organisation-first contract convergence + live IAM/CP/binding |
| G06 ERP finance | BLOCKED | ERP authority/contract convergence advanced; corporate F1 capabilities not canonical/implemented | FinanceBaseline + F1 + live iDempiere |
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
| G17 Acceptance | NOT STARTED | No release acceptance pack signed | Per-release UAT/security/ops GO |
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
| V2-B01 | No independently accepted real Nabhold legal verification case | CP / governance / source integration |
| V2-B02 | Real onboarding human Principals/SoD not established for the journey | IAM / CP |
| V2-B03 | Progressive/Organisation-first production routes deliberately closed pending certification | CP / security |
| V2-B04 | EA developer-unfreeze Gate B not passed | Shared / platform |
| V2-B05 | nabhold-backend workload PROVISIONED, not operationally accepted | IAM / CP / Nabhold |
| V2-B06 | CMS content contract/provider still needs Organisation-first convergence and live qualification | Shared / CMS / Nabhold |
| V2-B07 | Executive sign-in remains preview-only | IAM / Nabhold |
| V2-B08 | Corporate finance F1 contracts/provider absent | Shared / ERP |
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

1. **P0-02 — Organisation-first content context convergence (Nabhold consumer implemented; provider qualification blocked).**
2. **P0-03 — real Nabhold independent verification path.**
3. **P0-04 — real CP onboarding Principals and protected staging identity.**
4. **P0-05 — execute Nabhold progressive controlled staging onboarding to IDENTITY_TENANT_ACCEPTED_NOT_PRODUCTION.**
5. **P0-06 — activate the first qualified capability: Nabhold workload + CMS R0.**
6. **P0-07 — R0 protected E2E and acceptance pack.**
7. **P1-01 — accept and publish finance F1 contracts.**
8. **P1-02 — FinanceBaseline + live iDempiere proof.**
9. **P1-03 — finance F2 plus procurement/assets/projects.**
10. **P1-04/P1-05 — workforce then payroll.**

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
  and CP context validator. The current validator accepts absent Organisation;
  the route does not use the returned Organisation. This remains a provider gap.
- Nabhold ADR-NAB-0014 and masterplan v2.0 G05/P0-02 govern this increment.

**Gate remains PARTIAL.** Full P0-02 requires CMS to require the CP-attested
PRIMARY Organisation, reconcile projection identity and prove rejection of
missing/mismatched Organisation. No new body field may be added to pinned
Shared content v1 without contract governance. P0-03–P0-07 require real,
independently accepted identity/Principal/staging evidence; no synthetic fixture
or local setting is accepted as that evidence. Production remains unauthorised.
