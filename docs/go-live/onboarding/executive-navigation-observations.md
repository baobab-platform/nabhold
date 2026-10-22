# G04B-05 — protected read-only navigation observation handoff

**State: SOURCE PREPARATION; live execution and independent acceptance pending.**
This follows merged [Nabhold #89](https://github.com/baobab-platform/nabhold/pull/89).
Authority remains Go-Live v2.0, EA v2.3, ADR-NAB-0004/0005/0014 and CP's accepted
CX-03B human read contract. These descriptive checks introduce no new L4/NAB
scenario IDs and do not replace the normative Shared v2.2 matrix.

## Independent prerequisite — not supplied by this tool

Infrastructure #49 is an approval request, not approval. Its approved topology,
separate operators, CP-owned admission/IDs, private credentials, run window,
external supervisor and independent evidence custody are still required for
that execution lane. Do not provision or execute it from this observer.
A topology approval for the two INT-03C workload clients also does not by itself
authorise a new human OIDC fixture or executive read grants. Obtain explicit
approval for the human/BFF handoff in its own scope.

The fixture owner must supply existing, independently approved real services:

- A private HTTPS BFF running the reviewed source, with OIDC/TLS Redis custody
  and the reviewed read-only navigation opt-in. Do not change R1 or dashboard
  flags, create clients, activate CMS or borrow an unrelated workload token.
- A current real human session for the own Organisation/Tenant/country, and a
  separate current real human session lacking at least one required own-scope
  navigation grant. Both must be independently registered CP Principals.
- For each human, a private CP-audience bearer resolving to that same canonical
  Principal, supplied by the approved issuer/fixture owner. The observer neither
  generates nor edits a token, and never decodes JWT claims as CP authority.
- Real CP-generated Organisation/Tenant/market references, ACTIVE own PRIMARY
  mapping and exact organisation.view, tenant.view and market.view grants.
- Approved source/image/host/TLS pins, aligned clocks, external supervision,
  immutable custody and a distinct reviewer. Declared source SHAs and a free-form
  approval reference in a plan are not independent verification of any of these.

No actual handoff, credential, Principal, approval, source/image runtime
attestation or live result is created in the implementation PR.

## Private input and modes

Copy [the intentionally incomplete plan](executive-navigation-observation-plan.json)
into an owner-controlled 0700 directory, with an owner-only 0600 regular file.
Fill only independently provided references and exact 40-hex source revisions.
Leave credentials out of the plan. The CLI rejects symlink/hard-linked/shared
files, malformed input, unsafe origins and unknown fields. The plan's future
absolute deadline is capped at 90 minutes; the observer itself permits at most
30 seconds of collection and five seconds per complete response.

Private credential variables (never CLI arguments or shell-history values):

| Variable | Meaning |
|---|---|
| NABHOLD_NAVIGATION_OWNER_SESSION | Own opaque BFF session handle |
| NABHOLD_NAVIGATION_DENIED_SESSION | Different valid human BFF session handle |
| NABHOLD_NAVIGATION_OWNER_CP_TOKEN | Own human CP bearer |
| NABHOLD_NAVIGATION_DENIED_CP_TOKEN | Different human CP bearer |

Use the approved private credential handoff or secret manager. No trace, HAR,
screenshot, debug logger, session export artifact or echoed header may retain
these values. Debug/preload options and disabled Node TLS are refused before
credentialed observation. A private CA remains owner-managed Node/system trust;
no certificate-ignore switch is provided.

Offline input inspection (no network, no approval):

```bash
pnpm observe:executive-context inspect --input /private/approved-run/plan.json
```

**Only after independently approved runtime and human-fixture handoff**, the
operator may collect read-only observations and privately retain their output:

```bash
umask 077
set -C
pnpm --silent observe:executive-context observe --input /private/approved-run/plan.json > /private/approved-run/observations.json
(cd /private/approved-run && sha256sum observations.json > observations.sha256)
```

The reviewer must independently verify the approved running sources/images and
retain, retrieve and rehash the original report in external immutable custody.
A local sidecar is not a signature or independent acceptance. The report's
`plan_sha256` hashes the validated plan serialization, not original input-file
bytes; any original private plan hash/custody is a separate reviewer obligation.
No CLI option certifies a run or releases a gate.

## Checks and evidence boundaries

The observer makes fixed-route GET requests only, with BFF cookies sent solely
to the reviewed BFF and CP bearers solely to the reviewed CP. It neither changes
CP data nor logs out/revokes a session or deletes a runtime.

1. Check both BFF sessions against their expected canonical Principals and fresh
   direct CP effective-authority reads. The own human must have all three exact
   grants; the denial peer must demonstrably lack at least one. An expired,
   unauthenticated or actually authorised peer cannot stand in for this negative.
2. Read the actual CP Organisation overview and Tenant. Verify ACTIVE unique
   PRIMARY mapping, names, explicit country/market/currency and current sources.
3. Require structured denial of anonymous access, caller query selectors,
   foreign Origin and the authenticated ungranted session. A bare status,
   unrelated problem or disabled feature's 404 does not pass.
4. Recheck both session identities; compare the own BFF context to the direct
   CP facts, strict non-execution response shape, expiry and private/no-store,
   Cookie-varying, non-CORS headers. Recheck CP grants after the context read.
5. Refuse stale/future/mismatched sources, grant changes, duplicate references,
   unsafe transport, oversized/malformed/stalled bodies, redirects, elapsed
   deadlines and clock rollback. Preserve incomplete checks as BLOCKED.

Returned observations contain fixed labels, status codes and body SHA-256 for
non-secret responses. Raw responses, names, IDs, URLs, credentials and errors
are not copied into the report. Session responses contain CSRF values and are
neither retained nor hashed. The report records only declared source pins;
source/runtime and topology approval attestation remain false.

Exit zero from inspect means shape-valid input only. Exit zero from observe
means at most OBSERVED_NOT_ACCEPTED. Missing prerequisites or mandatory checks
remain BLOCKED. Injected transports are labelled SYNTHETIC. Successful technical
observations cannot prove real browser login, issuer/session revocation,
independent evidence custody, disposal or protected staging/production signoff.
These remain explicit outstanding acceptance obligations in every report.

## Remaining sequence and rollback

After source CI/review/merge, obtain the independent approved handoff; only then
execute real observations, real browser/revocation cases and independent custody
and teardown. Current read-only context is not a human execution permit: CP/Shared
same-principal/delegated execution and provider mandates remain separate.
Infrastructure #49 stays approval-required; CMS activation under Accepted Shared
#354 stays HELD; all 14 NAB-03 cases BLOCKED and R0–R3 unreleased.

Rollback the observer PR/package script; the shared body reader keeps the prior
G17 default digest behaviour. There is no migration or persisted authority.
After an actual authorised run, the fixture owner must dispose of credentials,
sessions and runtimes with independent read-back; this observer certifies none
of that cleanup.
