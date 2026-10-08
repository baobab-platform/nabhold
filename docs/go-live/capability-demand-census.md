# Capability demand census

Masterplan work item 04 (G03 input). It lists what the Nabhold estate would consume, per journey, and where each capability stands. It creates no canonical key and proves no provider support.

**Baseline:** NAB-GOLIVE-MP-001 v1.0 §4, Shared catalogue at `shared@70f92ee` (22 canonical keys). Refresh at each gate.

**Status codes**

- `C` canonical: the key is in the Shared catalogue.
- `P` proposed: a candidate name only, not in the catalogue.
- `A` active: registered, healthy, bound and entitled for Nabhold. **No row is `A` today.**
- `–` no capability needed, or not a Nabhold direct operation.

**Provider support** is what the provider repo declares on 8 October 2026. A declaration is not certification and not an active binding.

## Sponsor direction on providing engines

On 8 October 2026 the sponsor stated that Nabhold will consume from the IAM, CMS, ERP and Pulse engines, including finance, accounts, HR and payroll. So, for the R1 rows below, the intended provider is the ERP engine for `finance.*`, `procurement.*`, `asset.*`, `workforce.*` and `payroll.*`; IAM for `identity.*`; CMS for `content.*`; Pulse for `intelligence.*`. This is intent, not a decision: see `register.md` section 5. The status codes below do not change.

## R0 Institutional (public)

| Journey | Capability | Status | Provider support | Nabhold code today |
|---|---|---|---|---|
| Home, group profile, navigation, footer, site settings | `content.entry.resolve` | C | CONTRACTED, no HTTP surface | `CorporateContentGateway` over Payload REST, direct via `PAYLOAD_BASE_URL` |
| Portfolio and sector pages (editorial) | `content.entry.resolve` | C | as above | same gateway |
| Insights and articles | `content.entry.resolve` | C | as above | same gateway |
| Publish and unpublish with cache invalidation | `content.publication.manage` | P | none | `/api/revalidate` with shared secret |
| Media (logos, photography) | `content.media.manage` | P | none | `next/image` allow-listed to the Payload origin |
| Signed draft preview | `content.preview.issue` | P | none | none |
| Contact and careers forms | none identified | – | – | not built; needs approved content and a data-processing decision (POPIA) |
| Privacy, terms | none (CMS content) | – | – | not built; needs legal-approved text |

## R1 Corporate (protected workspace)

| Journey | Capability | Status | Provider support | Notes |
|---|---|---|---|---|
| Sign in, session, logout | `identity.authentication.perform` | C | PARTIAL (Kratos, Keycloak) | `getSession()` is preview-only |
| BFF token to Control Plane and providers | `identity.workload-token.issue` | C | PARTIAL (Hydra) | `CapabilityClient` has the seam; no token provider |
| Context and capability resolution | CP administrative contract, not a catalogue key | – | Control Plane | `CapabilityClient` implemented, unused by pages |
| Disable a leaver, revoke sessions | `identity.human.disable`, `identity.session.revoke` | P | none | G04 and G07 |
| Ledger, statements, cash | `finance.ledger.balance.read`, `finance.statement.read`, `finance.cash-position.read` | P | none; ERP has no corporate GL | G06 |
| Journals, AP, AR, bank reconciliation | `finance.journal.manage`, `finance.payable.manage`, `finance.receivable.manage`, `finance.bank-reconciliation.manage` | P | none | G06 |
| Budgets, project cost | `finance.budget.manage`, `finance.project-cost.read` | P | none | G06 |
| Requisitions, POs, receipts, suppliers | `procurement.*` | P | none | G09; not Trade RFQ |
| Expenses | `finance.expense.manage` | P | none | G09 |
| Fixed assets, depreciation, custody | `asset.*` | P | none | G09 |
| Employees, positions, leave, attendance | `workforce.*` | P | none; provider undecided | G07 |
| Payroll runs, payslips, statutory exports | `payroll.*` | P | none; provider undecided | G08 |
| Corporate documents | `documents.record.manage`, `documents.record.read` | P | none | G13 |
| Approvals and matters | `governance.*` | P | none | G13 |
| Notifications | `notifications.message.dispatch` | P | none | G13 |

