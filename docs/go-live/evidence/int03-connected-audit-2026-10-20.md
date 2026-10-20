# INT-03 connected engineering audit — 20 October 2026

**Decision: OPEN; no full INT-03 or protected acceptance.** Fresh GitHub reads
confirm the merged baselines below. The Accepted [masterplan v2.0](../NAB-GOLIVE-MP-001.md),
Shared EA v2.2 and ADR-SHARED-036 remain controlling; the normative NAB-01–04
matrix is not replaced by the smaller NAB-ID-01–04 smoke.

## Current merged source

| Repository | Main SHA |
|---|---|
| Nabhold | `bc672d37e0e301d30090937f103710a82898df26` |
| Infrastructure | `84079fa6720da5e1dd5f14d9d0b0d3b0dd149f28` |
| IAM | `63db55c87fda13762fc438a6d32a885a63ddb353` |
| CP | `3810b8222fa6df09b829e7c725d534af10b1155c` |
| Shared | `5b34b15b18361d43a9da9bec088771912c2b89c6` |
| CMS | `e2001e5fcc26301dd019575b49db6f782e71714e` |
| ERP | `0bcf6d1b9d0ec262a1400eb9ce83981305e5d32d` |
| Subscriptions | `52c69906343d7b1afee08a88b8d3afe118af0428` |

Nabhold #76 merged the reviewed file-trust correction; do not repeat it.
Infrastructure #36 remains preparation only. Infrastructure
[#37](https://github.com/baobab-platform/infrastructure/pull/37) supplies the next
connected lifecycle but is unmerged at audit time. Its current candidate is
`502b9e7363a7dae22940a26c9a168ab3957bda72`.

## Reconciled engineering and observed execution

The candidate implements a distinct reviewed source lock and prerequisite lock,
real selected IAM/CP/Pulse prerequisite requalification, isolated synthetic
non-admin human/client and current CP external-identity mapping, private HTTPS,
TLS-only Redis with per-run namespace ACL, Node/Chromium CA trust, real BFF
browser execution, observed running-image/source verification and mandatory
teardown. The frozen accepted INT-02 lock is unchanged. The dormant product
client remains disabled; the fixture has no executive, business or tenant grant.

| Evidence | Observation | Claim permitted |
|---|---|---|
| [Run 39314768018](https://github.com/baobab-platform/infrastructure/actions/runs/39314768018), candidate `5337e8e6420dd492f1ef76bb774e48d1b022ab51` | Real selected prerequisite reached PASS; subsequent Nabhold browser smoke failed; cleanup recorded | Failed connected engineering attempt; no Nabhold acceptance |
| [Run 39315781153](https://github.com/baobab-platform/infrastructure/actions/runs/39315781153), candidate `6f81c81f2bf59df23fe1a8ecc53c070320b2f947` | Prerequisite human browser ceremony failed before Nabhold; own cases BLOCKED; teardown true | Failed prerequisite attempt; no new qualification |
| [Run 39370127494](https://github.com/baobab-platform/infrastructure/actions/runs/39370127494), candidate `502b9e7363a7dae22940a26c9a168ab3957bda72` | Source/security job passes; connected job pending at initial audit | Pending; no acceptance |

Earlier failed build attempts exposed actual executor integration defects:
untracked Dev Containers feature lock, incorrect override of the approved
image's offline Corepack cache, and exclusion of public tracked environment
examples from the clean-source build. The candidate fixes these with a committed
frozen feature lock, inherited shared Corepack cache and a separate public-template
build context. Private dotenv files and package credentials remain excluded.

Downloaded artifacts for the two completed attempts were checked against GitHub's
archive digests and their own receipt sidecars during engineering investigation.
This record does not independently approve the selected prerequisite set or
promote an earlier run's partial success. The final candidate must pass its own
mandatory checks and review. Runtime source, workflow branch head, PR merge ref
and eventual squash commit are distinct provenance fields.

The current increment additionally fixes both review findings about PR/main push
trigger coverage (Dev Containers CLI and reused harness inputs). Thirty-four
local handoff/runtime/security tests pass. Failure observations now retain only
finite prerequisite browser facts and fixed HTTP route/method/status fields;
no raw authentication URL, query, cookie, header, body or log enters artifacts.
These diagnostics cannot turn a failed or missing case into PASS.

## Outstanding PR triage

Fresh queries inspected every open PR and every head's check-runs in the eight
repositories (up to 100 checks per head). No Nabhold PR was open. Failed checks
remain on CP #398, Shared #292/#294, ERP #108 and CMS #27/#28/#29.
Other open dependency heads currently have no failed/pending check; that is
check inventory, not semantic approval of all changes. Major Node 26/type,
TypeScript 7, GraphQL 17 and schema-validator migrations require compatible
owner-reviewed changes. No failed mandatory check is waived or bulk-merged.
CMS #39 includes a further Node 26 type update, so a green patch-group aggregate
alone does not establish the accepted Node 24 runtime/type baseline.

The previous main-only L3 failure (run `39263711884`) remains an independently
tracked baseline issue; no repair or new L3 acceptance is claimed here.

## Remaining dependency order and authority

1. Diagnose the actual prerequisite/browser failures, complete all four real
   NAB-ID cases, verify running pins and cleanup, obtain final-head review and
   successful mandatory CI before merging Infrastructure #37.
2. Converge CMS's Node 22 CI/image baseline to the approved Node 24 profile;
   independently qualify its PARTIAL provider, current CP workload/grant/context/
   binding/instance and real published/preview/mutation/revocation/isolation/outage
   cases. The existing Codespaces images and bootstrap contracts remain intact.
3. Complete all normative NAB-01/02/03/04 and applicable universal L4 assertions;
   obtain independent profile acceptance. A smaller identity PASS is insufficient.
4. Execute protected native Kratos/Hydra→CP C4-03 and C4-04B/C, real legal/SoD/
   onboarding and release-specific staging under their separate approved inputs.

ERP F1 remains DRAFT/EXPERIMENTAL with Proposed ADR-SHARED-033 and no qualified
canonical provider. Subscriptions' simulated non-production billing is not R2
acceptance. CP owns current authority, admission, contexts, grants and bindings;
IAM owns identity; Shared owns contracts; engines own domain state. Nabhold
remains non-trading, and group membership grants no subsidiary data access.
Protected staging, production and R0/R1/R2/R3 remain unaccepted. No migration,
provider promotion, real client activation or release flag is changed by this
record. Rollback of the source candidate means reverting its reviewed source;
private ephemeral resources are destroyed rather than retained as authority.

Reviewer role/date: engineering source and CI reconciliation, 20 October 2026;
independent acceptance pending.
