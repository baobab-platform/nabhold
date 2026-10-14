# ADR-NAB-0012 — Holding Company, Autonomous Subsidiaries and Baobab Platform Operating Model

**Status:** Accepted  
**Date:** 2026-10-14  
**Decision Owners:** Nabhold Group Africa / Baobab Platform Architecture  
**Repository:** baobab-platform/nabhold  
**Masterplan:** NAB-GOLIVE-MP-001 v2.0, G01/G02/G12  
**Depends On:** ADR-NAB-0003, ADR-NAB-0005, ADR-NAB-0007, ADR-NAB-0014, ADR-BCP-017, ADR-BCP-018, ADR-BCP-026, ADR-BCP-027  

## 1. Decision

Nabhold adopts an autonomous-holdings operating model.

1. **Nabhold own identity.** NABHOLD GROUP AFRICA (Pty) Ltd operates its own Organisation and independent Baobab Tenant for its holding-company, employer, IP/platform-owner and approved corporate-services activities.
2. **Non-trading holding company.** Nabhold does not buy/sell subsidiary goods as its operating business. It does not directly consume Trade commerce, inventory, logistics or trade-document mutations by default.
3. **Autonomous subsidiaries.** Thamani, ZuriBeans and other independently governed businesses retain their own Organisation and Tenant boundaries. Each independently decides market entry/exit, business operations and capability adoption, subject to lawful reserved matters.
4. **Option B permanence.** Group membership is an effective-dated CorporateRelationship. A subsidiary can leave Nabhold without reminting its Organisation/Tenant or rewriting historical transactions.
5. **Legal persons are separate facts.** Nabhold and Thamani have documented ZA incorporation claims that require independent acceptance for consequential use. ZuriBeans remains an operating business while its incorporation process is pending; future ZA/UG LegalEntities are linked additively to its existing Organisation.
6. **Ownership is not access.** No group relationship grants IAM, Tenant, capability or data access. Group reporting needs explicit current grants, purpose and domain authority.
7. **Legal actor is scoped.** Nabhold may act as legal actor for another operating business only under an independently approved role/activity/market/time mandate and any required legal/provider permission.
8. **Group reporting is governed.** Parent dashboards use an authorised portfolio projection plus domain-owned aggregate/reporting capabilities. They do not wildcard-query subsidiary tenants.
9. **Exit/disposal.** Disposal terminates future group privileges and triggers classification/grant review while preserving historic relationship, accounting and audit evidence.
10. **Future regions.** A subsidiary incorporating in Uganda or another market creates a new jurisdiction-specific LegalEntity where independently established; it does not create a new business identity merely because jurisdiction changes.

## 2. Canonical model

    CorporateGroup
       |
       +-- Nabhold Organisation ---- Nabhold Tenant ---- Nabhold ZA LegalEntity
       |
       +-- Thamani Organisation ---- Thamani Tenant ---- ZA LegalEntity
       |                                               + future UG LegalEntity
       |
       +-- ZuriBeans Organisation --- ZuriBeans Tenant - future ZA/UG LegalEntities
       |
       +-- Equator & Estate Organisation --- independent Tenant where justified

## 3. Governance consequences

The group SHALL maintain effective-dated evidence for:

- ownership/control where relied upon;
- reserved matters;
- subsidiary autonomy;
- group reporting/data sharing;
- intercompany services;
- IP/licensing;
- legal-actor mandates;
- subsidiary admission, disposal and exit.

The Digital Estate SHALL not encode percentages, market membership or group access as frontend constants.

## 4. Production constraints

No production capability may infer:

- corporate control from a name or Shared role label;
- group access from parenthood;
- legal-person status from Tenant existence;
- seller/employer/importer/issuer status from business brand;
- INTERNAL entitlement from group affiliation alone.

## 5. Supersession

This version supersedes the Proposed 8 October 2026 text of ADR-NAB-0012.

ADR-NAB-0014 governs Organisation-first tenancy, legal-actor separation and capability-specific activation.

## 6. Final decision

Nabhold is a decentralised holding group on Baobab: common platform, explicit governance, independent operating businesses, separate tenant authority, and reversible group relationships.
