# Fresh Go-Live v2.0 × Shared EA v2.2 implementation audit

**Date:** 19 October 2026. **Evidence class:** repository/source/CI audit;
not independent legal verification, protected staging or production approval.
The Accepted [masterplan v2.0](../NAB-GOLIVE-MP-001.md) remains controlling.
This reconciliation supersedes prior *current* assertions that Infrastructure
#35 is open. Dated historical entries retain their original scope.

## Method and governing decisions

Read current main source and programme registers in Nabhold, Shared, IAM, CP,
Infrastructure, CMS, ERP and Subscriptions; inspect their provider declarations,
integration/acceptance code and relevant accepted ADR boundaries. Query each
repository's complete open PR list and each head's check-runs (100 per page),
then inspect substantive/selected dependency diffs and failure logs. A green
aggregate is not used to conceal a failed individual mandatory check.

Governing decisions: Nabhold ADR-0004/0012/0013/0014; Shared EA v2.2,
ADR-SHARED-036 (L4/consumer/production separation), capability/provider contract
and EA-09 certification rules; IAM ADR-IAM-0033 and current C4 runbooks; CP's
accepted Organisation-first/progressive onboarding and caller-owned context;
CMS ADR-0012/0014/0017; ERP posting/placement/COMMIT boundaries and Subscriptions
ADR-SUB-0001/0014/0016. Proposed Finance ADR-SHARED-033 is not treated as Accepted.

Source examination is focused on the next dependency closure and declared
support. It does not claim a new line-by-line security audit of every engine.
No real protected issuer/CP deployment, AWS account or live enterprise legal
evidence was available in this workspace. Docker remains absent locally. Go 1.27.2 was subsequently obtained from its
official release and checksum-verified for the #128 focused/race tests. Required
GitHub CI is inspected and new CI is awaited, never waived.

## Source baseline

| Repository | Merged source inspected | Finding |
|---|---|---|
| Nabhold | `f582537c8d5b04d8e33423fd5b7d2cefdcf46a84`; dependency merges #73/#74 advance to `55af5bd306b2b8f60273adacd9a83f554bb413c3` during audit | Confidential BFF/Redis, identity/current-authority and fail-closed executive seam already exist; identity smoke and receipt tooling are preparation |
| Shared | `bd21d229f54521da30ad7c79f8967797ad4fb401` | EA v2.2 records qualified synthetic INT-02; full INT-03 remains open; Finance F1 is DRAFT/EXPERIMENTAL |
| IAM | `839834da3c25994724ccc9c7a06baa68fb40f752` | #122/#123 merged; native C4 protected execution remains outstanding; #126 is an unmerged readiness/evidence increment at audit start |
| CP | `3810b8222fa6df09b829e7c725d534af10b1155c` | Protected identity-runtime source and current context/binding checks exist; another actor cannot redeem a human-owned context |
| Infrastructure | `03ad3f488e19ad446328ba6827363730e4252409` | #35 merged; fixed INT-02 real IAM/CP/Pulse suite, no complete Nabhold handoff or CMS profile |
| CMS | `b72ff38dc5aefb2e6b859b06044f592b86c8fd24` | Canonical content route, Organisation/current CP checks and hierarchical scopes merged; provider `PARTIAL`, `production_permitted=false`; CI/Docker still on Node 22, requiring Node 24 convergence before production-shaped qualification |
| ERP | `0bcf6d1b9d0ec262a1400eb9ce83981305e5d32d` | Native iDempiere placement/posting fences and synthetic native proofs exist; no qualified Nabhold canonical F1 provider |
| Subscriptions | `52c69906343d7b1afee08a88b8d3afe118af0428` | Contract convergence merged; declared temporary billing provider is simulated and `production_permitted=false` |

## Reconciled task and acceptance state

