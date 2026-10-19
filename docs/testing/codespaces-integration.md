# Nabhold Codespaces integration harness

Status: **source preparation; real execution BLOCKED pending infrastructure handoff**.
Date: 17 October 2026. Scope: `keycloak-identity-smoke`, not full INT-03.

Governing decisions: Accepted ADR-NAB-0004 (dedicated confidential client,
provider authentication, current CP identity), ADR-NAB-0014 (Organisation-first
context, Option B autonomy and separate legal-actor authority), Go-Live v2.0
G04B/G05 and EA v2.2 INT-02 → INT-03. This source increment changes no authority
or release decision. Nabhold remains a non-trading holding estate.

## Two distinct modes

| Command | Dependencies | Claim |
| --- | --- | --- |
| `pnpm dev`, `pnpm test:e2e` | Existing public development profile; browser suite explicitly enables development content fallback | Public estate regression only |
| `pnpm integration:check` | Explicit private integration environment file | Configuration validation only; no connectivity or provider acceptance |
| `pnpm dev:integration` | Infrastructure-owned private HTTPS edge, real IAM/CP and TLS Redis | Starts Nabhold on private HTTP upstream port 3000; no dependency provisioning |
| `pnpm test:e2e:integration` | Already-running integrated Nabhold plus synthetic human fixture | Real issuer discovery, browser login, current CP identity, session cookie and local revocation smoke |

The integration runner never starts the fallback Playwright webServer. It does
not auto-start engines, alter #35, register clients, grant access, create a CP
Principal, or fabricate credentials. It also does not run on every hot reload.
The normal Codespaces devcontainer remains the lightweight public profile.

## Infrastructure handoff required before running

Infrastructure #35 owns INT-02, which is necessary but does not currently export
this complete Nabhold handoff. Its existing private `iam.int02.test` /
`cp.int02.test` network is not automatically reachable from a separate Nabhold
Codespace. Extend the Infrastructure laboratory rather than exposing IAM, CP,
Redis or their databases on public forwarded ports.

1. Start exact reviewed IAM, CP, Shared and infrastructure source revisions in
   the disposable integration profile. Record all four **actual** commit SHAs.
   The harness checks pin syntax, not remote service provenance; the orchestrator
   must bind the running images/checkouts to those pins. A green smoke cannot
   certify INT-02 or bless an unmerged #35 revision.
2. Attach the Nabhold process and test browser to the laboratory's private DNS
   and network. Supply three distinct, resolvable HTTPS origins for Nabhold,
   IAM and CP. Route Nabhold's HTTPS edge to port 3000 and preserve its reviewed
   Host and forwarded scheme so the BFF sees the exact configured HTTPS origin.
   A forwarded Codespaces URL is usable only if IAM, the BFF, and the test
   browser can all reach the registered callback without a Codespaces sign-in
   wall. Never register a wildcard callback to work around this.
3. Register a dedicated IAM-governed `nabhold-…` confidential client, exact
   `<NABHOLD_OIDC_ORIGIN>/api/auth/callback`, code flow/S256,
   `client_secret_basic`, approved signing algorithm and introspection endpoint.
   Never reuse the INT-02 test/admin client. For this BFF's current profile,
   issued and introspected access tokens must carry CP audience
   `baobab-control-plane`, `authority:self`, and the dedicated `client_id`.
   The current BFF requests `openid`; IAM's reviewed default-scope/mapper policy
   must supply the required authority scope. Do not bypass that check in tests.
4. Provision a disposable non-admin human in the real Keycloak federation
   path, already mapped by verified issuer/subject to an active CP Principal.
   Supply that expected canonical UUID and synthetic login credentials. The
   current smoke assumes no required-action/MFA prompt for this *synthetic*
   fixture only. It changes no real-user MFA policy and proves no step-up path.
5. Supply real TLS Redis, a dedicated prefix-scoped ACL for
   `nabhold:bff:v1:<epoch>:*`, and the approved SET/GET/GETDEL/DEL plus handshake
   operations. Provide random 32-byte AES keys as canonical base64 JSON, an
   active key ID and recovery epoch. No process-local session substitute.
