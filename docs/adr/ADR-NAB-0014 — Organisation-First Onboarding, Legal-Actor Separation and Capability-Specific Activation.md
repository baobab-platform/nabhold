# ADR-NAB-0014 — Organisation-First Onboarding, Legal-Actor Separation and Capability-Specific Activation

**Status:** Accepted  
**Date:** 2026-10-14  
**Decision Owners:** Nabhold Group Africa / Baobab Platform Architecture  
**Repository:** baobab-platform/nabhold  
**Masterplan:** NAB-GOLIVE-MP-001 v2.0  
**Depends On:** ADR-NAB-0003, ADR-NAB-0004, ADR-NAB-0005, ADR-NAB-0006, ADR-NAB-0007, ADR-NAB-0012, ADR-NAB-0013, ADR-BCP-026, ADR-BCP-027, Baobab EA Implementation Plan v2.1  
**Decision Type:** Foundational amendment to Nabhold onboarding, tenancy, legal-actor and release-readiness semantics  

## 1. Context

The first Nabhold ADR series and Go-Live Masterplan v1.0 predated the accepted 9 October 2026 decisions ADR-BCP-026 and ADR-BCP-027. Those decisions establish progressive enterprise onboarding, Organisation-first tenancy, separate legal-actor mandates and capability-specific evidence/readiness.

The older Nabhold decisions remain sound where they establish capability-centric consumption, provider neutrality, subsidiary autonomy, accounting authority and no implied group access. They are no longer sufficient where wording can be read as making LegalEntity the universal tenant identity or a whole Tenant ACTIVE state the proof that every capability is production-ready.

## 2. Decision

### 2.1 Organisation is the enduring business identity

For Nabhold and every independently governed subsidiary/business:

- Organisation identifies the enduring business participant.
- Tenant is the isolated operating boundary.
- LegalEntity identifies an incorporated or otherwise recognised legal person.
- CorporateRelationship describes group/economic/legal affiliation when independently evidenced.
- OperatingLegalActorMandate describes when a legal person may act for a business for a specific role, activity, market and time period.

No one of these objects substitutes for another.

### 2.2 Option B is normative

Nabhold, Thamani and ZuriBeans SHALL retain independent Tenant identity where their governance/isolation requires it.

A subsidiary may:

- enter or exit markets independently;
- change providers/capabilities independently;
- later incorporate in another jurisdiction;
- leave the Nabhold group.

Those transitions SHALL NOT require destroying or reminting the Organisation or Tenant.

### 2.3 Legal incorporation is additive

An operating business may have an Organisation and Tenant before it has a separately incorporated company when platform policy permits.

When ZuriBeans completes incorporation, the new LegalEntity is linked to the existing ZuriBeans Organisation. Historic transactions remain attributed to the legal actor that actually applied at the time.

### 2.4 Group relationship is not authority

Ownership, control, group membership, founding sponsorship, PlatformAccount linkage or INTERNAL classification SHALL NOT create:

- IAM membership;
- cross-tenant read/write access;
- legal-actor authority;
- capability grants;
- provider bindings;
- financial consolidation permission.

Every consequential use requires its own current authority.

### 2.5 Progressive onboarding replaces the linear legal-entity-first interpretation

The canonical Nabhold onboarding sequence is:

1. authenticated applicant/sponsor;
2. progressive ClientApplication v2;
3. truthful business identity;
4. PRIMARY Organisation;
5. independent review and AdmissionDecision;
6. Organisation-bound TenantOnboardingRequest v2;
7. independent request authorisation;
8. progressive Tenant registration;
9. PRIMARY Organisation mapping;
10. optional DEFAULT LegalEntity mapping where justified;
11. INTERNAL/product/DigitalEstate desired state;
12. capability-specific qualification;
13. protected staging;
14. production authorisation.

The state after step 9 is identity/tenant acceptance, not production activation.

### 2.6 Legal actor is operation-specific

A Tenant does not universally have one legal actor for every operation.

