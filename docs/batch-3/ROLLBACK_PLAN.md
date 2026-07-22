# Batch 3 rollback plan

Batch 3 began from `main@95c66f4efa0e496fc720bfcdbdd21dc3f7120b52` on `codex/batch-3-production-reconciliation`. Queue commits are `ba1a936`, `0c9ab8f`, and `e24c0e9`; Queue 4 remains uncommitted while failures are recorded.

No runtime, project data, database, server migration, or deployment changed. To abandon the local unmerged documentation branch, switch to `main` or start a new branch at the documented baseline; do not force-push shared history. If documentation commits are merged, use normal `git revert` commits.

The production rollback reference is `docs/public-site-refresh/RELEASE_REPORT.md`. Any authorized future production rollback needs fresh production, security, performance, and route checks. Recovery clone: `C:\dev\nusacanvas.space-recovered-20260722-135156`; backup: `C:\dev\nusacanvas-recovery-backup\20260722-135156`.
