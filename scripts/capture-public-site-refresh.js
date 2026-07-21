const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const { spawn } = require("node:child_process");
const { chromium } = require("@playwright/test");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const output = path.join(root, "artifacts", "public-site-refresh");
const port = 4176;

function localChromium() {
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe"
  ];
  return candidates.find(fs.existsSync);
}

function diskFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const relative = clean === "/" ? "index.html" : clean.replace(/^\//, "");
  const candidate = path.join(dist, relative.endsWith("/") ? `${relative}index.html` : relative);
  return candidate.startsWith(dist) && fs.existsSync(candidate) ? candidate : null;
}

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/`)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Public screenshot server did not start.");
}

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const server = spawn(process.execPath, ["scripts/serve-dist-for-tests.js", String(port)], { cwd: root, stdio: "ignore" });
  try {
    await waitForServer();
    const browser = await chromium.launch({ executablePath: localChromium() });

    async function capture(route, filename, viewport, action) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: viewport.width < 500 });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle" });
      if (action) await action(page);
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForFunction(() => [...document.querySelectorAll("img[data-card-src], .goal-card img, .map-medallion img")]
        .every((image) => !image.hasAttribute("data-card-src") && image.complete && image.naturalWidth > 0), null, { timeout: 30000 });
      await page.screenshot({ path: path.join(output, filename), fullPage: true });
      await context.close();
    }

    const desktop = { width: 1440, height: 1000 };
    const mobile = { width: 393, height: 851 };
    await capture("/", "home-desktop-slide-1.png", desktop);
    await capture("/", "home-desktop-slide-2.png", desktop, async (page) => {
      await page.locator("[data-carousel-dot]").nth(1).click();
      await page.locator("#hero-slide-2 img").evaluate((image) => image.complete || new Promise((resolve) => image.addEventListener("load", resolve, { once: true })));
    });
    await capture("/", "home-mobile.png", mobile);
    await capture("/highlight-regions/", "highlight-desktop.png", desktop);
    await capture("/highlight-regions/", "highlight-mobile.png", mobile);
    await capture("/excel-to-map/", "spreadsheet-desktop.png", desktop);
    await capture("/excel-to-map/", "spreadsheet-mobile.png", mobile);
    await capture("/sales-territories/", "territories-desktop.png", desktop);
    await capture("/coverage-analysis/", "coverage-desktop.png", desktop);

    const network = {};
    for (const route of ["/", "/highlight-regions/", "/excel-to-map/", "/workspace/"]) {
      const context = await browser.newContext({ viewport: desktop, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const requests = [];
      page.on("request", (request) => requests.push({ url: new URL(request.url()).pathname, type: request.resourceType() }));
      await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle" });
      if (route === "/workspace/") await page.locator('#loadingIndicator[data-state="ready"]').waitFor({ timeout: 60000 });
      const unique = requests.filter((item, index) => requests.findIndex((candidate) => candidate.url === item.url && candidate.type === item.type) === index);
      const measured = unique.map((item) => {
        const file = diskFile(item.url);
        const bytes = file ? fs.readFileSync(file) : null;
        return { ...item, bytes: bytes?.length || 0, gzipBytes: bytes ? zlib.gzipSync(bytes, { level: 9 }).length : 0 };
      });
      network[route] = {
        requestCount: measured.length,
        rawBytes: measured.reduce((sum, item) => sum + item.bytes, 0),
        gzipBytes: measured.reduce((sum, item) => sum + item.gzipBytes, 0),
        requests: measured
      };
      await context.close();
    }
    fs.writeFileSync(path.join(output, "network-measurements.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), viewport: desktop, routes: network }, null, 2)}\n`);
    await browser.close();
    console.log(`Captured 9 final screenshots and network measurements in ${path.relative(root, output)}.`);
  } finally {
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
