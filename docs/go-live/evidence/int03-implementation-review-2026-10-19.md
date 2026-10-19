# INT-03 implementation progress review — 19 October 2026

**Decision:** INT-03 is OPEN. INT-03A source preparation is merged; no connected
INT-03B identity run or full NAB-01–04 acceptance is evidenced. This review
records source and CI observations, not protected staging or production approval.

Authority: Accepted [Go-Live v2.0](../NAB-GOLIVE-MP-001.md), Shared
[EA v2.2](https://github.com/baobab-platform/shared/blob/5b34b15b18361d43a9da9bec088771912c2b89c6/docs/architecture/EA-implementation-plan-v2.2-ADR-SHARED-036-integration-reconciliation.md),
[mandatory matrix](https://github.com/baobab-platform/shared/blob/5b34b15b18361d43a9da9bec088771912c2b89c6/docs/architecture/ea-v2.2-integration-acceptance-matrix.md),
ADR-SHARED-036, ADR-NAB-0004/0014 and ADR-IAM-0033. The broader
[implementation audit](progress-audit-2026-10-19.md) retains its historical
source baselines; the following heads are freshly queried from GitHub.

## Rechecked merged baseline

| Repository | Current main | INT-03 relevance |
|---|---|---|
| Nabhold | `de19f52093ccaf8509a1da000c978e0583a1136e` | BFF, TLS Redis, current identity, smaller smoke and sanitized receipts present |
| Infrastructure | `84079fa6720da5e1dd5f14d9d0b0d3b0dd149f28` | Private handoff preparer merged; no provisioning/network lifecycle in INT-03 |
| IAM | `63db55c87fda13762fc438a6d32a885a63ddb353` | Dormant human profile subject-scope repair and C4 evidence hardening merged |
| CP | `3810b8222fa6df09b829e7c725d534af10b1155c` | Human self-read and governed context/provider/binding source |
| CMS | `e2001e5fcc26301dd019575b49db6f782e71714e` | Content provider PARTIAL; production not permitted; Node 22 runtime convergence outstanding |
| Shared | `5b34b15b18361d43a9da9bec088771912c2b89c6` | Accepted matrix, exact INT-02 qualification and INT-03 dependency register |
| ERP | `0bcf6d1b9d0ec262a1400eb9ce83981305e5d32d` | Separate native posting lane; no qualified Nabhold F1 provider |
| Subscriptions | `52c69906343d7b1afee08a88b8d3afe118af0428` | Separate simulated/non-production billing lane |

These heads are unchanged since the preceding audit. No new INT-03 PR exists
at review start. The Codespaces bootstrap configurations remain intact; package
access does not connect their DNS/networks or provision authority.

## Engineering task reconciliation

| Task | Completed source | Remaining exit / dependency | Evidence level |
|---|---|---|---|
| Human client | IAM #127 repairs `basic`/subject mapping, including pre-existing dormant client; isolated handoff clone has code/S256 and no service account/admin roles | Provision separate disposable confidential client and non-admin human; verify real issuer/subject maps to current ACTIVE CP Principal | Source and IAM-owned legacy integration; no Nabhold journey |
| Private handoff | Infrastructure #36 creates private env/client/CA/epoch/ACL/AES inputs atomically, with explicit unverified manifest | Actual runtime source/image verification; provision rather than trust declared UUID/pins | Source only |
| BFF/session custody | Existing callback/introspection/CP self-read, encrypted Redis session, CSRF/local logout enforcement | Private HTTPS edge, real TLS-only Redis and namespace ACL; Chromium CA trust; actual login→CP→custody→logout | Source and separate store tests; no connected INT-03 |
| Consumer file trust | Review found CA ownership/write/link checks weaker than preparer; credential loader also permitted hard links | This increment rejects foreign ownership, shared-write CA and multiple links; preserve private parents and immutable-in-run files because Node reopens CA on child startup | Source hardening; no network or certificate-chain claim |
| Runtime lifecycle | INT-02 lifecycle exists for its own frozen pins | Dedicated INT-03 services, isolated identity/CP fixtures, health/readiness, unconditional teardown; requalify changed IAM/CP pins | Outstanding engineering, not a protected-credential blocker |
| CMS qualification | Canonical consumer/provider and Organisation/current-context checks exist | Node 24 convergence, independently qualified provider/release; CP-owned workload, grant, context, binding and instance; published/preview and mutation/denial proof | Source PARTIAL |
| Executive operations | Fail-closed `CurrentExecutiveContextResolver` interface and operation guard | CP owner-approved same-principal/delegation protocol before concrete executive adapter or activation | Contract dependency; self-read is not an executive grant |
| Receipts | Fixed NAB-ID-01–04 smoke, clean local source pin, declared dependency pins, failure/incomplete-run denial and digest | Bind to independently observed running commits/images; cover all matrix assertions, retain sanitized evidence and prove teardown | Observation-tool source only |

There is no defensible percentage-complete calculation: completed source tasks
and required connected acceptance scenarios are different denominators.

## Normative acceptance gaps

| Mandatory ID | Existing smaller smoke/source coverage | Required connected assertions still unproven |
|---|---|---|
| NAB-01 | NAB-ID-01 anonymous denial; ID-02 unsolicited callback; ID-03 cross-origin initiation; ID-04 intended code/S256 flow, cookie shape, CSRF denial and local logout replay | All four smoke cases against actual stack; wrong PKCE, nonce/state/callback, session replay/eviction and prohibited consequence checks |
| NAB-02 | ID-04 asserts expected canonical Principal through BFF's current IAM introspection/CP self-read | Revoked token, unmapped/inactive CP Principal, current rejection and no retained usable session |
| NAB-03 | Canonical CMS workload route/consumer source | PUBLISHED home/nav/footer through actual registered capability; preview/draft and tenant mismatch denial; unauthorized/expired workload; current binding/grant/context; publish/unpublish, revocation and outage |
| NAB-04 | Public estate/navigation source and separate UI tests | Connected public/console routes; no fabricated authority, legal actor, provider binding or executive data |
| L4 universal requirements | Reusable INT-01/02 source and frozen accepted INT-02 proof | INT-03-specific exact running sources/images, private network/TLS, IAM/caller checks, all mandatory results, sanitized custody and complete cleanup |

NAB-ID-01–04 are smaller consumer test IDs, **not** aliases for NAB-01–04.
Passing the smoke cannot close full INT-03 or remove CMS/negative requirements.

## Fresh CI and outstanding PR observations

All open PR heads in the eight repositories were queried with up to 100 check
runs per head. No Nabhold PR was open at review start. Failed mandatory suites
remain on CMS #27/#28/#29, ERP #108, CP #398 and Shared #292/#294. CMS #31
currently has no failed check, unlike the earlier audit's historical grouping;
green checks alone do not establish that a major ESLint update is compatible
with the accepted runtime/peer baseline. CP #399 remains a Node 26 type-baseline
conflict despite green CI. Other green dependency PRs remain separate semantic
review work; this review does not bulk-approve them or claim resolved errors.

Infrastructure main's [INT-02 regression run 39263711772](https://github.com/baobab-platform/infrastructure/actions/runs/39263711772)
is completed/success. It runs the frozen INT-02 profile, **not INT-03**.
The accepted [INT-02 record](https://github.com/baobab-platform/shared/blob/5b34b15b18361d43a9da9bec088771912c2b89c6/docs/architecture/int02-pulse-qualification-register.md)
continues to govern its exact pins; this review does not re-download its binary
artifacts or independently re-attest them.

A separate main-only [L3 run 39263711884](https://github.com/baobab-platform/infrastructure/actions/runs/39263711884)
failed: L3-02 RabbitMQ management health, L3-08 fixture queue declaration and
L3-10 APISIX admin probe (403/access-forbidden log). This is a new visible
baseline issue to triage in the owning L3 lane; it is neither an INT-03 result
nor evidence that the isolated INT-02 run failed. Do not report all main CI as
green. The exact root cause and repair have not been established in this review.

Local verification for the consumer hardening: 33 configuration tests (including
real filesystem permissions/hard links and an injected different UID), 15
receipt tests, 14 Codespaces lifecycle tests and 12 Infrastructure handoff tests
pass. The different-UID test exercises policy without privileged `chown`; it is
not a multi-user host acceptance run. Full application lint/types/build/browser
and mandatory CI must pass on the PR head before merge.

## Next execution order

1. Review and merge the consumer file-trust correction only after exact-head
   mandatory CI/review. Keep the dormant product client disabled.
2. Implement Infrastructure's private connected identity profile: independently
   pinned checkouts/images, isolated client/non-admin human/current CP mapping,
   exact HTTPS routes, TLS-only Redis/ACL and CA trusted by Node/Chromium. Preserve
   the frozen INT-02 lock; requalify the new running set separately.
3. Run the existing real BFF smoke, prove cleanup, retain sanitized runtime-bound
   observations. A local Docker-capable or Actions/Codespaces runtime is needed;
   Docker is absent in this workspace, so no connected pass is claimed here.
4. Converge/qualify CMS through its owning APIs and current CP authority, then
   implement/execute the remaining NAB-01–04 and universal negative scenarios.
5. Obtain independent acceptance of that complete synthetic profile. Execute
   protected native C4-03/C4-04, real legal/SoD/onboarding and R0/staging under
   their separate approved registrations, credentials, facts and reviewers.

Nabhold Group Africa remains non-trading. A group relationship grants no
subsidiary data access; Tenant and PRIMARY Organisation must be independently
validated. IAM owns identity, CP owns authority/context/grants/bindings, Shared
owns contracts and engines own domain state. ERP F1 and production billing
remain open independent dependencies. **Protected staging, production and
R0/R1/R2/R3 remain unaccepted.**
