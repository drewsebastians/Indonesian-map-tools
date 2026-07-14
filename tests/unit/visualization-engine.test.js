const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadEngine() {
  const sandbox = { Intl, Map, Set, Number, String, Object, Array, Math, JSON, console, window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.resolve(__dirname, "../../assets/js/visualization-engine.js"), "utf8"), sandbox);
  return sandbox.window.VisualizationEngine;
}

function rows(values, categories) {
  return values.map((value, index) => ({ rowId: `row-${index + 1}`, rowNumber: index + 2, matchedId: `region-${index + 1}`, matchedName: `Region ${index + 1}`, record: { numericValue: value, category: categories ? categories[index] : "" }, matchStatus: "exact-code", errors: [] }));
}

test("categorical output is deterministic and category order is normalized", () => {
  const engine = loadEngine();
  const first = engine.classify(rows([1, 2, 3], [" zeta ", "Alpha", "alpha"]), { method: "categorical", palette: "safe-default" });
  const second = engine.classify(rows([3, 1, 2], ["alpha", " zeta ", "Alpha"]), { method: "categorical", palette: "safe-default" });
  assert.deepEqual(first.legend.map((item) => item.label), ["ALPHA", "ZETA"]);
  assert.equal(first.legend[0].color, second.legend[0].color);
});

test("equal interval excludes no-data and handles equal values", () => {
  const engine = loadEngine();
  const output = engine.classify(rows([0, 10, "", "invalid", 20]), { method: "equal-interval", classes: 3, palette: "blue" });
  assert.equal(output.noData.length, 2);
  assert.equal(output.assignments["region-1"].classKey, "0");
  const equal = engine.classify(rows([5, 5, 5]), { method: "equal-interval", classes: 5, palette: "blue" });
  assert.match(equal.warnings.join(" "), /all values are the same/i);
  assert.equal(equal.legend.length, 1);
});

test("quantile keeps tied values together and is row-order independent", () => {
  const engine = loadEngine();
  const a = engine.classify(rows([1, 1, 1, 2, 2, 2]), { method: "quantile", classes: 4, palette: "blue" });
  const b = engine.classify(rows([2, 1, 2, 1, 2, 1]), { method: "quantile", classes: 4, palette: "blue" });
  assert.ok(a.warnings.some((item) => /repeated values|number of color groups/i.test(item)));
  assert.equal(a.legend.length, b.legend.length);
});

test("manual breaks reject invalid order and classify boundary inclusively", () => {
  const engine = loadEngine();
  assert.throws(() => engine.classify(rows([1, 2]), { method: "manual", breaks: "10,10" }), /unique numbers in increasing order/i);
  const output = engine.classify(rows([-1, 0, 10, 11]), { method: "manual", breaks: "0,10" });
  assert.equal(output.assignments["region-2"].classKey, "0");
  assert.equal(output.assignments["region-3"].classKey, "1");
});

test("diverging mode centers zero, uses odd classes, and discloses one-sided data", () => {
  const engine = loadEngine();
  const output = engine.classify(rows([-2, 0, 5]), { method: "diverging", classes: 4, center: 0, palette: "blue-orange" });
  assert.equal(output.options.classes, 4);
  assert.equal(output.assignments["region-2"].classKey, "center");
  const oneSided = engine.classify(rows([1, 2]), { method: "diverging", center: 0, palette: "blue-orange" });
  assert.ok(oneSided.warnings.some((item) => /one side of the center/i.test(item)));
});
