# INT-02 prerequisite source — 16 October 2026

**Claim:** IMPLEMENTED prerequisite repairs and allocation only.
**Evidence class:** Source and unit tests; linked repository CI is not full L4 acceptance.
**Reviewer role/date:** automated engineering review, 16 October 2026;
programme/independent gate sign-off PENDING.
**Simulation/provider declaration:** tests use disposable synthetic identities,
relationships, grants and credentials. The Infrastructure provider is still a
synthetic resolution fixture; no protected, sandbox-vendor or production
provider acceptance is claimed here.

| Source | Immutable merge | Scope |
|---|---|---|
| CP #407 | `217a8ea946fb63533b3379a0fa79846f7976706c` | Current PRIMARY integrity for governed tenants; authoritative derivation when the optional caller hint is omitted; explicit legacy migration compatibility |
| CP #408 | `a795a8eb59a6083a3195060530af19d13ea03834` | Review correction: PRIMARY outages/integrity failures retain operational error categories instead of counting as cross-tenant attempts |
| IAM #117 | `70ec8555a040f068f9a5097eb2e6006e01d6f756` | Package the selected Baobab login/account theme through maintained upstream inheritance; type-specific CI inventory validation; MFA policy preserved |
| Shared #322 | `07bad90db360f03747c9165d60bbac5e35b0b319` | PROVISIONED development-environment Pulse test caller; canonical environment validation; no credential, tenant grant or workload activation |

Each prerequisite merged after mandatory CI passed and its review findings
were addressed. CP #407's late metrics finding was repaired by #408; both
commits are needed. The Shared base search scope has its existing CONFIDENTIAL
ceiling, not a PUBLIC-only promise; no RESTRICTED scope was allocated.

Infrastructure [#35](https://github.com/baobab-platform/infrastructure/pull/35)
adds the real confidential browser/code/S256/MFA candidate, independent callback
and token negatives, four-principal record isolation and actual canonical
workload-registry loading. The original profile did not configure CP's registry;
its historical workload observation cannot establish complete current-registry
or full INT-02 qualification. New candidates have failed at the browser form,
and the next real run must establish actual results before promotion.

The [Infrastructure closure register](https://github.com/baobab-platform/infrastructure/blob/feat/int-02-real-iam-cp-profile/docs/testing/int02-closure-2026-10-16.md)
is a moving implementation record, not immutable passed evidence. Accepted
runtime evidence must identify its exact harness/dependency pins and run ID.
No PASS is inferred from this link or from source tests.

## Remaining decisive exits

- Every mandatory real human/workload/current-authority/PRIMARY/market/isolation
  scenario must pass on the final exact source and image pins.
- L4-CP-02 needs an actual qualified provider, current readiness/health and
  binding/contract/market/instance/isolation negatives. A synthetic ACTIVE row
  cannot certify it.
- Shared's [provider qualification register](https://github.com/baobab-platform/shared/blob/07bad90db360f03747c9165d60bbac5e35b0b319/docs/architecture/int02-pulse-qualification-register.md)
  records the proof-bootstrap owner decision still needed. Its new caller is
  PROVISIONED, and the existing single evidence-producer exception is not
  silently extended.
- Then qualify INT-03 Nabhold BFF/CP/CMS and independently execute protected
  identity, binding, operational and release acceptance.

G04 source advances. Full INT-02, G05/R0, G16/G17 and G18 remain unaccepted.
Nabhold's own workload remains PROVISIONED. No executive Principal, real grant,
legal proof, binding, feature flag or release was activated by these repairs.
