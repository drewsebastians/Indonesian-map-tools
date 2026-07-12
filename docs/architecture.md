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
3. User selections are stored by stable `region_id`.
4. CSV and project files are processed locally by File APIs.
5. SVG/PNG export is generated in-browser.

All paths are relative so the app works from the Cloudflare Workers staging host and future custom domain.

