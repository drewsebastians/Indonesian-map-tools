# Batch 2R Prompt 5 — Public product shell

The root route is now the lightweight NusaCanvas product homepage. It introduces the four product goals, marks Sales territories and Coverage honestly as upcoming, provides factual privacy/data trust points, retains **Useful starting points**, and has one dominant **Create a map** action.

The existing Batch 2 workspace is preserved without engine changes at `/workspace/`. The old root workspace test paths were migrated to that route. Its document uses a root base URL so its existing local data, module, export, and trust links continue to resolve without duplicate geometry or runtime copies.

## Route and indexing policy

- Public active routes: `/`, `/workspace/`, `/guides/`, existing guides, trust/support pages, and region-data pages.
- Prototype routes remain under `/design-preview/batch-2r/`, remain noindex, and are not included in public navigation.
- The staging deployment remains noindex. No custom domain or indexing state changed in this prompt.

## Verification

Run `npm run verify:batch2r:public-shell` after a supported Node installation is available. It checks the static payload and runs desktop/mobile Playwright tests for accessibility, mobile menu behavior, focus restoration, no horizontal overflow, no map/XLSX/geometry homepage requests, visual screenshots, and workspace reachability.

This prompt does not implement Batch 3 runtime or redesign the production workspace layout; that work remains Prompt 6.
