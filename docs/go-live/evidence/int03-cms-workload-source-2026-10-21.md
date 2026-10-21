# INT-03 CMS workload lifecycle — 21 October 2026

Classification: SOURCE CANDIDATE / bounded protocol tests, not real-component
CMS qualification. Accepted EA v2.3 retains the normative v2.2 NAB/L4 matrix.

## Fresh source and acceptance audit

| Repository | Audited main | Result |
|---|---|---|
| Shared | `ba5b4523ffc82cbf1b1d804b4d88ab69be04843a` | Accepted EA v2.3; product workload remains PROVISIONED |
| Infrastructure | `de1ced0c9cc1aba6f89caec0b337b48f097eb240` | #37 merged; only connected NAB-ID-01–04 acceptance |
| Nabhold | `243ec48b759dd4581f4caffea064e1641f5af053` | #80–82 merged; retained identity receipt accurately scoped |
| CMS | `e2001e5fcc26301dd019575b49db6f782e71714e` | Existing content/v1 route and CP validator; Node 22 drift |
| IAM | `63db55c87fda13762fc438a6d32a885a63ddb353` | Existing issuer/source, no new protected qualification |
| CP | `3810b8222fa6df09b829e7c725d534af10b1155c` | Existing current context/provider APIs, no new protected acceptance |

