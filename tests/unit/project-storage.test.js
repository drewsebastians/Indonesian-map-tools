const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadProjectStorage() {
  const file = path.resolve(__dirname, "..", "..", "assets", "js", "project-storage.js");
  const sandbox = {
    Blob: function Blob() {},
    Date,
    JSON,
    Set,
    String,
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    document: { createElement: () => ({ click() {} }) },
    localStorage: {
      getItem: () => null,
      removeItem: () => {},
      setItem: () => {}
    },
    window: {}
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
  return sandbox.window.ProjectStorage;
}

test("sanitizeProject accepts valid highlights and strips unknown region IDs", () => {
  const storage = loadProjectStorage();
  const project = storage.sanitizeProject({
    schemaVersion: "1.0",
    title: "A".repeat(120),
    highlights: {
      "known-id": { color: "#4472C4", category: "Category", value: "Value" },
      "unknown-id": { color: "#E74C3C" }
    },
    legend: [{ label: "Good", color: "#70AD47" }],
    groupNames: { "#4472c4": "Blue group" },
    groupMeta: { "#4472c4": { category: "Meta", value: "100" } }
  }, new Set(["known-id"]));

  assert.equal(project.schemaVersion, "1.0");
  assert.equal(project.title.length, 90);
  assert.deepEqual(Object.keys(project.highlights), ["known-id"]);
  assert.equal(project.groupNames["#4472C4"], "Blue group");
  assert.equal(project.groupMeta["#4472C4"].value, "100");
});

test("sanitizeProject rejects unsupported schema versions", () => {
  const storage = loadProjectStorage();
  assert.throws(() => storage.sanitizeProject({ schemaVersion: "9.9", highlights: {} }, new Set()), /Versi file proyek/);
});

test("sanitizeProject rejects invalid colors in valid region highlights", () => {
  const storage = loadProjectStorage();
  assert.throws(() => storage.sanitizeProject({
    schemaVersion: "1.0",
    highlights: { "known-id": { color: "javascript:alert(1)" } }
  }, new Set(["known-id"])), /warna tidak valid/);
});

test("sanitizeProject rejects oversized highlight payloads", () => {
  const storage = loadProjectStorage();
  const highlights = {};
  for (let index = 0; index < 2001; index += 1) {
    highlights[`id-${index}`] = { color: "#4472C4" };
  }
  assert.throws(() => storage.sanitizeProject({ schemaVersion: "1.0", highlights }, new Set()), /terlalu besar/);
});

test("isColor only accepts six-digit hex colors", () => {
  const storage = loadProjectStorage();
  assert.equal(storage.isColor("#abcdef"), true);
  assert.equal(storage.isColor("#ABCDEF"), true);
  assert.equal(storage.isColor("#abcd"), false);
  assert.equal(storage.isColor("red"), false);
});

