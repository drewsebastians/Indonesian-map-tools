# Production source of truth

Canonical production origin: `https://nusacanvas.space/`.

The approved Batch 3 baseline is current `main` at `95c66f4efa0e496fc720bfcdbdd21dc3f7120b52` and its clean deterministic `dist` build, which is production-equivalent. This records a verified historical baseline, not an eternal authority: future commits become authoritative only after merge, clean build, and production verification. Never infer deployment from dates, branch names, or screenshots alone.

Route inputs are public `index.html` files and `workspace/index.html`; `scripts/build.js` owns the strict build allowlist, generated illustrations, canonicals, normalized public navigation, public-shell assets, and workspace bundles. `wrangler.jsonc` deploys `dist`; `_headers` owns security/cache policy. Use `npm run verify:production`, clean-build route/hash manifests, and live headers/DOM as evidence.

Compare bytes first. Only `assets/js/export.js` and generated `project-storage.js` may use UTF-8 CRLF-to-LF normalized hashes after raw mismatch; Batch 3 proved those two content-equivalent. Do not alter line-ending policy. A new source/build/production mismatch requires evidence collection and reviewed smallest-scope remediation; never copy edge/minified output into source. Deployment requires authorization, successful checks, target-commit evidence, live verification, and rollback evidence.
