const { expect, test } = require("@playwright/test");

async function ready(page, suffix = "") {
  await page.goto(`/workspace/${suffix}`);
  await expect(page.locator("#loadingIndicator")).toHaveAttribute("data-state", "ready", { timeout: 60000 });
}

test("first-use input gives local privacy, format, guide, and keyboard help", async ({ page }) => {
  await ready(page);
  await page.locator('[data-workspace-goal="spreadsheet"]').click();
  await expect(page.locator("#workspaceFirstUse")).toContainText("CSV, TSV, or XLSX");
  await expect(page.locator("#workspaceFirstUse")).toContainText("stays on this device");
  await expect(page.locator("#workspaceFirstUse a")).toHaveAttribute("href", /cara-membuat-peta-kabupaten-kota-dari-excel/);
  await expect(page.locator("#workspaceFirstUse")).toContainText("Keyboard");
});

test("recoverable workflow error keeps input and offers a focused next action", async ({ page }) => {
  await ready(page);
  await page.locator('[data-workspace-goal="spreadsheet"]').click();
  await page.locator("#importPaste").fill("kode\tnilai\n35.78\t125\n");
  await page.locator('[data-workflow-stage="visualize"]').click();
  await expect(page.locator("#workspaceRecovery")).toBeVisible();
  await expect(page.locator("#workspaceRecovery")).toContainText("current map is safe");
  await expect(page.locator("#importPaste")).toHaveValue("kode\tnilai\n35.78\t125\n");
  await page.locator("#workspaceRecoveryAction").click();
  await expect(page.locator("#workspaceRecovery")).toBeHidden();
  await expect(page.locator("#importPaste")).toBeFocused();
});

test("successful export shows one contextual recommendation and keeps future work honest", async ({ page }) => {
  await ready(page);
  await page.locator('[data-workspace-goal="spreadsheet"]').click();
  await page.locator("#importPaste").fill("kode\tnilai\n35.78\t125\n51.71\t77\n");
  await page.locator("#previewCsvBtn").click();
  await page.locator("#applyCsvBtn").click();
  await page.locator('[data-workflow-stage="export"]').click();
  const download = page.waitForEvent("download");
  await page.locator("#exportMappingBtn").click();
  await download;
  await expect(page.locator("#workspaceSuccess")).toBeVisible();
  await expect(page.locator("#workspaceRecommendation")).toContainText("coming soon");
  await expect(page.locator("#workspaceRecommendationAction")).toHaveText("Sales territories — upcoming");
  await expect(page.locator("#workspaceRecommendationAction")).toHaveCount(1);
  await page.locator("#workspaceRecommendationAction").click();
  await expect(page.locator("#appShell")).toHaveAttribute("data-workspace-goal", "spreadsheet");
});

test("local evidence mode records steps only and never spreadsheet values", async ({ page }) => {
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await ready(page, "?evidence=1");
  await page.locator('[data-workspace-goal="spreadsheet"]').click();
  await page.locator("#importPaste").fill("kode\tnilai\n35.78\tPRIVATE-USER-VALUE\n");
  await page.locator('[data-workflow-stage="visualize"]').click();
  const evidence = await page.evaluate(() => JSON.stringify(window.NusaCanvasEvidence));
  expect(evidence).toContain("goal:spreadsheet");
  expect(evidence).not.toContain("PRIVATE-USER-VALUE");
  expect(requests.filter((url) => /^https?:\/\//.test(url) && !url.startsWith("http://127.0.0.1:4173/")).length).toBe(0);
});
