# BXS-05A — Nabhold public-estate conformance

Governing decision: ADR-SHARED-040, Accepted. Node.js 24 and pnpm 11.24.0
remain the approved runtime, with no frontend-owned PostgreSQL connection.

The public layout owns the document's sole main landmark and skip-link
destination. This increment removes nested main landmarks from the homepage,
markets index, and dedicated Africa map route. The enclosing view-only div
preserves all site and map styles, routes, CMS composition and market evidence.
Playwright tests assert a single main landmark, its id and visible page title.

This is an independently tested BXS consumer conformance correction, **not**
claiming that Shared experience packages have been published or consumed yet.

**Next BXS-05 consumer gate:** after the Shared 0.2.0 packages are published,
verified in GitHub Packages, and immutable pins recorded, adopt namespaced
experience-tokens and geo-core through a Nabhold-specific adapter. Retain
Nabhold's approved existing brand, the editorial partial Africa dataset,
verified legal/market disclosures, keyboard country-list alternatives and
per-subsidiary autonomous market status. Require visual and axe receipts,
reviewed snapshots and fail-closed context integration before replacing
existing presentation paths.
