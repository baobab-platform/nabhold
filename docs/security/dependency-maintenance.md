# BA-SEC-DEP-001 — Digital Estate Dependency and Security Maintenance Adoption

**Authority:** [Approved Baobab Dependency & Security Maintenance Policy v1.0](https://github.com/baobab-platform/shared/pull/429). Shared #429 is **still an unmerged engineering PR**: approval of the policy text is not acceptance of its strict reusable validator.  
**Record date:** 7 November 2026.  
**Status:** **SOURCE_COMMITTED** on the indicated estate PR; **CI_VERIFIED, SECURITY_ALERT_PATH_VERIFIED, CONSUMER_QUALIFIED and protected deployment evidence remain UNVERIFIED** until independently checked.  
**Owners:** Estate Engineering, Platform Engineering, Security. No self-certification.

## 1. Observed dependency surfaces

All three estates use a **pnpm 11** package-manager declaration, a root `package.json`/`pnpm-lock.yaml`, a real `Dockerfile` and GitHub Actions workflows. Their `.baobab/repository.yaml` declares Node, container, digital-estate and `node: pnpm`. None of the three has a root `docker-compose.yml`; do not invent a Compose ecosystem just to increase coverage.

| Dependabot ecosystem | Authoritative input | Qualifying action |
| --- | --- | --- |
| `github-actions` at `/` | `.github/workflows/*.yml` | Review SHA-pin/release provenance, including reusable Shared workflows |
| `npm` at `/` | `package.json` and root `pnpm-lock.yaml` | Verify pnpm resolver and private Baobab Experience package integrity |
| `docker` at `/` | root `Dockerfile` | Review base image provenance, applicable security advisories and digest-bound consumer |

**Policy controls:** Existing default branch is implicitly authoritative. Do not set `target-branch: main` (GitHub security updates still target the default branch, but the entry's settings would apply to version updates only). Optional groups are restricted to `applies-to: version-updates` and `update-types: [minor, patch]`; majors must be assessed independently. Routine updates run weekly with Monday SAST schedules and nonzero PR limits. Security patch triage follows advisory urgency, not the weekly schedule.

**Shared control consumption:** The repository's `.github/workflows/enforce-dependabot-config.yml` calls a previously accepted **immutable Shared baseline** and sets `required-ecosystems: "github-actions,npm,docker"`. It also executes a local source/negative suite (16 cases). The strict version of the validator introduced on Shared #429 is **not** assumed released and must not be used as an unaccepted branch SHA. Adopt it only following its independent acceptance, merge and immutable release.

## 2. Vulnerability surveillance and exceptions

The previously shared `pnpm-workspace.yaml` `auditConfig.ignoreGhsas` entry for `GHSA-vfj7-8cjw-p6xm` globally suppressed an advisory without an expiry. It is **removed**. Whether the upstream advisory is current/withdrawn, mitigated in context, or still exposed must be re-checked independently from a current authoritative advisory record and the actual lockfile. This source change is **not** a claim that the vulnerability disappeared.

`.github/workflows/security.yml` now runs a **daily full-lockfile audit** (including tooling/development dependencies): `pnpm audit --audit-level high`, rather than the earlier weekly production-only audit. The native audit fails on HIGH/CRITICAL findings or scanner failure. Foundation's scheduled security gates and independent CodeQL/Trivy coverage remain in force where supported; do not treat skipped or unavailable scanners as green.

Do not reinstate global `auditConfig.ignoreGhsas` or introduce an unconditional Dependabot ignore to greenwash CI. If an advisory has no available fix and the call path cannot be removed immediately, use the existing Foundation exception governance with a narrowly described advisory, exact dependency path, exposure/controllability analysis, independent approver, expiration date and remediation issue. Preserve **WAIVED** as a distinct state and re-review before expiry. A failing scan is **BLOCKED** until actually remedied or formally disposed; an exception is not equal to PASSED.

## 3. Verification and promotion gates

- Run `python3 -m unittest discover -s scripts/tests -p 'test_dependency_policy.py' -v` after installing the pinned PyYAML verifier; this is source conformance only, not an online Dependabot test.
- Verify the original GitHub Actions action-pinning gate, the accepted Shared Dependabot baseline and the Foundation native audit all execute at the **actual final commit**.
- Independently verify GitHub dependency graph, Dependabot Alerts, security updates and package-registry credentials. A YAML file alone cannot prove any service is enabled.
- Run the estate's existing pnpm frozen install, lint, type checks, test, build, browser tests (Playwright), accessibility/visual regressions and performance budgets when packages change. Preserve business authorization **negative cases**, not just successful renderings.
- Confirm runtime image provenance, SBOM, exact published digest, deployed consumer version and the platform's protected environment approvals separately. No production or staging authority follows from merging a maintenance PR.
- Reconcile remaining HIGH/CRITICAL advisories and affected transitive owners with first-seen dates and the policy's incident-response deadlines. Scheduled daily inspection is **supplementary** to immediate incident triage.

## 4. Status discipline

Use explicit `SOURCE_COMMITTED`, `CI_VERIFIED`, `SECURITY_ALERT_PATH_VERIFIED`, `CONSUMER_QUALIFIED`, `WAIVED`, `BLOCKED`, `STAGING_VERIFIED` and `PRODUCTION_VERIFIED` where appropriate. File-level tests establish **source observations**, not live scanner results or proof of the configured release environment.

This is a policy-adoption/change-safety increment only. Existing business identity, IAM/CP authority, tenant isolation, provider access, financial commitments and cross-border verification remain under their respective canonical owner and accepted ADRs.
## 5. Nabhold-specific findings and unresolved risks

**PR:** [nabhold #104](https://github.com/baobab-platform/nabhold/pull/104).

- Before the audit, both Actions and npm Dependabot entries explicitly set `target-branch: main`; minor/patch groups lacked `applies-to`. Docker had **no** update entry despite the active Node 24 image.
- The package manager is pnpm 11.24.0, while current root `Dockerfile` uses `node:24.21.0-alpine3.24` **without an immutable digest**. Verify the registry digest, publication and architecture before proposing any pin; do not invent or auto-apply one here.
- The intentional `@types/node` major limit is **version-update-only**, not an unconditional security advisory ignore. Correct the stale Node 22 explanatory comment to the current Node 24 target and re-review when DEV-10 changes runtime major.
- `.github/workflows/enforce-action-pinning.yml` was absent; it is added using the accepted pinned Shared workflow.
- Existing `.github/workflows/security.yml` uses a private GHCR image and GitHub Packages auth. Availability, token scope, short-lived credentials and exactly pinned consumer digests require observed CI checks.
- `pnpm-workspace.yaml` has lockfile overrides/allow-build configuration. They stay unchanged; no provenance is inferred merely because an override exists.
- Preserve the executive-authority BFF, IAM/CP protected navigation, authorisation refusal and legal-entity context negatives. Existing Lighthouse/CSS budgets, Playwright visual and accessibility gates must remain binding.
- **Potential blocker:** Full-lockfile auditing may reveal an existing dev-only advisory previously globally suppressed. Require actual fix, restricted transitive migration or an **expiring independently approved** exception before merge; do not weaken the scan.

No protected release/authorisation acceptance is claimed by this PR.