CMS [#40](https://github.com/baobab-platform/baobab-cms/pull/40) subsequently
merged at `f03b3b4db348cfee1ddf72dad7b3cbfbe76e0bab`: CI/image/.nvmrc converge
on Node 24.21.0, engines require Node 24 and npm 11. All 30 checks cleared and
exact head `2974acfe319e3d716915c63cb29114ecdb9e8423` review reported no findings.
Local Node 24.19.0 lint/typecheck, 259 tests, type generation and build passed.
The image build/scan and fresh-database migration gates passed in Actions.
CMS's pre-existing approved dependency-audit exception was not added or widened.

The affected-repository open-PR inventory found Shared #354 plus dependency
updates; no additional Nabhold, CP or Infrastructure engineering PR is pending.
Shared #354 owner acceptance is explicit in its PR and this implementation
session. The decision merged as [Shared #354](https://github.com/baobab-platform/shared/pull/354)
at `409d780d05f7825ab1228649541032d42a7b0b13` after 30 checks and a zero-finding
exact-head review. It defines both named development pre-proof ACTIVE
exceptions, independent credentials, absolute token deadlines, early-close
revocation/trust destruction and mandatory teardown. It does not itself add
registry rows, credentials, grants or bindings. Its separate prerequisite #355
patches the Vite/launch-editor high advisory; no dependency waiver is introduced.
Other dependency major upgrades remain separate compatibility reviews.
The same newly reported Vite advisory affected Nabhold's existing locked 7.3.6.
Its lock now selects patched 7.3.7 using the integrity from reviewed Shared #355,
without changing any private-package version/integrity or bypassing supply-chain
policy. Local authenticated lock regeneration was unavailable (private registry
401); Actions must verify the frozen lock and public/private integrity. Local
`pnpm audit --audit-level=high` passes with only the pre-existing ignored advisory.

## Source increment

Reuse the existing content gateway, resolver, `WorkloadTokenProvider`, CP
capability client and bounded HTTPS transport. Use maintained `openid-client`
client-credentials and introspection rather than another OAuth implementation.
There is no new Shared canonical contract or shadow Principal/tenant authority.

The opt-in profile is only `baobab-int03-cms-consumer` in `development`:

- Independently request CP `context:resolve` and CMS `content:entry:resolve`
  audience-limited tokens. No human credential, preview, validator, provider
  administration, product activation or production identity is selected.
- Acquire and introspect each token afresh. Require current active workload,
  exact issuer/client/audience/scope, bounded expiry and consistent verified
  `(issuer, sub)` across audiences. CP maps that identity to its own Principal.
  Neither an unverified decoded claim nor an estate-provided Principal is used.
- Resolve a fresh CP context per content read, supplying only canonical
  tenant/Organisation/country selectors. Require the returned exact selectors,
  valid UUID, fresh resolution time and bounded future expiry. CP still decides
  membership, PRIMARY Organisation and market; CMS still redeems the context
  using a separate validator and the actual caller token.
- Never reuse an invocation for another context. Denial or renewal failure
  cannot use a previous context or silently refresh someone else's identity.
- Require actual complete published singleton records in proof mode. Missing,
  denied, withdrawn, malformed or unavailable content raises a bounded error;
  no estate defaults or direct-Payload portfolio records can become proof.
  The same absolute deadline bounds the provider request and decoded response
  body through completion; late responses cannot become successful evidence.

## Deployment inputs and evidence boundary

The harness must supply these server-only inputs; no real secret belongs in git:

| Input | Required value/source |
|---|---|
| `NABHOLD_CMS_PROOF_ENABLED` | `true`, explicit disposable proof opt-in |
| `NABHOLD_WORKLOAD_ENVIRONMENT` | `development` |
| `NABHOLD_WORKLOAD_CLIENT_ID` | `baobab-int03-cms-consumer` |
| `NABHOLD_WORKLOAD_ISSUER` | Exact ephemeral trusted HTTPS issuer |
| `NABHOLD_WORKLOAD_TOKEN_ENDPOINT` / `NABHOLD_WORKLOAD_INTROSPECTION_ENDPOINT` | Reviewed HTTPS endpoints on issuer origin |
| `NABHOLD_WORKLOAD_CLIENT_SECRET` | Independent OS-random per-run secret, at least 32 characters |
| `NABHOLD_CMS_PROOF_DEADLINE` | Fixed absolute ISO timestamp, at most 90 minutes from client creation; never roll it forward |
| `NABHOLD_CONTENT_SOURCE` | `capability` |
| `BAOBAB_CONTROL_PLANE_API_URL` | Reviewed CP HTTPS origin |
| `NABHOLD_CONTENT_TENANT_ID` / `NABHOLD_CONTENT_ORGANISATION_ID` / `NABHOLD_CONTENT_COUNTRY_CODE` | Explicit synthetic canonical selectors with independently governed grants |
| `NABHOLD_CONTENT_DIGITAL_ESTATE_ID` / locale / optional market | Existing content port scope, not authority |
| `NABHOLD_SERVICE_ORIGINS` | Explicit HTTPS allowlist for resolved provider references |

`NABHOLD_CONTENT_CONTEXT_ID` is ignored in this proof profile: CP issues the
current context. Proof mode always disables fallback, independently of
`NABHOLD_CONTENT_FALLBACK=disabled`. Outside proof, existing explicitly injected
ports remain available, without making the product client ACTIVE.

Protocol tests exercise real maintained OAuth code with synthetic HTTPS peers,
current introspection, audience/subject/lifecycle/expiry denials, wrong
Organisation/tenant/country, renewal and dependency outage/restoration. They do
not run IAM, CP, Payload, PostgreSQL or TLS Redis together. Local focused
TypeScript validation and 89 workload/content tests pass using previously
installed dependencies; mandatory full clean-install CI remains the merge gate.

## Next acceptance dependencies

1. The reviewed Shared decision and dependency prerequisite are merged. Implement exact-row validation and IAM-owned per-run
   caller/validator provisioning/read-back against the unmodified approved
   registry, with independent secrets and enforced deadline/teardown.
2. CMS #41 is merged at `7122b220d4dde83cb87884ea7a40c0535f8feff5`: current
   independent development validator acquisition is implemented, with 298 tests,
   all 29 final-head checks and zero-finding exact-head review. The fixture must
   configure its explicit mode and distinct credential; no production borrowing.
3. Start actual Node 24 CMS/PostgreSQL with synthetic published home/nav/footer;
   use existing CMS-owned setup, registered provider APIs, independent
   maker/checker certification and current health/bindings. Preserve PARTIAL /
   non-production semantics; report BLOCKED if current policy prevents resolution.
4. Execute complete NAB-01–04 and all applicable universal L4 cases, including
   revocation, owner/tenant/context negatives, withdrawal, outages, restoration,
   exact provenance and teardown. Identity-only smoke cannot close these gates.

Native protected Kratos/Hydra IAM–CP, executive authority, legal admission,
protected staging, production and R0–R3 remain OPEN. Nabhold stays non-trading;
parent/subsidiary relationships confer no access. The earlier identity artifact
digest remains GitHub-reported, not independently downloaded/rehashed here.
