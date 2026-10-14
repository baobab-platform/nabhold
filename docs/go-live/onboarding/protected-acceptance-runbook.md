# G17 — protected identity, onboarding and CMS technical acceptance

**Authority:** accepted NAB-GOLIVE-MP-001 v2.0, ADR-NAB-0004/0006/0014,
CP ADR-BCP-007/009/026/027 and CMS ADR-0012/0017. This runner implements
technical observations. It neither performs the independent onboarding ceremony
nor signs protected acceptance or production activation.

## What is implemented

`pnpm acceptance:protected` consumes a reviewed metadata plan and eleven
separate short-lived credentials. It executes the following chain in order:

| Lane | Executable check | Meaning and limit |
|---|---|---|
| G04 | Each of seven human tokens obtains its own CP effective-authority projection | Exact planned Principal and fresh staging PLATFORM grants; not browser SSO, office-holder evidence or action authorisation |
| G02 | Registrar reads the permission-filtered Organisation overview | Expected active Organisation and exactly one visible PRIMARY Tenant with reviewed isolation/residency and a usable observed state; not proof that every admission/verification step completed |
| G05 | Workload resolves content.entry.resolve through CP | Fresh decision, exact context/correlation/contract major and reviewed binding/provider/engine instance; no inferred binding or registry activation |
| G05 | Eight negative requests exercise CMS | Missing credential, wrong audience, missing scope, rejected credential, different controlled Tenant/context, missing context and unauthorised preview must receive exact structured denials |
| G05 | Read expected published CMS record | Exact record, Tenant, key, estate and locale; no preview, fallback or local fixture is accepted |
| G17 | Observation freshness and report digest | No stale observation resurrected during collection; report remains non-authorising |

Transport uses reviewed origins, HTTPS for staging, fixed existing routes,
redirect refusal, no retries/cache, five-second header/body deadlines and a
1 MiB decoded-response ceiling. Errors, response bodies, content data, tokens
and Principal/Organisation/Tenant identifiers never enter the report. Only
check names, codes, correlation UUIDs, timestamps and SHA256 digests are emitted.
A digest identifies an observation; it does not sign or authenticate evidence.

CP's Organisation overview requires the registrar's existing `canonical:read`
OAuth scope and current `organisation.view` authority for the Organisation;
its PRIMARY Tenant row also needs exact tenant-scoped `tenant.view` authority.
The existing platform admin route requirements still apply. A missing/hidden
row fails rather than borrowing a sibling or unqualified platform grant.
No permission is added by this tool or by a successful preflight.

## Required real inputs

Copy [protected-acceptance-plan.json](protected-acceptance-plan.json) to an
owner-private regular file (`chmod 600`). The committed nulls intentionally
refuse execution. Fill only from current IAM/CP/CMS reviewed state:

- staging CP and CMS HTTPS origins; seven distinct canonical human Principal
  UUIDs using the operator preflight role mapping;
- Nabhold PRIMARY Organisation UUID and Tenant ID, reviewed isolation and
  af-south-1 residency;
- a fresh RUNTIME context issued for the real Nabhold workload, DigitalEstate
  ID and expected published singleton record;
- current CP binding, provider and engine-instance identifiers;
- a different controlled nonproduction Tenant and context that the Nabhold
  workload is forbidden to use. Do not invent an ID and call a 404 isolation
  acceptance; the controlled negative must come from the reviewed test estate.

The plan is metadata only: the closed schema rejects credential fields. Names,
CIPC registrations, placeholder UUIDs and a workload's PROVISIONED registry
entry cannot replace live identity/grant/onboarding/binding prerequisites.

Supply credentials privately through these process/environment secrets:

| Names | Required credential |
|---|---|
| `NABHOLD_OPERATOR_<ROLE>_TOKEN` | Seven separate CP-audience human credentials, using the exact role names in the [operator runbook](P0-04B-operator-preflight-runbook.md) |
| `NABHOLD_ACCEPTANCE_RESOLVE_TOKEN` | Actual workload CP-audience context:resolve token |
| `NABHOLD_ACCEPTANCE_CONTENT_TOKEN` | Actual workload CMS-audience content:entry:resolve token without preview authority |
| `NABHOLD_ACCEPTANCE_MISSING_SCOPE_TOKEN` | Independently issued CMS-audience workload token that lacks content:entry:resolve |
| `NABHOLD_ACCEPTANCE_REJECTED_TOKEN` | Controlled expired/revoked credential from the reviewed negative rehearsal |

All eleven tokens must be distinct. A positive CP token is also tested against
CMS to exercise audience refusal. The missing-scope token must be issued in a
controlled IAM scenario; a CMS 403 alone cannot distinguish missing scope from
another context denial. Likewise, rejection alone does not prove a revocation
ceremony: record the prior successful use and subsequent authorised revocation
in restricted IAM/CP evidence before claiming that exit. Tokens are never
passed as command arguments, stored in this plan or printed to the shell.

## Local execution

```bash
node --experimental-strip-types scripts/run-protected-acceptance.mjs \
  --input /operator-controlled/private-plan.json --require-staging \
  > protected-observations.json
sha256sum protected-observations.json > protected-observations.sha256
```

