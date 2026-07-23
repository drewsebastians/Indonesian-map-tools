# Batch 3 Queue Item 4R remediation diagnosis

**Timestamp:** 2026-07-23 (Asia/Jakarta)
**Starting commit:** `ce7b95bfca704b4a423a9052a6a6d423d637904f`
**Scope:** focused remediation of the Queue Item 4 verification failures. No deployment, merge, or source/build/production reconciliation change is authorized.

## Clean reproduction

`npm ci` completed successfully (including its deterministic six-illustration build), followed by `npm run build` successfully building 70 allowlisted `dist` files. Playwright's configured failure capture (`trace: retain-on-failure`, `screenshot: only-on-failure`) was used. An attempted `--screenshot=on` CLI flag was rejected by the installed Playwright version; this was an invocation error, not product evidence. A timed-out combined diagnostic left a local test server on port 4173; it was removed before standalone runs.

## Findings and classifications

### First-use spreadsheet guidance — missing approved product contract

`npm run test:batch2r:guidance` reproduced the first test failure in Chromium desktop: after selecting the spreadsheet goal, `#workspaceFirstUse` was absent for Playwright's full 30-second expectation timeout. The other three guidance journeys passed. Failure evidence is retained locally in Playwright's generated `test-results` directory and is not a committed artifact.

This is a product defect, not a stale test. `docs/batch-2r/07-content-and-state-patterns.md` requires a short inline first-use block beside the input that explains the required region/value data, names CSV, TSV, and XLSX, says the spreadsheet stays on the device, links to the relevant guide, and provides keyboard guidance. That document explicitly assigns this contract to `npm run test:batch2r:guidance`. Current equivalent copy is incomplete and split across generic notices; it does not supply the required accessible first-use block or guide/keyboard help.

The smallest compliant repair is one static semantic `aside` in `workspace/index.html`, inside the spreadsheet input panel. Existing workflow filtering makes that panel visible only for the spreadsheet input stage, so it neither appears in the manual workflow nor covers the map. No new script, request, modal, state, or storage behavior is needed.

### Representative boundary capture — deterministic test-helper defect

The captured trace and error context identify a strict-mode error, not a map rendering problem. After manual goal selection, `#appShell` has `data-workspace-goal="manual"`. The helper's broad selector, `[data-workspace-goal='manual']`, then resolves both the shell and the goal-choice button on its next fixture selection, so `locator.isVisible()` fails before it can select a region.

This is a deterministic test-harness defect. The intended control is the goal button; narrowing the selector to `button[data-workspace-goal='manual']` preserves the valid user interaction. The existing map readiness attribute remains the appropriate observable wait for fixture capture; no `map.js`, geometry, boundary, or timing change is warranted.

### High-DPI export controls — invalid test precondition

The current approved workflow test already proves that `#exportSection` becomes visible only after `#applyColorBtn` adds a manual highlight. The failing high-DPI test selected `Kota Denpasar` but did not apply a color before trying to inspect `#exportSvgBtn`. A selection alone is intentionally not export-ready.

This is an incorrect test setup. The repair must apply a highlight through the existing user control, wait for `#exportSection` to become visible, and then retain the meaningful touch-target bounding-box assertion. It must not expose export controls earlier and must not alter map or export code.

### Chromium-mobile smallest PNG export — unresolved pending stability exercise

The exact isolated case (`load, color, save, SVG export, and smallest PNG export`, Chromium mobile) passed in a fresh browser context in 10.4 seconds (25.9 seconds wall-clock including test-server lifecycle), with no captured console, page, or network error. Queue Item 4 recorded one failure and a passing isolated retry. The required 10 isolated and 5 sequence executions have not yet completed, so this remains unclassified and no source or test change is authorized for it.

Final stability completed without changing the test or product: 10/10 isolated executions and five seven-test smoke-context sequences passed. Target durations were 7.7–12.4 seconds; there were no retries, removed assertions, increased blanket timeouts, disabled downloads, unexpected skips, or recorded console/page/network/filesystem errors. Final classification: **isolated prior environmental flake**.

## Rejected changes

- No map, boundary, registry, data, project-schema, dependency, deployment, or public-site change has evidence support.
- No arbitrary sleep, blanket retry, line-ending normalization, or export-control behavior change is justified.
- No `workspace-shell.js` change is needed because static semantic markup is the current ownership boundary.

## Approved focused remediation

1. Restore the approved static first-use guidance contract in `workspace/index.html`.
2. Correct only the boundary evidence test's goal-button selector and valid export-ready precondition.
3. Update the Batch 3 allowlist, reports, locks, manifests, and evidence with measured results.

The final full 76-test smoke inventory, decomposed aggregate contracts, production verifier, performance, security/privacy, project/map preservation, and fresh local pixel evidence all passed. No broader change was approved or made.
