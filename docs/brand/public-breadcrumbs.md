# Public breadcrumbs — navigation and accessibility

All published routes in the `(public)` route group except the landing
page `/` must expose a visible, accessible breadcrumb trail. This follows
the site's established Insights/Portfolio `PageHeader` pattern.

## Component and authority

`src/components/marketing/public-breadcrumbs.tsx` is the shared renderer.
The caller provides semantic parent links. Never generate public navigation
by guessing slug labels or reading browser history; the server-rendered
detail page already resolves a verified title from its content gateway.

Each trail starts with `Home` linked to `/`, and ends with the current
page text (`aria-current="page"`, no link). Linked middle nodes must point
to existing published parent pages. Dark hero pages use `contrast="dark"`
for accessible visual differentiation. Long published titles are visually
truncated at compact breakpoints, with the full name retained in the DOM,
accessible text, and a `title` tooltip.

## Route coverage

| Route | Breadcrumb hierarchy |
|---|---|
| `/about/group` | Home → Our Group |
| `/portfolio` | Home → Portfolio |
| `/portfolio/[slug]` | Home → Portfolio → CMS company name |
| `/sectors` | Home → Businesses → Sectors |
| `/sectors/[slug]` | Home → Businesses → Sectors → CMS sector name |
| `/investment` | Home → Investment |
| `/governance` | Home → Our Group → Governance |
| `/markets` | Home → Investment → Markets |
| `/markets/map` | Home → Investment → Markets → African Map |
| `/intelligence` | Home → Insights → Intelligence |
| `/insights` | Home → Insights |
| `/insights/[slug]` | Home → Insights → CMS article title |
| `/platform` | Home → Our Group → Baobab Platform |
| `/contact` | Home → Contact |
| `/sign-in` | Home → Sign in |

The homepage has no breadcrumb. Dashboard/console routes have their
own navigation and are explicitly not part of this public-site convention.

## Implementation rules

- Where a page already uses `PageHeader`, retain its `breadcrumbs` prop.
- For full-width institutional editorial pages, pass breadcrumbs to
  `EditorialPage` and render inside the contrasting hero.
- For bespoke pages, render `PublicBreadcrumbs` before the visible heading.
- Do not inject a generic route-label resolver into the global layout:
  dynamic CMS titles and hierarchy remain authoritative in the route.
- Preserve exactly one breadcrumb landmark per page.
