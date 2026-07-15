# Batch 2R Prompt 10: platform rename record

Date: 2026-07-15
Status: local preparation complete; remote operations blocked by missing valid authentication.

## Scope and safety boundary

The active product identity is NusaCanvas. The intended remote identities are:

- GitHub: `drewsebastians/nusacanvas.space`
- Cloudflare Worker: `nusacanvas-space`
- workers.dev staging: `https://nusacanvas-space.andrew-sebastian91.workers.dev`

`https://nusacanvas.space` is a future production domain only. This prompt does not attach it to Cloudflare, alter DNS, add a route, remove noindex, submit a sitemap, create analytics, or create redirects.

The previous GitHub repository and Cloudflare Worker names are retained below only as truthful migration and rollback evidence. They must not be used by active product links or deployment commands.

## Checks completed before remote work

- The local working tree was clean at the start of Prompt 10.
- Local `main` was at `19e75f820474513de5bfcb381dcf47180fc1b78f` before this Prompt 10 edit.
- The remote default branch reported by `git ls-remote --symref origin HEAD` was `main` at `390c9de5c672714b70d368a4c04563e93733d036`.
- `origin` still resolves to the previous repository URL. Its redirect must not be relied on after the rename.
- The previous staging endpoint `https://mapnesia.andrew-sebastian91.workers.dev` passed the staging verifier before local identity preparation. Its deployment revision is not exposed by the endpoint, so it is recorded as unknown rather than guessed.
- GitHub CLI authentication is invalid for account `drewsebastians`; it reports an invalid keyring token.
- Wrangler reports that no Cloudflare authentication is present.

## Local preparation completed

- `wrangler.jsonc` prepares Worker `nusacanvas-space` with `workers_dev: true` and no custom-domain route.
- The staging verifier, manual deployment guide, workflow summary, package command, public brand configuration, and source-schema identity point to the new names.
- The Windows Wrangler wrapper now invokes the installed local Wrangler executable reliably.
- The brand audit fails active legacy references and permits them only in historical evidence, migration code, tests, and these explicit migration records.
- The local storage and project migration identifiers remain neutral; no project schema, stable region ID, boundary version, or user data was changed.

## Remote operations not attempted

No GitHub rename, Cloudflare deployment, deletion/disablement of the previous Worker, custom-domain operation, DNS change, analytics setup, or GitHub Pages activation was attempted. Those actions would require valid credentials and, for the repository rename, repository-administration permission.

## Owner/operator runbook after authentication

Run these steps only from the repository root after reviewing the pending local commit.

1. Re-authenticate GitHub with repository administration available to the account:

   ```text
   gh auth login -h github.com -w
   gh auth status
   ```

2. Rename the repository in GitHub repository Settings → General → Repository name to `nusacanvas.space`. Confirm the owner remains `drewsebastians`; do not create a second repository under either name.

3. Update and verify the local remote. Do not force-push:

   ```text
   git remote set-url origin https://github.com/drewsebastians/nusacanvas.space.git
   git fetch origin
   git remote -v
   git branch -vv
   git push origin main
   ```

4. Authenticate Wrangler using the intended Cloudflare account, without placing any token in source control:

   ```text
   npx wrangler login
   npx wrangler whoami
   ```

5. Build, deploy, and verify the new Worker:

   ```text
   npm ci
   npm run build
   npm run deploy
   npm run verify:staging
   PLAYWRIGHT_BASE_URL=https://nusacanvas-space.andrew-sebastian91.workers.dev npm run test:e2e:smoke
   ```

6. Confirm the new endpoint serves the homepage, workspace, static/trust pages and required assets; has the expected security/cache headers; returns a 404 for an unknown route; keeps robots and `X-Robots-Tag` noindex; makes no GitHub Pages, custom-domain, analytics, external map, or external data request.

7. Only after every new-staging check passes, inspect the previous Worker in the Cloudflare dashboard. Keep its last known-good deployment available until the rollback window is formally closed. Delete or disable it only when the account permission and owner decision are explicit and the result is verifiable.

Use `docs/batch-2r/10-rollback-checklist.md` if the new Worker cannot pass verification.
