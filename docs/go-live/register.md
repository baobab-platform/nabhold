# Go-live register

Source: NAB-GOLIVE-MP-001 v1.0, baseline 8 October 2026. Status words follow the masterplan convention: `EVIDENCED`, `DECLARED`, `PLANNED`, `UNVERIFIED`, `BLOCKED`. Never mark a row `PASS` without an evidence pointer ([evidence/README.md](evidence/README.md)).

## 1. Gates

Owner columns are roles from the masterplan; no individual has been appointed.

| Gate | Scope | Releases | Status | Blocked by | Repo work available without external input |
|---|---|---|---|---|---|
| G00 | Baseline, traceability, governance | all | IN PROGRESS | Review body not named | Registers, evidence index (this directory) |
| G01 | Legal authority, autonomy, IP | all | BLOCKED | B-01, D-01 to D-03 | None. Facts must come from the company secretary. |
| G02 | INTERNAL admission, tenant, DigitalEstate | R1 to R3 | BLOCKED | G01, CP runtime access, second authoriser | Input profile and readiness check (done) |
| G03 | Shared capability census and contracts | all | UNVERIFIED | Shared stewards | Demand census in `nabhold` (not started) |
| G04 | IAM, OIDC/BFF, grants | R1 to R3 | BLOCKED | B-02, ADR-IAM-0033 completion | Token provider seam in `CapabilityClient` (done) |
| G05 | CMS `content.entry.resolve` | R0 | BLOCKED | B-03, G03 | Gateway swap after CMS route exists |
| G06 | ERP finance baseline | R1 to R3 | BLOCKED | B-04, G01, G03 | None |
| G07 | HR system of record | R1 | BLOCKED | B-06, D-09 | None |
| G08 | ZA payroll | R1 | BLOCKED | B-05, D-10 | None |
| G09 | Procurement, assets, expenses | R1 | BLOCKED | B-07, G06 | None |
| G10 | SaaS billing | R2 | BLOCKED | B-08, D-05 | None |
| G11 | Production payments | R2 | BLOCKED | B-09, B-10 | None |
| G12 | Group reporting | R3 | BLOCKED | B-11, B-18, D-07, D-08 | None |
| G13 | Governance, records, risk | R3 | BLOCKED | B-12, D-13 | None |
| G14 | Pulse and Regulations | R3 | BLOCKED | B-13, B-14 | Prototype fenced to R3 and labelled advisory (done) |
| G15 | Frontend and composition | all | IN PROGRESS | Per-feature contracts | Release-class guard, `CapabilityClient` (done) |
| G16 | Infrastructure and certification | all | BLOCKED | B-15, B-16, D-14 | None |
| G17 | Pilots and acceptance | per release | NOT STARTED | G16 | None |
| G18 | Production activation | per release | NOT STARTED | Signed G17 GO | None |

## 2. Blockers (8 October source audit, not live telemetry)

| ID | Blocker | Release | Next action |
|---|---|---|---|
| B-01 | Shared Nabhold registry has jurisdiction and registration null | all | Legal verification, then a Shared registry PR |
| B-02 | No real executive authentication; preview session only | R1 to R3 | Complete ADR-IAM-0033; OIDC/BFF client |
| B-03 | `content.entry.resolve` is CONTRACTED only | R0 | CMS route and provider declaration |
| B-04 | Corporate GL, AP and AR not available as Baobab capabilities | R1 to R3 | FinanceBaseline and iDempiere adapters |
| B-05 | Payroll not implemented, no provider | R1 | Vendor due diligence |
| B-06 | Employment system of record undecided | R1 | Domain ADR |
| B-07 | Procurement and assets proposed only | R1 | Contracts and adapters |
| B-08 | Subscriptions has a simulated provider only | R2 | Kill Bill adapter and certification |
| B-09 | Payments has a sandbox provider only | R2 | Real PSP integration |
| B-10 | Billing, payment and ERP reconciliation unproven | R2 | Signed reconciliation journey |
| B-11 | No group reporting consent or consolidation | R3 | CP portfolio projection, ERP policy |
| B-12 | No governance or DMS provider | R3 | Provider selection |
| B-13 | Pulse `/v1/executive-overview` is not canonical | R3 | Use canonical keys or contract a new capability |
| B-14 | Regulations has no verified ZA pack | regulatory features | Source governance |
| B-15 | Cloud account and OIDC bootstrap unproven | all deployed | Infrastructure owner supplies verified values |
| B-16 | Declared support is not an active Nabhold binding | all | EA-09 and CP readout |
| B-17 | Node 22 and Next 15 versus wider Node 24 standard | CI, deploy | Tested upgrade or exception ADR |
| B-18 | Subsidiary legal registration and data consent unverified | R3 | Legal documents and signed agreements |