| Task/gate | Completed source or observed integration | Outstanding/blocked exit |
|---|---|---|
| G00 / P0-01 | Accepted v2.0 and ADR-NAB-0014; existing programme controls | Keep current status distinct from dated history |
| P0-02 / G05 source | Organisation-first Nabhold/CMS consumption and scope correction merged | Live identity, provider certification, binding and R0 acceptance |
| P0-03 / G01A/B/C | Documentary inputs, private preparation/source-custody and independent-review machinery | Accepted real Nabhold/Thamani legal verification, control/mandates and reviewer independence |
| P0-04 / G04 | IAM native/federated source; encrypted TLS Redis custody; OIDC callback; current IAM/CP self-identity; G04B-04 source guard | Real human/CP Principals, SoD and protected acceptance; concrete approved human-context protocol before executive activation |
| INT-01 | Merged L4 Foundation and real Actions dependency/cleanup proof | Separate interactive Codespaces observation, protected operational acceptance |
| INT-02 | #35 merged; final-pin Actions real IAM/CP/Pulse synthetic qualification accepted | No automatic qualification of later source pins; no C4/Ory, Nabhold, staging or production implication |
| C4-03 | #123 live-runner source; real released/backport Ory mechanics and browser/passkey engineering are separate facts | Actual registered Kratos/Hydra→protected CP B–E execution, current registrations/validator credentials, withdrawal and accepted provenance |
| C4-04A/B/C | #126 merged read-only current-authority/health observation and integrity-only receipt verifier | #126 reviewed source merged; independent CP-governed support/activation and running consumer negatives; CRITICAL AdministrativeGrant remains prohibited |
| INT-03A | Existing Nabhold smoke + receipt code; IAM subject-mapper repair and Infrastructure private-handoff source merged | Run actual connected lab; generated files alone do not provision or verify identity |
| INT-03B / NAB-01/02 | Concrete BFF identity consumer exists | Actual connected private HTTPS, issuer/client/CP mapping/TLS Redis/browser journey and negatives; owner-bound runtime source evidence and teardown |
| INT-03 / NAB-03 | CMS provider/consumer source exists | Independent qualification and current grants/binding/context; actual published/preview, publish/unpublish, tenant/audience/revocation/outage assertions |
| P0-05 / G02 | Progressive onboarding source and synthetic acceptance | Execute real controlled Nabhold admission; identity/tenant acceptance is not production activation |
| P0-06 / G05 | Workload consumer and capability resolver source | Operational Nabhold workload and first qualified CMS binding |
| P0-07 / G17 | Protected acceptance observation tooling | Signed release-specific R0 acceptance; no current R0 GO |
| P1-01/02 / G06 | Three canonical F1 DRAFT wire contracts and native ERP posting groundwork | ADR/domain semantic acceptance, actual ledger/journal/statements provider, FinanceBaseline and real trial-balance/reconciliation proof |
| G07/08/09/13 | Existing boundary/planning work | Workforce/payroll/procurement/assets/projects/governance owner/contracts/provider and scoped acceptance; no generic ERP activation substitutes |
| G10/11 / R2 | Temporary billing/sandbox payment engineering | Production-permitted providers, real financial authority and invoice→payment→settlement→ERP reconciliation |
| G12 / R3 | Option B and group relationship/read-model source | Evidence-backed control, independent subsidiary data grants and approved accounting/consolidation semantics |
| G14 | Pulse source and qualified synthetic provider lane; conditional Regulations source | Nabhold-specific bindings, regulatory source coverage and advisory/release acceptance |
| G15 | Public estate and preview/workbench source, BXS adoption | Governed actual executive capability journeys; no sign-in-to-executive privilege promotion |
| G16/G17/G18 | Infrastructure/acceptance source and local/synthetic CI evidence | Actual approved AWS/account/roles/KMS/DNS, protected staging, security/restore/UAT ownership and signed production activation |

## INT-02 evidence: preserve the exact claim

