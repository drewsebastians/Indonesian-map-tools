# Known Limitations

- The production geometry is based on a 2020 COD-AB / geoBoundaries lineage, not a freshly verified 2026 official boundary.
- Current Indonesia has 38 provinces, but the inspected HDX ADM2 workbook represented 34 province codes.
- Papua Barat Daya, Papua Tengah, Papua Pegunungan, and Papua Selatan are not represented as separate ADM1 provinces in the inspected metadata.
- The geometry contains 519 ADM2 features; the HDX ADM2 workbook contains 522 rows. This differs from the commonly cited 514 autonomous kabupaten/kota count.
- 53 same-name geometry features could not be assigned an official code safely because the geometry file stores name-only attributes.
- DKI Jakarta administrative cities and Kepulauan Seribu are for visual reference, not legal boundary determination.
- Small islands are preserved in the GeoJSON where present, but clickability depends on browser zoom and screen size.
- SVG/PNG export uses a browser-side projection intended for presentation maps, not survey or legal mapping.
- Very large PNG exports may fail on memory-constrained browsers.
- Offline/PWA support is deferred; the app is currently an online static Cloudflare Workers app.
- This map is not a legal boundary determination.

