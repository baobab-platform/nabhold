# G04B-02 — confidential BFF session custody

**Plan:** NAB-GOLIVE-MP-001 v2.0, P0-04/G04B.  
**Scope:** server-side storage prerequisite for confidential OIDC/BFF login.  
**Authority:** Accepted ADR-NAB-0004/0006/0014 and ADR-IAM-0033.

## Critical-path review — 15 October 2026

Nabhold main `cca8f67458deab51f604c05417c5e5ce2d05c812` contains the accepted
plan, verification preparation, operator diagnostic, protected technical
observation workflow and current institutional UI. No open Nabhold PR was
present at the review. The first unresolved operational exits remain P0-03
independent legal verification and P0-04 real operator identities; these need
protected source/identity access and independent human decisions.

The next implementable source dependency is G04B confidential sessions. The
current `getSession()` is preview-only, and the sign-in page has no live OIDC
flow. Wiring a callback before shared atomic transaction storage would permit
cross-worker replay and tempt process-local session/token custody. This
increment implements that storage prerequisite; the next source step is the
reviewed OIDC login/callback adapter using it, followed by current IAM and CP
checks. It creates no identity, grants no executive access and signs no release.

## Implemented behaviour

| Concern | Behaviour |
|---|---|
| Browser handles | 256-bit OS-random opaque handles; only SHA256 handle digests enter Redis keys |
| Login transactions | Original issuer/client/redirect/scopes/state/nonce/S256 verifier tuple, encrypted with browser-binding digest; maximum five-minute absolute lifetime |
| One-time callback | Redis GETDEL atomically removes the transaction before expiry/binding/decryption checks; a failed/uncertain consume is never restored or retried |
| Session custody | External issuer+subject, opaque access token and CSRF secret stored server-side only; maximum one-hour absolute lifetime and no refresh token |
| Encryption | AES-256-GCM with fresh 96-bit nonce; AAD binds version, key ID, recovery epoch, record type and hashed handle |
| Expiry | Redis SET NX PXAT plus application absolute-expiry checks; reads never renew the lifetime |
| Revocation | Idempotent Redis DEL; subsequent reads by another worker return no session |
| Transport | Official node-redis client, certificate/hostname verification, TLS 1.2 minimum, explicit ACL credentials, three-second operation deadline |
| Failure | No reconnect replay, offline buffering, local storage fallback or raw errors; timeout destroys the connection and an uncertain login must restart |
| Boundaries | Strict private record schemas reject added roles/permissions; external subject is never treated as a CP Principal |

The backend uses a separate bounded connection per operation. This deliberately
trades connection overhead for simple fail-closed failure semantics at the
first integration boundary. Capacity/connection limits require protected load
qualification before replacing it with a governed pool. No token, handle,
password, decrypted record or raw Redis error is logged.

## Operator configuration and storage ownership

The adapter is **off by default**. `createConfidentialStoreFromEnv()` returns
null until `NABHOLD_BFF_STORE_ENABLED=true`; malformed enabled configuration
throws a generic storage error rather than selecting a fallback. The flag
enables only storage construction, never a public route or executive access.

Provide the documented `.env.example` names through an approved secret store:
TLS Redis hostname/port, ACL username/password, optional private CA,
`NABHOLD_BFF_STORE_KEYS_JSON`, active key ID and recovery epoch. The key map has
one active and at most two retiring 32-byte CSPRNG keys, in canonical base64.
Use a new dedicated Redis identity and no default credential. Runtime should
allow only the reviewed `nabhold:bff:v1:<epoch>:*` prefix and SET/GET/GETDEL/DEL,
plus the minimal AUTH/HELLO and CLIENT handshake operations needed by the
pinned client. Deny scans, scripts, configuration, flush and other estates'
keys. Enforce reviewed durability/HA, eviction, ACL, backup and alert policy.
Redis 6.2 or newer is required for GETDEL/PXAT; deployment version approval and
patching remain infrastructure-owned.

