# Africa footprint map — ownership and source

The reusable `AfricaFootprint` component lives in `src/components/marketing/africa-footprint.tsx`; its independent home is `/markets/map`. It can be embedded in the homepage or any editorial page via `<AfricaFootprint compact />`.

Country outlines in `src/data/africa-geometry.json` were derived from the open GeoJSON dataset at https://github.com/holtzy/D3-graph-gallery/blob/master/DATA/world.geojson and simplified by sampling vertices every third position and rounding coordinates for web performance. Therefore this is a **cartographic editorial reference**, not a cadastral/survey boundary or border-adjudication source. Current geometry includes 47 countries/territories from the dataset; missing small islands must be added from an authoritative complete source before representing full continental coverage. Borders may be disputed and do not express Nabhold's positions.

`src/data/market-status.ts` is the independently editable status overlay. It describes *only* Group-confirmed incorporation and strategic interest; it intentionally does not assert verified active operations. A future CP-backed adapter must supply approved market-context assertions with source, identity, valid-time and publication approval. Never derive commercial market state from a country polygon, CMS article or locale.

The map works without an external browser script, API key or new tracking service. Keyboard-operable buttons accompany the SVG selection targets. Before production publication of additional claims, obtain evidence and review statuses with authorised staff.
