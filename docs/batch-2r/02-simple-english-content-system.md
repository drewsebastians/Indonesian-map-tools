# Batch 2R Simple-English Content System

## Outcome

The active product experience now uses simple English from the workspace through import, region matching, map design, projects, export, trust pages, and guides. This is a presentation-layer change. It does not alter boundaries, stable IDs, matching decisions, project schemas, export formats, or source and license evidence.

## Content architecture

| Concern | Governed source | Rule |
| --- | --- | --- |
| Short UI copy and reusable runtime messages | `assets/js/product-content.js` | Buttons, workflow names, reusable success/warning/error messages, source badge copy, and export labels come from one browser-safe dictionary. |
| Approved vocabulary and policy | `content/terminology.json` | Preferred terms, discouraged alternatives, advanced-only terms, exemptions, style, and brand transition policy are machine readable. |
| Long-form content | Active route HTML | Trust pages and guides may use complete explanations, but must follow the glossary and declare `lang="en"`. |
| Product state | Stable IDs and `data-*` attributes | Tests and assistive status consumers use semantic state rather than translated prose. |
| Data and interoperability contracts | Existing engine and data files | Internal status codes, schema fields, storage keys, accepted spreadsheet aliases, and stable export column headers are not product copy and remain compatible. |

`index.html` uses `data-copy`, `data-copy-placeholder`, `data-copy-title`, and `data-copy-aria` where a short reusable label belongs to the governed dictionary. `app.js` uses `ProductContent.text(key, values)` for reusable dynamic messages. Long explanations remain close to their page so they can be reviewed in context.

## Writing standard

- Use sentence case, common verbs, active voice, and short sentences.
- Use one instruction per sentence when recovery is required.
- Say what happened before introducing a next step.
- Never blame the user or expose engine diagnostics in normal UI.
- Refer to regencies and cities collectively as “regions” after the first plain explanation.
- Use “match regions”, “unmatched regions”, “color by value”, “design map”, and “export map” in the main workflow.
- Keep source, license, and legal-boundary statements exact enough to remain trustworthy.

## Message patterns

### Success

State the completed result with a count or object when useful.

> 2 rows were added to the map.

### Warning

State the limitation, confirm safety, then give one recovery action.

> 2 regions could not be matched. Your map is still safe. Check the region names or select the correct matches.

The nearby action is “Fix unmatched regions”. An unmatched row never changes the map silently.

### Recoverable error

Use three calm parts: what failed, what stayed safe, and what to do next.

> We could not read this spreadsheet. Your current map is still safe. Upload a supported .xlsx file without macros, or paste the data instead.

Raw ZIP, parser, rendering-mode, schema, or matching-engine diagnostics are not shown as primary product copy.

## Semantic state contract

Tests should use state before copy:

- app readiness: `#loadingIndicator[data-state="ready"]`;
- data versions: `#dataTruthBadge[data-boundary-version][data-registry-version]`;
- workflow: `#workflowStatus[data-stage]` with `add-data`, `match`, `design`, or `export`;
- import preview: `#csvPreview[data-match-status]` plus count attributes;
- preview rows: `data-match-status` with visible states such as `matched`, `unmatched`, or `needs-review`;
- visualization: `#vizSummary[data-state]` and numeric count attributes;
- map/table selection: `#mapSelectionStatus[data-state]` and `data-table-row`;
- project backup/open status: `#autosaveStatus[data-state]`;
- recoverable errors: `#errorArea[data-state="error"]`.

Exact-copy assertions remain appropriate only for safety language, representative governed messages, legal notices, and accessibility names that form part of the product contract.

## Scope and exemptions

The active scope is the workspace, all public trust/support routes, `/excel-to-map/`, and all existing guide pages. Historical files under `docs/**`, `artifacts/**`, test reports, and prior prompt evidence are records of their time and are not rewritten.

These are deliberately preserved:

- official Indonesian province, regency, and city names;
- accepted Indonesian spreadsheet header aliases such as `wilayah`, `provinsi`, and `nilai`;
- `geoBoundaries/HDX COD-AB`, Kepmendagri source names, and `CC BY 3.0 IGO`;
- boundary, registry, source, schema, and canonical IDs;
- internal matching values, serialized keys, storage keys, test IDs, and stable export CSV headers;
- user-entered titles, labels, categories, values, and filenames.

The Mapnesia name is an expected Prompt 2 warning. Its replacement is owned by Prompt 3, so this prompt does not rename the repository, Worker, storage key, or public routes.

## Automated governance

Run `npm run audit:terminology`. The audit reads `content/terminology.json`, checks every active HTML and JavaScript surface, writes `artifacts/batch-2r/terminology-audit.json`, and fails for:

- an active page without `lang="en"`;
- known legacy Indonesian product labels;
- mixed-language product sentences;
- advanced-only terminology exposed in the Basic workspace;
- known raw internal or mixed runtime phrases;
- a missing required governed term.

Old-brand occurrences are reported as warnings until Prompt 3. Official data, contract identifiers, and historical evidence use the explicit exemptions above.

## Acceptance rule

Prompt 2 is complete only when the terminology audit, unit tests, browser smoke/trust/accessibility tests, static content checks, security audit, build, data/source gates, geometry gates, and performance budget all pass without changing the frozen Batch 3 contract.