6. Install the disposable CA in Chromium's trust store and supply its readable
   absolute file path through `NODE_EXTRA_CA_CERTS` before Node starts. The
   preflight requires an owner-readable regular file belonging to the invoking
   UID, with one hard link, no symlink and no group/other write permission, at
   most 256 KiB, containing only valid PEM CA certificates. Public 0644 CA
   bundles are allowed; credential dotenv files remain owner-private. Protect
   all parent directories from replacement and keep these files unchanged
   throughout the run: Node reads the CA path again at child startup.
   This verifies file syntax and
   readability; live trust and issuer acceptance still require the browser run. Redis
   uses system trust or the optional literal multiline CA PEM separately.
   Never disable TLS verification or use Chromium certificate-ignore flags.
7. Keep all credentials synthetic and owner-private; teardown the isolated
   stack, synthetic identities and private files through Infrastructure after
   use. The harness owns no shared volume and therefore never deletes one.

The template intentionally leaves credentials, source pins and origins empty.
It is not a provisioned `.env.local`. Nabhold does **not** need direct IAM/CP/
ERP PostgreSQL URLs: those engines own their databases. Only the BFF's TLS
Redis connection is configured here. CMS/ERP capability consumption must go
through the accepted authority and provider boundaries.

## Commands after receiving the handoff

Use the repository-declared Node 24 and pnpm 11.24.0 versions. Install the matching
Playwright Chromium (`pnpm exec playwright install chromium`) or set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to the preinstalled baobab-dev binary.

```bash
cp .env.integration.example .env.integration.local
chmod 600 .env.integration.local
# Populate every required empty value from the disposable lab handoff.
export NABHOLD_INTEGRATION_ENV_FILE="$PWD/.env.integration.local"
pnpm integration:check
pnpm dev:integration
```

In a second terminal in the same private network:

```bash
export NABHOLD_INTEGRATION_ENV_FILE="$PWD/.env.integration.local"
pnpm test:e2e:integration
```

Do not `source` the dotenv file. Its parser treats dollar signs literally and
accepts literal multiline quoted PEM; it performs no variable expansion. The
file is read through a bounded, no-follow descriptor and must be an owner-only
regular file. The dedicated file overrides inherited documented values;
required empty fields are refused. Do not copy browser credentials to the
standard `.env.local`. The launcher removes them from the Next child process.

The runner rejects `NODE_OPTIONS`, `DEBUG`, `PWDEBUG`, disabled Node TLS,
content fallback, dashboard preview and R1–R3 activation. Integration API origins
must be HTTPS, without credentials/query/fragment; application/CP origins have
no base path or trailing slash. Unknown keys in the private file are refused.

## Test and diagnostic boundaries

The browser suite creates fresh contexts. It proves anonymous session denial,
unsolicited callback denial, cross-origin login denial, real Keycloak login,
expected current CP Principal, secure HttpOnly opaque session custody, and
server-side local logout revocation by replaying the previous handle. CP/Redis
must actually work for that positive journey; health checks alone do not count.
Local logout is not global IAM SSO logout.

No request mocks, token minting, preloaded storageState, screenshots, video,
traces or HAR are used. A dedicated reporter emits fixed status messages and
suppresses assertion/navigation payloads. Output files are not retained. The
Next integration launch suppresses stdout/stderr because dev request logs can
contain callback codes. Inspect sanitized, private Infrastructure component
diagnostics for failures; do not enable protocol debug logging around secrets.
These controls do not sanitize upstream reverse-proxy/issuer logging: the
Infrastructure profile must enforce equivalent custody there.

### G17 identity-smoke observations

`test:e2e:integration` requires a **clean committed Nabhold checkout**, then
creates an owner-private `.integration/identity-smoke-*` directory for that run.
`started.json` records the actual local Nabhold commit and the four declared
Infrastructure/IAM/CP/Shared pins. Dependency pins remain **unattested operator
declarations** until Infrastructure binds them to the running components.
The launcher prints the receipt path after the browser process terminates.

