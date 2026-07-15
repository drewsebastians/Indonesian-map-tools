# Batch 2R Prompt 7 — Future workflow handoff contract

This is a contract for a future Sales territories or Coverage implementation. It does not add either runtime in Batch 2R.

## Preconditions

1. The user explicitly chooses a compatible next workflow from a completion state.
2. The next workflow shows a preview before accepting any handoff.
3. The preview lists included and excluded fields and offers Cancel.
4. The source project remains unchanged and can be saved or exported independently.

## Eligible fields

A future handoff may propose only the current project's canonical region IDs, matched display names, province or official codes where present, the selected numeric value or category, matching status, and non-sensitive map metadata such as source and period. It must preserve stable region IDs and the boundary/registry version.

## Excluded fields

It must exclude raw uploaded files, clipboard text, browser storage keys, autosave backups, migration diagnostics, unrelated project settings, local debug evidence, and any content not necessary for the selected workflow. It must not infer, enrich, upload, or derive new data remotely.

## Acceptance

The future workflow must create a reversible working copy only after confirmation. It may not silently mutate the source project, replace its export metadata, or remove unresolved rows. If a boundary or schema is incompatible, it must show a recoverable explanation and leave both projects safe. A user must be able to cancel without creating a future-workflow project.

Until that implementation exists, the UI may only label Sales territories and Coverage as **upcoming**.
