# Nabhold Group Africa Digital Estate

The corporate frontend for Nabhold Group Africa: an institutional public presence and a protected executive window into Baobab intelligence. It consumes Baobab through APIs; it does not reimplement Baobab.

## GitHub Codespaces

Nabhold uses the reviewed `ghcr.io/baobab-platform/baobab-dev:1.4.4-frontend`
image **pinned to its v1.4.4 release SHA-256 digest**, Node 24 and pnpm 11.24.0. Codespaces privately forwards Next.js on port
3000. The two exact published Shared dependencies are
`@baobab-platform/experience-tokens@0.3.1` and
`@baobab-platform/experience-geo-core@0.3.1`; they are **npm packages at
`npm.pkg.github.com`**, not container images at `ghcr.io`.

**Before creating a Codespace**, an organisation/package administrator must
approve `baobab-platform/nabhold` under **Manage Codespaces access** for the
private `baobab-dev` container package and both private Shared npm packages
(or verify equivalent inherited access). Also confirm the exact image tags and
package versions are published. GHCR image pulls happen **before** the
devcontainer starts: an npm script or even a correct `GITHUB_TOKEN` inside
the container cannot repair a missing image-pull entitlement.

Create a **new** Codespace using **Code → Codespaces → Create codespace on main**
after this configuration is merged, and approve its two explicitly requested
cross-repository read-only permissions for `baobab-platform/shared` and
`baobab-platform/baobab-dev`. Existing Codespaces do not acquire these new
permissions merely by rebuilding.

The prebuild phase now runs **only offline contract tests**. After the Codespace
opens, `postCreateCommand` configures a private user npmrc reference, verifies
both exact organisation package versions against the authenticated registry,
installs the frozen lockfile, and runs the contract/typecheck/unit gates.
If package access is denied, it fails closed **without preventing you from
opening a terminal for diagnosis**. To retry after the required access is
granted:

```bash
node scripts/codespaces/bootstrap.mjs
baobab-verify --contract
pnpm typecheck
pnpm test
pnpm dev
```

The user-level `~/.npmrc` references the injected `GITHUB_TOKEN` or optional
read-only `BAOBAB_PACKAGES_READ_TOKEN` Codespaces secret; its value is never
committed or persisted. If the built-in Codespaces token cannot read the
packages, an organisation/SSO-authorised **classic PAT with `read:packages`**
may be provided through that restricted Codespaces secret. Never put tokens
into `.npmrc`, `.env.local`, Docker build arguments, Git or shell history.

**Administrator checklist, diagnostics, CI image permissions, prebuild security
and future repository rollout:**
[Codespaces registry-access runbook](docs/testing/codespaces-registry-access.md).
GitHub's [private registry guidance](https://docs.github.com/en/codespaces/reference/allowing-your-codespace-to-access-a-private-registry)
explains why Codespaces GHCR access must be managed separately from npm
authentication.

## Local development

Use a Dev Container-compatible editor for parity with Codespaces or
**Node 24** and pinned pnpm directly. Install only after configuring authorised
user-level GitHub Packages credentials. For a direct installation, provide the
read-only `BAOBAB_PACKAGES_READ_TOKEN` **through your machine's secret store**
(not the shell history or repository) before running:

```bash
corepack enable
node scripts/codespaces/configure-private-npm.mjs
pnpm install --frozen-lockfile
cp -n .env.example .env.local
pnpm dev
```

Set `NABHOLD_DASHBOARD_PREVIEW=true` only for local dashboard UI work. The application rejects preview sessions when `NODE_ENV=production`.

## Quality gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

GitHub CI runs the same gates using the `baobab-dev:1.4.4-frontend-e2e` profile.

See the accepted [Go-Live Master Plan v2.0](docs/go-live/NAB-GOLIVE-MP-001.md), [live go-live register](docs/go-live/register.md), [architecture](docs/architecture.md), [Pulse integration](docs/integrations/pulse.md), [Payload CMS integration](docs/integrations/payload.md), [content model](docs/content-model.md), and [deployment](docs/deployment.md).

## Foundation 4

Codespaces uses `ghcr.io/baobab-platform/baobab-dev:1.4.4-frontend`. The SHA-pinned
Foundation gate validates contract compatibility and reproducibility and scans
source, dependencies, secrets, configuration, and the deployable image.
Fixable transitive dependencies are constrained through reviewed pnpm overrides
and remain visible in the committed lockfile.


## Finance F1 source progress

Shared's independent Finance F1 DRAFT wire tranche is merged. The
[Go-Live evidence record](docs/go-live/evidence/finance-f1-source-2026-10-16.md)
and [programme register](docs/go-live/register.md) track exact commits/checks,
restricted ledger/journal/statement contracts and remaining ERP native/Finance
acceptance. DRAFT vocabulary does not enable a Nabhold finance feature or release.

The [INT-02 prerequisite checkpoint](docs/go-live/evidence/int02-prerequisite-source-2026-10-16.md)
records merged IAM/CP/Shared repairs and the remaining real integration/provider
qualification. Infrastructure #35 remains open; no protected release is implied.


## Independent native enforcement progress

The [17 October Trade-A TA-05 source record](docs/go-live/evidence/trade-a-ta05-source-2026-10-17.md)
tracks the central order-authority and durable receipt boundary, including
review repairs and native regression coverage. This lane is independent of
Infrastructure #35; entry-point wiring, native COMMIT closure, L4 and protected
release acceptance remain separate. Nabhold gains no trading or tenant authority.

## Codespaces integration preparation

The [integration runbook](docs/testing/codespaces-integration.md) and
[private environment template](.env.integration.example) prepare a separate
real IAM/CP/TLS Redis browser profile. After Infrastructure supplies the private
network/client/fixture handoff, use `pnpm integration:check`,
`pnpm dev:integration`, and `pnpm test:e2e:integration`.
Existing public development and fallback browser tests remain separate.
This is identity/session smoke preparation, not completed INT-03, CMS/ERP
acceptance, or authority to activate protected releases.

The confidential BFF requests `openid authority:self`: the ID token establishes
OIDC identity and the access token permits CP's current self-authority read.
Requesting only `openid` cannot satisfy `/api/auth/session` and must not be
compensated by a provider granting unrequested administrative scopes. The BFF
still derives Principal/current grants from CP and stores only encrypted server
custody behind opaque, secure browser handles. DEV-05 tests this native flow
separately from the CMS workload and canonical provider qualification.
