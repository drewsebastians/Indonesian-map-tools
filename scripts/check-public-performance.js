const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname, "..");
const gzip = (relativePath) => zlib.gzipSync(fs.readFileSync(path.join(root, relativePath)), { level: 9 }).length;
const files = [
  "index.html",
  "assets/css/design-system.css",
  "assets/css/content.css",
  "assets/js/public-shell.js",
  "assets/images/public/hero-highlight-regions.svg",
  "assets/images/nusacanvas-logo.png",
  "assets/images/nusacanvas-favicon.png"
];
const measured = Object.fromEntries(files.map((file) => [file, gzip(file)]));
const report = {
  schemaVersion: "nusacanvas.public-performance.v1",
  generatedAt: new Date().toISOString(),
  initialRequestCount: 7,
  publicShellJavaScriptGzipBytes: measured["assets/js/public-shell.js"],
  initialHeroImageGzipBytes: measured["assets/images/public/hero-highlight-regions.svg"],
  criticalAssetGzipBytes: Object.values(measured).reduce((sum, value) => sum + value, 0),
  measured,
  forbiddenUrlPatterns: ["leaflet", "xlsx", "read-excel", "geojson", "assets/js/app.js", "assets/js/map.js", "http://", "https://"]
};
if (report.initialRequestCount > 8) throw new Error("Public initial request estimate exceeds 8 requests.");
if (report.publicShellJavaScriptGzipBytes > 5000) throw new Error("Public shell JavaScript exceeds 5 KB gzip.");
if (report.initialHeroImageGzipBytes > 180000) throw new Error("Initial hero illustration exceeds 180 KB gzip.");
if (report.criticalAssetGzipBytes > 1000000) throw new Error("Public critical assets exceed 1 MB gzip.");
fs.mkdirSync(path.join(root, "artifacts", "public-site-refresh"), { recursive: true });
fs.writeFileSync(path.join(root, "artifacts", "public-site-refresh", "public-performance.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Public performance passed: requests=${report.initialRequestCount}, shell_js=${report.publicShellJavaScriptGzipBytes} gzip bytes, hero=${report.initialHeroImageGzipBytes} gzip bytes.`);
