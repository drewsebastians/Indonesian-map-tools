# Changelog

## Unreleased

- Added a minimal Node 24 toolchain for deterministic build, local development, tests, measurements, and CI.
- Added an allowlisted static build into `dist/`.
- Added baseline size/checksum/network documentation and machine-readable artifacts.
- Added unit coverage for project JSON sanitization and rejection paths.
- Added Playwright smoke and axe accessibility checks.
- Added a least-privilege GitHub Actions CI workflow for non-deployment quality gates.
- Added Cloudflare Workers Static Assets staging configuration, noindex headers, robots.txt, and deployment workflow.
- Removed automatic detailed-geometry startup loading and external boundary fallback.
- Added explicit opt-in high-detail export, tiered runtime labels, PNG memory fallback, and automated performance budgets.