Where an operation requires a legal person, CP/domain authority SHALL resolve an accepted effective-dated mandate for the exact activity, role, market and time. Missing, expired or ambiguous authority blocks only the dependent operation unless policy says otherwise.

The browser may never choose an unrestricted legal actor.

### 2.7 Capability activation is independent

No global ACTIVE Tenant state may be interpreted as proof that CMS, ERP, IAM, Subscriptions, Payments, Pulse or Regulations are all available.

For each enabled capability, the system SHALL independently establish:

- canonical contract;
- provider support and contract version;
- workload/human identity;
- entitlement/grant;
- binding;
- context;
- legal actor if required;
- provider/release/instance readiness;
- protected staging acceptance;
- operational certification.

### 2.8 Nabhold is a non-trading holding-company consumer

Nabhold SHALL NOT directly adopt Trade, inventory, logistics or trade-document mutations merely because its subsidiaries do.

It MAY consume authorised aggregate/reporting outputs from subsidiary domains for group oversight and MAY consume corporate procurement/asset functionality from ERP for its own administration.

A later decision to operate central goods trading, logistics or supply-chain finance requires an explicit ADR/masterplan amendment.

## 3. Current founding-group interpretation

| Business | PRIMARY Organisation | Tenant | Legal-person posture |
|---|---|---|---|
| Nabhold | Nabhold Organisation | independent Nabhold Tenant | ZA company, independently verify for consequential use |
| Thamani | Thamani Organisation | independent Thamani Tenant | ZA company; verify incorporation and Nabhold control separately |
| ZuriBeans | ZuriBeans Organisation | independent ZuriBeans Tenant | incorporation pending; no fabricated company |
| Equator & Estate | Equator & Estate Organisation | independent Tenant where justified | no separate incorporated company asserted without evidence |

## 4. Amendments and supersession

This ADR **amends** the following accepted Nabhold ADRs without discarding their other decisions:

- **ADR-NAB-0003:** any diagram or lifecycle implying Tenant identity derives universally from LegalEntity, or that one Tenant ACTIVE state proves platform readiness, is superseded by Organisation-first and capability-specific readiness.
- **ADR-NAB-0004:** protected context is Organisation/Tenant-first. LegalEntity/legal actor is resolved only where relevant; identity never inherits group authority.
- **ADR-NAB-0005:** group portfolio scope begins from canonical Organisation and effective-dated relationship authority, not a legal-entity graph alone.
- **ADR-NAB-0006:** server-side composition must carry trusted Organisation/Tenant context and operation-specific legal actor only when required.
- **ADR-NAB-0007:** legal-entity reporting remains authoritative for accounting, but Tenant identity and portfolio membership are not inferred from one LegalEntity mapping. Group reporting requires separately authorised portfolio scope.

ADR-NAB-0012 and ADR-NAB-0013 are accepted alongside this amendment and interpreted through it.

## 5. Required negative tests

The programme SHALL prove at least:

1. Nabhold ownership does not grant Thamani/ZuriBeans Tenant access.
2. A Tenant without a LegalEntity can exist where admission policy permits.
3. An operation needing a legal actor fails when mandate is missing/expired/ambiguous.
4. Adding a new LegalEntity does not change OrganisationID/TenantID.
5. A subsidiary exits the group without losing historic records or its Tenant.
6. One qualified capability does not activate another.
7. Browser-supplied tenant/legal-actor/provider values cannot create authority.
8. Historical invoices/transactions retain the legal actor effective at transaction time.

## 6. Consequences

Positive:

- preserves subsidiary autonomy and future market expansion;
- avoids rebuilding identity when corporate form changes;
- makes group oversight explicit and revocable;
- prevents whole-tenant readiness shortcuts;
- aligns the estate with accepted platform architecture.

Trade-off:

- onboarding and go-live have more explicit states;
- consumers must handle partial capability readiness;
- legal actor and group reporting require stronger evidence and as-of semantics.

## 7. Final decision

Nabhold adopts Organisation-first progressive onboarding, separate legal-actor authority and capability-specific production activation as mandatory architecture.

Any older Nabhold wording is subordinate to this ADR where the two conflict.
