# G04B-05 navigation qualification preparation — 23 October 2026

**Classification:** automated implementer source/test evidence only. No approved
runtime handoff or live executive-context qualification was executed.

| Source | Immutable revision |
|---|---|
| Local-tested observer implementation | 405989b4f34060abb46f0d797b181c0c7cad10c3 |
| Starting Nabhold / merged #89 | f851da8c6e181a66fa17759ff785dee57ce91281 |
| Inspected CP human read contract | bcea71bd9909be3672dfcb7ce78d04d6feb0e748 |
| Inspected Shared main / EA authority | 742295e2b4f67a3de6d985e7da6bd89ed0be39cb |
| Inspected Infrastructure main / merged #50 | cbdb6e8bebe6ca485d1b78faf05f658cffd9ed08 |

This follows source integration of read-only human navigation in Nabhold #89.
Accepted Go-Live v2.0 and EA v2.3 retain the normative v2.2 L4 matrix. The new
observer supplies descriptive G04B-05 technical checks, not new normative L4
IDs, INT-03C completion, CMS acceptance or a human execution protocol.

## Implemented

A strict non-secret handoff schema, intentionally unresolved plan template,
private-file CLI and read-only HTTP observer compare the real BFF context with
separately authenticated direct CP reads for the same own human. A distinct
valid human denial peer must have current BFF/CP identity and lack at least one
required own-scope navigation grant before an access denial can be observed.
The observer checks primary mapping/market, all denial responses, current final
identities/grants, privacy/cache headers, source freshness and response expiry.

GET routes and credential destinations are fixed. Collection is bounded to 30
seconds and five seconds per full response, with a maximum 90-minute declared
run window. No token issuance, client/Principal/topology creation, SQL, mutation,
logout, credential revocation, grant/binding activation or runtime deletion is
implemented. The existing G17 streamed JSON reader is reused, with its previous
hashing default preserved; credential-bearing session bodies suppress hashing.

Inspect is offline, shape-only and explicitly non-authorising. Observe returns
BLOCKED or OBSERVED_NOT_ACCEPTED, never PASS or accepted qualification. Declared
source pins and an approval reference are not verified runtime authority. The
report keeps attestation, execution and qualification booleans false and lists
outstanding browser/revocation, custody, disposal and protected-signoff work.

## Validation

149 focused tests passed locally across the observer, existing protected G17,
OIDC, executive navigation, capability and protected-operation suites. Strict
TypeScript checking passed for the new observer/tests and imported code.
The tested source revision above precedes documentation-only publication.

Coverage includes exact/missing/group/mixed/environment/expired/duplicate grants,
active denial identity and actual missing authority, grant changes during reads,
PRIMARY/market/state mismatches, strict denial problems and non-execution shape,
privacy/cache/CORS headers, unsafe credentials/destinations/debug/TLS settings,
stalled/oversized/malformed/redirected responses, clock rollback and elapsed
windows. Actual CLI subprocess tests cover offline shape inspection, missing
credential BLOCKED output and private file/symlink/hard-link restrictions.

All transport peers and fixture identities in these tests are synthetic and
not accepted CP topology. The CLI's observe subprocess in unit tests has no
credentials and performs no network calls. Existing G17 loopback protocol tests
remain synthetic as before. No independently retained live receipt, provider
certification, source/image runtime attestation or human signoff is claimed.
Full mandatory repository CI and final-head review remain required before merge.

## Independent approval and next action

Infrastructure #49 was re-read and remains an open approval request with no
independent topology approval in its comments. CP #427, IAM #137, Infrastructure
#48/#50 and Nabhold #89 are source milestones, not authorisation to execute.
Actual human OIDC/session/grant fixtures require separately scoped owner approval
as well; the INT-03C workload-only ruling cannot be widened to cover them.

See the [private handoff guide](../onboarding/executive-navigation-observations.md).
Once independent approvals and provisioning exist, the owning operator can run
real checks and the distinct reviewer can independently verify exact running
sources/images, originals, custody, revocation and teardown. Until then no live
observation is represented by this source receipt.

Privileged human capability execution remains blocked on its own CP/Shared
protocol and mandate/provider evidence. CMS activation under Accepted Shared
#354 remains HELD, NAB-03 14/14 BLOCKED and R0–R3 unreleased. Rollback reverts the
observer/script/package entry; no persisted data or authority must be undone.
