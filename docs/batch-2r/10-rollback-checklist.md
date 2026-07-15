# Batch 2R Prompt 10: staging rollback checklist

Date: 2026-07-15
Status: prepared; use only after a failed new-Worker deployment or verification.

## Preserved baseline

- Previous Worker: `mapnesia`.
- Previous staging origin: `https://mapnesia.andrew-sebastian91.workers.dev`.
- Previous staging verifier: passed before Prompt 10 local preparation.
- Deployment revision exposed by the previous endpoint: unknown. Do not infer it from the local Git history.
- Previous local Worker configuration snapshot: Git blob `a3ecf28182aef91cafe1cbae318f5fe8d646e147` (`HEAD:wrangler.jsonc` before the Prompt 10 edit); it used `workers_dev: true`, `preview_urls: true`, `assets.directory: ./dist`, and no custom-domain route.

## If the new Worker fails

1. Stop. Do not delete or disable the previous Worker.
2. Record the failing command, timestamp, new Worker URL, failing route, response status, and a redacted error message in the platform migration artifact.
3. Re-run the local build and the staging verifier once only after correcting the identified issue. Do not compensate by enabling GitHub Pages or attaching the production domain.
4. If the new Worker was deployed but is unsafe, roll it back in the Cloudflare dashboard to its most recent known-good deployment, or disable its traffic only if that action is reversible and authorized.
5. If the live service must be restored, use the previous Worker only after confirming its endpoint still has noindex headers and its known staging behavior. Never change DNS or custom-domain routing for this rollback.
6. Re-run the verifier against the restored endpoint and retain the evidence.
7. Keep the previous Worker until the new Worker has a complete successful verification record and the owner explicitly authorizes removal or disablement.

## GitHub rollback boundary

GitHub repository rename redirects are not a rollback plan. If the repository rename itself needs to be reversed, an owner with repository-admin permission must decide that separately after checking existing clone URLs, workflow runs, releases, and links. Do not force-push or recreate the old repository name automatically.
