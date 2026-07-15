# Manual Upload Steps

This file is retained only as a deployment-history note.

GitHub Pages is no longer an approved deployment path for this repository. Do not upload files through the GitHub web UI and do not enable Pages.

The Batch 2R staging target is Cloudflare Workers Static Assets:

```text
https://nusacanvas-space.andrew-sebastian91.workers.dev
```

Use the Cloudflare workflow documented in `docs/deployment-guide.md`:

```text
npm run verify:batch1
npm run deploy
npm run verify:staging
```

The target needs an authenticated Cloudflare deployment before it is live. If GitHub Pages is ever found enabled again, disable it before treating the Cloudflare migration as complete.
