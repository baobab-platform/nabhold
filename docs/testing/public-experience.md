# Nabhold public-estate experience quality gates

Status: engineering implementation; **CI and screenshot receipts decide acceptance**.
Reference: ZuriBeans public-estate suites and ADR-SHARED-040.

## Ownership boundaries

These gates evaluate anonymous Nabhold Group Africa corporate pages, not
subsidiary trading, logistics, live Payload publishing, IAM/CP acceptance or
any protected production deployment. `NABHOLD_CONTENT_DEV_FALLBACK=true`
is only enabled in a separate development-only Playwright preview run. The
main CI build and all numerical lab tests use the true production setting,
which refuses this fallback even if incorrectly requested.

The protected real-service integration harness uses
`playwright.integration.config.ts` and suppresses sensitive browser artifacts.
Never combine its credentials, cookies, protocol URLs, or test runs with this
public Playwright project.

## Gates

| Gate | Command | Claim |
| --- | --- | --- |
| Unit/security | `pnpm test`, `pnpm test:auth-store` | Existing BFF/domain boundaries |
| Static budget | `pnpm perf:budget` | Emitted JS <=800 KiB, largest chunk <=250 KiB, CSS <=64 KiB, raster image <=250 KiB |
| Dev preview | \`pnpm test:e2e:preview\` | Separately-labelled fixture-only subsidiary journey, no CMS claim |\n| Functional | `pnpm test:e2e` | Corporate navigation, responsive page, portfolio, map, SEO and public negative paths in five browser profiles |
| Lighthouse | `pnpm test:e2e:lighthouse` | Production-build isolated lab: >=90 performance and >=95 accessibility/best-practices/SEO, <=250 KiB transferred JS, CLS <=0.1 |
| Accessibility | `pnpm test:e2e:a11y` | WCAG 2.2 AA-tagged axe-core checks on representative public pages, keyboard and labels |
| Visual | `pnpm test:e2e:visual` | Landing layout invariants at five viewports and attachable full-page screenshots; map retains existing reviewed screenshot baselines |

Playwright installs version-synchronised Chromium, Firefox and WebKit, checks
all three launch, then caps CI workers at two. All gated public suites start
the **already built** Next server on loopback; CI never measures dev/HMR.
Lighthouse runs after all functional workers finish. CI uploads the browser
reports, Lighthouse JSON and visual snapshots even when a gate fails. Traces
and screenshots may only contain anonymous synthetic public data.

Lighthouse lab LCP is a diagnostic, **not a field p75 LCP**. INP requires
representative field instrumentation; a single lab run cannot certify it.
Visual screenshots from the landing page are diagnostic until a separately
reviewed, committed set of pixel baselines is accepted; structural layout
regressions are blocking from the outset. Existing map snapshot comparisons
remain mandatory. Do not update snapshots automatically inside a passing gate.

Before merging review the actual last-head CI, unresolved review comments,
published private-package access and branch protection. Re-measure and fix
the source instead of raising budget thresholds simply to clear CI.
