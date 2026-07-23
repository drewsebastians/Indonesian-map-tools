# Batch 3 Queue Item 1: production reconciliation preflight

## Scope and baseline

- Timestamp: `2026-07-22T15:51:15.2893661+07:00`
- Recovery repository: `C:\dev\nusacanvas.space-recovered-20260722-135156`
- Branch: `codex/batch-3-production-reconciliation`
- Starting SHA and rollback base: `95c66f4efa0e496fc720bfcdbdd21dc3f7120b52`
- Node/npm: `v24.10.0` / `11.6.1`
- Repository state before branch creation: clean `main`, equal to `origin/main`; no staged or untracked files.

This item is inventory and preflight only. No runtime, public UI, workspace, map, project-schema, boundary, data, dependency, or deployment change was made.

## Source, build, and deployment ownership

- Source public routes are root and route `index.html` files; the workspace source is `workspace/index.html`.
- `scripts/build.js` removes and recreates `dist`, builds detailed province chunks, generates the six public SVG illustrations, copies the allowlisted source assets, injects canonical/brand assets, normalizes every public header/navigation, and bundles selected workspace modules into `project-storage.js` and `app.js` in `dist`.
- `wrangler.jsonc` deploys only `./dist` to the `nusacanvas.space` and `www.nusacanvas.space` custom-domain routes with automatic trailing-slash handling.
- `.github/workflows/deploy-cloudflare.yml` is manual (`workflow_dispatch`), runs Node 24/npm CI and Batch 1 verification, builds `dist`, deploys through Cloudflare Wrangler, then runs the production verifier. This queue item did not invoke it.
- `_headers` supplies CSP, `no-transform`, cache, nosniff, referrer, and permissions policies. `robots.txt` allows crawling and points to the sitemap; `workspace/` declares `noindex,follow`.

## Route and runtime inventory

The machine-readable route inventory is [`manifests/repository-route-inventory.json`](manifests/repository-route-inventory.json). It records public source routes, destinations, title/canonical/lang metadata, styles, scripts, workspace query contracts, and the observed production root/workspace samples.

Observed live production at `https://nusacanvas.space/` served the public shell with `design-system.css`, `content.css`, and `public-shell.js`; it did not load workspace runtime. Observed `https://nusacanvas.space/workspace/` was `noindex,follow` and served the Leaflet/map/import/project runtime. These observations are evidence only; they do not establish the authoritative reconciliation baseline.

## Current evidence and GitHub history

- Recent `main` history includes `95c66f4 fix: polish trust banner and carousel`, `a750f5e fix: refine public landing carousel`, the public refresh release record, analytics-injection hotfix `909194d`, carousel hotfix `87d2d22`, and public-site refresh `4b40505`.
- The current release report identifies `909194db7066cde7ea3d92e547948a67132cefc7` as the final merge/deployed commit on 2026-07-21, with `4b4050541b48a45a02909ef551e481267c583bea` as the earlier redesign rollback reference.
- Recent merged GitHub PRs are #3 (public-site refresh), #4 (carousel counters), and #5 (edge analytics injection). They are relevant deployment/reconciliation evidence, not proof that a current edge response exactly equals clean main.
- Historic Batch 2R closure documents include older owner-gate language, while the later public-refresh release report states no manual approval remains outstanding. Queue Item 2 must reconcile this documentation timeline rather than selecting an authority by assumption.

## Safe build and targeted checks

All required Queue Item 1 preflight checks passed:

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 100 packages installed from the existing lockfile; no package-file edit |
| `npm run build` | PASS; six deterministic illustrations and 70 allowlisted build files |
| `npm run verify:public-illustrations` | PASS |
| `npm run verify:public-performance` | PASS; 7 requests, 1430-byte gzip public shell, 146640-byte gzip first hero |
| `npm run test:unit` | PASS; 81 tests |
| `npm run test:content` | PASS; 22 trust pages |
| `npm run test:security` | PASS; 8 checks |

The build updated six generated SVG worktree entries under the known Windows line-ending behavior and refreshed `artifacts/public-site-refresh/public-performance.json` with a current timestamp and environment-specific byte measurements. The SVG content diff was empty; the report artifact is generated evidence, not source. Both were recorded and restored before documentation was created. No generated output is included in this commit.

## Protected areas and initial allowlist

- [`manifests/protected-ui-files.json`](manifests/protected-ui-files.json) protects public and workspace presentation, navigation, content assets, headers, robots, and sitemap.
- [`manifests/protected-map-files.json`](manifests/protected-map-files.json) protects map runtime, canonical IDs, compatibility, boundaries, geometry, label anchors, and regression fixtures/tests.
- [`manifests/changed-file-allowlist.json`](manifests/changed-file-allowlist.json) permits only `docs/batch-3/**` for Queue Item 1.

## Preliminary risks and unanswered forensic questions

1. Production may not equal the latest clean `main`, a clean local build, or the release report's deployed commit.
2. `scripts/build.js` owns navigation rewriting, canonical insertion, workspace bundling, and generated assets; a later deploy can therefore change output without an obvious single-route source edit.
3. Cloudflare cache/edge behavior, deployed artifact provenance, and potentially stale deployment evidence can alter the response observed at the production domain.
4. Multiple sources own a public route's final HTML: route source, build-time navigation/canonical transforms, generated illustrations, headers, and Cloudflare static-assets behavior.
5. Public runtime and workspace runtime are intentionally separate. Any reconciliation must preserve the public no-map payload and workspace map/data compatibility.
6. Historic Batch 2R and newer public-refresh release records use different approval language. Queue Item 2 must establish chronology, deploy provenance, and current owner-approved UI evidence before declaring an authoritative baseline.
7. Production analytics injection must remain disabled; PR #5 and `_headers` are relevant controls that Queue Item 2 must verify against the live response.

## Queue Item 2 handoff

Queue Item 2 must remain on `codex/batch-3-production-reconciliation`, begin from the Queue Item 1 commit, and perform forensic comparison only: source/main, clean dist, live production headers/HTML/assets, commit/deployment evidence, cache behavior, and approval-record chronology. It must not implement reconciliation, deploy, restore Batch 4 files, alter protected map/schema assets, or mark the authoritative baseline resolved without recorded evidence.

No deployment occurred. Remote `main` was not modified.
