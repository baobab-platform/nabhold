# R0 canonical homepage parity — 23 October 2026

**Classification:** LOCAL_TESTED source correction. No live CMS/IAM/CP qualification
or release acceptance is claimed. Accepted Go-Live v2.0 and EA v2.3 remain governing.

## Reconciled source milestones

- Nabhold #90 is merged at `58d1a641e227212c7c43c14e7c66b16ab8be62cf`.
  Its executive navigation observer remains read-only and non-authorising.
- Infrastructure #51 is merged at `6ef5c19c8f057f3592b71f572714b365efdd6b26`.
  Final head `1d67d540a42776467de24fb2488d382b4d21ff57` had all applicable
  checks successful, all four review threads resolved and 205 local INT-03 tests
  passing. The implementer's final-head source review confirmed duplicate JSON
  rejection, the closed committed source lock, clean checkout/ancestry and role
  separation corrections. This merges the #49 runbook and offline structural
  preflight, not independent approval, resource provisioning or live evidence.

## Concrete defect and correction

The transitional Payload homepage gateway mapped `accentHeadline` and
`heroGallery`; the canonical `content.entry.resolve` gateway silently omitted
both even though the shared estate DTO/mapper already accepted them. Selecting
the canonical path therefore discarded approved editorial copy and imagery.

The canonical gateway now preserves both fields using the existing estate
mapper. Gallery assets without populated URLs are omitted by that mapper.
Older records remain valid: ordinary rendering retains the existing estate
accent default; qualification rendering keeps an absent optional accent absent
and an absent gallery empty. No provider fallback, new content key, catalogue
contract, scope, binding or registry activation is introduced. Portfolio
qualification still performs no transitional provider read.

## Validation and scope

Published tested source: `2a07cdc59be58c24c75e2ff02f841f0c6870792b`
([PR #91](https://github.com/baobab-platform/nabhold/pull/91)). Its full Git tree
`5eb52341c6f6ee1c7e9aa4dcfd5bb2d6b8b96644` was fetched and compared with the
locally tested checkout; the tree hashes are identical. This published commit
is reachable from the PR branch. Later receipt-only corrections do not change
the tested source or test files.

- 56 focused Vitest tests passed across the canonical gateway/resolver and
  transitional Payload client, using the installed matching Vitest 5.0.5/Zod
  4.6.7 runtime and a temporary Node-environment configuration without DOM setup.
- Strict TypeScript passed for changed files and their imported source graph;
  ESLint passed for all changed source/test files; `git diff --check` passed.
- New regressions cover ordinary/qualification gallery and accent mapping,
  legacy records, exclusion of unpopulated media and actual resolver-to-gateway
  schema/mapping flow through synthetic CP/provider protocol responses.

The initial repository-default local test invocation could not start because
this scratch runtime lacks jsdom and testing-library; the temporary Node test
configuration exercised these server adapter suites without DOM dependencies.
Full repository lint/typecheck/unit/build/browser and security/Foundation CI
must pass on the final PR head before source merge. Synthetic protocol fixtures
are not real provider support or runtime acceptance.

Rollback: revert the gateway and regression change. No persisted state,
credentials or authority changes require reversal.

## Remaining critical path

Infrastructure #49 still requires the exact independently approved private
packet, qualified separate operators, actual CP admission and generated IDs,
private credentials, external shutdown and immutable evidence custody. None
was supplied by merging #51. The seven real INT-03C cases remain unexecuted.
The separately scoped executive human runtime also lacks live acceptance.

Shared #354 CMS activation remains HELD and all fourteen NAB-03 cases remain
BLOCKED. Independent legal onboarding, protected identity/staging, qualified
finance/workforce providers and R0–R3 acceptance remain outstanding. CP #430's
explicit do-not-merge instruction is preserved. Nabhold stays non-trading;
subsidiary ownership confers no cross-tenant authority.
