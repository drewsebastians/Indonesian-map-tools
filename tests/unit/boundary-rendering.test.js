const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const boundaryProvider = require(path.resolve(__dirname, "..", "..", "assets", "js", "boundary-provider.js"));

function loadExport() {
  const window = {
    ProductBrand: {
      productName: "NusaCanvas",
      defaults: { exportFilenamePrefix: "nusacanvas-map", projectTitle: "NusaCanvas map" }
    },
    NusaCanvasBoundaryProvider: boundaryProvider
  };
  const sandbox = { window, Map, Set, Number, String, Object, Array, Math, JSON, TextEncoder, Blob, URL, Image: class {}, navigator: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.resolve(__dirname, "../../assets/js/export.js"), "utf8"), sandbox);
  return window.MapExport;
}

function feature(id, coordinates) {
  return {
    type: "Feature",
    properties: { region_id: id, display_name: id },
    geometry: { type: "Polygon", coordinates: [coordinates] }
  };
}

test("SVG draws exact shared boundaries once while leaving stable feature IDs untouched", () => {
  const mapExport = loadExport();
  const features = [
    feature("west", [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]),
    feature("east", [[1, 0], [2, 0], [2, 1], [1, 1], [1, 0]])
  ];
  const before = JSON.parse(JSON.stringify(features));
  const svg = mapExport.buildSvg(features, {
    title: "Shared edge test",
    highlights: { west: { color: "#4472C4" } },
    legend: [],
    legendVisible: false,
    groupNames: {},
    groupMeta: {}
  }, { labels: false, selectedId: "west", ratio: "1:1" });

  assert.equal((svg.match(/id="boundary-mesh"/g) || []).length, 1);
  assert.equal((svg.match(/data-region-fill=/g) || []).length, 2);
  assert.equal((svg.match(/stroke="none"/g) || []).length, 2);
  assert.match(svg, /data-highlight-outline="west"/);
  assert.match(svg, /data-selected-outline="west"/);
  assert.match(svg, /stroke-linejoin="round" stroke-linecap="round"/);
  const mesh = svg.match(/id="boundary-mesh"[^>]*d="([^"]+)"/);
  assert.ok(mesh);
  assert.equal((mesh[1].match(/ L/g) || []).length, 7, "two adjacent squares have seven unique boundary segments");
  assert.deepEqual(features, before);
});

test("presentation exports keep selective labels and the same visual hierarchy", () => {
  const mapExport = loadExport();
  const features = [
    feature("selected", [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]),
    feature("highlighted", [[2, 0], [3, 0], [3, 1], [2, 1], [2, 0]]),
    feature("ordinary", [[4, 0], [5, 0], [5, 1], [4, 1], [4, 0]])
  ];
  const svg = mapExport.buildSvg(features, {
    title: "Presentation",
    highlights: { highlighted: { color: "#087F73" } },
    legend: [],
    legendVisible: false,
    groupNames: {},
    groupMeta: {}
  }, { labels: true, selectedId: "selected", presentationMode: true, geometryDetail: "detailed", ratio: "1:1" });

  assert.match(svg, /fill="#f7f9fa"/);
  assert.match(svg, /data-highlight-outline="highlighted"/);
  assert.match(svg, /&quot;presentationMode&quot;:true/);
  assert.match(svg, /&quot;geometryDetail&quot;:&quot;detailed&quot;/);
  assert.match(svg, />selected<\/text>/);
  assert.match(svg, />highlighted<\/text>/);
  assert.doesNotMatch(svg, />ordinary<\/text>/);
});

test("high-resolution SVG, PDF, and large PNG request detailed local geometry", () => {
  const mapExport = loadExport();
  assert.equal(mapExport.requiresDetailedGeometry("svg", {}), true);
  assert.equal(mapExport.requiresDetailedGeometry("pdf", {}), true);
  assert.equal(mapExport.requiresDetailedGeometry("png", { pngSize: "3840x2160" }), true);
  assert.equal(mapExport.requiresDetailedGeometry("png", { pngSize: "2560x1440" }), true);
  assert.equal(mapExport.requiresDetailedGeometry("png", { pngSize: "1920x1080" }), false);
  assert.equal(mapExport.requiresDetailedGeometry("png", { pngSize: "1920x1080", highDetail: true }), true);
});

test("export provenance is supplied by the active boundary provider", () => {
  const mapExport = loadExport();
  const spec = mapExport.buildExportSpec([], { title: "Provider test", legend: [] }, { ratio: "1:1" });
  assert.equal(spec.boundaryProviderId, "geoboundaries-hdx-idn-adm2-2020");
  assert.equal(spec.boundaryVersion, boundaryProvider.current.getVersion());
  assert.equal(spec.attribution, boundaryProvider.current.getAttribution());
});
