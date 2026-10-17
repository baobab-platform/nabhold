# Nabhold Group Africa Digital Estate

The corporate frontend for Nabhold Group Africa: an institutional public presence and a protected executive window into Baobab intelligence. It consumes Baobab through APIs; it does not reimplement Baobab.

## GitHub Codespaces

Choose **Code → Codespaces → Create codespace on main**. The repository uses the pinned `baobab-dev` 1.4.4 `frontend` profile, installs the locked pnpm dependencies, and forwards the Next.js development server privately on port 3000.

After the Codespace is ready:

```bash
cp .env.example .env.local
pnpm dev
```

## Local development

Use a Dev Container-compatible editor for parity with Codespaces. For a direct Node.js 22 installation:

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
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