| Scenario | Observation |
|---|---|
| NAB-ID-01 | Anonymous session denied |
| NAB-ID-02 | Unsolicited callback denied |
| NAB-ID-03 | Cross-origin login initiation denied |
| NAB-ID-04 | Real federation login/current CP identity, confidential cookie, CSRF denial and server-side local logout revocation |

The reporter writes only these fixed identifiers and framework statuses.
`completed/receipt.json` requires all four checks passed, a complete reporter result and
successful process exit for an identity-smoke `PASS`. Missing/filtered/duplicate/
skipped checks, setup errors, crashes and interrupted children produce
`INCOMPLETE_OR_FAILED`; absent observations remain `notRun`. No title, diagnostic,
attachment, host, Principal, cookie or credential is copied into the receipt.
`started.json`, `observations.json`, `completed/receipt.json` and
`completed/receipt.sha256` are write-once, mode 0600 files inside mode 0700
directories. Both final files and their staging directory are synchronized
before an atomic directory rename publishes `completed`; the parent is then
synchronized. A failed staging write, staging synchronization or pre-publication crash leaves
only `.finalizing`, which is incomplete even if it contains a PASS candidate.
Only the complete published pair is a receipt. Results from a previous run
cannot satisfy the new run. A forced termination of the launcher itself may
leave only `started.json`; that is incomplete, never PASS.

The SHA-256 file detects alteration; it is **not a signature or independent
attestation**. Infrastructure owns immutable artifact retention and runtime
provenance. A successful receipt describes only this synthetic-human identity
smoke. It explicitly sets `acceptanceClaimed=false` and
`dependencyRuntimeAttested=false`; it cannot qualify INT-02, full INT-03, CMS,
ERP, protected staging or a release. No real run is asserted by unit tests.

Run receipt/reporter regression checks without package-registry credentials:

```bash
node --experimental-strip-types --test scripts/integration/evidence.node.mjs
```

CI runs those checks before installing packages. Rollback: revert this source
increment and retain existing observations under the evidence policy; never
reinterpret an old identity smoke as full integration acceptance.

Source unit tests cover configuration rejection, private file handling and
compatibility with the real OIDC/store factories; they are mandatory in normal
`pnpm test` CI. Real browser smoke is invoked explicitly once Infrastructure
provides the environment. Its success message explicitly withholds acceptance.
Do not add a skipped/mock integration job and report full integration as green.

## Remaining INT-03 and release work

- Complete #35's real IAM↔CP mandatory scenarios and review/merge qualification.
- Deliver the above network/TLS/client/Redis/fixture handoff and run this smoke
  against the actual pinned stack in Codespaces and CI.
- Extend provider-owned fixtures for Kratos, MFA/step-up, IAM revocation, expired
  sessions, CP deactivation, grant changes, wrong audience, unavailable services
  and independent subsidiary/external-tenant denials. This suite does not yet
  test business authority, Organisation context or tenant membership.
- Add real CMS `content.entry.resolve` context, binding and publish/unpublish
  acceptance with fallback disabled. Current identity-only smoke does not
  enable the canonical CMS capability profile or prove public content readiness.
- Add ERP Finance journeys only when their accepted provider operations exist;
  pair browser journeys with native persistence/COMMIT and accounting evidence.
- Retain and attest the sanitized identity-smoke receipts through Infrastructure,
  independently verify deployed source pins, expand evidence for the remaining
  scenarios and obtain independent gate review. G04B/G05/G16/G17/G18 and R0–R3
  remain unaccepted.

Implementation references: [Playwright web-server lifecycle](https://playwright.dev/docs/test-webserver)
and [trace contents](https://playwright.dev/docs/trace-viewer-intro). The separate
configuration intentionally leaves server lifecycle with Infrastructure and
avoids credential-bearing trace artifacts.