This is token custody, not authentication validation. The later callback must
validate state/nonce, S256, signature, issuer, audience and subject before
creating a session, using the current IAM flow. Every protected request must
recheck provider revocation/expiry and current CP identity/context/domain
permission. Redis availability or an intact record alone never grants access.
Future cookies require Secure, HttpOnly, __Host- naming, path=/ and appropriate
SameSite/CSRF controls; this increment does not set cookies or bypass existing
R1/R3 guards. Logout must obtain a successful local revoke before reporting
success, and perform separately governed provider revocation as applicable.

## Key rotation and recovery

1. Generate a new independent key in the secret store; retain the old key under
   its original ID, deploy both, and make the new ID active for new records.
2. Allow no more than the maximum session lifetime before removing a retiring
   key, after fencing/draining workers that still issue with it. Unknown or
   removed keys fail closed. Rotation does not extend a record's lifetime.
3. During disaster recovery, fence old workers and their Redis ACL credentials,
   then deploy a new approved recovery epoch and fresh credentials/keys.
   New-epoch stores do not read restored old-epoch handles. The namespace is
   not a global lock: old workers with still-valid old credentials must be
   stopped/revoked by operations before reopening service.
4. Do not restore deleted sessions or consumed login records into an active
   epoch. If replay status is uncertain, use a new epoch and require login.

The server-side encryption key necessarily resides in process memory while
used. Keep secret-store access, crash dumps, diagnostic tooling and deployment
permissions restricted. No committed secret, local key generator or production
activation is introduced here.

## Verification

CI explicitly selects Node **22.23.3**, matching the deployment Dockerfile,
rather than inheriting Node 24 from the frontend tooling image. It installs
OpenSSL development headers for the ephemeral TLS fixture build.
The required CI step builds Redis **8.10.2** from exact official source commit
`498ecd0d6d007db11ddb3aea9428552598a78622`, outside the repository. A moved tag
fails verification. Tests generate an ephemeral self-signed fixture CA,
certificate, ACL password and encryption key; start a real Redis TLS-only
listener on a dynamic loopback port; and erase all fixture files/process state.
The test suite fails if the Redis binary is absent rather than skipping.

```bash
scripts/build-test-redis.sh /absolute/new/scratch/redis-source
NABHOLD_TEST_REDIS_BINARY=/absolute/new/scratch/redis-source/src/redis-server \
  pnpm test:auth-store
```

Real integration proves concurrent single consumption across two worker
instances, actual TTL expiry, encrypted token custody, cross-worker revoke,
wrong-browser burn, trust/credential rejection and namespace ACL denial. Unit
tests cover record tampering/transplant, key rotation/removal, recovery epoch,
clock rollback, bounds, closed authority-free schemas, copied key buffers and
secret-free uncertain-operation errors. Lint, typecheck, all unit tests and
production build are required alongside this suite before merge.

These are source and local/CI runtime checks. Actual IAM login, protected
staging, tenant onboarding, CMS publication/rollback and independent G17
acceptance remain pending. No P0-03/P0-04/P0-05/P0-06/P0-07 operational exit or
R0/R1/R2/R3 release status is promoted.

## Consulted sources before implementation

- Nabhold Accepted ADR-NAB-0004 §§11–16, session/revocation/CSRF and failure
  semantics; ADR-NAB-0006 and ADR-NAB-0014; accepted masterplan G04B.
- IAM `5dae8c44e943fc0106c1d4a8867a1c8a999a2234`, Accepted ADR-IAM-0033 and `docs/operations/native-human-handoff.md`:
  original retained browser transaction, current native session and exact
  challenge matching; CP remains the canonical identity authority.
- CP's existing server-side OIDC/Redis custody implementation was consulted
  for its boundaries; this estate does not copy CP admin authority or create
  a competing canonical identity mapping.
- [Redis GETDEL](https://redis.io/docs/latest/commands/getdel/),
  [node-redis connection configuration](https://redis.io/docs/latest/develop/clients/nodejs/connect/),
  [node-redis client options](https://github.com/redis/node-redis/blob/master/docs/client-configuration.md),
  [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html), and installed Next
  16.4 cookie/route documentation.

Rollback: revert the module/dependency/CI increment before routes consume it.
After future live adoption, disable login and revoke/drain affected sessions
before changing storage or epochs; never fall back to the preview session.
