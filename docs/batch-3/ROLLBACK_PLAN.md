# Batch 3 rollback plan

Batch 3 began from `main@95c66f4efa0e496fc720bfcdbdd21dc3f7120b52` on `codex/batch-3-production-reconciliation`. Queue commits are `ba1a936`, `0c9ab8f`, `e24c0e9`, `ce7b95b` (Queue 4), and `c3f57bc` (Queue 4R).

No runtime, project data, database, server migration, or deployment changed. To abandon the local unmerged documentation branch, switch to `main` or start a new branch at the documented baseline; do not force-push shared history. If documentation commits are merged, use normal `git revert` commits.

The production rollback reference is `docs/public-site-refresh/RELEASE_REPORT.md`. Any authorized future production rollback needs fresh production, security, performance, and route checks. Recovery clone: `C:\dev\nusacanvas.space-recovered-20260722-135156`; backup: `C:\dev\nusacanvas-recovery-backup\20260722-135156`.

## Queue Item 4R

Queue 4 (`ce7b95b`) and Queue 4R (`c3f57bc`) are committed on the local branch. After merge, reverse the focused remediation with a normal `git revert <queue-4r-commit>` and verify guidance, workspace, smoke, accessibility, and production. Do not force-push. Before merge, abandon it by leaving the branch unmerged; the external checkpoints contain the exact pre-completion diffs and hashes. Reversal affects only static guidance, test setup, and Batch 3 documentation/evidence—no project data, database, server migration, or deployed resource.

Queue Item 5 is documentation-only. If its closure commit must be reversed, use `git revert <queue-5-commit>` and rerun the documentation/queue-state checks. Post-merge production rollback remains separately authorized work; use the deployed SHA and normal provider rollback procedure, never a forced history rewrite.
