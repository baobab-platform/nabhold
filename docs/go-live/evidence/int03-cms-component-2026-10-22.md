# CMS component and pre-gate engineering reconciliation — 22 October 2026

Accepted Nabhold Go-Live Masterplan v2.0 and Accepted Shared EA v2.3 govern this
receipt. EA v2.3 retains v2.2's normative L4 matrix. Evidence classes remain
separate: source tests, actual component execution, connected qualification,
protected acceptance and production certification.

**Record class:** source/unit implementation evidence plus actual CMS/PG17
component interoperability on disposable synthetic Actions data, and a separate
bounded real IAM/CP identity smoke. The CMS component uses no simulated CMS
provider; the reported identity smoke uses real IAM/CP dependencies. No full
connected IAM/CP/CMS NAB-03 qualification has run, and all 14 cases remain BLOCKED.
**Verifier/reviewer role and date:** Codex automated engineering implementer,
22 October 2026 UTC. This same implementation agent downloaded the archives and
recomputed their hashes independently of GitHub's reported digest values. It is
not an independent human security/operations reviewer and has not signed a
release acceptance. Independent gate-review sign-off remains **PENDING**.

## Immutable source audit

| Repository | Observed main | Relevant merged work |
|---|---|---|
| Shared | `135da2d336b4afefd9f338f548fb22bd8eed43d2` | #354 Accepted decision at `409d780d05f7825ab1228649541032d42a7b0b13`; CMS activation still held |
| Infrastructure | `9c1e44314ccc8c58730f164b3b4811625559fa64` | #38 supported Go security patch; #39 actual CMS component provider |
| IAM | `b439970d86a5ae0393753160dd0b24646e385c51` | #130 strict issuer/service-account read-back; #132 verified native short token lifetime |
| CMS | `a712797177924c875e50ed63a9c01ec34bd632c8` | #42 authority fix; #43 estate profiles; #44 real fixture CLI; #46 bounded external reference handoff; #47 native client authentication |
| Nabhold | `ece3cb47bf576f241ec75d41b14fd32a325b94c8` | #83 current same-principal token/context source; #85 tenant guard; #86 native client authentication |
| CP | `9cd1223e012b47f0be2e3f7a75ccc9b98d95b0c8` | #425 patched Go/Vite dependencies; existing context, topology and independent certification interfaces remain authoritative |
| ERP | `856c02343de499fa2ce287fe6238c2e097fd933e` | #110 Accepted first-party People direction and PG17 Gate D repair; no workforce/payroll provider acceptance |

Shared #356 was closed unmerged. Neither named CMS identity appears in the
committed workload registry at this audit. The latest Shared delta adds
commercial actor contracts/registry field documentation; it does not activate
CMS, confer Nabhold trading authority, or release the hold. Do not copy a dirty
working registry or advance a consumer pin to an unmerged activation proposal.

## Completed source and component work

- CMS uses Node 24, approved pinned dependencies, PostgreSQL 17 with committed
  migrations and schema push disabled. Roleless publication/deletion bypasses
  are closed. Nabhold editorial seeding remains draft-only and production
  restrictions remain in force.
- Reusable configuration-driven estate profiles scope tenants, organisations,
  markets and digital estates independently. The synthetic development profile
  detects duplicate/orphan/foreign ownership before writes, supports idempotent
  CMS-owned publication, withdrawal and draft fixtures, and scoped cleanup.
  Canonical references remain `UNRESOLVED` until CP issuance. An externally
  supplied reference declaration is explicitly unverified and proves no issuance.
- Infrastructure #39 source-builds real CMS and tools on Node 24, uses private
  disposable PG17 storage, verifies migrations, probes liveness/readiness/content
  routes and anonymous denial, and exercises actual database outage/recovery.
  Receipts include source/image/runtime provenance and teardown observations.
  Success, failure and interruption share owner-scoped cleanup.
- IAM #132 adds optional 1–300-second native token lifetimes with independent
  issuer GET verification and preserved ceilings across rotation/disable. The
  ordinary provisioning CLI refuses both named CMS profiles. Existing actual
  native provider regressions pass; no named CMS identity is created.
- Nabhold and CMS opt-in development workload clients support the maintained
  native `client_secret_post` method. Current same-principal CP context and
  independent audience boundaries remain required; no audience widening occurs.

All merged increments passed their mandatory checks and final-head review.
Actual fixture publication is disposable CMS engineering data, not human
editorial approval or an independently certified provider.

## Downloaded-artifact hash verification (engineering)