## R2 Platform commercial

| Journey | Capability | Status | Provider support | Notes |
|---|---|---|---|---|
| Plans and subscriptions | `billing.subscription.manage` | C | IMPLEMENTED, simulated only | not production-permitted |
| Usage metering | `billing.usage.record` | C | IMPLEMENTED, simulated only | server-side service, not a browser call |
| Catalogue, invoices, credits, dunning, reconciliation | `billing.catalogue.manage`, `billing.invoice.read`, `billing.credit.adjust`, `billing.dunning.manage`, `billing.reconciliation.read` | P | none | G10 |
| Collections | `payment.intent.create`, `payment.intent.cancel`, `payment.payment.authorize`, `payment.payment.capture` | C | IMPLEMENTED, sandbox only | G11 |
| Refunds | `payment.refund.create` | C | IMPLEMENTED, sandbox only | dual approval required |
| Settlement, reconciliation, disputes | `payment.settlement.read`, `payment.reconciliation.read`, `payment.dispute.manage` | P | none | G11 |
| Customer support | `support.case.manage` | P | none | provider undecided |
| Service usage and health | `platform.service-usage.read`, `platform.service-health.read` | P | none | CP and Subscriptions projections |

## R3 Group oversight

| Journey | Capability | Status | Provider support | Notes |
|---|---|---|---|---|
| Portfolio and subsidiary list | CP authorised portfolio projection | – | not built | needs a Shared contract; no wildcard queries |
| Subsidiary performance | scoped aggregate projections from ERP/Trade | P | none | needs subsidiary data agreements (D-07) |
| Consolidation | `finance.consolidation.run`, `finance.intercompany.reconcile` | P | none | accountant-approved model required |
| Evidence and research | `intelligence.evidence.search`, `intelligence.research-mission.manage` | C | IMPLEMENTED in source; binding unverified | |
| Executive summary (Pulse prototype) | `intelligence.portfolio.summary.read` | P | none | current `/v1/executive-overview` call is not canonical (B-13) |
| Regulatory requirements and decisions | `regulations.requirement.resolve`, `regulations.evidence.assess`, `regulations.decision.evaluate` | C | PARTIAL, no verified ZA pack | conditional use only |
| Compliance calendar | `regulations.obligation.monitor` | P | none | manual reviewed register meanwhile |

## Not consumed by Nabhold's own legal entity

`commerce.cart.manage`, `commercial.quotation.manage`, `commercial.rfq.manage`, `customer.buyer-application.manage`, `customer.buyer-membership.manage`, `finance.order-consequence.process`, `inventory.availability.query`. Nabhold does not trade goods.

## Gap summary

| Group | Count | Meaning |
|---|---|---|
| Canonical keys Nabhold uses directly | 12 of 22 | 2 billing, `content.entry.resolve`, 2 identity, 2 intelligence, 5 payment |
| Canonical keys, conditional use | 3 | the regulations keys, only after verified ZA source packs |
| Canonical keys not used by Nabhold | 7 | listed above |
| Proposed candidate keys in masterplan §4 | 73 | ERP 20, workforce 8, payroll 8, billing 7, payments 4, Pulse 4, regulations 2, content 4, IAM 6, governance/records/support/platform 10. G03 may merge some. Each needs a census, a Shared ADR and a contract before any code consumes it. |
| Active bindings | 0 | none proven |

Counts were taken from the masterplan §4 tables on 8 October 2026 and must be re-derived when Shared changes.

## Findings

1. The only R0 dependency on an unbuilt capability is `content.entry.resolve`. R0 can ship on the transitional Payload gateway if the register records that as an accepted exception; that decision is open (D-15).
2. Every R1 operational function except sign-in rests on proposed keys with no provider. R1 cannot be declared complete from the estate side.
3. R2 depends on simulated providers. It stays disabled.
4. The Pulse prototype uses an endpoint outside the catalogue; it is fenced to R3 and labelled advisory.
