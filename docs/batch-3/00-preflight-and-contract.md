# Batch 3 Prompt 1 — Preflight dan Kontrak Bisnis

Tanggal verifikasi: 13 Juli 2026  
Branch: `main`  
Commit dasar yang diverifikasi: `323cdc1d6b5939f57a95ca928417b1e8ee6cb481`  
Staging: `https://mapnesia.andrew-sebastian91.workers.dev`

## Keputusan gate

Batch 2 telah lulus gate lokal dan live staging. Prompt ini hanya menetapkan kontrak versioned untuk pekerjaan Batch 3; belum ada territory engine, coverage engine, content shell penuh, monetisasi, domain produksi, analytics, atau AI runtime yang diimplementasikan.

Perubahan kecil yang menjadi bagian dari gate:

- konfigurasi smoke mobile memakai viewport responsif dengan touch semantics yang stabil pada CI;
- export section diberi stacking context agar kontrol ekspor tetap dapat ditap;
- smoke matrix merekam first-user flow dua kolom berbasis kode wilayah resmi tanpa melemahkan aturan ambiguity.

## A. Bukti Batch 2

| Prasyarat | Status | Perintah / bukti |
| --- | --- | --- |
| Clean install | pass | `pnpm dlx npm@11.6.2 clean-install --ignore-scripts` |
| Build allowlisted | pass | `node scripts/build.js`; 48 file |
| Data, source, license, reproducibility | pass | `node scripts/data-pipeline.js test`; 6 source, 18 asset, no drift, run hash `215deb9d81f1ddfe40656dd2191d9ad872646863844971084b756167a4baac61` |
| Geometry/stable ID | pass | `python tests/run_data_tests.py`; 519 feature, 519 canonical region, 38 province, 53 ambiguous fixture |
| Unit/migration | pass | `node --test --test-isolation=none tests/unit/*.test.js`; 31/31 |
| Browser smoke | pass | `node scripts/verify-batch1.js`; 56/56 pada Chromium desktop/mobile, Firefox, WebKit |
| Trust/support browser | pass | 12/12 |
| Accessibility | pass | 8/8 serious/critical axe gate |
| Performance | pass | initial 611,579 B gzip; simplified geometry 518,479 B; shell JS 81,974 B |
| Static content | pass | 17 halaman |
| Security/privacy | pass | 8/8 |
| Source/license gate | pass | `npm run data:verify-sources` dan pipeline test |
| Live staging | pass | `node scripts/verify-staging.js https://mapnesia.andrew-sebastian91.workers.dev`; assets, headers, robots, 404 |
| First-user two-column | pass | `artifacts/batch-1/first-user-two-column-*.json`, 4 browser projects, 0 blocking error |
| Lint/typecheck | not-applicable | tidak ada script lint/typecheck di `package.json`; digantikan oleh build, unit, E2E, security, dan static checks |

Rujukan closure: `docs/batch-2/08-batch-2-closure.md`, `artifacts/batch-2/closure.json`, `docs/batch-2/08-first-user-manual-protocol.md`.

## B. Prinsip lintas Batch 3

Semua workflow tetap client-side, tanpa akun dan tanpa upload. Isi spreadsheet, nama file, nilai wilayah, teks bebas, dan raw error tidak boleh dikirim ke server, analytics, tracker, atau API model. Tidak ada AI runtime, chatbot, prompt box, data population/election/travel, ADM3 startup, kolaborasi, backend project storage, ads, AdSense, custom domain, atau production analytics pada Batch 3. Data contoh bisnis harus sintetis dan dilabeli jelas.

Boundary geometry, canonical registry, stable IDs, crosswalk, dan license approvals diwarisi apa adanya. Koreksi data hanya boleh melalui blocker terverifikasi dan migration review terpisah.

## C. Kontrak Sales Territory — `batch3.sales-territory.v1`

### Hierarki

Node memakai struktur deterministik berikut:

```json
{
  "id": "territory-node-id",
  "level": "salesRegion|area|branch|territory",
  "displayName": "Nama tampilan",
  "color": "#RRGGBB|null",
  "parentId": "parent-node-id|null",
  "sortOrder": 10,
  "status": "active|archived",
  "scenarioId": "current",
  "createdAt": "local ISO timestamp",
  "updatedAt": "local ISO timestamp"
}
```

ID internal tidak berasal dari row order atau display name. Serialisasi mengurutkan node berdasarkan `level`, `sortOrder`, lalu `id`; warna dan nama tidak mengubah ID. Rename mempertahankan ID dan histori; archive mempertahankan assignment historis tetapi mengeluarkannya dari pilihan aktif; delete hanya boleh jika tidak ada assignment aktif, atau melalui explicit reassignment/unassigned review. Validator menolak siklus, parent lintas level yang tidak sah, orphan, duplicate ID, dan collision nama aktif pada sibling yang sama (case/Unicode-normalized).

### Assignment

