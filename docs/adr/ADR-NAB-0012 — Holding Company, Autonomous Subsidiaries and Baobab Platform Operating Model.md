# ADR-NAB-0012 — Holding Company, Autonomous Subsidiaries and Baobab Platform Operating Model

**Status:** Proposed (not Accepted; requires the decision owners below)
**Date:** 2026-10-08
**Decision Owners:** Nabhold Group Africa board (company secretary to record)
**Repository:** `baobab-platform/nabhold`
**Masterplan:** NAB-GOLIVE-MP-001, gate G01
**Depends On:** ADR-NAB-0003, ADR-NAB-0005, ADR-NAB-0007, ADR-BCP-017, ADR-BCP-018

## Context

Nabhold Group Africa is registered as NABHOLD GROUP AFRICA (Pty) Ltd, `2026/029839/07`, South Africa, effective 16 January 2026 (see `docs/go-live/evidence/G01/production/2026-01-16-cipc-registration.md`). The masterplan describes it as holding company, intended Baobab IP owner and operator, and parent of ZuriBeans, Thamani and Equator & Estate.

Nothing in the repository yet records the legal basis for subsidiary autonomy, reserved matters, intercompany agreements or IP ownership. Frontend code could otherwise encode assumptions (for example that parent ownership implies data access).

## Decision (proposed)

1. **Operating entity.** The Nabhold estate and its INTERNAL Baobab subscription operate for the South African legal entity above, in market `ZA` only. It does not trade goods and holds no `SELLING_GOODS` participation.
2. **Ownership is not access.** A corporate-graph edge never grants a privilege. Group access needs the authenticated actor, a current relationship, an explicit scope, a capability entitlement, domain authorisation, data-classification clearance and a recorded purpose (masterplan §1.2).
3. **Subsidiary autonomy.** Each subsidiary controls its market participation, day-to-day decisions and operational data. Group reporting uses explicit, effective-dated, revocable data grants. A disposal ends future grants and preserves history.
4. **Platform commerce.** Nabhold's Baobab revenue is billed under contracts to be set by the commercial and legal decisions D-03 to D-06. The estate computes no price, tax or revenue.
5. **No assumptions in code.** Ownership percentages, IP title and intercompany terms are recorded as decisions with evidence, never inferred from repository names or CMS content.

## Open items that block Acceptance

| Item | Decision |
|---|---|
| Subsidiary incorporation, ownership and control | D-02 |
| IP ownership, licences, assignments | D-03 |
| Scope of Nabhold's own commercial offering | D-04 |
| Which subsidiary data group officers may view | D-07 |
| Treatment of a subsidiary after sale | D-18 |
| Director and company-secretary appointments, beneficial ownership | D-01 |

## Consequences

- Positive: the autonomy and access rules are explicit before any group-reporting code exists.
- Negative: this ADR cannot be Accepted until the open items have evidence. Group reporting (R3) stays disabled until then.

## Supersedes / amends

None. It extends ADR-NAB-0005 and ADR-NAB-0007 and amends neither.
