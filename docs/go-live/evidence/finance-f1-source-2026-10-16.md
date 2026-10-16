# Finance F1 — merged source evidence (16 October 2026)

**Programme:** NAB-GOLIVE-MP-001 v2.0, G03/G06, P1-01/P1-02.
**State:** DRAFT wire source merged; ERP provider and release acceptance pending.
**Dependency:** source engineering is independent of Infrastructure #35.
**Claim and scope:** IMPLEMENTED source schemas, validation and tests only; no
CERTIFIED, ACTIVE or provider PASS claim.
**Evidence class:** Source and unit tests. The linked Shared contracts remain
DRAFT; this record does not establish accepted canonical semantics.
**Reviewer role/date:** automated engineering source/CI review, 16 October 2026.
Shared/ERP contract stewards and programme gate reviewers: sign-off PENDING;
no human or domain acceptance is asserted.
**Simulation/provider declaration:** examples are synthetic and validation runs
offline. No live, sandbox or simulated Finance provider was exercised. The
separately linked Infrastructure observation is outside this Finance claim.

## Immutable source and CI pointers

| Evidence | Exact source / result |
|---|---|
| Shared #319 design checkpoint | [Merge `27eb77a`](https://github.com/baobab-platform/shared/commit/27eb77a367d6c9f2a2368cdffcae73cd5d544571); journal polarity/view review findings repaired; mandatory CI passed |
| Shared #321 wire tranche | [Merge `2aa057d`](https://github.com/baobab-platform/shared/commit/2aa057dcaa475450450ff1166e8e4c1cb8f5d33c); three DRAFT/EXPERIMENTAL capabilities; no provider declaration |
| Final tested PR head | `eee834ec4f97b93bb9f7975e3ea020de1e3cac28` |
| Canonical contracts | [Successful run 38936472044](https://github.com/baobab-platform/shared/actions/runs/38936472044), including actual Draft 2020-12 validation, canonical references, 26 examples and negative tests |
| Foundation definitions | [Successful run 38936472091](https://github.com/baobab-platform/shared/actions/runs/38936472091) |
| Foundation/security/runtime | [Successful run 38936472138](https://github.com/baobab-platform/shared/actions/runs/38936472138) |

The final PR head had 29 completed checks: 22 successful and seven expected
skips. Finance-specific local verification passed 19 canonical tests, eight
historical design tests and all 26 synthetic examples; the catalogue validates
25 keys, including the three new DRAFT entries. Pure-Python governance checks
were exercised locally; Ruby-backed checks passed in mandatory GitHub CI.

## What changed

- `finance.ledger.read`: explicit authorised book/period/as-of/currency, typed
  chart/balance/entry rows, bounded snapshot continuation, signed native
  correction history and exact historical FinanceBaseline references.
- `finance.journal.manage`: operation-specific create/transition inputs,
  positive/zero draft amounts, optimistic version/idempotency input, explicit
  accounting/reversal date and correcting-journal lineage.
- `finance.statement.read`: trial-balance versus policy statement lines,
  completeness, baseline provenance and required reconciliation lineage for a
  complete statement.
- Canonical ERP decimal/Money/ID/baseline and RFC 9457 references, offline
  validation, actual date-time/URI format checks, lock index and CI coverage.
- README, EA dashboard, Proposed ADR checkpoint, implementation register and
  explicit unexecuted provider acceptance plan.

The Shared [contract README](https://github.com/baobab-platform/shared/blob/2aa057dcaa475450450ff1166e8e4c1cb8f5d33c/contracts/finance/v1/README.md)
records semantics and rollback; its [implementation register](https://github.com/baobab-platform/shared/blob/2aa057dcaa475450450ff1166e8e4c1cb8f5d33c/docs/architecture/finance-f1-implementation-register.md)
records the independent lane and owner boundaries. Source comments explain why
wire validation cannot confer accounting or legal authority.

## Remaining owner tasks and gate disposition

1. Shared/ERP stewards resolve Proposed ADR-SHARED-033 and approve the actual
   resource-server scope/route, book/baseline and journal-event protocols.
2. ERP implements the accepted boundary against native accounting, durable
   state and exact current CP authority. No existing scope, role string,
   corporate relationship or request field may substitute for permission.
3. Real provider tests prove account/currency/period controls, balanced exact
   arithmetic, distinct maker/checker, idempotency/conflict, concurrency, native
   COMMIT/reversal, snapshot isolation and numerical trial-balance tie-out.
4. Independently qualify provider/binding, L4/protected staging and Finance,
   security and operational acceptance. Only then consider an R1 feature.

[The ERP-owned provider acceptance plan](https://github.com/baobab-platform/shared/blob/2aa057dcaa475450450ff1166e8e4c1cb8f5d33c/docs/architecture/finance-f1-provider-acceptance.yaml)
is REQUIRED_NOT_EXECUTED; it is not successful evidence. Event producer and
provider readiness are not inferred from a schema or DRAFT catalogue row.

G03 advances source only. G06 remains blocked for operational F1. No person,
credential, legal verification, Tenant, grant, binding, feature flag or release
was activated by this work. The Nabhold estate remains a presentation/consumer
boundary; no finance calculation or native posting is added here.

**Infrastructure #35:** unchanged by this increment. The existing pinned
`0f6cbac` real run proves only L4-IAM-02; the complete INT-02 profile remains
blocked. This source work does not waive any of its mandatory acceptance exits.
