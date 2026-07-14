const assert = require("node:assert/strict");
const test = require("node:test");

const ProductContent = require("../../assets/js/product-content.js");

test("governed success copy reports exactly what changed", () => {
  assert.equal(
    ProductContent.text("ui.status.rowsAdded", { count: 2 }),
    "2 rows were added to the map."
  );
});

test("governed unmatched warning protects the map and offers a clear recovery action", () => {
  const warning = ProductContent.text("ui.warnings.unmatched", { count: 3 });
  assert.match(warning, /^3 regions could not be matched\./);
  assert.match(warning, /Your map is still safe\./);
  assert.equal(ProductContent.text("ui.actions.fixUnmatched"), "Fix unmatched regions");
});

test("governed spreadsheet error explains safety and recovery", () => {
  const message = ProductContent.text("ui.errors.spreadsheetRead");
  assert.match(message, /We could not read this spreadsheet\./);
  assert.match(message, /Your current map is still safe\./);
  assert.match(message, /Upload a supported \.xlsx file without macros, or paste the data instead\./);
});