```json
{
  "canonicalRegionId": "adm2-stable-id",
  "scenarioId": "current",
  "leafTerritoryId": "territory-id|null",
  "path": {"branchId": "...", "areaId": "...", "salesRegionId": "..."},
  "ring": "core|greater|unassigned",
  "sourceRowIds": ["row-0001"],
  "metrics": {"sales": {"value": 1200, "state": "value"}},
  "provenance": "imported|manually-assigned|copied-from-scenario|migrated",
  "createdAt": "local ISO timestamp",
  "updatedAt": "local ISO timestamp"
}
```

Satu canonical administrative region boleh memiliki paling banyak satu leaf territory dalam satu scenario. Shared territory bukan perilaku tersembunyi; jika diperlukan kelak, ia menjadi kontrak baru. `unassigned` adalah keadaan eksplisit, bukan territory palsu. Assignment selalu menyimpan canonical ID dan path turunan untuk audit, tetapi canonical ID adalah kunci rekonsiliasi.

### Scope dan validasi

- `national`: semua 519 canonical region pada boundary yang aktif.
- `province`: subset berdasarkan province ID canonical.
- `imported-row`: region yang memiliki source row diterima.
- `user-selected`: subset pilihan user saat ini.
- Unassigned berarti region valid dalam scope yang belum memiliki leaf assignment untuk scenario aktif.
- Overlap berarti dua leaf assignment aktif mengklaim canonical ID yang sama dalam scenario yang sama; duplicate source rows adalah masalah input dan tidak boleh berubah menjadi duplicate assignment.
- `unresolved` mencakup ambiguous, unmatched, invalid code, atau row yang belum dikonfirmasi user.
- `orphan-assignment`, `hierarchy-name-collision`, `invalid-ring`, dan `invalid-scenario` adalah error validator dan dikeluarkan dari summary hingga diperbaiki.

## D. Kontrak scenario — `batch3.scenario.v1`

```json
{
  "id": "current|proposed-2026-01|custom-id",
  "type": "current|proposed|custom",
  "name": "Current",
  "baseScenarioId": null,
  "active": true,
  "readOnly": false
}
```

Current adalah baseline read-only secara bisnis. Proposed/custom dibuat lewat copy/fork yang deterministic dan menyimpan `baseScenarioId`; copy hanya menyalin assignment valid dan mencatat `copied-from-scenario`. Comparison snapshot read-only tidak boleh memutasi active scenario. Perbandingan menggunakan `canonicalRegionId`, bukan urutan row atau nama tampilan, dengan change type: `unchanged`, `newly-assigned`, `removed/unassigned`, `reassigned`, `ring-changed`, `hierarchy-changed`, `unresolved`.

## E. Kontrak summary territory — `batch3.summary.v1`

Metric yang dipetakan user (Sales, Outlet, Active Customer, Gross Margin value/percentage, atau numeric field lain) menyimpan unit, aggregation rule, source column, dan state. Default aggregation numeric adalah `sum` per canonical region/source-row policy; `count` dan `weighted-average` harus dipilih eksplisit. Gross Margin percentage tidak pernah dijumlahkan; gunakan weighted average hanya bila denominator tersedia, selain itu tampilkan `no-data`/`not-computable`.

Blank, zero, invalid, dan excluded tetap state berbeda. Duplicate source row tidak dihitung dua kali pada accepted scope. Rollup Territory → Branch → Area → Sales Region → national harus merekonsiliasi accepted matched canonical scope; unresolved, orphan, overlap, invalid ring/scenario, dan excluded rows ditampilkan dalam warning count serta tidak masuk total. Summary menyimpan `acceptedCount`, `excludedCount`, `unresolvedCount`, `duplicateCount`, dan `reconciliation`.

## F. Kontrak Distribution Coverage — `batch3.distribution-coverage.v1`

Mode inti: `binary`, `coverage-percentage`, `outlet-count`, `active-customer-count`, dan `sku-distribution`. Semua metric berasal dari input user atau synthetic sample yang dilabeli; tidak ada dataset eksternal bundled.

- Numeric gap: `gap = target - current`, kecuali metric contract yang secara eksplisit mendefinisikan arah lain.
- Percentage memiliki bounds/format yang dinyatakan (0–100% atau 0–1 hanya satu representasi per field); nilai di luar bounds menjadi invalid, bukan clamp diam-diam.
- Binary menampilkan covered/not-covered, target state, dan gap category secara terpisah.
- Current/target missing, denominator missing/zero, blank, negative, invalid, dan no-data adalah state berbeda dan dijelaskan pada legend/summary.
- Negative gap tidak disembunyikan; artinya current melampaui target dan diberi label surplus/above target.
- Aggregation province dan territory menyimpan numerator/denominator sebelum menghitung percentage; percentage tidak dijumlahkan.
- UI wajib menjelaskan formula, period, source column, exclusions, dan scope.

## G. Template dan deep-link — `batch3.template-entry.v1`

