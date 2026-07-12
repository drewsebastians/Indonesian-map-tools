# Cloudflare Live Verification Blocker

The target URL currently responds, but it does not yet satisfy the required staging headers.

Checked on 2026-07-12:

```text
curl.exe -I --max-time 20 https://mapnesia.andrew-sebastian91.workers.dev/
```

Observed:

```text
HTTP/1.1 200 OK
X-Robots-Tag: missing
```

Unknown path check:

```text
curl.exe -I --max-time 20 https://mapnesia.andrew-sebastian91.workers.dev/__missing-codex-check
```

Observed:

```text
HTTP/1.1 404 Not Found
```

Wrangler authentication check:

```text
wrangler whoami
```

Observed:

```text
You are not authenticated. Please run `wrangler login`.
```

