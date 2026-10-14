# Nabhold Capability Demand Census — v2.0

**Masterplan:** NAB-GOLIVE-MP-001 v2.0  
**Baseline:** 14 October 2026  
**Purpose:** define what the non-trading Nabhold holding company consumes directly, conditionally or only through group reporting. This file does not create canonical keys.

## 1. Status model

- **C** — canonical in Shared.
- **P** — proposed/candidate, not canonical.
- **I** — provider repository publishes implementation evidence.
- **Q** — protected staging qualification.
- **A** — active for Nabhold in an accepted production context.

No capability in this census is A today.

## 2. Direct provider/engine map

| Engine/domain | Nabhold direct? | Planned purpose |
|---|---|---|
| IAM | Yes | human login, federation, workload tokens, lifecycle/revocation |
| CMS | Yes | corporate public/editorial content |
| ERP | Yes | corporate finance, accounting, procurement, expenses, assets, projects, workforce/payroll boundary |
| Pulse | Yes, governed | evidence, research and executive intelligence |
| Subscriptions | Yes | internal product entitlement/metering and R2 customer subscriptions/billing |
| Payments | Yes | R2 collections, refunds, settlement/reconciliation |
| Regulations | Conditional | regulatory requirement/evidence/decision support |
| Trade | No by default | subsidiary goods commerce only |
| Trade Docs | No by default | subsidiary trade-document operations only |
| TMS | No by default | subsidiary logistics only |
| SCF | No by default | future decision if Nabhold enters central financing; not current operating model |

Nabhold may consume authorised aggregate/reporting outputs from subsidiary domains under R3 without acquiring their mutation capabilities.

## 3. Current Shared canonical catalogue — 22 keys

| Canonical key | Nabhold use | Provider state at baseline |
|---|---|---|
| billing.subscription.manage | Direct R2/internal entitlement path | Subscriptions IMPLEMENTED; simulated provider; production_permitted=false |
| billing.usage.record | Direct server-side metering | IMPLEMENTED; simulated provider |
| commerce.cart.manage | No | Trade/subsidiaries |
| commercial.quotation.manage | No | Trade/subsidiaries |
| commercial.rfq.manage | No | Trade/subsidiaries |
| content.entry.resolve | Direct R0+ | CMS PARTIAL; production_permitted=false |
| customer.buyer-application.manage | No | Subsidiary commerce |
| customer.buyer-membership.manage | No | Subsidiary commerce |
| finance.order-consequence.process | No | ERP PARTIAL; goods-order consequence |
| identity.authentication.perform | Direct R1-R3 | IAM PARTIAL |
| identity.workload-token.issue | Direct server-side R0-R3 | IAM PARTIAL |
| intelligence.evidence.search | Direct/conditional R3 | Pulse IMPLEMENTED source |
| intelligence.research-mission.manage | Direct/conditional R3 | Pulse IMPLEMENTED source |
| inventory.availability.query | No | ERP IMPLEMENTED source; goods inventory |
| payment.intent.cancel | Direct R2 | Payments IMPLEMENTED; sandbox provider; production_permitted=false |
| payment.intent.create | Direct R2 | sandbox only |
| payment.payment.authorize | Direct R2 | sandbox only |
| payment.payment.capture | Direct R2 | sandbox only |
| payment.refund.create | Direct R2 | sandbox only |
| regulations.decision.evaluate | Conditional | Regulations PARTIAL |
| regulations.evidence.assess | Conditional | Regulations PARTIAL |
| regulations.requirement.resolve | Conditional | Regulations PARTIAL |

## 4. R0 Institutional

| Journey | Capability | State / gap |
|---|---|---|
| Home, group profile, navigation, footer, settings | content.entry.resolve | C; CMS PARTIAL; needs Organisation-first convergence and live qualification |
| Portfolio public narrative | content.entry.resolve | C; CMS content references CP IDs, never creates ownership truth |
| Insights/articles | content.entry.resolve | C |
| Publication lifecycle | candidate contract needed if resolve alone is insufficient | P |
| Media management | candidate contract/domain review | P |
| Signed preview | candidate contract/domain review | P |
| Legal/privacy content | CMS editorial + approved legal text | Business approval required |

## 5. R1 Corporate — identity

| Operation | Capability/status |
|---|---|
| Human sign-in/federation | identity.authentication.perform — C, IAM PARTIAL |
| Server workload token | identity.workload-token.issue — C, IAM PARTIAL |
| Human provision | identity.human.provision — IAM P |
| Human disable | identity.human.disable — IAM P |
| Session revoke | identity.session.revoke — IAM P |
| Workload provision/disable/rotate | IAM P |
| MFA/step-up | protocol/assurance policy; domain action still authorises |

