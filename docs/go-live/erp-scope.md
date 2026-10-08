# ERP engine scope for Nabhold

**Purpose.** What `baobab-erp` must gain before Nabhold can consume finance, accounts, HR and payroll from it, in the order Nabhold needs it.
**Basis.** Read-only survey of `baobab-erp` at `2ef19b8` (after #76), Shared `contracts/erp/v1` and `contracts/capability/v1`, and the masterplan NAB-GOLIVE-MP-001, on 8 October 2026.
**Status.** A scoping input for ERP and Shared owners. It creates no canonical key, accepts no ADR and claims no support. Every "missing" below was checked in code and docs, but I could not run ERP or iDempiere.

## 1. Bottom line

1. ERP today is a **commerce back office** for Trade: it creates customers, orders, warehouses and stock reads, and reports invoice and payment outcomes for **Trade orders**. It has no general ledger access, no payables, no bank reconciliation, no financial statements, no HR and no payroll.
2. **Nothing in ERP has run against a live iDempiere.** The conformance ledger says so for every engine-backed route. Every item below inherits that gap, so proving one real read and one real write against iDempiere is the first piece of work, not the last.
3. The sponsor's direction (HR and payroll from the ERP engine) **reverses ERP's current position**: its census classes payroll "out of scope until a staffing need" and HR as "proposed", and keeps them as separate families. That needs an ERP ADR before any code.
4. The finance work is large but has a sound foundation: the **finance baseline** (an approved, versioned, hashed accounting configuration per legal entity) already exists in ERP and Shared. Nabhold's ledger should be built on it.

## 1a. Sponsor decisions received (8 October 2026)

| # | Question | Answer | Effect on this scope |
|---|---|---|---|
| 1 | When are HR and payroll needed? | From the financial year starting **1 March 2027**, 144 days (about 20.6 weeks) after this document | Sets the deadline for phases E6 and E7. See section 5 |
| 2 | Who approves the accounting baseline? | **Brian Nabusiu** | Named approver recorded in `onboarding/nabhold-finance-baseline-input.json`. ERP requires a named accountable person plus evidence |
| 3 | VAT? | **Not VAT-registered yet.** Tax reference number 9470182230 (sponsor-stated, no SARS document seen) | The baseline's tax profile is "not VAT-registered". Registration must be an effective-dated change, not an assumption in code. Recorded, not verified |
| 4 | Who owns the Subscriptions-to-ERP invoice hand-off? | **`baobab-cp`** | Recorded. It needs one design decision: see section 9 |

## 2. What exists (evidence)

| Area | State | Evidence |
|---|---|---|
| Provider declaration | Two canonical capabilities: `finance.order-consequence.process` PARTIAL, `inventory.availability.query` IMPLEMENTED. Merged (#58); the masterplan still calls #58 open | `.baobab/capability-provider.yaml` |
| Finance baseline | Domain type, Postgres store, reference and resolution contract (Shared erp/v1 1.3.0). Holds functional currency, fiscal-year start month, chart-of-accounts template, accounting schema, tax profile, costing method, effective date, named human approver, evidence reference. Refuses synthetic approvers | `modules/provisioning/finance_baseline*.py`, `db/migrations/0017`, `finance-baseline.schema.json` |
| Tenancy and provisioning | Dedicated AD_Client per legal entity; Control Plane assignment consumed fail-closed; signed delivery of provisioning events | ADR-ERP-002/019/021, `modules/provisioning/` |
| Order-to-cash | Trade `order.placed` executed by an inbox worker; customer projection executed; invoice and payment outcomes announced | `modules/order_to_cash/`, `docs/events.md` |
| Events | 8 produced types registered, 2 consumed. Produced: order consequence, provisioning, business partner, warehouse, invoice, payment accounting. **Not produced:** inventory availability change, buyer commercial profile | `docs/architecture/capability-census-additional-areas-2026-10-08.md` §3 |
| Architecture decisions | ADR-ERP-008 (finance, multi-currency, periods, posting immutability), 009 (ZA localisation), 015 (procurement), 017 (documents), 018 (reporting, trial-balance reconciliation) | `docs/adr/` |

## 3. What is missing, by Nabhold need

Size: **S** days, **M** a few weeks, **L** a quarter or more, with one team. These are order-of-magnitude judgements, not estimates; the masterplan declines to give dates without capacity.

| # | Need (Nabhold gate) | Shared contract today | ERP code today | Missing | Size |
|---|---|---|---|---|---|
| 0 | **Live iDempiere proof** (all) | n/a | none: ledger records NONE of the engine routes as live-proven; REST plugin not installed in the image | Run a real iDempiere in CI; prove one authenticated read and one idempotent write through the real REST API; record it in `architecture/conformance.yaml` | M |
| 1 | **Nabhold finance baseline** (G06) | Reference contract exists | Store and resolver exist | Intake of Nabhold's baseline (ZAR, fiscal year, chart of accounts, tax profile) approved by a named finance owner; ZA localisation (VAT 15% effective-dated, never hard-coded) | M, plus finance sign-off |
| 2 | **General ledger: journals and balances** (G06) | none (`finance.ledger.balance.read`, `finance.journal.manage` are only proposed) | none | Read adapter for accounts and balances by entity, period, currency, as-of; balanced, idempotent journal command; reversal; closed-period refusal; provenance transaction to posting | L |
| 3 | **Financial statements and trial balance** (G06) | none | none | Trial balance, income statement, balance sheet, cash flow from the ledger, tied out to the trial balance (ADR-ERP-018 §54) | M after 2 |
| 4 | **Accounts payable** (G09) | `Purchase Order`, `Invoice` listed as ERP-owned concepts only | none | Supplier master; vendor bill, credit note, due date, approval; payment preparation (execution stays with Payments) | L |
| 5 | **Accounts receivable for SaaS** (G11) | `invoice-outcome` requires `commerce_order_id` | invoice and payment outcomes are keyed to **Trade orders** | A receivable path that has no commerce order: consume an authoritative Subscriptions invoice, allocate Payments settlement, handle credits, deferred revenue and VAT. Needs a new or widened contract | L |
| 6 | **Bank statements and reconciliation** (G06, G11) | none | none | Statement import, matching, exceptions, fees and settlement, dual approval | L |
| 7 | **Budgets and cost centres** (G06, G09) | none | none | Cost centres, approved budget and revisions, commitment reporting | M |
| 8 | **Project and development cost** (G06) | none | none | Platform R&D cost reporting; capitalisation policy is an accounting decision, not code | M |
| 9 | **Expenses** (G09) | none | none | Claims, receipts, approval, liability posting; payment via Payments | M |
| 10 | **Procurement** (G09) | Shared procurement contracts exist as a foundation | none (ADR-ERP-015 only) | Requisition, PO, receipt, three-way match, budget check, delegated approval in ZAR | L |
| 11 | **Fixed assets** (G09) | none | none | Register, depreciation books, disposal; custody kept separate from the accounting asset | M to L |
| 12 | **Workforce / HR** (G07) | none | none | Employment record, position, reporting line, leave, joiner-mover-leaver outbox to IAM and Control Plane, legal-employer scope, privacy classification | L |
| 13 | **Time and attendance** (G07) | none | none | Capture and approval separate from payroll | M |
| 14 | **Payroll** (G08) | none | none | See section 5. Highest risk | L, with specialist sign-off |
| 15 | **Reporting export for Pulse and group reporting** (G12, G14) | none | none | Immutable reconciled financial snapshot with lineage; scoped aggregates for approved group reporting | M |
| 16 | **Consolidation and intercompany** (G12) | `contracts/intercompany/v1` exists | none | Only after an accountant-approved group model (D-08). Do not start earlier | L |
| 17 | **Events** | 8 producer types registered | 6 produced; `inventory.availability-changed` and `buyer-commercial-profile.changed` are not | Those two producers, plus new events for ledger, payable and receivable changes | M |

Capability keys for items 2 to 16 are **proposed names** from masterplan §4.6 to §4.8. None is in the Shared catalogue, so each needs the Shared steps in section 6 before ERP writes a provider declaration for it.

## 4. Cross-cutting work every item needs

1. **Canonical key and contract first** (ADR-SHARED-017 §12): census, Shared ADR, request/response/error/event schemas, examples, classification, idempotency and pagination.
2. **Source plus tests**, then a `.baobab/capability-provider.yaml` entry only for operations with real routes.
3. **Live-provider conformance** against iDempiere (item 0).
4. **Certification (EA-09)** and a Control Plane registration, health and binding. Source and green CI do not make a capability active.
5. **A production EngineInstance.** None exists (`ADR-ERP-001` gap).
6. **Segregation of duties:** maker-checker on journals, vendor bank-detail changes, refunds and pay runs, using the canonical principal and step-up from IAM.
7. **Audit and tenancy:** every read and write scoped to the legal entity; no wildcard queries; restricted data (payroll, bank details) classified and redacted by default.

## 5. HR and payroll: the decision that changes ERP's scope

The ERP census treats HR and payroll as separate families "so a subsidiary can use ERP for employment records and leave and an external payroll provider", and keeps payroll out of scope. The sponsor now wants both from ERP. Options for the ERP ADR:

| Option | What it means | Main risk |
|---|---|---|
| A. ERP hosts HR; payroll calculated by a certified South African provider behind an ERP-owned contract | ERP is the contract owner and journal target; a vendor does the statutory maths | Vendor integration and its own certification; the cheapest safe route |
| B. ERP hosts HR and payroll natively (iDempiere HR module or extension) | One engine | Statutory PAYE, UIF, SDL, EMP201/EMP501, IRP5, COIDA correctness becomes ERP's problem; masterplan forbids a casual bespoke calculator |
| C. HR in ERP; payroll deferred | Unblocks people records first | Payroll stays manual; fine for a very small headcount |

### Against the 1 March 2027 date

144 days remain. Before any HR or payroll code can exist, ERP needs: a live iDempiere (E0), an ERP ADR for this decision, Shared namespace reviews (`workforce` and `payroll` are not registered domains), contracts, an adapter, and a practitioner-signed parallel run. Option B (native payroll) is **not credible** inside that window. Option A depends on choosing a payroll provider soon. Option C (HR records from 1 March, payroll through a payroll bureau or provider portal until the integration is ready) is the only option that does not depend on every earlier phase landing on time.

South Africa's employer tax year runs 1 March to the end of February, so a 1 March start is the cleanest point to begin. The first pay run would then be at the end of March 2027 (assuming monthly pay; to be confirmed), which leaves the parallel run in February at the latest. Employer registration with SARS (PAYE, UIF, SDL) and the Compensation Fund (COIDA) must precede the first pay run; **their status is unverified**. A tax reference number alone does not show that Nabhold is registered as an employer.

Recommendation for the ADR to weigh: **A or C**, not B. Under any option payroll approval is separate from payment release, a practitioner signs the test vectors, and a person's employment record never implies system access. Headcount and the date payroll is needed (not yet given) decide between A and C.

## 6. Proposed sequence

| Phase | Work | Exit criterion |
|---|---|---|
| E0 | Live iDempiere in CI; one real read and one idempotent write; REST plugin installed and recorded; stale conformance entries corrected | Conformance ledger shows a live-proven route |
| E1 | Shared: finance namespace ADR and contracts for ledger read, journal command, statements (G03 PRs `SH-NAB-FIN-01`). ERP: Nabhold baseline intake and ZA localisation | Finance owner signs the baseline; contracts merged |
| E2 | Ledger read, journal command, trial balance, statements, period lock, tie-out (items 2, 3) | Finance officer signs a reproducible Nabhold trial balance from the real provider |
| E3 | AP, bank reconciliation, budgets, expenses (4, 6, 7, 9) | One vendor bill paid and reconciled end to end |
| E4 | SaaS receivable path (5) with Subscriptions and Payments, after those have production providers | Reconciled test invoice to cash in non-production (R2 gate) |
| E5 | Procurement and fixed assets (10, 11) | One purchase-to-asset lifecycle tied to the ledger |
| E6 | HR and time (12, 13) after the ERP ADR | Real leaver revokes IAM and Control Plane access |
| E7 | Payroll (14) per the chosen option | Practitioner-signed parallel run |
| E8 | Reporting export, then consolidation (15, 16) | Group controller signs a source-reconciled report |

E0 to E2 is the minimum for **R1 finance**. E4 is a **hard R2 prerequisite**. E1 to E3 can proceed in parallel with the IAM and CMS work.

## 7. ERP ADRs and Shared decisions needed

From masterplan §9.3, plus items this survey found:

- `ADR-ERP-NEXT-NABHOLD-ZA-FINANCE-BASELINE` (baseline, real adapter, closing)
- `ADR-ERP-NEXT-CORPORATE-PROCURE-TO-PAY`, `ADR-ERP-NEXT-FIXED-ASSETS-CUSTODY`
- `ADR-ERP-NEXT-SAAS-REVENUE` (invoice, AR, payment, VAT, refund, deferred revenue)
- `ADR-ERP-NEXT-PAYROLL-JOURNAL`
- **New:** an ERP ADR amending the HR and payroll scope decision in section 5
- **New:** a decision on whether the existing `invoice-outcome` is widened or a separate receivable outcome is created (it requires `commerce_order_id` today)
- Shared: finance, workforce, payroll, procurement and asset namespace ADRs (G03), with the rule from the masterplan that screens do not each get a key

## 8. What Nabhold needs from ERP, release by release

| Release | ERP dependency |
|---|---|
| R0 | none |
| R1 finance | E0 to E2 minimum; E3 for payables and bank |
| R1 HR / payroll | E6, E7 and the section 5 decision |
| R2 | E4, plus Subscriptions and Payments production providers |
| R3 | E8, plus subsidiary data agreements (D-07) and the consolidation model (D-08) |

## 9. Decisions and inputs still needed

1. HR and payroll option (section 5), **headcount**, pay frequency and pay date. Headcount is still not given.
2. The accounting decisions Brian Nabusiu will be asked to approve: chart of accounts, accounting schema, costing method, effective date. He is the sole director, not necessarily an accountant; the masterplan expects policy-bearing choices (depreciation, capitalisation, VAT) to be reviewed by a qualified accountant or tax practitioner, with him approving.
3. Whether the Nabhold ledger lives in a dedicated AD_Client (ADR-ERP-021 says one per legal entity) and in which region (blocked by D-14, no AWS account yet).
4. Evidence for the VAT and tax reference statements, and whether Nabhold is or will be registered as an employer (PAYE, UIF, SDL, COIDA).
5. **The Subscriptions-to-ERP hand-off owned by `baobab-cp`.** Control Plane ADR-BCP-007 says it SHALL NOT proxy the business request or become a universal proxy. The workable reading is: CP owns the *authority and routing* (which legal entity and ERP assignment receive the invoice, which binding applies, whether the subscription is entitled and classified), while the invoice itself moves from Subscriptions to ERP as a canonical event. If instead CP is meant to carry the invoice, that contradicts ADR-BCP-007 and needs a CP ADR first. Shared ADR-SHARED-033 (proposed) section 9 carries this as an open decision.

## 10. Risks

- **Everything is unproven against a real iDempiere.** Estimates will move once E0 runs.
- The REST API plugin is third-party and not in the pinned image; the integration layer depends on it.
- Statutory payroll and VAT errors carry legal and financial penalties; they need specialist sign-off, not test coverage alone.
- The open provider PRs and the unreconciled older buyer-profile stack (#32 to #35) may overlap new finance work; re-check open ERP PRs before starting each phase.
