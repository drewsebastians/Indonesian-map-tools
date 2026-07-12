# Update Boundary Data

## Reproducible release gate

Do not replace production data directly from a live `/current/` endpoint. A future update must start as an explicit source-review task and must pass the offline pipeline:

1. Pin the exact source artifact, source identifier, version/effective period, retrieved date, media type, and SHA-256 in `data/sources/source-inventory-v1.json`.
2. Record license, commercial-use, modification, redistribution, attribution, reviewer, and production approval status in `data/license-manifest-v1.json`.
3. Run `npm run data:verify-sources`.
4. Run `npm run data:diff` and review added, removed, changed, ID, name/code/province, ambiguity, checksum, license, and project compatibility impact.
5. Update boundary/registry versions, migration notes, and user-project fixtures before approval.
6. Run `npm run data:reproduce`, `npm run test:data`, and the full quality gate.

`npm run data:refresh` intentionally fails closed. It is a reminder that refresh is a reviewed workflow, not a normal build step.

See `docs/data-release-policy.md` for ownership cadence, stale-data triggers, migration policy, and the license-review checklist.

1. Find a newer authoritative reference from Kemendagri, BPS, BIG, Ina-Geoportal, Satu Data Indonesia, HDX, or geoBoundaries.
2. Confirm the license explicitly permits public redistribution, modification/simplification, and Cloudflare Workers hosting.
3. Download the source data without bypassing authentication, CAPTCHA, or access controls.
4. Inspect format, fields, CRS, feature count, geometry types, and province/ADM2 code fields.
5. Convert SHP, KML, geodatabase, WFS, or FeatureServer output to EPSG:4326 GeoJSON.
6. Preserve Polygon and MultiPolygon geometry.
7. Validate null geometry, coordinate ranges, invalid rings, duplicate IDs, overlaps, and gaps.
8. Do not rename existing geometry IDs in-place. Create a candidate boundary version and a crosswalk first.
9. Match official codes and names without forcing ambiguous matches.
10. Update `indonesia-adm2-registry.csv`, `canonical-regions-v1.csv`, `crosswalk-region-ids-v1.csv`, `boundary-version-crosswalk-v1.json`, `unmatched-and-extra-regions.csv`, and `boundary-validation-summary.json`.
11. Simplify only a copy, preserving small islands as far as practical.
12. Update `ATTRIBUTION.md`, `data/README.md`, and source-research documentation.
13. Add project migration fixtures for unchanged, split, merge, retired, ambiguous, and missing regions.
14. Run data, CSV, project, migration, performance, and export tests.
15. Version the boundary data and disclose any changes in release notes.

## Boundary replacement gate

A newer administrative list is not sufficient to replace the active geometry. A production replacement requires:

- clear redistribution and modification rights;
- exact source artifact and checksum;
- topology validation;
- crosswalk coverage for all existing project IDs;
- migration preview/report behavior;
- startup performance proof;
- updated noindex/staging verification.

