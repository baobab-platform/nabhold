# ADR-NAB-0013 — Corporate Capability Consumption, Required Product Compositions and Rollout Classification

**Status:** Accepted  
**Date:** 2026-10-14  
**Decision Owners:** Baobab Platform Architecture / Nabhold Digital Estate  
**Repository:** baobab-platform/nabhold  
**Masterplan:** NAB-GOLIVE-MP-001 v2.0  
**Depends On:** ADR-NAB-0003, ADR-NAB-0006, ADR-NAB-0014, ADR-BCP-003, ADR-BCP-007, ADR-BCP-026, ADR-BCP-027, ADR-SHARED-017  

## 1. Decision

### 1.1 Release classes

Nabhold ships four independently controlled release classes:

- R0 — Institutional public estate;
- R1 — Nabhold corporate operations;
- R2 — Baobab commercial subscriptions/services;
- R3 — authorised group oversight.

Server-side flags may technically expose a release class, but a flag is not acceptance. Every release still needs masterplan G17 evidence and a signed GO.

### 1.2 Capability-only business integration

The estate SHALL consume a business operation only when its key is canonical in Shared or when the operation is a documented Control Plane administrative contract.

Candidate/proposed capability names SHALL NOT be used in production clients.

### 1.3 Control Plane resolution

Provider selection, binding and readiness are resolved by the Control Plane. The estate SHALL NOT select an engine/provider from tenant, market, legal entity or group membership.

### 1.4 Organisation-first context

Protected requests SHALL use trusted Organisation/Tenant context. LegalEntity/legal actor is included only where required by the operation and must be resolved from accepted authority, never an unrestricted browser field.

### 1.5 Capability readiness states

The programme distinguishes:

- canonical contract;
- provider source support;
- provider certification;
- grant/entitlement;
- binding;
- IAM/context authority;
- protected staging;
- production activation.

No global Tenant ACTIVE state collapses these dimensions.

## 2. Direct engine consumption

Nabhold is expected to consume:

| Engine | Purpose |
|---|---|
| IAM | human/workload authentication and lifecycle |
| CMS | public/editorial corporate content |
| ERP | finance, accounts, procurement, assets, projects, workforce/payroll boundary |
| Pulse | governed executive evidence/research/intelligence |
| Subscriptions | internal product entitlement and R2 subscription/billing |
| Payments | R2 collections/refunds/settlement |
| Regulations | conditional regulatory requirement/evidence/decision support |

Trade, Trade Docs, TMS and SCF are not default direct Nabhold dependencies because Nabhold is a non-trading holding company. R3 may consume authorised aggregates from subsidiary domains.

## 3. Current canonical keys

Nabhold may directly/conditionally use the following current Shared keys:

- content.entry.resolve;
- identity.authentication.perform;
- identity.workload-token.issue;
- billing.subscription.manage;
- billing.usage.record;
- payment.intent.create;
- payment.intent.cancel;
- payment.payment.authorize;
- payment.payment.capture;
- payment.refund.create;
- intelligence.evidence.search;
- intelligence.research-mission.manage;
- regulations.requirement.resolve;
- regulations.evidence.assess;
- regulations.decision.evaluate.

Commerce, buyer, goods-order and inventory keys are not Nabhold direct operations.

## 4. Future corporate capability programme

Corporate finance begins with ADR-SHARED-033's proposed F1/F2/F3 inventory and becomes consumable only after individual Shared contract promotion.

Separate Shared decisions are required for workforce, payroll, procurement/assets, governance/documents/notifications, advanced billing/payments and group-reporting projections.

The estate SHALL not pre-empt those semantic decisions.

## 5. Transitional provider adapters

Direct Payload and noncanonical Pulse prototype integrations may exist only as explicit, bounded migration/development paths. A production exception requires a dated approval and removal plan.

## 6. Supersession

This Accepted revision supersedes the Proposed 8 October 2026 ADR-NAB-0013.

It is amended by ADR-NAB-0014 for Organisation-first and capability-specific activation semantics.

## 7. Final decision

Nabhold owns experience composition. Shared owns capability semantics. CP owns runtime authority. Domain engines own business truth. Providers remain replaceable behind canonical contracts.
