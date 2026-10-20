# Connected identity smoke — 20 October 2026

**Observed result:** PASS for NAB-ID-01–04 in the disposable real-component
synthetic profile. **Full INT-03 and all protected/release gates remain OPEN.**

This delta supersedes the unmerged/failed identity-smoke status in earlier
dated audits and register sections 25–29. It does not replace their history or
the normative Shared NAB-01–04/universal L4 matrix.

## Exact implementation and execution

| Item | Immutable reference |
|---|---|
| Infrastructure PR | [#37](https://github.com/baobab-platform/infrastructure/pull/37), merged `de1ced0c9cc1aba6f89caec0b337b48f097eb240` |
| Reviewed PR head | `75007b32379f6bb5efcbae1017b9ad27c37e8ff8` |
| Actual Actions checkout | `c7d5614075acb64249fe3f3c3bcb14fca88555b5` |
| Connected run / job | [39481595139](https://github.com/baobab-platform/infrastructure/actions/runs/39481595139) / `118831412470`, completed SUCCESS |
| Tested Nabhold source | `9f1f282272fca451f106a8d631ab45885ea48639` |
| Nabhold reviewed merges | [#80](https://github.com/baobab-platform/nabhold/pull/80) `7c950c7a92762a7478b87e68549c9114c76e20c3`; [#81](https://github.com/baobab-platform/nabhold/pull/81) `4b717cbcc7023551ad644dc2ecc8665e9f0eb186` |
| IAM / CP runtime pins | `63db55c87fda13762fc438a6d32a885a63ddb353` / `3810b8222fa6df09b829e7c725d534af10b1155c` |
| Shared runtime contract pin | `5b34b15b18361d43a9da9bec088771912c2b89c6` |
| Shared governance baseline | Accepted EA v2.3 / ADR-SHARED-036/041 at `ba5b4523ffc82cbf1b1d804b4d88ab69be04843a`; retained v2.2 normative L4 matrix |
| Retained artifact | [12292865811](https://github.com/baobab-platform/infrastructure/actions/runs/39481595139/artifacts/12292865811), `int03-identity-synthetic-observations`, 7,273 bytes |
| GitHub-reported archive SHA-256 | `84459bad8c68891d3f478c62e0178d2d1151e8a20cf2c275e53d1859db5ec6c9` |

The actual checkout's parents are the reviewed base
`84079fa6720da5e1dd5f14d9d0b0d3b0dd149f28` and final PR head.
Its tree `dc5c7258f180653d4c90be68c5c043dfc7593a06` equals the merged
Infrastructure tree. Nabhold's normal merges preserve both tested commits in
main history; the final tested source and merged main have no file differences.
No new source revision is silently substituted for a qualified pin.

The harness validates clean source checkouts, actual running estate revision,
built-versus-running image config IDs, declared dependency correspondence,
closed scenario coverage, process success and teardown before printing PASS.
Image config IDs remain distinct from OCI manifest digests.

The archive digest above agrees between GitHub artifact metadata and the upload
log. This environment had no local executor, so the archive/embedded sidecars
were **not independently downloaded and recomputed here**. Do not relabel this
check as an independent cryptographic attestation. The retained artifact expires
4 November 2026; evidence custody must preserve it under programme policy before
expiry if it will support later review. The runtime receipt is the scoped
harness observation, not a signed protected gate decision.

## What executed

The run uses the reviewed Codespaces integration devcontainer and actual pinned
IAM/CP/Pulse prerequisite profile, a separately registered synthetic non-admin
human, CP identity mapping, private HTTPS ingress, TLS Redis and real Chromium.
It requalifies the selected current dependencies rather than inheriting the
frozen INT-02 result.

All five prerequisite scenario groups PASS. The sanitized log reports 89 named
boolean checks, all true, plus 14/14 actual browser sub-checks. Historical
90-check summaries must not be used as a count for this run.

| Identity case | Observed assertion |
|---|---|
| NAB-ID-01 | Anonymous session 401 |
| NAB-ID-02 | Unsolicited callback 401 |
| NAB-ID-03 | Cross-origin login initiation 401 |
| NAB-ID-04 | Real code/S256 login, signed token verification, current introspection and CP self-read, HTML completion, account/session 200, Secure/HttpOnly/Strict opaque session, invalid CSRF 401, native exact-Origin logout 303 and stale-cookie session 401 |

The last actual sequence is introspection 200 → CP self-read 200 → callback
HTML 200 → fresh introspection/CP → account 200 → fresh introspection/CP →
session 200 → invalid logout 401 → native logout 303 → sign-in 200 →
stale-cookie session 401. Cleanup completes before the scoped PASS message.
Missing cases, nonzero process, invalid observations or teardown failure cannot
produce that message or a passing completed receipt.

The product client remains dormant. The disposable Keycloak client has a
strictly verified self-audience for Keycloak 26.7 introspection, alongside the
existing CP audience. That fixture does not converge or qualify the protected
product client's audience configuration.

## Repairs and review

- #80 commits a fixed no-store same-origin completion document, ending the
  cross-site redirect chain before account navigation without weakening Strict
  cookies. No script, OAuth reflection or caller-selected destination is added.
- #81 uses same-origin referrer policy for account documents so native POST
  preserves exact Origin, while protocol/callback routes retain no-referrer.
  Missing, null and foreign Origin remain denied even with valid CSRF.
- Infrastructure exposes only finite route/method/status diagnostics and
  regression-tests suppression of private/unknown data.
- Both Nabhold final heads passed all 29 checks with zero-finding exact-head
  review and no unresolved threads before merge. #81 passed 359 unit tests,
  five TLS Redis tests and 23 public browser tests.
- Infrastructure final head passed all 35 checks: 29 successful and six
  applicability skips. Its 41 source/security tests and real connected job pass;
  exact-head automated review has zero findings and all review threads resolve.

An earlier review allowance error was retried successfully; no review gate was
waived. No local full package/browser/Docker run is claimed in this environment.

## Readiness and next dependency

| Dimension | Current result |
|---|---|
| Source implementation | Reviewed/merged #37, #80 and #81 |
| Local integration / interactive Codespaces | Not independently executed in this environment |
| GitHub Actions real-component synthetic identity | PASS, exact bounded pins/run above |
| Full INT-03 / canonical NAB-01–04 | OPEN: CMS and remaining revocation/context/isolation/outage matrix required |
| Native protected Kratos/Hydra C4 / executive authority | OPEN; Keycloak compatibility is not protected-provider qualification |
| Protected staging / legal admission / production / R0–R3 | OPEN / not authorised |

The accepted frozen INT-02 qualification remains unchanged. No provider support,
real legal fact, corporate mandate, entitlement, tenant membership or release
flag is promoted. Corporate relationships confer no access and Nabhold remains
non-trading.

Current CMS source `e2001e5fcc26301dd019575b49db6f782e71714e` already has
the canonical provider/context route; Nabhold already has its gateway/resolver.
Reuse them. Outstanding work is Node 24 convergence, maintained workload-token
acquisition and current same-Principal CP context issuance/refresh, actual
CMS provider qualification/binding and published/preview/withdrawal/isolation/
failure assertions with fallback disabled for qualification.

Shared still leaves `nabhold-backend` PROVISIONED until actual CMS/CP proof.
The accepted proof-bootstrap exception names only the Pulse caller. [Shared
draft #354](https://github.com/baobab-platform/shared/pull/354) provides a concrete,
least-privilege CMS evidence-producer proposal for an owner decision; it is
PROPOSED, changes no registry/authority and is not acceptance. The separate CMS
validator's ACTIVE row is not consumer authority. Do not promote the product
workload, borrow the Pulse exception or use the human identity token to bypass
this boundary.

ERP F1 remains its separate DRAFT/provider/Finance acceptance lane; Subscriptions
remains simulated/non-production. No trade/cart/inventory capability is introduced.
