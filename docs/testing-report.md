# Testing Report

Test date: 2026-06-18

## Automated checks

Command:

```text
python tests/run_data_tests.py
```

Coverage:

- GeoJSON parses.
- FeatureCollection type is present.
- Expected 519 features are present.
- Stable region IDs are unique.
- Only Polygon and MultiPolygon geometry types are present.
- Required display and matching fields are populated.
- Geometry coordinates are nonempty and within valid lon/lat ranges.
- Registry rows reconcile with GeoJSON features.
- Sample CSV codes match the registry.
- Sample project IDs match the GeoJSON.

Result: passed.

Evidence:

```text
PASSED
features=519 polygon=287 multipolygon=232
registry=519 sample_csv_rows=3
```

## Manual functional checklist

The following should be verified in a browser after deployment or local static serving:

| Area | Test | Expected |
|---|---|---|
| Map | App loads | 519 regions render with no basemap dependency |
| Map | Click region | Selection text updates and polygon outline changes |
| Search | Search Surabaya | Result zooms to Kota Surabaya |
| Filter | Choose a province | Region dropdown filters and map fits province |
| Highlight | Apply several colors | Colors persist during pan, zoom, hover, and selection |
| Highlight | Remove, undo, reset | Changes behave as labelled |
| CSV | Import sample CSV | Three valid rows preview and apply |
| CSV | Invalid color | Row is rejected and error report can be downloaded |
| Project | Save/open sample project | JSON validates and restores highlights |
| Export | SVG | File downloads and contains map, title, legend, attribution |
| Export | PNG | File downloads at selected size |
| Privacy | Network | Runtime resources are same-site static files only |
| Mobile | Narrow viewport | Controls stack above the map and remain reachable |

## Current limitations

## Browser smoke test evidence

Local URL:

```text
http://localhost:8000/
```

Observed in the in-app browser:

- Page title: Peta Warna Wilayah Indonesia
- Loading status: 519 wilayah dimuat.
- Rendered Leaflet SVG paths: 519
- Region dropdown options: 520
- Console errors: 0
- Search for `Surabaya`: one result, `Kota Surabaya - Jawa Timur`
- Applying `#E74C3C` to Surabaya: highlight count became 1
- SVG and PNG export buttons were enabled
- Screenshot capture attempted, but the browser capture timed out on the large map surface; capture should be repeated manually after deployment or in a fresh browser.

## Current limitations

Cloudflare Workers smoke testing still needs to be run after deployment. Cross-browser checks in Edge, Chrome, and Firefox were not completed in this environment.
