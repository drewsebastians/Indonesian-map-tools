const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname, "..");
const limits = {
  publicCssGzipBytes: 18000,
  publicJavaScriptGzipBytes: 4000,
  homepageHtmlGzipBytes: 6000
};
const gzip = (file) => zlib.gzipSync(fs.readFileSync(path.join(root, file)), { level: 9 }).length;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const results = {
  schemaVersion: "batch2r.public-shell.v1",
  generatedAt: new Date().toISOString(),
  limits,
  measured: {
    publicCssGzipBytes: gzip("assets/css/content.css") + gzip("assets/css/design-system.css"),
    publicJavaScriptGzipBytes: gzip("assets/js/public-shell.js"),
    homepageHtmlGzipBytes: gzip("index.html")
  },
  checks: []
};

function check(name, passed, detail) {
  results.checks.push({ name, passed, detail });
  if (!passed) process.exitCode = 1;
}

check("no-map-or-spreadsheet-runtime-in-homepage-html", !/leaflet|xlsx|read-excel|geojson|assets\/js\/(?:app|map|export|csv-import)/i.test(html), "Homepage source contains no map, geometry, or spreadsheet runtime reference.");
check("single-filled-primary-action", (html.match(/class="button"/g) || []).length === 1, "Homepage has one filled primary button; secondary CTAs are explicitly styled.");
Object.entries(limits).forEach(([name, limit]) => check(name, results.measured[name] <= limit, `${results.measured[name]} <= ${limit}`));
fs.mkdirSync(path.join(root, "artifacts", "batch-2r"), { recursive: true });
fs.writeFileSync(path.join(root, "artifacts", "batch-2r", "public-shell-verification.json"), `${JSON.stringify(results, null, 2)}\n`);
if (process.exitCode) console.error("Batch 2R public shell verification failed.");
else console.log("Batch 2R public shell verification passed.");
