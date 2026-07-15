# Batch 2R closure: NusaCanvas Experience Reset

Date: 2026-07-15  
Code status: **complete and regression-checked locally**  
Owner validation status: **required; not yet recorded**

## Closure classification

**BATCH 2R CODE COMPLETE — OWNER VISUAL APPROVAL REQUIRED**

The approved direction was implemented: Option A's desktop guided rail and dominant map, Option C's map-first mobile sheets, Option B's clear recoverable-error treatment, the **Useful starting points** section, and the manual-highlight to spreadsheet handoff. Batch 3 runtime was not implemented or enabled.

## What is now in the product

- A lightweight public NusaCanvas homepage with goal-led entry points, templates, examples, guides, privacy/data trust points, and honest upcoming Batch 3 goals.
- A desktop workspace with one compact workflow rail, a dominant map, a collapsible data/issues drawer, a contextual inspector, and one primary action for the active step.
- A phone workspace that keeps the map reachable and uses predictable collapsed, medium, and expanded sheets.
- Guided spreadsheet mapping from local input through deterministic matching, design, export, project save/open, and safe recovery.
- Local-only handling: no account, runtime AI, analytics, data upload, external map tile, or user-value telemetry.
- A versioned local BoundaryProvider with stable region compatibility and a shared boundary mesh that avoids doubled internal strokes.

## Final local evidence

| Area | Result | Evidence |
| --- | --- | --- |
| Data, sources, licenses, reproducibility, geometry, and stable IDs | Passed | `artifacts/batch-1/data-test-report.json`, `license-gate-report.json`, `reproducibility-report.json` |
| Unit and migration contracts | Passed: 70 tests | Final local non-browser gate |
| Browser workflow, import/XLSX safety, export, project persistence, trust, public shell, and guidance | Passed: 34 Chromium desktop tests | Final Playwright regression run |
| Final owner-journey automation | Passed: desktop manual/spreadsheet/recovery and mobile core path | `artifacts/batch-2r/final-journey-evidence.json` |
| Boundary rendering and exports | Passed: 8 tests; 8 browser-scoped duplicate scenarios intentionally skipped | `artifacts/batch-2r/boundary-rendering-benchmark.json` |
| Accessibility automation | No serious or critical axe findings; keyboard/status/reflow/overflow smoke checks passed | `artifacts/batch-1/a11y-axe-results.json` |
| Security/privacy | Passed | `artifacts/batch-1/security-audit-report.json` |
| Active NusaCanvas brand and terminology | Passed | `artifacts/batch-2r/{brand-migration-audit,terminology-audit}.json` |

`npm ci` could not be executed in this Codex runtime because its supplied Node 24 binary has no npm executable. This is an environment limitation, not a hidden test pass: all available lockfile-resolved dependencies were used for every local gate, and a normal clean install remains part of the operator's post-authentication deployment runbook.

## Accessibility statement

Automated axe checks ran against the workspace and trust/support pages with no serious or critical violations. Automated checks, keyboard completion, visible-focus assertions, error recovery, live-status assertions, mobile reflow, target-size smoke checks, and no-horizontal-overflow checks are strong regression evidence; they do **not** establish full WCAG 2.2 conformance. The owner protocol includes human checks for focus visibility, clarity, and mobile interaction.

## Performance and boundaries

- Public homepage shell: 6,305 gzip bytes across its HTML, CSS, and small public script; it does not load map geometry or XLSX runtime.
- Workspace initial payload: 626,742 gzip bytes, below the 1,000,000 preferred and 1,100,000 hard budgets.
- Simplified geometry: unchanged at 518,479 gzip bytes and 519 features. Detailed geometry makes zero startup requests.
- Workspace shell JavaScript: 106,470 gzip bytes, below the 150,000 hard and preferred budget.
- The historical pre-Batch 2R initial baseline was 588,639 gzip bytes. The 38,103-byte increase is documented and justified by the brand migration, boundary provider, and workspace orchestration modules; it is not claimed as a performance improvement.
- The boundary mesh renders 36,690 unique exact-coordinate segments once and avoids 2,614 duplicate internal stroke passes. National, Java/Jakarta, Bali, Nusa Tenggara, Sulawesi, Maluku, Papua, small-island, high-DPI, SVG, PNG, and PDF evidence exists.

See `artifacts/batch-2r/final-performance.json` and `artifacts/batch-2r/final-visual-review.json` for the complete record.

## Platform status is separate

The local application is ready for review. Remote GitHub rename and new Cloudflare Worker deployment remain externally blocked because GitHub CLI authentication is invalid and Wrangler is not authenticated. The target workers.dev staging endpoint has therefore not been deployed or live-verified. No custom domain, DNS, route, indexing, analytics, or previous Worker deletion was performed.

Use `docs/batch-2r/10-platform-rename.md` after credentials are restored. This external blocker does not hide a product, data, security, or regression failure, but it prevents a claim that the target staging endpoint is live.

## What must happen before Batch 3 resumes

1. Run the practical review in `docs/batch-2r/11-owner-validation-protocol.md` on desktop and phone.
2. Record explicit production-UI approval or actionable defects.
3. If approved with no P0/P1, complete `docs/batch-2r/11-batch-3-resumption-checklist.md` before starting Batch 3 Prompt 2.
4. Keep remote platform migration and custom-domain activation as separate, authenticated operations; neither is implied by owner UI approval.

Historical Batch 1/2 records remain historical. This document and the Batch 2R artifacts describe only the current closure state.
