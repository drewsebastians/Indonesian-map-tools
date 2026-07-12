# Batch 1 Baseline Audit

Generated: 2026-07-12T15:29:06.510Z
Repository commit: `dbbcbc3ed536360571483e46a42c8b3f2b3e689e`
Branch: `main`

## Runtime entry points

- `index.html` loads local Leaflet, application CSS, and five browser scripts.
- `assets/js/app.js` starts on `DOMContentLoaded`, fetches simplified geometry, then tries detailed geometry.
- `assets/js/project-storage.js` defines project schema validation, autosave, and JSON download.
- `assets/js/export.js` creates SVG and PNG files in the browser.

## Production files measured

| File | Raw bytes | Gzip bytes | SHA-256 |
|---|---:|---:|---|
| `_headers` | 430 | 276 | `793ed67b4376f29b1fbdf8c3bb1b144eb0e9b7a87adb7fc7f56d41b5b2f14921` |
| `.nojekyll` | 2 | 22 | `7eb70257593da06f682a3ddda54a9d260d4fc514f645237f5ca74b08f8da61a6` |
| `index.html` | 7789 | 2252 | `4fcf93e2a5de67856675da413c2af07530485265aff787bf66173cf21e8f6f20` |
| `robots.txt` | 27 | 47 | `32403248dc764535c87140955fc9451f9ebc9702f3e298d1c24fe84e558a53a9` |
| `assets/css/app.css` | 8424 | 2171 | `50099a53fc3ed912337bfad50bf9a5650ad67bdf241cb31a6acaa8a5699e4454` |
| `assets/js/project-storage.js` | 4247 | 1378 | `561ca805bb12d5f571cd71571fd960472160832c2d1b8702919ef6d104d05039` |
| `assets/js/csv-import.js` | 4562 | 1505 | `faab595b42460b0ad7335f6dfae15515fb862244b56d9c41ede1200d920243c8` |
| `assets/js/export.js` | 15330 | 4609 | `830b1665a6886ac955d9a3d1d6622a26a4e0bf5aa26831b8def77f495c84d0c3` |
| `assets/js/map.js` | 8787 | 2466 | `c3cbc20212ba27453d0188f227f7b2865627321c2492f88684552b7b599ed5f0` |
| `assets/js/app.js` | 30707 | 7701 | `a38368542852511baaa757c1289fc0ed1b858b1aea137aacab1273542d06084d` |
| `assets/vendor/leaflet/leaflet.css` | 14806 | 3524 | `a7837102824184820dfa198d1ebcd109ff6d0ff9a2672a074b9a1b4d147d04c6` |
| `assets/vendor/leaflet/leaflet.js` | 147557 | 42503 | `3104b526504d0d61fd3099a4521e87f732ccc3174dec54e08de6ba8bde3e15ff` |
| `data/indonesia-adm2-simplified.geojson` | 2014724 | 518479 | `6d735512fb7cab04ac7ca6048aa41437eba4f53595b83d8da4f25c198ba01f91` |
| `data/indonesia-adm2-detailed.geojson` | 11003421 | 2999956 | `5a5cc09736dea030b30536cec6958c8f9aaad4b61f71b1c45500db95bcc360e8` |
| `sample/sample-project.json` | 755 | 381 | `dd22b0645b4de6255aab7db4cd66429522a763122b9cd84f3ca7855ecd02a546` |
| `sample/sample-region-colors.csv` | 227 | 197 | `10de9761ce0e394a3fb1084a8c157116aba4a2a05e6357dfe4ce56f63b7acd2d` |
| `assets/vendor/leaflet/images/layers-2x.png` | 1259 | 1282 | `066daca850d8ffbef007af00b06eac0015728dee279c51f3cb6c716df7c42edf` |
| `assets/vendor/leaflet/images/layers.png` | 696 | 719 | `1dbbe9d028e292f36fcba8f8b3a28d5e8932754fc2215b9ac69e4cdecf5107c6` |
| `assets/vendor/leaflet/images/marker-icon-2x.png` | 2464 | 2487 | `00179c4c1ee830d3a108412ae0d294f55776cfeb085c60129a39aa6fc4ae2528` |
| `assets/vendor/leaflet/images/marker-icon.png` | 1466 | 1489 | `574c3a5cca85f4114085b6841596d62f00d7c892c7b03f28cbfa301deb1dc437` |
| `assets/vendor/leaflet/images/marker-shadow.png` | 618 | 641 | `264f5c640339f042dd729062cfc04c17f8ea0f29882b538e3848ed8f10edb4da` |
| `data/indonesia-adm2-registry.csv` | 133114 | 16350 | `db269ffe8bd12ba2c337fefd7812d9e4c9059e61bb5339a2697a78836c6ca116` |

## Geometry baseline

- Simplified geometry: 519 features.
- Detailed geometry: 519 features.
- Simplified SHA-256: `6d735512fb7cab04ac7ca6048aa41437eba4f53595b83d8da4f25c198ba01f91`.
- Detailed SHA-256: `5a5cc09736dea030b30536cec6958c8f9aaad4b61f71b1c45500db95bcc360e8`.
- Geometry types: {"Polygon":287,"MultiPolygon":232}.

## Current schema versions

- App version: `1.0.0`.
- Project schema: `1.0`.
- Sample project schema: `1.0`.
- Boundary version: `IDN-ADM2-2020-CODAB-geoboundaries`.
- Data registry schema: No explicit version field found in data/indonesia-adm2-registry.csv.

## Network and deployment baseline

- Initial app files are local relative URLs.
- External URLs visible in source: `https://www.geoboundaries.org/api/current/gbOpen/IDN/ADM2/`.
- Browser smoke testing records runtime requests under `artifacts/batch-1/smoke-network.json` when `npm run test:e2e:smoke` is run.
- GitHub workflow directory currently exists: true.
- `.nojekyll` currently exists: true.
- README currently mentions GitHub Pages: false.

## Current checks

- Pre-Batch 1 repository had one Python data check: `python tests/run_data_tests.py`.
- Batch 1 adds deterministic build, unit, smoke, accessibility, measurement, and CI checks.

## Accessibility and mobile risks visible in implementation

- The sidebar contains many controls and can be dense on small screens.
- Permanent map labels can collide or become visually busy even with collision hiding.
- Several icon-like buttons use text or symbols inherited from the current UI.
- Batch 1 records serious/critical axe failures as a blocking gate and lower-severity findings as artifacts.

## Baseline load, color, save, and export behavior

- Load: fetch local simplified geometry and then local detailed geometry; external geoBoundaries fallback is only attempted if local detailed geometry fails.
- Color: users select a region, choose a color, and apply it to the in-browser highlight state.
- Save: project JSON is built in the browser and downloaded locally; autosave uses browser localStorage.
- Export: SVG and PNG are generated in-browser without uploading project contents.

## Measurement limitations

- Raw and gzip sizes are filesystem measurements, not CDN transfer logs.
- Browser network evidence depends on the local Playwright environment and is stored separately by the smoke test.
- Accessibility evidence starts with automated axe checks only; manual keyboard and screen-reader testing remain required in later batches.
- The baseline does not verify legal currency of administrative boundaries.
