const fs = require("node:fs");
const path = require("node:path");
const { expect, test } = require("@playwright/test");

const artifactDir = path.resolve(__dirname, "..", "..", "artifacts", "batch-1");
const axePath = require.resolve("axe-core/axe.min.js");

test("home page has no serious or critical automated accessibility violations", async ({ page }) => {
  fs.mkdirSync(artifactDir, { recursive: true });
  await page.goto("/");
  await expect(page.locator("#loadingIndicator")).toContainText(/wilayah dimuat/i, { timeout: 60000 });
  await page.addScriptTag({ path: axePath });
  const results = await page.evaluate(async () => {
    return window.axe.run(document, {
      resultTypes: ["violations"],
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "best-practice"] }
    });
  });
  fs.writeFileSync(path.join(artifactDir, "a11y-axe-results.json"), `${JSON.stringify(results, null, 2)}\n`);
  const blocking = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
  expect(blocking).toEqual([]);
});