## 6. R1 Corporate — finance

ADR-SHARED-033 remains Proposed. Its inventory is preferred but not canonical.

### F1 — first priority
- finance.ledger.read — P
- finance.journal.manage — P
- finance.statement.read — P

### F2
- finance.payable.manage — P
- finance.receivable.manage — P
- finance.bank-reconciliation.manage — P
- finance.cash-position.read — P
- finance.expense.manage — P
- finance.budget.manage — P

### F3
- finance.reporting-export.create — P
- finance.project-cost.read — P
- finance.consolidation.run — P

Existing finance.order-consequence.process is not a substitute for corporate GL/AP/AR.

## 7. R1 Corporate — workforce and payroll

Exact keys are intentionally not coined here because Shared has not registered workforce/payroll domains.

Required semantic operations:

### Workforce/HR
- employee/work relationship;
- position/reporting line;
- joiner/mover/leaver;
- leave/absence;
- attendance/time where required;
- compensation inputs/benefits;
- employee documents;
- manager approvals;
- IAM deprovision signal.

### Payroll
- payroll period;
- earning/deduction inputs;
- statutory calculation provider;
- draft/review/approve/finalise run;
- payslip access;
- employer/statutory exports;
- ERP aggregate liability posting;
- treasury/payment handoff;
- correction/reversal.

The estate must consume these through the accepted ERP/domain boundary, not a vendor-specific payroll API.

## 8. R1 Corporate — procurement, expenses, projects, assets

Required operations, pending canonical Shared contracts:

- requisition;
- purchase approval/order;
- supplier reference;
- receipt/service confirmation;
- vendor bill;
- employee expense;
- project/cost-centre;
- asset register;
- depreciation;
- custody;
- transfer/disposal.

These are Nabhold's own corporate administration and are not Trade RFQ/cart capabilities.

## 9. R2 Platform Commercial

### Existing canonical
- billing.subscription.manage — C/I simulated
- billing.usage.record — C/I simulated
- payment.intent.create/cancel — C/I sandbox
- payment.payment.authorize/capture — C/I sandbox
- payment.refund.create — C/I sandbox

### Required future semantics
- product/price catalogue;
- invoice/read/outcome;
- credits;
- dunning;
- billing reconciliation;
- payment settlement;
- payment reconciliation;
- disputes/chargebacks;
- merchant readiness.

No production monetary release while the relevant providers remain simulated/sandbox or production_permitted=false.

## 10. R3 Group Oversight

Required composition:

1. CP-authorised portfolio projection — administrative/read-model contract, not a wildcard business key.
2. ERP reporting exports and later consolidation.
3. Domain-owned subsidiary aggregate metrics under explicit reporting grants.
4. Pulse intelligence.evidence.search — C/I.
5. Pulse intelligence.research-mission.manage — C/I.
6. Future canonical portfolio summary if Shared accepts one.
7. Regulations requirement/evidence/decision — C/PARTIAL, conditional on verified source coverage.
8. Governance/risk/documents domains after semantic ownership is accepted.

Group reporting must preserve entity, period, currency, source, freshness and permission provenance.

## 11. Governance/documents/notifications gap

The following business needs have no accepted canonical owner/provider yet:

- board and committee matter management;
- resolutions/approvals;
- capital allocation;
- risk register;
- policy acknowledgement;
- corporate records/documents;
- retention/legal hold;
- notifications/action tasks.

G03 must decide domain ownership before any capability key or provider implementation.

## 12. Current direct-use summary

| Class | Count / note |
|---|---|
| Current canonical keys | 22 |
| Direct Nabhold current keys | 12 |
| Conditional Regulations keys | 3 |
| Current canonical keys not directly consumed | 7 |
| Corporate finance proposed keys | 12 under ADR-SHARED-033 |
| Workforce/payroll/procurement/assets/governance future operations | semantic review required |
| Active Nabhold production bindings proven | 0 |

## 13. Invariants

1. A key in this file is not canonical unless Shared registers it.
2. Provider IMPLEMENTED does not mean certified/active.
3. Nabhold does not inherit subsidiary operational capabilities.
4. R3 aggregate visibility does not grant mutation permission.
5. Provider/vendor names remain behind canonical contracts.
6. The browser never supplies business authority.
7. Every production capability must pass the masterplan's capability-specific G02F/G16/G17 path.
