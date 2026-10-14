# Concept v3.3 — dual-ambition hero and footer directory

## Editorial intent

Nabhold Group Africa **builds and stewards enterprises** through independently
operated companies and **develops capabilities to enable other enterprises**
through Baobab Platform. The Platform is not represented as a fourth operating
subsidiary. Public language must not state that external tenant onboarding or
commercial availability is already production-ready.

The homepage hero has two separate headline lines. The estate's editorial
fallback is **Building what lasts.** / **Enabling what’s next.** Publishers may
override `headline` and `accentHeadline` through the home content key.
Previously published CMS copy continues to take precedence over local defaults
until an authorised editor publishes the new approved wording.

## Photography

`heroMedia` is the existing primary media field; `heroGallery` adds up to four
optional editorial assets. Both are read through the existing Payload content
gateway. The hero shows up to four unique photos in supplied order; each must
have a meaningful alt text. Missing photos show designed sector panels rather
than downloading stock imagery or suggesting that a photographed operation is
owned by the Group. Editors are responsible for copyright/consent clearance,
usage rights, asset approval, and accurate captions before publication.

The `heroGallery` DTO field is forward-compatible; it requires a corresponding
published `home` structured field in baobab-cms before authoring is possible
through the CMS. A missing CMS field is safe.

## Navigation and footer

The main header has four destinations, with three contextual mega menus.
The former extra intelligence icon has been removed to avoid an ambiguous
search affordance with no real search function.

The footer keeps the original brand column and **the exact existing
CMS-provided `footer.links` rendering strip**. The eight editorial link groups
live in a 4-column × 2-row desktop grid to the right of the brand area.
Breakpoints reduce the directory to two and one columns on smaller devices.
The directory refers only to routes or section anchors available today. No
unpublished privacy/terms/legal pages or fabricated contact coordinates
are linked.
