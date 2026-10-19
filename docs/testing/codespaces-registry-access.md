# Nabhold Codespaces — GHCR image and private organisation package access

**Image provenance:** the published [baobab-dev v1.4.4 release](https://github.com/baobab-platform/baobab-dev/releases/tag/v1.4.4) records
`frontend` digest `sha256:1b3165067912eacbca96b576efb67e0428850b1ff1a953aa9013127a01635371`
and `frontend-e2e` digest `sha256:eb9c401cea16c4f333c28b250dd455e505752dfc6d11e9779a182a02bc207213`.
Both consumer image references are pinned to these values. The manifest/digest
identity is still subject to a **real** registry pull and release signature
verification by the authorised runner; published notes alone do not
prove the currently reachable registry content.

**Scope:** Nabhold first, before rolling out a reviewed pattern to ZuriBeans,
Thamani and Baobab engines. This is a development environment, **not**
production or protected IAM/CP acceptance. Do not place Docker credentials,
personal tokens, SSH keys or administrative scopes in `.devcontainer/`,
`.npmrc`, image build arguments, Compose files or Next.js environment files.

## Three independent authorisation boundaries

| Boundary | Used when | Required owner-controlled setting |
| --- | --- | --- |
| GHCR base image `ghcr.io/baobab-platform/baobab-dev:1.4.4-frontend` | **Before the container exists** | `baobab-dev` package **Manage Codespaces access** → add `baobab-platform/nabhold`, or verified inherited/internal visibility appropriately available to the consuming repository |
| GitHub Packages npm `@baobab-platform/experience-tokens@0.3.1` and `experience-geo-core@0.3.1` | After container creation | On **each** package, allow Nabhold Codespaces access or reviewed inherited repository access; authenticate the npm registry with an actual package-read token |
| Cross-repository Codespaces `GITHUB_TOKEN` | During a **new** Codespace's lifetime | Approve the `devcontainer.json` requests for `baobab-platform/shared` and `baobab-platform/baobab-dev`, **contents:read / packages:read only** |

A valid token for `nabhold` does **not** automatically grant access to
another repository's private package. GitHub requires the package's own
Codespaces access or appropriate inherited access. The repository requests
minimal cross-repository access; **GitHub users must approve it at Codespace
creation**, and an organisation/package administrator must configure the
corresponding package permissions. The configuration does not magically change
existing Codespaces or override organisation policy.

- [GitHub: private registry access in Codespaces](https://docs.github.com/en/codespaces/reference/allowing-your-codespace-to-access-a-private-registry)
- [GitHub: request repository access in devcontainer.json](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-repository-access-for-your-codespaces)
- [GitHub: ensure Codespaces package access](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility#ensuring-github-codespaces-access-to-your-package)

### Required one-time organisation owner checks

1. In `baobab-platform → Packages`, open the container package **baobab-dev**.
   Confirm the `1.4.4-frontend` and `1.4.4-frontend-e2e` tags actually exist
   and support the Codespaces machine architecture. Do not silently substitute
   `:latest`, a Docker Hub image or a locally assembled unreviewed base.
2. In that package's **Package settings → Manage Codespaces access**, grant
   `baobab-platform/nabhold` access unless an already verified inherited/
   internal policy grants the same entitlement. Container image pulls occur
   **before** any post-create command can log in.
3. For each **experience-tokens** and **experience-geo-core** npm package,
   confirm version **0.3.1** is published and approve Nabhold's Codespaces
   access (or its linked-repository inherited access as applicable). Review
   `baobab-platform/shared`'s existing publication links and package access.
4. In the **baobab-dev** package settings, also permit
   `baobab-platform/nabhold` under **Manage Actions access**, if the package
   does not inherit Nabhold's workflow permissions. CI and protected acceptance
   explicitly authenticate the GHCR job image with `github.actor` and a job
   `GITHUB_TOKEN` constrained to `packages:read`; Codespaces access and
   Actions access are **separate** controls.
5. Check organisation Codespaces policies, billing/spending and allowed
   images where applicable; ensure Nabhold members can launch Codespaces.
   Do **not** loosen organisation-wide visibility, make private packages
   public, or add `write:packages` merely to repair a read operation.

**These GitHub package and organisation settings are administrative actions.
This PR cannot inspect or grant them, and does not claim they were changed.**

### Lifecycle separation (prebuild-safe)

```text
GHCR image fetch -- GitHub-controlled package Codespaces access
        |
        v
Container start (Node 24, pnpm 11.24.0 from baobab-dev)
        |
        v
updateContentCommand -- offline node:test checks only; no user secrets
        |
        v
Codespace can open (waitFor=updateContentCommand)
        |
        v
postCreateCommand -- private user npmrc reference; exact package metadata
                     checks; frozen pnpm install; contract/typecheck/tests
        |
        v
postStartCommand -- refresh user npmrc source selection on resume
```

GitHub prebuilds do **not** receive user-level Codespaces secrets. Do not move
`pnpm install`, `configure-private-npm.mjs` or registry metadata probes to
`updateContentCommand` or `onCreateCommand`. Prebuilds can use explicitly
configured *repository/organisation* secrets, but this design deliberately
avoids requiring any secret in prebuilds. The difference is important for
developer access and reproducibility.

The private npm bootstrap uses only `BAOBAB_PACKAGES_READ_TOKEN` when available,
otherwise `GITHUB_TOKEN`. `~/.npmrc` stores **only** a literal variable
reference, mode `0600`. The project `.npmrc` contains only
`@baobab-platform:registry=https://npm.pkg.github.com` and never a token.

If an authorised Codespace token still lacks package read permission, use a
read-only, organisation/SSO-authorised GitHub **personal access token (classic)**
with `read:packages` solely as a restricted **Codespaces secret** named
`BAOBAB_PACKAGES_READ_TOKEN`. Limit the secret's repository access to Nabhold
and other explicitly approved consumers; never set the value in code, shell
history, GitHub comments, screenshots, CI output or `.env.local`. A user-level
secret may require **restarting/reloading** the existing Codespace. Do not
duplicate it as an Actions secret without explicit justification.

### New Codespace verification (after access approval)

Create a **new** Codespace from the reviewed Nabhold branch/main using GitHub
UI or a supported Codespaces client. Accept the two explicitly requested
`contents:read` + `packages:read` repository permissions. Existing Codespaces
cannot acquire those new grants merely by pulling commits or rebuilding.

The following checks run automatically after the container starts. To retry
after fixing a package or secret entitlement:

```bash
node --version
pnpm --version
node scripts/codespaces/bootstrap.mjs
baobab-verify --contract
pnpm typecheck
pnpm test
pnpm dev
```

Expected results: Node 24.19+, pnpm 11.24.0, both **exact** organisation package
metadata checks succeed, and frozen pnpm installation/typechecking/tests pass.
The public Next.js app is forwarded privately on port 3000. The bootstrap
does not alter the lockfile, provision IAM/CP/ERP databases, run a fake
provider, grant access or weaken supply-chain rules.

### Failure classification

| Symptom | Likely boundary / action |
| --- | --- |
| Container cannot start; GHCR returns 401/403 or manifest unavailable | **Before lifecycle**: check baobab-dev package Codespaces access, repository visibility/policies, exact tag/platform. No npm helper can fix this |
| Container opens; package metadata returns 401 | Token missing/expired/SSO not authorised or unusable user npmrc; inspect Codespaces secret assignment, then rerun bootstrap |
| Package metadata returns 403 | Authenticated token without package permission; inspect package/repository access and `read:packages` |
| Metadata returns 404 | Wrong exact package/version **or** private package hidden by insufficient permissions |
| DNS, timeouts, TLS | Codespaces network/proxy/CA/registry reachability; never disable TLS verification |
| pnpm version mismatch | Wrong baobab-dev image or Corepack toolchain; never auto-upgrade to an unreviewed pnpm |
| `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` | Supply-chain policy; use only independently published/verified exceptions, never globally turn off release-age enforcement |
| `postCreateCommand` fails but editor opens | Expected fail-closed package gate; fix the stated entitlement and rerun the explicit bootstrap |
| CI job image pull fails while Codespaces works | Grant the **Actions** repository access separately; job token has explicit packages:read |

### Next-repository rollout gate

Do not bulk-edit ZuriBeans, Thamani, CP or engine devcontainers yet. First
record a **real** Nabhold Codespace creation with an authenticated GHCR image
pull, successful exact package metadata probes, frozen install, contract
verification and private Next.js smoke, including the actual reviewed image
digest and pinned commit. Validate existing Codespaces and Actions package
permissions on each next consumer before applying the same least-privilege
pattern; scopes, runtime languages, capabilities and image profiles differ by
repository.
