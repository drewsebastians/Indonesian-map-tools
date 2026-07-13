const assert = require("node:assert/strict");
const test = require("node:test");

const ImportCore = require("../../assets/js/import-core.js");
global.ImportCore = ImportCore;
const MatchingEngine = require("../../assets/js/matching-engine.js");

function feature(id, code, name, province, type = "Kota", aliases = "") {
  return {
    properties: {
      region_id: id,
      geometry_source_id: id.replace(/^gb-/, ""),
      official_code: code,
      region_name: name,
      region_type: type,
      province_name: province,
      display_name: `${type} ${name}`,
      geometry_source_name: name,
      alternative_names: aliases,
      match_status: "matched_unique_name"
    }
  };
}

function parsed(text) {
  return ImportCore.parseTabularInput({ text, sourceType: "paste", delimiterOverride: "tab" });
}

function statuses(text, features, mapping) {
  const importRows = parsed(text);
  const indexes = MatchingEngine.buildIndexes(features);
  return MatchingEngine.matchParsedRows(importRows, indexes, mapping || importRows.mapping);
}

test("matches exact verified official code before names", () => {
  const rows = statuses("kode\twilayah\n35.78\tNama Salah\n", [
    feature("gb-surabaya", "35.78", "Surabaya", "Jawa Timur")
  ]);
  assert.equal(rows[0].status, "exact-code");
  assert.equal(rows[0].matched.id, "gb-surabaya");
});

test("matches exact canonical name plus province and alias plus province", () => {
  const features = [
    feature("gb-badung", "51.03", "Badung", "Bali", "Kabupaten", "Mengwi Lama | Bali | 51.03")
  ];
  assert.equal(statuses("wilayah\tprovinsi\nBadung\tBali\n", features)[0].status, "exact-name-province");
  assert.equal(statuses("wilayah\tprovinsi\nMengwi Lama\tBali\n", features)[0].status, "exact-alias-province");
});

test("keeps same name in multiple provinces ambiguous when province is missing", () => {
  const rows = statuses("wilayah\nKupang\n", [
    feature("gb-kupang-kab", "53.03", "Kupang", "Nusa Tenggara Timur", "Kabupaten"),
    feature("gb-kupang-kota", "53.71", "Kupang", "Nusa Tenggara Timur", "Kota")
  ]);
  assert.equal(rows[0].status, "ambiguous");
  assert.equal(rows[0].candidates.length, 2);
});

test("detects duplicate targets instead of overwriting", () => {
  const rows = statuses("wilayah\tprovinsi\nKota Surabaya\tJawa Timur\nSurabaya\tJawa Timur\n", [
    feature("gb-surabaya", "35.78", "Surabaya", "Jawa Timur")
  ]);
  assert.deepEqual(rows.map((row) => row.status), ["duplicate-target", "duplicate-target"]);
});

test("applies user resolution and stale correction rules", () => {
  const input = parsed("wilayah\nKupang\n");
  const indexes = MatchingEngine.buildIndexes([
    feature("gb-kupang-kab", "53.03", "Kupang", "Nusa Tenggara Timur", "Kabupaten"),
    feature("gb-kupang-kota", "53.71", "Kupang", "Nusa Tenggara Timur", "Kota")
  ]);
  const rowId = input.rows[0].rowId;
  const resolved = MatchingEngine.matchParsedRows(input, indexes, input.mapping, {
    resolutions: { [rowId]: { action: "resolve", targetId: "gb-kupang-kota", registryVersion: MatchingEngine.REGISTRY_VERSION } }
  });
  assert.equal(resolved[0].status, "user-resolved");

  const stale = MatchingEngine.matchParsedRows(input, indexes, input.mapping, {
    resolutions: { [rowId]: { action: "resolve", targetId: "gb-kupang-kota", registryVersion: "old" } }
  });
  assert.equal(stale[0].status, "ambiguous");
});