[Infrastructure #35](https://github.com/baobab-platform/infrastructure/pull/35)
merged at `03ad3f488e19ad446328ba6827363730e4252409`.
[Actions run 39108198886](https://github.com/baobab-platform/infrastructure/actions/runs/39108198886)
is independently returned by GitHub as completed/success. Shared's
[accepted qualification register](https://github.com/baobab-platform/shared/blob/bd21d229f54521da30ad7c79f8967797ad4fb401/docs/architecture/int02-pulse-qualification-register.md)
records all five mandatory groups, 14 browser/MFA, 16 isolation, 11 HTTP,
seven native and 19 provider checks, source/image identities, digest verification
and teardown. The executing workflow head, reported harness source, baseline
manifest pins and eventual merge SHA are different provenance fields; do not
substitute one for another. This audit verifies GitHub run status and reads the
previously accepted digest/receipt record; it does not claim a new download and
independent cryptographic verification of the binary artifact.

Qualification applies to IAM `9b8b0b4a401139ed9055fd5947ca3b1b7e0f3f8e`, CP
`34fc86a5bf276dfb80760710fe32a34d2431558a`, Pulse
`6f4271d7b43db8d9c81e04d4f5dcc4cf50b27172` and Shared
`33f1dd6aa7c0db43743dbb02cff16d5dc0802610` only. New merged IAM/CP source must
be qualified as its own running set. Synthetic fixture records never establish
Nabhold's real company, native identity, executive grant or legal mandate.

## Open PR review and repairs

Audit inventory: Nabhold #71–74; Shared #290–294; IAM #125/126 (new #127);
CP #396/398/399/414; ERP #97/103–109; Subscriptions #41/42; CMS
#27/28/29/31/36–39; Infrastructure #29–33 (new #36). This is an inventory and
check/failure triage, not an assertion that every dependency diff has been
semantically approved. Independent upgrades remain distinct from Go-Live scope.

| PR lane | Finding / action | Merge rule |
|---|---|---|
| IAM #126 | Failed `provider-contract` log identifies one extra blank line rejected by gofmt; repaired at `cd378f04c66a4c957bc302a50d1e310fb63c25d6` | All 46 head checks completed successfully/applicably skipped before merge `5bc1a7c4200a7b5dd029452c9d305408fb4a286e`. Automated review triggered on ready arrived after merge with two valid file-input findings; corrective #128 head `190cc179231ddb13b3ae7640e48d4748bd58c6e8` passed all 45 final-head checks/zero-finding automated review and merged at `63db55c87fda13762fc438a6d32a885a63ddb353`. Both original findings resolved; local focused/broader/race tests pass (foreign-owner chown fixture unavailable in the single-UID local namespace). C4 protected gates stay open |
| IAM #127 | Explicit Nabhold scope list omitted Keycloak `basic`, which supplies access-token subject; fixed dormant profile/validator and mandatory real-realm exact-scope/native-mapper assertions | Eight focused tests and syntax/source checks pass. New real-realm assertion corrected for OIDC openid meta-value; bootstrap now repairs built-in basic only on the existing dormant client; legacy fixtures test that repair. Head `2c001bf9b894f6239f3e02c7c0107376e8843e8c` passed all 45 checks; review resolved and merged `b2e6dbe879bd2d6757287c9b03947dddbc19a024`. Actual legacy suite 140/140; connected BFF/CP acceptance remains separate |
| Infrastructure #36 | New private handoff preparation; per-run secrets/AES/epoch, exact Redis namespace ACL, strict dormant-client cloning, atomic private files and explicit unverified manifest | 12 source/security/actual-Node interoperability tests and 92 existing INT-02 tests pass locally. Review cleanup finding fixed at `1c1b2a3f7fbeba089523c8a524b3532f9c36061b`; all 33 final-head checks/review passed, merged `84079fa6720da5e1dd5f14d9d0b0d3b0dd149f28`. Exact current Nabhold configuration validator also accepted the generated bundle locally; no network proof claimed |
| Nabhold #73/#74 | Setup action and compatible dependency/lock updates reviewed; Node 24, private package pins and Codespaces controls retained | All 28 head checks completed without failures before merge; merged `68fea868` / `55af5bd3` |
| Nabhold #71 | Updated artifact SHA retained an incorrect release comment | Fixed comment; all 29 final-head checks completed successfully/applicably skipped; reviewed merge `d684134f49c82878d7b0352719ab4153345fa8f3` |
| Nabhold #72 | Workflow SHA moved but `foundation_ref` stayed on old source | Aligned source/ref; all 29 final-head checks completed successfully/applicably skipped; reviewed merge `eb67b9f7b6616f78edc8b4628baec10ee7203062` |
| CMS #37/#38 | Logs show split Vitest/coverage major updates violate their exact peer relationship | Paired repair #38 at `645e8a86a0e850afacda8a33cf17e75b9274e469` passed 29 head checks and review; merged `e2001e5fcc26301dd019575b49db6f782e71714e`. Clean install, 259 tests and types/lint pass locally; #37 closed as superseded |
| CMS #27/#28/#29 | Separate major ESLint/TypeScript/GraphQL changes fail dependency/build gates; Payload's accepted compatibility must be retained | No blind major upgrade or merge based on unrelated green checks |
| ERP #108 | networknt 3.x breaks current Jackson/schema-validator API compilation | Requires an owner-reviewed migration with unchanged canonical schema validation/native posting proofs; remain unmerged |
| CP #398/#399 | Proposed Node 26/runtime types contradict the accepted Node 24 baseline; #398 also fails because corepack is absent in that image | Do not bypass the platform runtime standard to make an automated major update green |
| Shared #292/#294 | Old failure logs identify missing action version comments in an old workflow baseline | Reconcile against current main and rerun before attributing an engine/runtime defect |
| Remaining dependency PRs | Check inventories include successful patch/action updates, but head/base age and semantic compatibility differ | Review exact diff and all required checks; no bulk merge or automatic production claim |

## Recently merged Codespaces configuration

Read current Nabhold, ZuriBeans, Thamani, Shared and CP configurations. They use
immutable organisation images, private forwarded ports and read-only access to
the approved `baobab-dev`/Shared package sources. Frontend estates retain the
frontend image/profile; CP retains its governed full development image and
Docker/Go needs. Prebuild lifecycle checks are offline; private package setup
occurs under the developer's approved read-only token. Nabhold's 14 lifecycle
tests and 15 observation/receipt tests pass locally after the dependency merges.

No configuration is reverted or replaced by INT-03. A successful Codespaces
image/package bootstrap does not supply a shared private service network,
registered IAM client, current CP Principal, protected credential or accepted
provider. Independent Codespaces cannot assume visibility of each other's DNS.
No package token belongs in an application dotenv file or baked container layer.

## Dependency-ordered next work

1. Finish final-head review/checks for the repaired IAM prerequisite and
   evidence/readiness source; retain dormant product clients, PARTIAL provider
   support and CRITICAL-grant denial.
2. Complete Infrastructure's actual private INT-03 network/client/non-admin
   synthetic human→CP mapping/TLS Redis handoff, using the prepared source
   utility; bind source/image identities independently and run the existing
   real browser smoke. Generated files, health and source tests cannot pass it.
3. Qualify the actual CMS capability through the owning APIs, exact current
   Organisation/Tenant/workload context, grant and binding; add real published,
   draft/preview, publish/unpublish, revocation, isolation and outage negatives.
4. Retain scoped INT-03 evidence and prove cleanup. Reconcile NAB-01/02/03/04
   against the normative matrix, not only the smaller identity-smoke IDs.
5. Execute real Nabhold verification/SoD/progressive admission and protected
   R0 binding/acceptance when its separate approved inputs exist. The actual
   native C4-03/C4-04 protected lane remains explicit; do not call it accepted
   because the retained Keycloak compatibility profile passes.

F1/ERP and other independent source lanes can proceed where accepted contracts
permit, but do not expand Nabhold into subsidiary trading, copy engine data into
CP/BFF, mint grants from group relationships or unlock a release to show progress.
**No R0/R1/R2/R3 release, protected staging or production readiness is accepted.**


## Final source closure for this increment

Reviewed source merges: Nabhold #71–74, IAM #126/#127/#128, Infrastructure #36
and CMS #38. CMS #37 is closed as superseded. Every merge used its expected
head after mandatory checks and resolved review; #126’s ready-triggered review
arrived after merge and its two findings were subsequently corrected in #128.
The audit/register updates themselves require their own final-head checks.
No protected C4/INT-03, real legal/onboarding, R0–R3 or production gate changes.
The next substantive engineering increment remains actual governed private
BFF/Redis identity execution, followed by CMS qualification and full INT-03.
