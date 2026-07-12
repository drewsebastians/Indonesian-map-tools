# Batch 1 Baseline Audit

Generated: 2026-07-12T15:48:46.009Z
Repository commit: `cbb517dd9f14f6fee4b7dfa6d9df3786b3b2bc2f`
Branch: `main`

## Runtime entry points

- `index.html` loads local Leaflet, application CSS, and five browser scripts.
- `assets/js/app.js` starts on `DOMContentLoaded` and fetches only the simplified geometry snapshot.
- `assets/js/project-storage.js` defines project schema validation, autosave, and JSON download.
- `assets/js/export.js` creates SVG and PNG files in the browser.

## Production files measured

| File | Raw bytes | Gzip bytes | SHA-256 |
|---|---:|---:|---|
| `_headers` | 676 | 363 | `06374fb74831906e2911c6dc1d6965ec063e08baa219535e9b6fa5545b7f82df` |
| `.nojekyll` | 2 | 22 | `7eb70257593da06f682a3ddda54a9d260d4fc514f645237f5ca74b08f8da61a6` |
| `index.html` | 8054 | 2344 | `64e6a644f119828c9f40d59edea131b9504f1ab9f13d19d62ab3c922104ede65` |
| `robots.txt` | 27 | 47 | `32403248dc764535c87140955fc9451f9ebc9702f3e298d1c24fe84e558a53a9` |
| `assets/css/app.css` | 8424 | 2171 | `50099a53fc3ed912337bfad50bf9a5650ad67bdf241cb31a6acaa8a5699e4454` |
| `assets/js/project-storage.js` | 4247 | 1378 | `561ca805bb12d5f571cd71571fd960472160832c2d1b8702919ef6d104d05039` |
| `assets/js/csv-import.js` | 4562 | 1505 | `faab595b42460b0ad7335f6dfae15515fb862244b56d9c41ede1200d920243c8` |
| `assets/js/export.js` | 16990 | 5120 | `1adca20529411b3ae56ddd413ddb0c321db83bdc7ba2e00e015c4738ec483fcf` |
| `assets/js/map.js` | 10124 | 2867 | `dc6c4daafb55c1958af3b2ed78dc04ead80c2e8a016575c1774e018e2a6cd214` |
| `assets/js/app.js` | 31597 | 8123 | `13d11aeaa1c01abe701814cb93847097045324c47ebbab73ce240a2cca6a3f96` |
| `assets/vendor/leaflet/leaflet.css` | 14806 | 3524 | `a7837102824184820dfa198d1ebcd109ff6d0ff9a2672a074b9a1b4d147d04c6` |
| `assets/vendor/leaflet/leaflet.js` | 147557 | 42503 | `3104b526504d0d61fd3099a4521e87f732ccc3174dec54e08de6ba8bde3e15ff` |
| `data/indonesia-adm2-simplified.geojson` | 2014724 | 518479 | `6d735512fb7cab04ac7ca6048aa41437eba4f53595b83d8da4f25c198ba01f91` |
| `sample/sample-project.json` | 755 | 381 | `dd22b0645b4de6255aab7db4cd66429522a763122b9cd84f3ca7855ecd02a546` |
| `sample/sample-region-colors.csv` | 227 | 197 | `10de9761ce0e394a3fb1084a8c157116aba4a2a05e6357dfe4ce56f63b7acd2d` |
| `data/indonesia-adm2-detailed.geojson` | 11003421 | 2999956 | `5a5cc09736dea030b30536cec6958c8f9aaad4b61f71b1c45500db95bcc360e8` |
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
- Detailed geometry is an on-demand export asset, not a startup asset.
- External URLs visible in source: none.
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

- Load: fetch local simplified geometry only; detailed geometry is loaded only after explicit high-detail export selection.
- Color: users select a region, choose a color, and apply it to the in-browser highlight state.
- Save: project JSON is built in the browser and downloaded locally; autosave uses browser localStorage.
- Export: SVG and PNG are generated in-browser without uploading project contents.

## Measurement limitations

- Raw and gzip sizes are filesystem measurements, not CDN transfer logs.
- Browser network evidence depends on the local Playwright environment and is stored separately by the smoke test.
- Accessibility evidence starts with automated axe checks only; manual keyboard and screen-reader testing remain required in later batches.
- The baseline does not verify legal currency of administrative boundaries.
