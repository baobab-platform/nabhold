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
| Dev preview | `pnpm test:e2e:preview` | Separately labelled fixture-only subsidiary journey, no CMS claim |
| Functional | `pnpm test:e2e` | Corporate navigation, responsive page, portfolio, map, SEO and public negative paths in five browser profiles |
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

## Browser and asset remediation (3 November 2026)

The accepted BXS policy preserves all numerical limits; do not increase them to approve an unqualified change. The previous build measured 1193.4 KiB of emitted client JavaScript, a 351.2 KiB largest chunk and 74.8 KiB CSS. This PR removes the preview-only Recharts client graph in favour of a bounded, server-rendered SVG with exact accessible table values. It also scopes Tailwind v4 source detection to authored estate source, rather than CI workflows, tests or markdown. These are *candidate remedies*: actual measured current-head CI must prove the reduction.

For functional browsers, the public layout alone owns `main` and `#main`; Contact no longer nests another landmark. The public mobile navigation now uses the native HTML Popover API (Escape, focus return and light-dismiss), avoiding a hydrated drawer on public pages; the retained Base UI Sheet primitive separately uses its required Viewport. WebKit/Firefox/Chromium navigation, focus return, responsive visibility, CSP and independent accessibility and visual regressions remain required. No test is skipped, budget increased or preview data treated as CMS publication. The executive/chart changes neither grant Pulse authority nor expand an activated release class. Hosted Codespaces, protected IAM/CP and production performance field p75 remain separate gates.

An additional targeted stylesheet pass replaced the small dialog/menu entry/exit animations with opacity transitions and removed `tw-animate-css` from the global CSS imports. Existing accordion keyframes retain their locally scoped definition. No semantic, security, keyboard or numerical gate was waived; all outcomes need remeasurement at the current PR SHA.
