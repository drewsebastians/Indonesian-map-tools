const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname, "..");
const limits = {
  publicCssGzipBytes: 18000,
  publicJavaScriptGzipBytes: 5000,
  homepageHtmlGzipBytes: 9000,
  initialHeroImageGzipBytes: 180000
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
    homepageHtmlGzipBytes: gzip("index.html"),
    initialHeroImageGzipBytes: gzip("assets/images/public/hero-highlight-regions.svg")
  },
  checks: []
};

function check(name, passed, detail) {
  results.checks.push({ name, passed, detail });
  if (!passed) process.exitCode = 1;
}

check("no-map-or-spreadsheet-runtime-in-homepage-html", !/leaflet|xlsx|read-excel|geojson|assets\/js\/(?:app|map|export|csv-import)/i.test(html), "Homepage source contains no map, geometry, or spreadsheet runtime reference.");
check("four-carousel-slides", (html.match(/data-carousel-slide/g) || []).length === 4, "Homepage has four accessible carousel slides.");
check("lazy-inactive-illustrations", (html.match(/data-src=/g) || []).length === 3, "Only the first hero illustration is referenced eagerly.");
check("dots-without-arrows-or-counter", (html.match(/data-carousel-dot/g) || []).length === 4 && !/previous slide|next slide|1 of 4<\/|slide counter/i.test(html), "Carousel exposes dots without visible arrows or a slide counter.");
Object.entries(limits).forEach(([name, limit]) => check(name, results.measured[name] <= limit, `${results.measured[name]} <= ${limit}`));
fs.mkdirSync(path.join(root, "artifacts", "batch-2r"), { recursive: true });
fs.writeFileSync(path.join(root, "artifacts", "batch-2r", "public-shell-verification.json"), `${JSON.stringify(results, null, 2)}\n`);
if (process.exitCode) console.error("Batch 2R public shell verification failed.");
else console.log("Batch 2R public shell verification passed.");
