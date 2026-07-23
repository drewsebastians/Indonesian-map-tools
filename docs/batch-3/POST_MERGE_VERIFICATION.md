# Batch 3 post-merge verification checklist

This checklist is prospective. These commands are not claimed complete until an authorized merge and deployment occur.

1. Push only `codex/batch-3-production-reconciliation` and open a review request.
2. Review the exact merge diff and authorize the merge; do not force-push.
3. On merged `main`, run `npm ci`, `npm run build`, `npm run test:unit`, `npm run test:e2e:smoke`, `npm run test:batch2r:guidance`, `npm run test:batch2r:boundary-rendering`, `npm run test:batch2r:workspace`, `npm run test:a11y`, `npm run test:security`, `npm run verify:public-performance`, and `npm run verify:production`.
4. Deploy only after separate authorization.
5. Verify `/workspace/?goal=spreadsheet` and `?sample=1`: exactly one visible `#workspaceFirstUse`, CSV/TSV/XLSX copy, local-device statement, guide link, and keyboard help.
6. Recheck production routes, canonicals, headers/CSP, noindex, 404, asset hashes, analytics injection, and public/runtime boundaries.
7. Capture authorized desktop `1440x1000` and mobile `393x851` workspace evidence, including manual export-ready and spreadsheet first-use states.
8. Recheck 7 public requests, 1,430-byte shell, 146,640-byte hero, no new workspace request, local-only privacy, 519 map features, boundary/provider/registry versions, project schema, and exports.
9. Record deployed SHA, cache/edge behavior, release/changelog evidence, and post-merge verifier output.
10. Mark Batch 3 production-verified only after all checks pass. Keep Batch 4 blocked until then.
