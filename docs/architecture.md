# Architecture

Peta Warna Wilayah Indonesia is a static Cloudflare Workers Static Assets application.

## Runtime

- `index.html`
- Local CSS in `assets/css/app.css`
- Local JavaScript in `assets/js/`
- Local Leaflet 1.9.4 in `assets/vendor/leaflet/`
- Local GeoJSON data in `data/`

No backend, database, API key, external tiles, analytics, or CDN dependency is required at runtime.

## Modules

- `app.js`: UI state, events, region selection, highlighting, import workflow, save/load, export actions.
- `map.js`: Leaflet map rendering and interaction.
- `csv-import.js`: CSV parsing, validation, matching, formula-injection-safe error reports.
- `project-storage.js`: project schema, JSON validation, local autosave.
- `export.js`: SVG and PNG export generation.

## Data flow

1. Browser loads `data/indonesia-adm2-simplified.geojson`.
2. Leaflet renders polygons without a basemap.
3. Runtime labels are tiered: selected and highlighted labels are prioritized, while general labels appear only above the configured zoom threshold.
4. User selections are stored by stable `region_id`.
5. CSV and project files are processed locally by File APIs.
6. SVG/PNG export is generated in-browser.
7. If the user explicitly selects high-detail export, the browser fetches the pinned local `data/indonesia-adm2-detailed.geojson` file, verifies its checksum, and uses it only for that export. The on-screen map remains on the simplified snapshot.

All paths are relative so the app works from the Cloudflare Workers staging host and future custom domain.

## Network Inventory

Normal startup uses same-origin static assets only:

- `index.html`
- local CSS and JavaScript
- local Leaflet vendor files
- `data/indonesia-adm2-simplified.geojson`

Normal startup must not request:

- `data/indonesia-adm2-detailed.geojson`
- geoBoundaries `/current/`
- HDX or other unpinned external boundary data

The detailed GeoJSON is allowed only after explicit high-detail export selection.

