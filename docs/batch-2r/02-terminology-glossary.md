# Batch 2R Terminology Glossary

The machine-readable authority is `content/terminology.json`. This document is the reviewer-friendly companion.

## Product terms

| Use this | Meaning in this product | Avoid in primary UI |
| --- | --- | --- |
| Region | A regency or city shown on the Indonesia map | administrative entity, feature |
| Highlight regions | Give selected regions a manual color | apply geometry style, manual coloring |
| Add data / Map spreadsheet data | Paste rows or upload a local spreadsheet | ingestion, import pipeline |
| Match regions | Connect spreadsheet rows to regions on the map | entity resolution, canonical matching |
| Unmatched regions | Rows not yet connected to one region | unresolved entities, raw `unmatched` status without explanation |
| Fix unmatched regions | Review names or choose the correct match | resolve entities |
| Color by value | Assign colors from numeric values | choropleth, numeric classification |
| Color by category | Give each category a different color | categorical classification |
| Design map | Choose colors, legend, title, and map settings | apply visualization |
| Export map | Download SVG, PNG, or PDF | render output |
| Save project | Download a portable local project file | persist project |
| Open project | Open a saved file after safety checks pass | load schema |
| Clear map | Remove all current highlights | reset all |
| Start over | Remove the project and browser backup after confirmation | clear schema/storage |

## Workflow language

The four stages are exactly:

1. Add data
2. Match regions
3. Design map
4. Export map

Use direct actions: “Try a sample”, “Highlight region”, “Remove highlight”, “Undo”, “Add legend item”, “Use these matches”, “Preview colors”, “Save project”, “Open project”, “Export SVG”, “Export PNG”, “Export PDF”, and “Download region match table”.

## Future entry-point language

“Build sales territories” and “Analyze coverage” are approved names for future Batch 3 entry points. Prompt 2 governs the terms only. It does not implement those workflows.

## Advanced-only terms

| Term | Allowed context | Plain alternative |
| --- | --- | --- |
| ADM2 | Source, license, methodology, or advanced boundary details | regency and city boundaries |
| geometry | Methodology, source evidence, diagnostics, or developer evidence | boundaries |
| feature | Developer or source evidence | region |
| canonical registry | Developer or methodology evidence | verified region list |
| choropleth | Methodology after a plain explanation | color by value |
| entity resolution | Developer evidence | match regions |
| import pipeline | Developer evidence | add data |
| unresolved entity | Developer evidence | unmatched region |

Advanced terms must not appear in the Basic workspace, button labels, normal statuses, or recoverable errors.

## Matching status presentation

Internal matching values remain stable for saved projects and exports. Display them as:

| Internal state | Visible label |
| --- | --- |
| `exact-code`, `exact-name-province`, `exact-alias-province`, `normalized-name-province` | Matched |
| `user-resolved` | Matched by you |
| `ambiguous` | Choose a match |
| `unmatched` | Unmatched |
| `duplicate-target` | Duplicate region |
| `invalid` | Check this row |
| `ignored` | Ignored |

## Protected names and contracts

Do not translate official Indonesian region names or user data. Do not rename accepted spreadsheet header aliases, schema IDs, storage keys, version IDs, internal status codes, HTML/test IDs, or stable export column headers. Preserve official source and license names verbatim where attribution requires them.

## Brand transition

Mapnesia is the current old-brand token. In Prompt 2 it is an audit warning, not a failure. Prompt 3 owns replacement naming and any related copy transition; it does not automatically authorize repository, Worker, domain, or compatibility-key renames.