## 3. Decisions that cannot be assumed

Default until accepted is the masterplan §12.2 default. Record decision reference, effective date, approving role, evidence, systems affected and rollback for each.

| ID | Decision | Owner role | State |
|---|---|---|---|
| D-01 | Exact Nabhold legal registration and beneficial owners | Company secretary | OPEN |
| D-02 | Equity and control percentages for ZuriBeans, Thamani, Equator | Legal | OPEN |
| D-03 | Platform IP owner, licences, assignments | Legal | OPEN |
| D-04 | Subscription SaaS only, or also consulting and support | Board | OPEN |
| D-05 | First pricing, billing period, currency, trials | Commercial and finance | OPEN |
| D-06 | Customer geography, VAT and export treatment, merchant onboarding | Tax and payments | OPEN |
| D-07 | Which subsidiary data group officers may view, and why | Boards, legal, privacy | OPEN |
| D-08 | Consolidation standard and accountant sign-off | Finance | OPEN |
| D-09 | HR provider and workspace boundary | HR and architecture | OPEN |
| D-10 | Payroll provider, statutory scope, bank release | HR, payroll, finance | OPEN |
| D-11 | Procurement authority and thresholds | Finance and legal | OPEN |
| D-12 | Capitalisation policy and custody owner | Finance | OPEN |
| D-13 | Governance and DMS product, retention | Company secretary, privacy | OPEN |
| D-14 | Production AWS account, residency, DR | Infrastructure, security, legal | OPEN |
| D-15 | Rollout scope per release and beta user list | Product sponsor | OPEN |
| D-16 | SLOs, RTO/RPO, support, on-call | SRE and business | OPEN |
| D-17 | Statutory interpretation (VAT, PAYE, COIDA, POPIA) | Qualified professionals | OPEN |
| D-18 | INTERNAL status of a subsidiary after sale | CP, governance, legal | OPEN |

## 4. First ten implementation PRs (masterplan §15.2)

| # | Work item | Repo | State |
|---|---|---|---|
| 01 | Adopt baseline, register and evidence policy | `nabhold` | DONE in this change (acceptance of the masterplan itself remains a governance decision) |
| 02 | First-party registry reconciliation | `shared` | BLOCKED on G01 |
| 03 | INTERNAL tenant and estate acceptance fixture | `baobab-cp` | BLOCKED on G01 |
| 04 | Capability demand census | `nabhold` | NOT STARTED |
| 05 | Finance, HR, payroll, procurement contracts | `shared` | NOT STARTED |
| 06 | OIDC confidential/BFF pilot | `baobab-iam`, `nabhold` | BLOCKED on G02 |
| 07 | CMS canonical resolve route | `baobab-cms` | NOT STARTED |
| 08 | Nabhold CMS capability adapter | `nabhold` | BLOCKED on 07 |
| 09 | ERP FinanceBaseline authority | `baobab-erp` | BLOCKED on G01 |
| 10 | Corporate financial read | `shared`, `baobab-erp`, `nabhold` | BLOCKED on 09 |
