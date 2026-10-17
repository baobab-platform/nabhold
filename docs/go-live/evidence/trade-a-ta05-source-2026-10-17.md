# Independent Trade-A TA-05 engineering evidence

Date: 17 October 2026. Programme: Nabhold Go-Live v2.0 / EA v2.2 EA-R03,
LA-05 / Trade-A. Direction: implement engineering independent of #35.
Governing contract: Accepted Shared ADR-SHARED-039; Trade ADR-0010 §28,
ADR-0014 and ADR-0015. Nabhold remains a consumer/presentation boundary.

**Claim:** IMPLEMENTED Trade-A TA-05 source kernel and receipt hardening only;
not complete Trade-A enforcement or a Nabhold onboarding/identity exit.
**Evidence class:** Source and unit tests, with linked engine-local native
regression evidence; not L4 or live protected dependency qualification.
**Reviewer role/date:** automated engineering source/CI review, 17 October 2026;
independent programme/gate reviewer sign-off PENDING. Standing merge
instructions authorise source integration, not gate acceptance.
**Simulation/provider declaration:** actual disposable Medusa/PostgreSQL17
with explicitly synthetic CP authority for the TA-05 regression; no real
external-provider, legal, merchant or protected-runtime acceptance is asserted.
Nabhold P0-04/P0-04B operator identity and authority preparation remain separate.

## Source record

- Owning PR: [Trade #153](https://github.com/baobab-platform/baobab-trade/pull/153).
- Final reviewed head: `e4ac79b3bb75ba31dcdddd8d5d24bcf4ec15088f`.
- Merge: `5435e7bf3e5a056920fe5d95426abfb48b3b093e` (MERGED).
- Final-head checks: all 32 complete, 24 success and 8 applicable skips,
  no failures; both review findings resolved before merge.
- Actual Medusa/PostgreSQL17 migration/regression job `117325627123` passed,
  including the expanded class/type matrix and existing checkout COMMIT fence.
- Shared contract pin: `2f5a330fd09f1e62608ae7728897e35c053bf738` (unchanged).
- Migration: `Migration20261016140000`, new in the source PR.
- Local checks pass: 600 unit tests (18 PEP), 99 pinned Shared conformance
  tests, formatting, lint, typecheck and build/postbuild.
- Mandatory native CI: [39008448291](https://github.com/baobab-platform/baobab-trade/actions/runs/39008448291).

The two review defects are repaired: asynchronous receipt persistence errors
now return a safe 503 authority denial, and the PostgreSQL guard binds each
operation class to its cart/order/draft attribution. Native regression covers
all three correct pairs and six wrong pairs via both store and direct SQL,
without counting uniqueness/expiry errors as the intended denial.

## Claim boundaries and next work

This is an engine-owned foundational source increment. Its real Medusa/
PostgreSQL regression uses explicitly synthetic CP authority. No dependency
on Infrastructure #35, staging credentials or AWS account inputs is required.
It is not L4, protected staging, legal/merchant evidence or Go-Live approval.
Nabhold remains a non-trading holding estate; Trade support does not turn it
into an operating seller or confer subsidiary/tenant authority.

TA-06 must wire every relevant native entry point, TA-07 must enforce native
COMMIT consumption and bypass closure, and TA-08 must prove acceptance.
Production and unknown runtimes remain denied. No grant, binding, workload
promotion, real mandate, estate feature or release is activated. G04/G05/G16/
G17/G18 and EA Gate B/D/E are unchanged. Finance F1 remains DRAFT source with
separate stewardship/native-provider prerequisites.

The source migration is repaired before release; never delete durable
receipt history to roll back an unreleased deployment. Keep protected denial
and withhold activation, or use an independently reviewed forward repair.
Merge authorisation is the user's standing instruction after CI/review; it
is not independent legal, Finance, domain or protected-release sign-off.