[Infrastructure Actions run 39667309644](https://github.com/baobab-platform/infrastructure/actions/runs/39667309644)
passed the final #39 component and selected identity/prerequisite regressions.
The PR source head was `1bf76f3e118368a26ac8e2ebd81d39314c75855c`; Actions tested
merge revision `5125a72db8ec811b745373767d1d1d7b6f6ceb16`. The merged main revision
is recorded separately above; these revisions are not interchangeable.

| Evidence | Artifact ID | Downloaded ZIP SHA-256 | Enclosed receipt SHA-256 |
|---|---|---|---|
| Actual CMS/PG component, job `119456423066` | `12377044343` | `cc5d3d581182a42a5751bf43b795600019f6a19f6f739e7feb708cd4af1cb342` | `8110ba3d951821095ace9b6235f70b79408da3219e6f835406023c06e71ae3d1` |
| Selected identity smoke, job `119456423025` | `12377994259` | `729f86ecb9e4b392da182a4b7fd46ad8449fb993d0b04f631bb322d2c2c35b31` | `5605fb7a559684f9006e75a8c94849f4f82e9e113e687dc0d94efe3728ad00dd` |

Retained custody is GitHub Actions in `baobab-platform/infrastructure`, run
`39667309644`, not this agent's temporary workspace:

| Archive | Retained custody reference | Enclosed receipt path |
|---|---|---|
| Component | [artifact 12377044343](https://github.com/baobab-platform/infrastructure/actions/runs/39667309644/artifacts/12377044343) | `cms-component-bfc0544a88aa04c1/completed/receipt.json` |
| Identity | [artifact 12377994259](https://github.com/baobab-platform/infrastructure/actions/runs/39667309644/artifacts/12377994259) | `l4-19c5654f450e805c-int03-identity/completed/receipt.json` |

The artifact API reported both unexpired on 22 October, with expiry
`2026-11-05T20:05:44Z`. Beside each enclosed receipt is `receipt.sha256`.
The automated engineering verifier downloaded both ZIPs, recomputed their
SHA-256 values and checked each enclosed receipt against its sidecar. The
committed values above allow another reviewer to repeat that verification
while retained artifacts remain available. No separate immutable archive
custodian or independent gate-review sign-off is claimed; longer-term custody
and such sign-off remain outstanding acceptance work before artifact expiry.
This verification applies only to these artifacts. The earlier identity run
`39481595139` digest remains GitHub-reported, not downloaded/rehashed by this
reconciliation.

The component lock freezes Shared `409d780d05f7825ab1228649541032d42a7b0b13`,
CMS `8c84676cf6139cffd353a6940a006450f14667a4`, Nabhold
`9d96bd6c4ae6894c7c24a8d9bbd9cf467b2ce583`, IAM
`2ed3e3f5a14cedcd6cec9b964f3e00aca561342a` and CP
`3810b8222fa6df09b829e7c725d534af10b1155c`. Later source changes do not inherit
this runtime evidence. The component receipt reports component PASS, all 14
connected cases BLOCKED and `qualified=false`. Selected NAB-ID-01–04 and
teardown pass in the separate identity smoke; full INT-03 remains false.

## Outstanding engineering and held execution

| Work | State / required next evidence |
|---|---|
| Native named fixture preparation | IAM #133 is under CI/review; its secret-free plan and fresh-client read-back are source preparation only |
| Supervised identity lifecycle | Implement/review immutable creation deadline, response-window enforcement, early closure and destruction of all issuer trust/accepting runtimes |
| CP fixture topology and authority | Obtain actual CP-issued synthetic references, grants, current same-principal contexts, independent maker/checker certification and current health/binding through owning APIs |
| Full connected NAB-03 | Implement/execute all 14 actual IAM/CP/CMS cases after canonical activation; retain a verifiable complete receipt and successful cleanup |
| Registry activation | HELD; exact consumer/validator rows require the reviewed Shared activation process; no local activation |
| Protected native C4, executive authority and legal/onboarding | OPEN; component and identity smoke evidence do not satisfy these gates |
| Protected staging, production, R0–R3 | OPEN / production not authorised; release-specific external evidence, independent acceptance and activation remain required |

The 14-case pack must cover actual published content; audience/credential and
disabled/expired/revoked denial; missing grants; tenant isolation and wrong owner;
draft/preview restrictions; withdrawal; dependency outage/recovery; validator
negatives; and teardown. Test transports and copied JSON cannot stand in for
actual issuer/CP observations. CMS remains PARTIAL with
`production_permitted=false`; Nabhold remains non-trading. The Pulse-only
bootstrap exception cannot authorize CMS.
