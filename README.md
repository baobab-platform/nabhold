# Nabhold Group Africa Digital Estate

The corporate frontend for Nabhold Group Africa: an institutional public presence and a protected executive window into Baobab intelligence. It consumes Baobab through APIs; it does not reimplement Baobab.

## GitHub Codespaces

Choose **Code → Codespaces → Create codespace on main**. The repository
uses the pinned `baobab-dev:1.4.4-frontend` profile and Node 24 / pnpm
11.24.0. It privately forwards port 3000.

**Registry authorisation is a prerequisite for devcontainer installation.**
Nabhold depends on `@baobab-platform/experience-tokens@0.3.1` and
`@baobab-platform/experience-geo-core@0.3.1`, privately hosted in GitHub
Packages. Publication and archive SHA512/exports were verified by
[Shared workflow 39073362603](https://github.com/baobab-platform/shared/actions/runs/39073362603).
The repository's committed `.npmrc` intentionally contains **only** the
non-secret registry URL. A GitHub Actions `GITHUB_TOKEN` is not automatically
available to an interactive developer's terminal as npm credentials.

For a trusted Codespace, use the following secure setup:

1. In GitHub, visit **baobab-platform → Packages**; for each package
   (`experience-tokens` and `experience-geo-core`) open **Package settings →
   Manage Codespaces access → Add repository → `baobab-platform/nabhold`**.
   This grants the Codespace access to those packages independently of its
   GitHub Actions permissions. If the package inherits permissions, use the
   applicable repository access controls. Recreate/restart the Codespace if
   permissions do not take effect. GitHub's
   [package access instructions](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility#ensuring-github-codespaces-access-to-your-package)
   describe the controls.
2. The devcontainer now configures the **user-level** npm auth reference
   before `pnpm install --frozen-lockfile`. The helper prefers an optional
   `BAOBAB_PACKAGES_READ_TOKEN` Codespaces secret over the built-in
   `GITHUB_TOKEN`. It saves **only** a literal `${GITHUB_TOKEN}` or
   `${BAOBAB_PACKAGES_READ_TOKEN}` reference in `~/.npmrc` with mode
   `0600`; it never persists or logs token values. `pnpm` 11 deliberately
   does **not** expand auth environment variables in a *repository* `.npmrc`.
3. In an **existing** Codespace after pulling the updated `main` branch,
   repair auth and dependencies without modifying the lockfile:

```bash
node scripts/codespaces/configure-private-npm.mjs
pnpm install --frozen-lockfile
cp -n .env.example .env.local
pnpm dev
```

If the Codespace token cannot read private packages, create a fine-scoped
**personal access token (classic)** with `read:packages` and the necessary
organisation/SSO authorisation, then save it as an **account or repository
Codespaces secret** named `BAOBAB_PACKAGES_READ_TOKEN`, enabled only for
trusted repositories. Reload the Codespace so the environment variable is
injected, and rerun the three setup commands. GitHub's
[npm registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
details the applicable credentials. Never paste token values into terminal
history, Git, `.env.local`, screenshots, build args, or issue comments.

A `401` with **"No authorization header"** means pnpm has no usable auth
configuration. A `401`/`403` *with* authentication configured normally
means the token is expired, missing `read:packages`, not SSO-authorised or
not permitted to access those packages. These are distinct from
`ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`: only exact published,
SHA512-verified versions may be allowed by the committed
`pnpm-workspace.yaml`; never disable supply-chain checks to fix npm auth.

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
