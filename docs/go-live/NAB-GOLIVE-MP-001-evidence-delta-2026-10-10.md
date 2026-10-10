# NAB-GOLIVE-MP-001 — Evidence delta (R0 focus)

**Parent document:** `NAB-GOLIVE-MP-001-masterplan-v1.0.md` (baseline 8 October 2026)  
**Delta date:** 10 October 2026  
**Scope of this pass:** release **R0 — Institutional public website** (gates G05, G15, G16, and the G01–G03 prerequisites R0 depends on). Other releases are only counted, not assessed.  
**Status:** DRAFT delta for review. It changes no decision in the masterplan and approves nothing.

Status vocabulary follows the masterplan: `EVIDENCED`, `DECLARED`, `PLANNED`, `UNVERIFIED`, `BLOCKED`. Source or green CI does not establish a production-active CapabilityBinding.

## 1. Method and limits

- Each repository's `origin/main` was fetched on 10 October 2026 and compared with the commit recorded in masterplan §2.1.
- For R0, the changed contracts, registries and source were **read**, not just counted (sections 3 and 4).
- For repositories outside R0 (ERP, Subscriptions, Payments, Pulse, Regulations, Trade, IAM) only commit counts and commit subjects were reviewed. **No claim below about those repositories is a verified status.**
- Open pull requests were listed for `nabhold` only in the first pass. **Correction (added later on 10 Oct):** branches were not checked for nabhold in the first pass, which missed the unmerged branch described in section 4.3; the same applies to every repository other than shared. Open PRs were then also reviewed for shared (none), baobab-cms (#21, #22), baobab-iam (#106), baobab-cp (#306, draft) and infrastructure (Dependabot only). The first version of this document read CMS `main` alone and so wrongly reported the CMS route as not started; sections 4.1 and 5 are corrected accordingly.

## 2. Repository drift since the §2.1 snapshot

| Repository | Snapshot | Now (`main`) | Commits since | R0 relevance |
|---|---|---|---|---|
| nabhold | `9336d49` | `f23c681` | +2 (the masterplan itself) | Direct — no feature change |
| baobab-cms | `19deac1` | `19deac1` | **0** | Direct — unchanged |
| infrastructure | `48ff627` | `48ff627` | **0** | Direct — unchanged |
| shared | `70f92ee` | `c85e4a9` | +24 | **High** — `content/v1` contract added |
| baobab-cp | `897cc6c` | `a10c348` | +65 | Medium — context validation, tenancy |
| baobab-iam | `cef8d02` | `81b59cd` | +62 | Not assessed (R1 sign-in) |
| baobab-erp | `416995b` | `d62ab24` | +13 | Not assessed (R1/R2) |
| baobab-subscriptions | `631093c` | `e7ea1e4` | +4 | Not assessed (R2) |
| baobab-payments | `017adee` | `b8ec5e8` | +9 | Not assessed (R2) |
| baobab-pulse | `a04ac79` | `6f4271d` | +8 | Not assessed |
| baobab-regulations | `4fab60e` | `4fab60e` | 0 | None |
| baobab-trade | `78d16b8` | `c30691f` | +13 | None for R0 |

## 3. What changed that matters to R0

| Change | Evidence | Effect on the plan |
|---|---|---|
| `content/v1` OpenAPI 1.0.0 added to Shared (`POST /v1/content/resolve`, scopes `content:entry:resolve` and `content:entry:preview`, error codes, examples) | shared #254 (`ec5d1b4`, 9 Oct) | **G05 step 1 is no longer waiting on a contract.** §4.5 "wire the exact Shared route" is now implementable. Status of `content.entry.resolve`: `DECLARED` with a complete HTTP contract. |
| Verified CIPC identity recorded for NABHOLD (jurisdiction, registration identifier, legal name, effective date). Ownership, directors and beneficial ownership intentionally not recorded; subsidiary entries remain TBD | shared #252 (`32ce2ca`) | G01 work item `SH-NAB-LEGAL-01` has a registry entry. It does **not** by itself establish an ACTIVE tenant or any group relationship. |
| Platform-context validation contract (`POST /platform-context/validate`, scope `context:validate`, `validates_audiences` registry rule) is in Shared and present in CP | shared `contracts/control-plane/v1/openapi.yaml`; CP `internal/auth/subject_verifiers.go` and embedded contracts | The mechanism `content/v1` depends on exists. Its allocation does not cover CMS (see 4.1). |
| ADR-BCP-026 / ADR-BCP-027 accepted; Organisation-first tenancy (LA-01 … LA-05), governed admission (NBO-01), 24-month founding evidence deferral (PEO-02) | shared and CP commit subjects, 9–10 Oct | Changes how the NABHOLD INTERNAL tenant (G02) is admitted. **Not read in detail**; G02 needs re-planning against these ADRs before it starts. |
| ADR-SHARED-033 proposed: corporate finance capability namespace | shared #253 | R1 (G03/G06). Not R0. |

## 4. R0 blockers confirmed by reading source

### 4.1 CMS cannot yet satisfy the `content.entry.resolve` contract — `BLOCKED`

1. **No route on `main`; one is in an open PR.** `baobab-cms/.baobab/capability-provider.yaml` on `main` still declares the capability as planned/CONTRACTED, and CMS `main` has had no commits since the snapshot. **baobab-cms #22 (open, not draft) implements `POST /v1/content/resolve`** (JWKS-verified caller, scope checks, Control Plane context validation, Payload-backed loader, 221 unit tests), the corporate content collections, a Nabhold onboarding script, an outbox-to-revalidation publisher and a reconciliation report. It declares PARTIAL support (repository evidence only), has not run CI on its head, and states that it activates nothing. baobab-cms #21 (open) re-pins consumed Shared contracts and is blocked by 21 npm audit findings.
2. **Stale contract lock.** `baobab-cms/contracts.lock.yaml` pins Shared commit `b63ce52…` and lists only `capabilities.yaml` and the two schemas. `content/v1/openapi.yaml` is not listed and is newer than the pin.
3. **CMS is not registered as a context validator** (addressed by baobab-platform/shared #265, open, as of 10 Oct). Until that merges, #22's route would have no registered holder of `context:validate`; #22 uses an interim `CMS_CONTEXT_VALIDATOR_TOKEN`. The contract requires the provider to validate `context_id` through the Control Plane for the actual caller. In Shared's `workload-registry.yaml`, `baobab-cms-workload` has `allowed_audiences: ["baobab-control-plane"]` and `allowed_scopes: ["context:resolve", "provider-migration:task"]`. It has **no** `context:validate` and **no** `validates_audiences`. The scope's own description says it is "currently allocated to ERP and Pulse".

### 4.2 Nabhold has no registered workload identity — `BLOCKED`

`workload-registry.yaml` on `main` registers cms, erp, pulse, trade, thamani, zuribeans, cp (three), and subscriptions. There is **no** Nabhold workload. **baobab-platform/shared #265 (open) adds `nabhold-backend`** as PROVISIONED with `context:resolve` and `content:entry:resolve` only. Nabhold's server-side client could therefore not be issued `context:resolve` or `content:entry:resolve`, and the registry says the lists are ceilings on what IAM may issue.

### 4.3 Nabhold `main` is unchanged against its §2.2 defect list — `EVIDENCED` (but see the unmerged branch below)

| §2.2 item | State on 10 Oct |
|---|---|
| Direct Payload integration | Still `src/integrations/payload/` with `PAYLOAD_BASE_URL`; no capability client anywhere in `src/` |
| Session | `src/lib/auth/session.ts` still returns a session only under `NABHOLD_DASHBOARD_PREVIEW=true` |
| Sign-in | Page still states federated identity is not connected |
| Runtime | Next `15.5.24`, Node `>=22 <23`, pnpm `11.24.0` |
| Workflows | `ci.yml`, `foundation.yml`, `security.yml` only |

**Unmerged branch with no PR (found later on 10 Oct):** `origin/ccr-0091ad61-xmo5ln` carries 17 commits ahead of `main`, 26 changed files under `src/` (about 2,300 added lines), and is **not** reflected in the table above. By file list, it adds: a Control Plane capability client (`src/lib/control-plane/capability-client.ts`, `resolution.ts`, with tests), a `content.entry.resolve` estate adapter and gateway (`src/integrations/baobab-content/`, with tests), a release-class guard, CSP and security headers, canonical-host handling, an onboarding profile, and G01 evidence and programme documents. Its session code still shows no real OIDC session in the head of `src/lib/auth/session.ts`, and the direct Payload integration files are still present (34 files). I have **not** run its tests or read the adapter in detail, so treat these as `EVIDENCED` for existence only, not for behaviour. Its capability client takes an injected token provider and hard-codes no client id, audience or scope list, so it does not conflict with the workload registered in shared #265.

The 10 most recent open nabhold PRs are all Dependabot (#6–#12, #29–#31; the list was not paged beyond 10), including Next 16, TypeScript 6 and Vitest 5 bumps open since 31 Aug. §G15 step 2 says to decide the Node/Next upgrade deliberately and not to switch dependencies casually during go-live; those PRs should not be merged on green CI alone.

### 4.4 No Nabhold or CMS deployment exists in infrastructure — `UNVERIFIED` → treat as not started

`infrastructure` has a `terraform/environments/staging` and staging workflows, but a search of `terraform/` and `deploy/` for `nabhold` and `cms` found nothing. The `nabhold` hits are in the local compose project name, ADR prose, and the traceability document. G16 items 2–4 (staging account bootstrap, release identity, Nabhold tag pipeline) therefore have no existing definition to build on. Whether the AWS account and OIDC roles exist is not visible from the repositories and remains `UNVERIFIED`.

### 4.5 Not established in this pass

- Whether a NABHOLD INTERNAL tenant exists or is ACTIVE in any environment (G02).
- Whether any CMS instance is registered, healthy or bound in the Control Plane.
- How the public site obtains a `PlatformContext` for anonymous visitors. `POST /platform-context/resolve` requires a verified **workload** token (`context:resolve`) and an ACTIVE tenant; the masterplan's "CP public content composition" (G02) is not described by any contract I found. This needs an explicit decision (see section 6).

## 5. R0 critical path, updated

Ordered by dependency. PR ids are the masterplan's where they exist; the two marked **new** are not in v1.0.

| # | Work | Repo | Status now | Depends on |
|---|---|---|---|---|
| 1 | Register a Nabhold workload (audiences: control-plane, cms; scopes: `context:resolve`, `content:entry:resolve`) — **new** | shared | **In review:** shared #265 (PROVISIONED) | — |
| 2 | Allocate `context:validate` and `validates_audiences: ["baobab-cms"]` to `baobab-cms-workload`; confirm IAM issuance — **new** | shared / baobab-iam | **In review:** shared #265 (registry only). IAM issuance not started | — |
| 3 | `CMS-CONTENT-01`: bump `contracts.lock` to a Shared commit containing `content/v1/openapi.yaml`; implement `POST /v1/content/resolve`; move the capability into `providers[].support` with route and contract tests as evidence | baobab-cms | **In review:** baobab-cms #22 (route, PARTIAL declaration). `contracts.lock` bump is #21, blocked by npm audit findings | 2 |
| 4 | `CMS-CORP-02`: corporate content schemas | baobab-cms | **In review:** baobab-cms #22 (collections and DRAFT starter content) | 3 |
| 5 | `CMS-EVENT-03`: signed publication and revalidation | baobab-cms | **In review:** baobab-cms #22 (outbox publisher; dispatcher not scheduled anywhere) | 3 |
| 6 | G02: NABHOLD INTERNAL tenant admitted and ACTIVE under ADR-BCP-026/027; CMS provider registered and bound | baobab-cp | `UNVERIFIED` | re-plan under accepted ADRs |
| 7 | `NAB-FE-00` / `NAB-CMS-01`: server-only capability client replacing the direct Payload adapter; public pages on contract-backed data | nabhold | **In progress on an unmerged branch with no PR** (`ccr-0091ad61-xmo5ln`: capability client and content adapter exist; page wiring and behaviour not verified) | 1, 3, 6 |
| 8 | `NAB-PUBLIC-02`, `NAB-CI-01`, `INF-NAB-01`: accessibility/SEO, CI gates, Nabhold and CMS staging deployment | nabhold / infrastructure | not started | 7 |

Items 1–2 are small registry changes in Shared and are the first unblockers. Item 6 is the longest unknown.

## 6. Decisions needed before items 1, 6 and 7

1. **Public-site context model.** Should the public site call `platform-context/resolve` as the Nabhold workload (tenant = NABHOLD) and pass the resulting `context_id` to CMS, or does R0 need a Control Plane public-composition route that does not exist yet? Section 4.5 explains why this is unresolved.
2. **Nabhold workload ownership and naming** in the workload registry (repository `baobab-platform/nabhold`, runtime, rotation owner).
3. **Node/Next target** for the Nabhold frontend. `baobab-trade` already runs Node 24 (`.nvmrc` 24.18.x); Nabhold is pinned to Node 22 and Next 15. Decide before merging Dependabot's Next 16 / TypeScript 6 PRs.
4. **Whether R0 may go live on the transitional Payload adapter** for a bounded window. Masterplan §4.5 allows that only in bounded migration and development windows; it needs an explicit, dated approval if so.

## 7. What this delta does not claim

- It does not claim any R0 gate is complete, or that the masterplan's timeline or ordering changes.
- It does not assess R1, R2 or R3 readiness. Commit counts for IAM, ERP, Subscriptions, Payments, Pulse and Trade are for orientation only.
- Section 3's ADR-BCP-026/027 and Organisation-first rows come from commit subjects and the accepted-status commit; the ADR text was not re-read for this document.
