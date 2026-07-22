# Batch 3 Queue Item 4 test report

Starting SHA: `e24c0e9e5c1682fd1fff0e10083ba6ed9d1b665f`. Environment: Windows, Node `v24.10.0`, npm `11.6.1`. Per-command durations/output: `artifacts/batch-3/verification-*.json`.

| Gate | Result |
| --- | --- |
| Clean install/build, illustrations, public performance, data, unit, trust, a11y, performance, content, security | PASS except smoke matrix |
| Smoke | **FAIL**: 75 passed; Chromium-mobile smallest-PNG-export failed. Isolated retry passed, so this is retained as a flake condition. |
| Batch 1 verifier | PASS in 211.6s, including 12 accessibility checks. |
| Batch 2R public shell, workspace, closure, structural verifiers | PASS; closure has 3 configured skips and 3 passes. |
| Batch 2R guidance | **FAIL, reproducible**: spreadsheet goal does not render `#workspaceFirstUse`. |
| Batch 2R boundary rendering | **FAIL**: 3 failed, 5 passed, 8 skipped; representative captures and high-DPI/mobile export controls fail. |
| Terminology, brand migration, repository check | PASS. |
| Production verifier | PASS: routes/assets, headers, indexing, canonicals, 404. |

Data tests passed: 519 features/canonical regions, 38 provinces, 519 crosswalk entries. Boundary structural verifier passed: 36,690 unique segments and 2,614 duplicate passes avoided. Public performance remains 7 requests, 1,430-byte gzip shell, 146,640-byte gzip hero; fresh workspace capture measured 15 requests and 1,052,746 gzip bytes.

Security/privacy audit passed (8 checks); production verification confirms CSP/nosniff, canonical/index policy, and no verifier defect. Final classification: **FAIL**. No remediation was made in verification.
