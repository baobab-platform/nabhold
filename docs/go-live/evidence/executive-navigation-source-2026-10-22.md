# G04B-05 executive navigation source receipt — 22 October 2026

**Classification:** automated implementer source/test evidence; no independent
human, legal, provider, protected staging or production acceptance.
**Programme:** Accepted NAB-GOLIVE-MP-001 v2.0 and EA v2.3, retaining v2.2 L4 IDs.
**Scope:** concrete read-only human navigation integration. Privileged executive
capability execution remains a separate unresolved protocol/acceptance gate.

| Source | Immutable revision |
|---|---|
| Implementation tested locally | `dca2fe8861a176b9ba50e6ededb451e32a4fc4b3` |
| Nabhold merged starting source | `bc263486c635120b2ceea7f25a155fa9e32234a6` |
| CP human read-contract source | `bcea71bd9909be3672dfcb7ce78d04d6feb0e748` |
| Shared inspected contract/EA source | `6938b16d63805d3cf07e492aa574ac076bbee423` |

Authority: ADR-NAB-0004/0005/0006/0014; CP ADR-BCP-020/026/027 and existing
[CX-03B read-only human contract](https://github.com/baobab-platform/baobab-cp/blob/bcea71bd9909be3672dfcb7ce78d04d6feb0e748/docs/frontend/cx03b-enterprise-context.md).
The maintained Shared administration/v1 EffectiveAuthority and one-anchor scopes
remain authoritative. Narrow Zod projections validate only consumed fields;
this consumer creates no new scope, canonical identity or CP API.

## Implementation and safety

- Server-owned exact own Organisation/Tenant/country selection, default-disabled
  route and existing nonproduction OIDC/TLS Redis custody.
- Human IAM introspection and canonical CP identity, then three independent
  exact read grants. No platform/group expansion or cached browser authority.
- Actual CP HTTP adapter for existing effective-authority, organisation overview
  and tenant-record APIs; same human bearer, exact HTTPS destination, bounded
  body/transport and complete-collection deadlines, no redirects or retries.
- Source-backed ACTIVE own PRIMARY mapping and explicitly selected current
  market. Recheck identity and exact grants after resource reads and re-read
  local session custody before response publication.
- Minimal token-free response with `executionAuthority: false`, no persisted
  context, no mandate/command permission, private/no-store and Cookie variation.
- No database migration, account provisioning, registry mutation, source-lock
  rewrite, runtime execution or release flag change.

## Local validation

97 focused tests pass across the new executive-navigation suite and existing
executive capability, protected-operation and OIDC suites. Strict TypeScript
checking passes for the changed auth module/tests/handler and their imports.
Public test dependencies were installed in a disposable separate test runtime;
repository dependency declarations and lockfiles are unchanged. Full repository
quality/build/browser/security checks remain mandatory on the PR's exact final
head; no local full-application CI result is claimed here.

Coverage includes missing/broad/group/foreign/environment-mismatched grants,
mixed scope anchors, duplicate grant IDs, expired/time-bound permissions, optional standing-grant expiry bounds, missing
TIME_BOUND/JUST_IN_TIME expiries,
stale/future/mismatched identities and CP sources, missing/secondary/duplicate
PRIMARY mappings, inactive states, wrong Tenant, invisible/missing/duplicate
markets, mid-read IAM revocation/identity replacement/grant withdrawal, source
outage, redirect/oversized/malformed/stalled body, token/grant/overall expiry,
unsafe destinations, browser selector/Origin/cookie injection, concurrent local
logout and private response redaction/cache headers. Unrelated inactive tenant
rows cannot change the selected scope.

These tests use synthetic HTTP peers and temporary private session interfaces.
They prove source behaviour, not real issuer or CP execution. The tested code
revision above precedes documentation-only publication; later code changes must
record their own tests and exact candidate. No independently retained local
runtime receipt or external evidence custody is asserted.

## Remaining evidence and rollback

Owner-approved live identity/grants/mapping data, real protected HTTPS/custody,
current revocation/suspension behaviour and independent acceptance remain open.
No resource is created to bypass Infrastructure #49. Its topology approval and
seven real INT-03C cases remain separate. Accepted Shared #354's CMS activation
remains HELD; all 14 NAB-03 cases BLOCKED; R0–R3 remain unreleased.

Same-human or explicit delegated CP capability execution and domain-side
mandate/assurance are not supplied by read navigation. Never feed this result
to CurrentExecutiveContextResolver or a workload capability client. Rollback:
disable NABHOLD_EXECUTIVE_CONTEXT_ENABLED and revert the source change. There is
no new persisted authority or data migration.
