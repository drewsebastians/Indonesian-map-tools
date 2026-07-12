# Cloudflare Credential Blocker

Missing secret names:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Exact verification commands:

```text
npm ci
npm run check
npm run build
npm run deploy
npm run verify:staging
PLAYWRIGHT_BASE_URL=https://mapnesia.andrew-sebastian91.workers.dev npm run test:e2e:smoke
```

PowerShell smoke-test command:

```text
$env:PLAYWRIGHT_BASE_URL = "https://mapnesia.andrew-sebastian91.workers.dev"
npm run test:e2e:smoke
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