Preset resmi: `/templates/excel-to-map/`, `/templates/sales-territory/`, `/templates/distribution-coverage/`. Query domain-neutral menggunakan `?template=excel-to-map|sales-territory|distribution-coverage` dan optional `?scenario=current|proposed|custom-id`; unknown value fallback ke default dengan disclosure. Preset hanya mengubah onboarding copy, synthetic sample/recommended sample, initial mappings, Basic-mode controls, visualization defaults, dan CTA. Semua preset memakai shared map engine, import pipeline, schema, dan export contracts.

## H. Kontrak content architecture — `batch3.content.v1`

Route groups: `/`, `/studio/`, `/templates/`, `/guides/`, `/reference/`, `/sources-and-licenses/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/faq/`, `/changelog/`. Content page tidak menginisialisasi map engine atau memuat geometry pada initial load. `/studio/` adalah aplikasi berat terpisah.

Setiap artikel/landing memiliki frontmatter: `id`, `slug`, `title`, `description`, `contentType`, `primaryProblem`, `author`, `reviewer`, `reviewedDate`, `status` (`draft|review|published`), `sources`, `limitations`, `workedExample`, `templateCta`, `relatedGuides`, `downloadableAssets`, `updatedAt`. Content types: cornerstone guide, workflow tutorial, methodology/reference, template landing, trust/support. Published page harus punya internal link masuk/keluar dan bukan thin duplicate.

Minimum planned inventory: 4 cornerstone guides, 6–10 workflow tutorials, 4 methodology/reference pages, 3 template landings, plus complete trust/support pages. Semua sample business data synthetic dan downloadable asset diregistrasikan pada license/source manifest.

## I. Performance, storage, dan privacy budgets

Inherited hard budgets: initial gzip ≤1,100,000 B; simplified geometry ≤600,000 B; shell JS ≤150,000 B; initial requests ≤12. Preferred values tetap 1,000,000 / 600,000 / 150,000. Territory/coverage engine dan UI wajib lazy-load dan dicatat sebagai budget baru: masing-masing ≤120 KB gzip, combined ≤200 KB gzip, tanpa memuat pada ordinary content route. Content page JS target ≤70 KB gzip dan geometry/map-engine requests = 0.

Acceptance budgets: 519-region multi-select interaction p95 ≤100 ms per action; summary recompute p95 ≤250 ms for 519 rows; scenario switch p95 ≤300 ms; table first meaningful render ≤500 ms for 1,000 rows with virtualization/分页; export memory ≤2× accepted input size plus generated artifact and must yield on large work; project local storage hard cap 5 MB with actionable refusal; no network request may include imported content or raw errors.

## Evidence plan and ownership

Planned contract/validator locations:

- `docs/batch-3/contracts/sales-territory.schema.json`
- `docs/batch-3/contracts/distribution-coverage.schema.json`
- `docs/batch-3/contracts/scenario.schema.json`
- `assets/js/domain/territory-validator.js`
- `assets/js/domain/coverage-validator.js`
- `tests/fixtures/batch-3/territory/`
- `tests/fixtures/batch-3/coverage/`
- `tests/fixtures/batch-3/migrations/`

Runtime validators must reject unknown schema versions, invalid IDs, cycles/orphans, duplicate assignments, invalid metric states, and unsafe strings before persistence/export. Fixtures cover current/proposed copy, rename/archive, one-region overlap, ambiguous/unresolved input, ring changes, no-data/zero/negative target, percentage denominator, duplicate rows, and migration rollback.

Threat notes: local-only data flow, no third-party requests from import/matching/export, formula-injection redaction on downloads, XSS-safe text rendering, bounded parser input, no macro/external-link execution, no raw error telemetry, and no external dataset fetch in coverage. Any new dependency or asset requires source/license manifest update before merge.

Module ownership: existing shared import/matching/schema/export modules remain authoritative; `domain/territory-*` owns territory rules; `domain/coverage-*` owns metric rules; `templates/` owns preset metadata only; `content/` owns static pages; `studio/` consumes contracts and owns presentation state. No duplicated map engine.

Test matrix: unit validators and aggregation; migration fixtures; deterministic serialization; import/no-exfiltration network audit; desktop/mobile keyboard/touch E2E; 519-region performance; export reconciliation; content route no-geometry request; accessibility axe gates; data/license/security gates; live staging assets/headers/404/noindex. Human usability remains a separately recorded manual action and must never be claimed from automation.

Explicit non-goals: runtime AI, accounts, collaboration, backend/cloud project storage, ads/AdSense, production analytics, custom domain, population/election/travel datasets, ADM3 startup map, multi-owner shared territories, silent fuzzy match, and monetization experiments.

## Batch 3 sequence after this contract

1. Entry points/import mapping/schema foundation.
2. Deterministic territory engine.
3. Accessible territory designer, scenarios, summaries, exports.
4. Distribution Coverage and Gap suite.
5. Lightweight content shell, templates, guides, methodology, trust/editorial QA.
6. Cross-cutting integration, staging acceptance, and Batch 3 closure.

Each work package must re-run the prerequisite checks, preserve this contract, and stop with a blocker report on any data-truth, privacy, license, accessibility, performance, or migration regression.

**READY FOR BATCH 3 IMPLEMENTATION**
