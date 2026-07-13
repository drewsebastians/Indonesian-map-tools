# Batch 3 Prompt 1 — Resolved blocker history

Date: 2026-07-13  
Verified branch: `main`  
Initial diagnostic commit: `323cdc1d6b5939f57a95ca928417b1e8ee6cb481`  
Status: **RESOLVED — historical diagnostic**

This file records the two blockers found during the first preflight attempt. They were resolved before the Batch 3 contract commit. The active preflight is `docs/batch-3/00-preflight-and-contract.md` and reports no open release blocker.

## Historical blockers

### B3-PREFLIGHT-001 — mobile professional export hit-testing

The Pixel 5 smoke test could see `#exportMappingBtn` but sibling panel controls intercepted pointer events. This was a code/test-environment blocker, not a waived test failure.

### B3-PREFLIGHT-002 — two-column first-user evidence

The existing evidence was synthetic three-column. A name-only two-column fixture correctly remained ambiguous, so evidence needed a deterministic official-code two-column path without weakening ambiguity rules.

## Resolution recorded 2026-07-13

1. The mobile hit-testing issue was fixed by using a stable responsive touch viewport in the Playwright mobile project and by isolating the export section stacking context. The professional export scenario now passes with a real pointer interaction.
2. A deterministic two-column first-user flow using official region codes (`35.78` and `51.71`) was added. It records artifacts for Chromium desktop/mobile, Firefox, and WebKit, while preserving explicit ambiguity handling for name-only input.
3. The full gate completed with 56/56 smoke, 12/12 trust, 8/8 accessibility, performance, static content, security, data, geometry, and 31/31 unit/migration checks passing.
4. Live staging verification passed for assets, headers, robots.txt, and 404 behavior.

The only remaining human action is the existing first-user manual protocol before any production/domain rollout; it is not a Batch 3 implementation blocker.

The active decision is recorded in `docs/batch-3/00-preflight-and-contract.md` and `artifacts/batch-3/preflight.json`.
