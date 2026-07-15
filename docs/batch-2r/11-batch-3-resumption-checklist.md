# Batch 3 resumption checklist

Batch 3 remains frozen. Batch 2R code completion alone does not authorize Batch 3 Prompt 2.

## Required owner gate

- [ ] The owner ran `docs/batch-2r/11-owner-validation-protocol.md` on desktop and phone.
- [ ] The owner recorded a clear approval or a list of defects with severity.
- [ ] No P0 or P1 product, data, privacy, accessibility, or visual issue remains.
- [ ] The owner explicitly confirms the implemented Option A desktop / Option C mobile / Option B error direction, including **Useful starting points** and the spreadsheet handoff.
- [ ] Boundary appearance was reviewed for national, dense adjacency, islands, eastern Indonesia, and high-DPI evidence.

Record the decision in a new, truthful artifact before resuming:

```text
docs/batch-2r/11-owner-validation-record.md
artifacts/batch-2r/owner-validation.json
```

The JSON should contain the reviewer, date, status (`approved` or `changes-required`), tasks completed, defect severities, retained requirements, required changes, and the closure commit it reviewed. Do not include spreadsheet content or personal data.

## Code and evidence gate

- [ ] `artifacts/batch-2r/closure.json` still reports the local gates as passed.
- [ ] `artifacts/batch-2r/final-test-matrix.json` shows no local failed gate.
- [ ] The owner decision is against the final production screenshots, not only the isolated prototypes.
- [ ] Any required UI correction has its own regression evidence and an updated owner record.

## Separate platform track

These operations are not a substitute for owner UI approval and must use the authenticated runbook in `docs/batch-2r/10-platform-rename.md`:

- [ ] GitHub repository rename and remote verification, if the operator chooses to perform it.
- [ ] Cloudflare Worker deployment to `nusacanvas-space` and staging verification.
- [ ] Live smoke test against the target workers.dev origin.
- [ ] Keep noindex in place. Do not attach or index `nusacanvas.space` as part of Batch 3 resumption.

## Authorization to resume

Only when the owner approval artifact is `approved` and no P0/P1 remains may the owner explicitly start Batch 3 Prompt 2. Batch 3 must begin from its existing preflight/contract rather than reinterpreting an upcoming card as implemented runtime.
