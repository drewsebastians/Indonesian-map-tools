# Development and Testing

This repository is a static browser application. Batch 1 adds a reproducible local toolchain without changing the user-facing map workflow.

## Requirements

- Node.js 24.x
- npm
- Python 3.12 or newer

Install dependencies from a clean checkout:

```text
npm ci
```

## Commands

```text
npm run dev
```

Builds `dist/` and serves it through `wrangler dev`, matching the Cloudflare Workers Static Assets staging shape.

```text
npm run dev:static
```

Serves the repository root at `http://127.0.0.1:8000/` for simple static debugging.

```text
npm run build
```

Copies the allowlisted production files into `dist/`.

```text
npm run test:data
```

Runs the existing Python data validation.

```text
npm run test:unit
```

Runs Node unit tests for project parsing and sanitization.

```text
npm run test:e2e:smoke
```

Builds `dist/`, serves it locally, and verifies the current load, color, save, SVG export, and smallest PNG export workflow in Chromium.

```text
npm run test:a11y
```

Runs an axe scan and fails on serious or critical violations. Full findings are written under `artifacts/batch-1/`.

```text
npm run measure
```

Writes reproducible size, checksum, geometry, schema, and network-baseline artifacts under `artifacts/batch-1/` and refreshes `docs/batch-1/01-baseline-audit.md`.

```text
npm run check
```

Runs the non-deployment local gate: build, data tests, unit tests, smoke tests, accessibility test, and measurements.

## Notes

- The application remains static and client-side.
- Do not add runtime AI, account systems, analytics, trackers, or unreviewed datasets.
- Cloudflare Workers is the staging deployment path for Batch 1.