Use a secret-store/session mechanism to populate the environment; do not paste
token literals into commands or enable shell tracing. The direct Node invocation
keeps wrapper banners out of the JSON file. Input uses one no-follow descriptor,
rejects nonregular/foreign-owned/group-readable files, and reads at most 32 KiB.

Exit **0** means only `OBSERVED_NOT_ACCEPTED`: every technical check passed and
remained fresh. Exit **2** means configuration or observation is blocked.
`protected_staging_accepted`, `onboarding_accepted` and `production_authorized`
are always false. Local loopback HTTP requires environment=local and remains a
LOCAL_REHEARSAL; the staging flag refuses it. Injected test transports are always
labelled SYNTHETIC. Production input and TLS bypass are refused.

## Protected GitHub execution

The `Nabhold Protected Technical Acceptance` workflow is dispatch-only on main,
serialised, bounded and references the `staging` environment. Repository owners
must configure that environment **before** providing service secrets:

1. Required independent reviewers; prevent self-review; disable admin bypass.
2. Restricted deployment branches allowing main.
3. `NABHOLD_ACCEPTANCE_PLAN_B64`: base64 encoding of the reviewed non-secret
   metadata plan (encoding is not encryption).
4. The eleven named short-lived environment credentials above, populated from
   the approved secret store/IAM flow for the run.
5. Runner network reachability to CP/CMS. Use an approved runner placement if
   services are private; do not expose private endpoints to make a test pass.

The workflow fetches GitHub's current environment policy and fails closed on
missing/unreadable protections before the service-secret execution step. Its
repository token has read permissions only; checkout credentials are not
persisted. It cannot configure environment reviewers, create IAM users/grants,
issue workload tokens or deploy AWS. Only sanitized report/digest artifacts are
uploaded for fourteen days; the private plan is removed on exit. An Actions
approval authorises this diagnostic run, not a legal decision or release.

## What still needs independent protected acceptance

This implements a repeatable evidence collector and catches integration errors.
It does not implement or certify Nabhold's still-preview-only executive BFF
login/session journey. G04B needs the governed confidential OIDC client,
server-side sessions, canonical context/domain checks, logout/step-up and
revocation acceptance; no login bypass is introduced here.

G01B/P0-03 needs real independent CIPC/source/custody review and a CP decision.
G02/P0-05 needs the actual progressive application→independent admission→
authorised request→registration ceremony and immutable audit. Use the CP
[PEO-03](https://github.com/baobab-platform/baobab-cp/blob/c42624c03464155334cc0eb7811d6ea2222a8ff1/docs/migrations/PEO-03B-independent-decision-to-authorised-onboarding.md)
and [PEO-05 protected runbook](https://github.com/baobab-platform/baobab-cp/blob/c42624c03464155334cc0eb7811d6ea2222a8ff1/docs/migrations/PEO-05D-protected-staging-acceptance.md)
for their independent acceptance scope; the four-business qualifier is not a
whole-platform prerequisite invented for Nabhold R0.

G05/P0-06 needs real workload issuance, entitlement/context, reconciled active
Tenant/Organisation CMS projections and governed release/binding certification.
CMS [#35](https://github.com/baobab-platform/baobab-cms/pull/35) fixes its former
rejection of correctly signed hierarchical CMS scopes. That source fix itself
does not activate a provider. P0-07/G17 still needs protected browser journeys,
controlled publish/unpublish, signed revalidation, stale-content/rollback proof,
accessibility/security/UAT, immutable deployment evidence and independent
reviewer signoff. No release status changes from this runner.

## Consulted source snapshots and validation

- Nabhold main `0a724fe9bd0b54b2bc16a7e17dde601e867d2e56`, accepted masterplan and
  ADR-NAB-0004/0006/0014; installed Next fetch/route documentation.
- CP `c42624c03464155334cc0eb7811d6ea2222a8ff1`, accepted BCP-007/009/026/027,
  Organisation overview, progressive registration authority and PEO-05 workflow;
  Shared capability/v1 pin `92541c92321abde72dea7deb7d42e70d0b6acafb`.
- CMS `b72ff38dc5aefb2e6b859b06044f592b86c8fd24`, accepted ADR-0012/0017,
  content route/body/projection checks; Shared content/v1 pin
  `8f3f847dd6c1ecfe32deea808c298e0f910cbc59`.
- [GitHub environment protections](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments),
  [environment REST permissions](https://docs.github.com/en/rest/deployments/environments#get-an-environment),
  [RFC 6750](https://www.rfc-editor.org/rfc/rfc6750.html), Fetch Standard and Node
  AbortSignal documentation.

Synthetic tests include the full actual CLI over separate loopback CP/CMS
services, controlled negatives, unsafe origins/files/credential reuse, authority
failure ordering, source mismatch/staleness, unexpected allow/5xx, cross-tenant
or draft content, response limits and absence of secrets in artifacts. These
remain rehearsal tests; the session had no configured protected origin or
credentials and performed no live acceptance. Rollback is a source revert;
there is no migration or authority mutation.

The Node floor is aligned to 22.12 (within the existing Node 22 runtime lane):
current Vite/Vitest dependencies require synchronous ESM loading that Node
22.6 cannot provide. The old minimum failed before test startup. Native CLI
imports use explicit .ts extensions with TypeScript noEmit/allowImportingTsExtensions;
this adds no browser credential flow or build output. CI continues to use the
approved baobab-dev container; this is not the proposed Node 24 migration.
