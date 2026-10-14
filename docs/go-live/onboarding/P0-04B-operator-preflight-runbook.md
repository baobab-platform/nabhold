# P0-04B-01 — authenticated operator authority preflight

**Governing plan:** NAB-GOLIVE-MP-001 v2.0, G04/P0-04.  
**Source scope:** read-only diagnostic; no identity creation, grant mutation or onboarding submission.  
**Acceptance:** local/synthetic integration and CI; real human identity and protected staging acceptance remain outstanding.

## Purpose and authority

P0-04A prepares local Keycloak provider administration. P0-04B needs actual
human authentication, CP canonical identity mappings and independent operational
authority. This increment closes the estate's missing executable check of the
staff's **current CP grant projections** before the real ceremony. It does not
complete P0-04B or certify a founding-group operator.

The command sends a separate credential for every staff role to the existing
`GET /v1/admin/effective-authority` endpoint. CP verifies the human token, resolves
the registered Principal, refuses inactive identity and computes eligible grants.
The estate compares that response with the reviewed expected Principal UUID and
the necessary permission demand below. It never uses unverified token claims.

| Role | Necessary projected permissions | Credential environment variable |
|---|---|---|
| Verification reviewer | verification.view, verification.review | NABHOLD_OPERATOR_VERIFICATION_REVIEWER_TOKEN |
| Verification decider | verification.view, verification.decide | NABHOLD_OPERATOR_VERIFICATION_DECIDER_TOKEN |
| Admission reviewer | application.review | NABHOLD_OPERATOR_ADMISSION_REVIEWER_TOKEN |
| Admission decider | application.decide | NABHOLD_OPERATOR_ADMISSION_DECIDER_TOKEN |
| Onboarding requester | tenant.provision | NABHOLD_OPERATOR_ONBOARDING_REQUESTER_TOKEN |
| Onboarding authoriser | changeset.approve | NABHOLD_OPERATOR_ONBOARDING_AUTHORISER_TOKEN |
| Tenant registrar | tenant.provision | NABHOLD_OPERATOR_TENANT_REGISTRAR_TOKEN |

These are Shared administrative permissions, not OAuth scopes or product
capabilities. They follow the existing CP administrative demand vocabulary;
`changeset.approve` is the existing onboarding authorisation mapping. The command
does **not** prove that any v2 action route accepts those grants. Current CP
route policy, IAM scope/client-role requirements, assurance/step-up, applicant
independence, maker/checker and natural-person authority must still be tested
through the real protected workflow. Grant migration remains CP/Shared-owned;
an observation must not be used to turn role-authoritative routes into
grant-authoritative ones.

## Prepare and run

1. Independently establish each person's operator authority. Authenticate each
   through the approved native Kratos/Hydra or federation flow. Do not use a
   Keycloak provider password or a shared workload credential for this check.
2. Resolve/register their canonical human Principals through the governed CP
   process. Obtain actual CP-issued UUIDs; this command cannot register them.
3. Establish bounded environment-specific grants through CP's existing
   administrative/bootstrap workflow. `cmd/admin-bootstrap` requires existing
   active, distinct operator/recipient Principals; it is not self-registration.
4. Copy `operator-preflight-plan.json` to an operator-controlled location.
   Replace **all** nulls with the approved CP origin and real Principal UUIDs.
   The committed template deliberately fails; no fake IDs or default host exist.
5. Supply each CP-audience human access token privately through its named
   environment variable. Tokens need `authority:self` to read the projection.
   Obtain them through the accepted IAM flow; never paste them into commands,
   manifests, PRs, evidence uploads or shell tracing. Do not disable TLS checks.
6. Run:

   ```bash
   pnpm onboarding:operators:check --input /operator-controlled/plan.json
   ```

Use `environment=staging` with HTTPS for an actual staging observation. Explicit
`environment=local` also permits HTTP to localhost, 127.0.0.1 or ::1 only. A local
run remains local even if every necessary grant is observed. Production is
excluded by the closed input schema. URL credentials, paths, queries/fragments,
redirects and TLS-bypass settings are refused.

The plan contains metadata only. The command reads at most 32 KiB of metadata
and 128 KiB per CP response; each read has a five-second request timeout. It
uses seven independent GETs with correlation UUIDs, no retries and no cached
fallback. Missing, reused or malformed credentials cannot borrow another role's
token. Unknown response fields, mismatched Principals, duplicate grants and
stale/future-dated projections fail closed.

## Interpret the result

- Exit **0**: necessary exact PLATFORM grants for the selected local/staging
  environment were observed for all seven distinct planned Principals.
- Exit **2**: configuration or at least one role observation was refused.
- `all_required_grants_observed` is a diagnostic fact, never an action permit.
- `onboarding_authorized`, `protected_staging_accepted` and
  `production_authorized` remain **false**, including after exit 0.
- The aggregate expires no later than the earliest selected grant or projection,
  with a maximum observation lifetime of 60 seconds. Rerun immediately before
  the ceremony. CP must reevaluate authority on every consequential request.
- Grant/Principal pointers and timestamps are safe for a restricted evidence
  record after review. Token values, raw CP bodies and transport errors are
  excluded. The command does not automatically save or publish its output.

The diagnostic's exact environment-qualified PLATFORM scope is a conservative
consumer ceiling. An unqualified global grant or another tenant/group scope
cannot satisfy this ceremony check. This does not change canonical grant
semantics or revoke any CP authority.

## Remaining P0-04B / protected acceptance

Real acceptance still needs: authenticated identity enrollment/mapping,
independent human authority, verified applicant/sponsor identity, office-holder
authority where required, current IAM audience/scope/client roles, step-up,
independent source/custody reviewers, CP action positive/negative tests,
revocation during the workflow, protected environment identity, immutable audit
and an accepted evidence pack. P0-03 independent legal decisions, P0-05 real
onboarding and P0-06 workload/CMS qualification are separate exits.

No accepted real operator identities, CP credentials or staging endpoint were
available in this implementation session. Synthetic UUIDs occur in tests only;
the real plan remains unconfigured.

## Consulted authority and security references

- Shared `92541c92321abde72dea7deb7d42e70d0b6acafb`, administration/v1
  `grant.schema.json#/$defs/EffectiveAuthority`, scope/domain schemas,
  permission registry and enforcement policy.
- CP `366fe6e549a6c5e7f62b551829438daaa1aa6647`, accepted ADR-BCP-020/026/027,
  `api/effective_authority_handler.go`, progressive routes,
  `api/admin_shadow.go`, identity service and `cmd/admin-bootstrap`.
- IAM `5dae8c44e943fc0106c1d4a8867a1c8a999a2234`, ADR-IAM-0031/0033,
  native human handoff and local administrator bootstrap runbooks.
- Nabhold ADR-NAB-0004/0014 and accepted Go-Live masterplan v2.0.
- [RFC 6750 §§2.1, 5](https://www.rfc-editor.org/rfc/rfc6750.html): protect
  bearer credentials in storage/transport and use the Authorization header.
- [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html): current OAuth security
  guidance. This consumer deliberately refuses redirects for credentialed CP
  reads; that is its transport policy, not an assertion that every OAuth
  redirect is prohibited.

**Rollback:** revert this diagnostic increment. It creates no provider account,
CP grant, tenant, legal decision, binding or migration to undo.
