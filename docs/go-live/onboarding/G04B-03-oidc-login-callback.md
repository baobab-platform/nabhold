# G04B-03 — Confidential OIDC login/callback and current IAM/CP identity

Source increment, 15 October 2026. **PARTIAL: protected operational acceptance
and production activation remain blocked.** No identity, client, scope, grant,
Tenant, binding or legal mandate is created by this increment.

## Authority and research

Read against Accepted ADR-NAB-0004, its Organisation-first ADR-NAB-0014 amendment,
Accepted IAM ADR-IAM-0023 and current native-human handoff implementation. IAM
ADR-0006 is Proposed; it is supporting design context, not new accepted policy.
CP source consulted at `8c129a1` (`api/effective_authority_handler.go`, router,
identity resolution); IAM source at `5dae8c4` (`docs/operations/native-human-handoff.md`).
CP's `GET /v1/admin/effective-authority` requires a human token with
`authority:self`, resolves verified `(issuer, subject)` without provisioning,
and refuses unknown/inactive canonical Principals. Its grants are administrative
observations, **not executive or CMS authorisation**. This increment discards
them. A Principal UUID is never inferred from provider `sub`, email or roles.

Protocol research: [OAuth security BCP (RFC 9700)](https://www.rfc-editor.org/rfc/rfc9700.html),
[OIDC Core code flow](https://openid.net/specs/openid-connect-core-1_0-errata2.html#CodeFlowAuth),
[openid-client authorization checks](https://github.com/panva/openid-client/blob/v6.8.8/docs/interfaces/AuthorizationCodeGrantChecks.md),
and [explicit signature checks](https://github.com/panva/openid-client/blob/v6.8.8/docs/functions/enableNonRepudiationChecks.md).
Next route-handler/cookie guidance was read from the installed Next 16.4 docs.
`openid-client` 6.8.8 is pinned, matching the consulted CMS dependency; its
independent ID-token signature checks are explicitly enabled (TLS alone is not
the identity verification used here). Only RS256/ES256 may be configured.

## Implemented boundary

1. `/sign-in` presents an IAM continuation, with no estate password collection.
   Disabled unless explicitly configured. `POST /api/auth/login` requires exact
   Origin and rejects cross-site Fetch Metadata. Browser input cannot select a
   provider, client, callback, scope, return destination or credential endpoint.
2. Discovery must match the exact configured issuer, advertise code/S256 and the
   configured asymmetric algorithm and confidential Basic authentication. A narrow
   metadata projection pins authorization, token and JWKS endpoints to that
   issuer's HTTPS origin. Server requests forbid redirects, use no cache, cap
   decoded JSON at 64 KiB and bound header/body completion to five seconds.
3. Fresh state, nonce and S256 verifier are retained in the encrypted G04B-02
   store. Separate random `__Host-nabhold-login` and `__Host-nabhold-browser`
   Secure/HttpOnly/Path=/, SameSite=Lax cookies bind a five-minute attempt to
   the initiating browser. No tokens/verifiers are put in cookies or JS storage.
4. Callback burns the attempt with GETDEL before parsing state/code/error or
   exchanging a code. Wrong binding burns it too. State/code duplicates,
   unexpected issuer, changed client/callback, expiry and failed validation deny.
   The maintained library validates state, PKCE exchange, issuer, audience,
   nonce, validity and the ID-token signature using the issuer JWKS. Failed or
   uncertain exchanges are never retried. ID/refresh tokens and roles are discarded.
5. Before issuing an estate session, current trusted IAM introspection must report
   active, exact issuer/subject/client, future expiry, CP audience and
   `authority:self`. CP must independently authenticate the bearer, resolve the
   active canonical human identity and return a fresh, well-formed self response.
   IAM credentials go only to the configured issuer introspection endpoint;
   the access token goes only to that endpoint and the fixed CP self route.
6. Successful callback issues a fresh opaque `__Host-nabhold-session` cookie,
   Secure/HttpOnly/Path=/, SameSite=Strict, and clears both attempt cookies.
   A presented prior session is revoked before replacement. Sessions in other
   browsers remain independently bounded; this is not global session revocation.
   Absolute server lifetime is the minimum of ID/access-token expiry and fifteen
   minutes. No refresh, sliding extension or client-side token custody exists.
7. `/account` and `GET /api/auth/session` recheck IAM and CP on **every read**.
   Outage, revocation, expiry, changed audience, suspended/unmapped Principal,
   stale CP response or unavailable store denies; no stale success cache exists.
   Only canonical Principal, expiry and a logout CSRF token may be projected.
   Account pages use nonce CSP, no-store, no-referrer and noindex.
8. `POST /api/auth/logout` requires same Origin, a bounded form and the exact
   session CSRF token, then deletes the stored session and clears cookies. It
   works during IAM/CP outage. This is estate logout, not provider SSO logout.

`getSession()` and the R1–R3 executive dashboard remain release-gated preview
abstractions; this new identity landing page grants no executive permission.
Every future protected business operation still needs current CP estate/context,
capability resolution and domain authorisation, including step-up where required.
No local mapping from administrative grant names to GroupRole is introduced.

## Protected configuration and remaining prerequisites

Keep `NABHOLD_OIDC_ENABLED=false` normally. An authorised deployment operator must
supply all server-only values from `.env.example`: approved estate HTTPS origin,
exact issuer, registered confidential client ID/secret, approved issuer-owned
introspection endpoint, CP HTTPS origin, algorithm, and explicit environment
`development`, `integration` or `staging`. `production` is refused by this source
profile. G04B-02 verified-TLS Redis ACL, keyring and recovery epoch must separately
be enabled; no memory fallback exists. No `NEXT_PUBLIC_*` credential mirrors.
Never set `NODE_TLS_REJECT_UNAUTHORIZED=0`. All proxies/CDNs must redact cookies,
authorization headers, token POST bodies and callback query strings from logs.

The approved client must register **exactly** `<estate-origin>/api/auth/callback`,
Authorization Code/S256, confidential Basic authentication and the selected
signature algorithm. Approval must establish that its current human access token
is valid for `baobab-control-plane` with `authority:self`, and that the client is
permitted to introspect it. This code requests only `openid`; it does not invent
resource audience parameters or expand the native handoff's current retained
scope contract. **The current native handoff supports only openid/profile/email,
not business scopes or resource audience requests.** If no approved token profile
can satisfy CP's checks, callback remains denied. Complete the governed IAM/Shared
client/profile work and protectively validate it before enabling this route.
Do not remove CP checks or substitute workload/provider-admin credentials.

Operational acceptance still requires real native/federated humans, active CP
external-identity links, authorised operator execution, full provider browser
journeys, revocation/expiry/recovery/logout observations, and independent acceptance.
This increment proves no MFA/step-up, global logout, capability access or R0 release.
P0-03/P0-04/P0-05/P0-06/P0-07 retain their independent blockers.

## Validation and rollback

Unit protocol tests use the real OIDC implementation and cryptographically signed
RSA ID tokens/JWKS, with synthetic HTTPS provider/CP responses and encrypted store
fixtures. They cover successful S256 exchange, nonce/signature/issuer/audience/
expiry failures, callback replay/binding/duplicate rejection, fresh revocation,
CP denial/staleness, unavailable storage, endpoint confinement, bounded/stalled
bodies, rotation and CSRF logout. This is source evidence, not live IAM acceptance.
The existing mandatory real TLS Redis suite separately verifies cross-worker
atomic consume, TTL, ciphertext, ACL/TLS failure and revocation. Browser CI checks
disabled routes, anonymous account denial and no estate password collection.

For rollback, disable OIDC activation, fence/drain all old workers and credentials,
and revoke/drain sessions using the G04B-02 recovery runbook before reopening.
A flag change does not globally revoke previously issued server records. Never
restore a preview identity, stale authority, old recovery epoch or plaintext store.
Next source work is the approved CP-audience human-client/profile handoff and
estate/context authorisation integration; protected real-client acceptance remains
external to this source increment.

## Trusted TLS proxy ingress

Next 16.4.2 can construct `nextUrl` using its private bind host and port even
when the browser used the configured HTTPS estate origin. The opt-in
`NABHOLD_OIDC_TRUST_PROXY=true` permits that transport difference only when
`Host` and `X-Forwarded-Host` exactly equal the configured origin's authority
and `X-Forwarded-Proto` is exactly `https`. The ingress must overwrite all three
headers and block direct application access. Comma-separated/absent/wrong
forwarded values deny; no incoming header supplies a credential destination.
The callback keeps its path/query but uses only the configured public origin.
POST Origin and Fetch Metadata checks remain mandatory. Default false retains
the existing exact request-URL check. Never enable this behind an untrusted or
publicly bypassable proxy. This fixes source interoperability, not protected
client activation, executive authority or INT-03 acceptance.

The exact sign-in page's enforced `form-action` includes self plus the validated
configured HTTPS IAM origin. Chromium can enforce this policy on the POST
redirect, so self-only would block the intended federation navigation. This
exception adds no script/API/frame access and is absent from other routes.
ADR-NAB-0004's 20 October implementation clarification records the boundary.
