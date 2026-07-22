# Codex batch rules

- Use one `codex/` branch per batch and preserve queue-state continuity.
- Establish authority from source, clean build, live verification, and deployment evidence; keep a narrow allowlist and no manufactured diff.
- Record real pass/fail/skip results; never weaken tests or call skips passes.
- Be truthful about screenshots versus DOM evidence.
- Preserve privacy/security: no analytics, upload, backend/auth, external map runtime, dependency update, or weakened headers without approval.
- Restore generated/test/line-ending noise; do not normalize line endings without a functional defect.
- Do not alter migration, map/schema/data, or deployment configuration outside focused review. Record rollback; require independent review before the next batch. No deployment or Batch 4 while Batch 3 is failed/blocked.
