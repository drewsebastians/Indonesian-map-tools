# Batch 2 Prompt 4 - Matching and Resolution Report

Date: 2026-07-13

Status: `IMPLEMENTED - DETERMINISTIC MATCHING V2`

Commit target: `batch2: add deterministic matching and resolution`

## Scope Delivered

- Added `assets/js/matching-engine.js` as a pure deterministic matching module.
- Integrated matching v2 into the shared paste/CSV/TSV/XLSX preview pipeline.
- Added explicit match statuses and evidence to each imported row.
- Added a compact ambiguity-resolution UI inside import preview.
- Added project-scoped import corrections with registry-version checks.
- Kept all matching local in the browser; no AI, geocoder, API, backend, or registry write-back was added.

## Index Design

The lazy matching engine builds indexes from the active geometry/registry properties:

- canonical geometry ID;
- derived stable canonical ID;
- verified official code variants;
- exact canonical/display/source name plus province;
- exact alias plus province from approved `alternative_names`;
- normalized name plus province;
- safe name-only candidate buckets for suggestions only.

Index version:

`IDN-ADM-REGISTRY-v1-2025-06-23:matching-v2`

The index keeps ambiguous buckets as arrays; no duplicate key overwrites another record.

The engine is lazy-loaded during import preview, not startup:

- `assets/js/matching-engine.js`
- raw size: 10,941 bytes
- gzip size: 2,861 bytes

## Normalization Rules

The engine applies deterministic normalization:

- Unicode NFKD normalization and diacritic stripping;
- uppercase comparison;
- punctuation and repeated whitespace collapse;
- official-code punctuation variants such as `35.78`, `3578`, `ID3578`, and `ID-3578`;
- conservative removal of administrative prefixes for normalized matching, including `Kabupaten`, `Kab.`, `Kab`, `Kota Administrasi`, `Kota`, `City`, and `Regency`.

Exact-name matching preserves more text than normalized matching. Name-only rows are never silently applied, even when the candidate set is small.

## Matching Order

Implemented order:

1. exact verified official code;
2. exact canonical name plus province;
3. exact alias plus province;
4. deterministic normalized name plus province;
5. explicit user resolution.

Name-only matches are suggestions only and produce `ambiguous`.

## Match Statuses

Rows can now produce:

- `exact-code`;
- `exact-name-province`;
- `exact-alias-province`;
- `normalized-name-province`;
- `ambiguous`;
- `unmatched`;
- `invalid`;
- `duplicate-target`;
- `user-resolved`;
- `ignored`.

Evidence includes key type, key value, registry version, index version, candidate IDs, duplicate target ID, and user decision metadata where applicable.

## Ambiguity and Duplicate Behavior

- Ambiguous rows remain excluded until the user chooses a candidate.
- Unmatched rows remain excluded and can be ignored.
- Duplicate targets are shown before apply and do not overwrite, sum, average, or choose the last row.
- User can resolve a row, ignore a row, or reset a decision.
- User decisions are stored in the project/session under `importCorrections`.
- Stale corrections are dropped when registry version changes.

## Tests and Evidence

Commands run:

- `node --test --test-isolation=none tests/unit/*.test.js` - 25/25 passed.
- `node scripts/build.js` - built `dist` with 37 allowlisted files.
- `playwright test tests/e2e/smoke.spec.js --project=chromium-desktop` - 7/7 passed.
- `node scripts/check-performance-budgets.js` - passed: initial `601656`, simplified `518479`, shell JS `74203` gzip bytes.
- `node scripts/data-pipeline.js verify-sources` - passed: 6 source records, 18 license assets.
- `node scripts/security-audit.js` - passed: 8 checks.
- `node scripts/check-static-content.js` - passed: 9 trust pages.

Unit coverage includes:

- exact code;
- exact canonical name/province;
- alias/province;
- missing province ambiguity;
- duplicate target;
- user resolution;
- stale correction after registry version change;
- project-scoped correction persistence.

E2E coverage includes:

- import preview with province-aware deterministic matching;
- ambiguous name-only import;
- candidate selection;
- local user resolution;
- explicit apply only after resolution.

## Known Limitations

- The UI uses compact row-level controls rather than a full dedicated data-table/resolution workspace; Prompt 5 is expected to improve this into the beginner workflow and linked table.
- Name-only candidate search is limited to candidates derived from the row text. Broader free-text registry search can be expanded in Prompt 5 without changing engine semantics.
- Duplicate rows are blocked from silent apply; richer aggregation choices are deferred to visualization/data-table work.
- User corrections remain project/session scoped and are not a canonical-data review workflow.
