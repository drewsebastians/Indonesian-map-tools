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

## Queue Item 4R remediation verification

The original Queue Item 4 **FAIL** remains the historical result above. Queue Item 4R resolved it.

| Gate | Queue 4R result |
| --- | --- |
| Build/illustrations | PASS: 70 files; 6 deterministic illustrations |
| Smoke | PASS: 76/76 expected IDs across four projects; no retry or skip |
| Mobile smallest PNG | PASS: 10 isolated plus 5 sequence contexts |
| Unit / trust / a11y | PASS: 81/81, 12/12, 12/12 |
| Data / content / security | PASS: 519 features; 22 pages; 8 checks |
| Public shell / workspace / guidance | PASS: 8/8, 5/5, final 4/4 and stability 20/20 |
| Boundary rendering | PASS three times: 8 passed + 8 configured skips per run |
| Closure | PASS: 3 passed + 3 configured skips |
| Production | PASS: assets, headers, indexing, canonicals, 404 |

`verify:batch1` and `check` were decomposed because their exact wrappers exceeded the 120-second foreground limit. Inspection proved they contain only listed child commands; every child passed. No unexpected skip occurred. Full machine-readable evidence: `artifacts/batch-3/verification-aggregate.json`.

## Queue Item 5 final classification

The FAIL above is the preserved historical Queue 4 result. Queue 4R resolved the recorded guidance, boundary-test, and isolated mobile-evidence conditions; its complete constituent matrix and critical reruns pass. Queue Item 5 independently reviewed the committed source, changed lines, manifests, production relationship, rollback, and evidence. Final Batch 3 verification classification: **PASS**, merge-ready for owner review. Production verification remains false until an authorized post-merge deployment check.
