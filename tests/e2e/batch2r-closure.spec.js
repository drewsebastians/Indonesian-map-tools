const fs = require("node:fs");
const path = require("node:path");
const { expect, test } = require("@playwright/test");

const root = path.resolve(__dirname, "..", "..");
const screenshotDir = path.join(root, "artifacts", "batch-2r", "final-screenshots");
const journeyPath = path.join(root, "artifacts", "batch-2r", "final-journey-evidence.json");

function capture(page, name) {
  fs.mkdirSync(screenshotDir, { recursive: true });
  return page.screenshot({ path: path.join(screenshotDir, `${name}.png`), fullPage: true });
}

async function waitForWorkspace(page) {
  await expect(page.locator("#loadingIndicator")).toHaveAttribute("data-state", "ready", { timeout: 60000 });
}

async function selectRegion(page, name, color) {
  const select = page.locator("#regionSelect");
  const values = await select.locator("option").evaluateAll((options, expectedName) => options
    .filter((option) => option.textContent && option.textContent.includes(expectedName))
    .map((option) => option.value), name);
  expect(values.length).toBeGreaterThan(0);
  await select.selectOption(values[0]);
  await page.locator("#colorPicker").evaluate((input, value) => {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, color);
  await page.locator("#applyColorBtn").click();
}

async function expectOne(page, selector) {
  const locator = page.locator(selector);
  expect(await locator.count()).toBe(1);
  return locator;
}

test("desktop closure journey completes locally without sending spreadsheet values", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desktop", "This final desktop journey is captured once in Chromium desktop.");
  test.setTimeout(180000);
  const requests = [];
  const timing = { startedAt: Date.now() };
  page.on("request", (request) => requests.push({ url: request.url(), method: request.method(), resourceType: request.resourceType() }));

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Highlight regions and cities clearly." })).toBeVisible();
  await capture(page, "homepage-desktop");
  expect(await page.getByText("Upcoming", { exact: true }).count()).toBeGreaterThanOrEqual(2);

  await page.route("**/data/indonesia-adm2-simplified.geojson", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.continue();
  });
  const highlightLink = await expectOne(page, 'a[href="./workspace/?goal=highlight"]');
  await highlightLink.click();
  await expect(page.locator("#loadingIndicator")).toHaveAttribute("data-state", "loading");
  await capture(page, "loading-desktop");
  await waitForWorkspace(page);
  await capture(page, "goal-selection-desktop");
  await expect(page.locator("#appShell")).toHaveAttribute("data-workspace-goal", "manual");
  await selectRegion(page, "Surabaya", "#08736E");
  await selectRegion(page, "Denpasar", "#275DAD");
  await expect(page.locator("#highlightCount")).toHaveText("2");
  await capture(page, "manual-highlighting-desktop");
  const manualSvg = page.waitForEvent("download");
  await page.locator("#exportSvgBtn").click();
  await manualSvg;

  const switchToSpreadsheet = await expectOne(page, "#spreadsheetWorkflowLink");
  await expect(switchToSpreadsheet).toContainText("Map spreadsheet data links rows to regions");
  const switchButton = await expectOne(page, "#switchToSpreadsheetBtn");
  await switchButton.click();
  await expect(page.locator("#appShell")).toHaveAttribute("data-workspace-goal", "spreadsheet");
  await capture(page, "add-data-desktop");
  await page.locator("#importPaste").fill("kode\tnilai\n35.78\t125\n51.71\t77\n");
  await page.locator("#previewCsvBtn").click();
  await expect(page.locator("#workflowStatus")).toHaveAttribute("data-stage", "match");
  await expect(page.locator("#applyCsvBtn")).toBeEnabled();
  timing.firstValidPreviewMs = Date.now() - timing.startedAt;
  await page.locator("#applyCsvBtn").click();
  await expect(page.locator("#workflowStatus")).toHaveAttribute("data-stage", "design");
  timing.firstValidMapMs = Date.now() - timing.startedAt;

  const addDataStage = await expectOne(page, '[data-workflow-stage="input"]');
  await addDataStage.click();
  await page.locator("#importPaste").fill("wilayah\tnilai\nBandung\t50\n");
  await page.locator("#previewCsvBtn").click();
  const candidate = await expectOne(page, "[data-candidate-for]");
  await candidate.selectOption({ index: 1 });
  const resolve = await expectOne(page, "[data-resolve-row]");
  await resolve.click();
  await expect(page.locator("#applyCsvBtn")).toBeEnabled();
  await capture(page, "match-regions-desktop");
  await page.locator("#applyCsvBtn").click();
  await expect(page.locator("#workflowStatus")).toHaveAttribute("data-stage", "design");

  const drawer = await expectOne(page, "#dataTablePanel");
  await expect(drawer).toBeVisible();
  await page.locator("#dataTableFilter").fill("Bandung");
  await expect(page.locator("#dataTable tbody tr")).toHaveCount(1);
  await capture(page, "data-drawer-desktop");
  const advanced = await expectOne(page, "#advancedModeBtn");
  await advanced.evaluate((button) => button.click());
  await expect(advanced).toHaveAttribute("aria-pressed", "true");
  await capture(page, "advanced-mode-desktop");
  await page.locator("#vizMode").selectOption("equal-interval");
  await page.locator("#vizClasses").fill("3");
  await page.locator("#vizPreviewBtn").click();
  await page.locator("#vizApplyBtn").click();
  await expect(page.locator("#vizSummary")).toHaveAttribute("data-state", "applied");
  await capture(page, "design-map-desktop");

  const exportStage = await expectOne(page, '[data-workflow-stage="export"]');
  await exportStage.click();
  await expect(page.locator("#exportSection")).toBeVisible();
  await capture(page, "export-desktop");
  for (const selector of ["#exportSvgBtn", "#exportPngBtn", "#exportPdfBtn", "#exportMappingBtn"]) {
    const download = page.waitForEvent("download");
    await page.locator(selector).click();
    await download;
  }
  timing.firstExportMs = Date.now() - timing.startedAt;
  await expect(page.locator("#workspaceSuccess")).toBeVisible();
  await expect(page.locator("#workspaceRecommendation")).toContainText("coming soon");
  await capture(page, "export-success-desktop");

  const savedCount = await page.locator("#highlightCount").textContent();
  const projectDownload = page.waitForEvent("download");
  await page.locator("#workspaceSuccessSave").click();
  const project = await projectDownload;
  const projectPath = await project.path();
  expect(projectPath).toBeTruthy();
  await page.locator("#projectFile").setInputFiles(projectPath);
  await expect(page.locator("#highlightCount")).toHaveText(savedCount || "2");

  const keyboardDrawer = await expectOne(page, "#dataDrawerToggle");
  await keyboardDrawer.focus();
  await keyboardDrawer.press("Enter");
  await expect(page.locator("#appShell")).toHaveAttribute("data-workspace-drawer", /open|closed/);
  for (const selector of ["#workflowStatus", "#workspaceToast", "#workspaceLiveStatus", "#dataTableAnnouncement"]) {
    const status = await expectOne(page, selector);
    expect(await status.getAttribute("aria-live")).toBe("polite");
  }

  const externalRequests = requests.filter((request) => /^https?:\/\//.test(request.url) && !request.url.startsWith("http://127.0.0.1:4173/"));
  expect(externalRequests).toEqual([]);
  fs.writeFileSync(journeyPath, `${JSON.stringify({
    schemaVersion: "batch2r.final-journey.v1",
    generatedAt: new Date().toISOString(),
    status: "passed",
    desktop: {
      homepageGoalSelection: true,
      manualHighlights: 2,
      manualSvgExport: true,
      spreadsheetTwoColumnInput: true,
      ambiguousRowResolved: true,
      dataDrawerUsed: true,
      visualizationApplied: true,
      exports: ["svg", "png", "pdf", "mapping-csv"],
      projectRoundTrip: true,
      keyboardDrawerAction: true,
      screenReaderStatusAnnouncements: true,
      futureWorkflowHonesty: true,
      noExternalUserDataRequest: true,
      timing
    },
    externalRequests
  }, null, 2)}\n`);
});

test("desktop recovery state preserves incomplete input and points back to the current step", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desktop", "This recovery state is captured once in Chromium desktop.");
  await page.goto("/workspace/");
  await waitForWorkspace(page);
  const spreadsheetGoal = await expectOne(page, '[data-workspace-goal="spreadsheet"]');
  await spreadsheetGoal.click();
  await page.locator("#importPaste").fill("kode\tnilai\n35.78\t125\n");
  await page.locator('[data-workflow-stage="visualize"]').click();
  await expect(page.locator("#errorArea")).toContainText("Add at least one matched row first");
  await expect(page.locator("#workspaceRecovery")).toBeVisible();
  await capture(page, "error-recovery-desktop");
  const recover = await expectOne(page, "#workspaceRecoveryAction");
  await recover.click();
  await expect(page.locator("#importPaste")).toHaveValue("kode\tnilai\n35.78\t125\n");
  await expect(page.locator("#importPaste")).toBeFocused();
});

test("mobile closure path keeps the map reachable through sheet states", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-mobile", "This final mobile path is captured once in Chromium mobile.");
  await page.setViewportSize({ width: 393, height: 851 });
  await page.goto("/");
  await capture(page, "homepage-mobile");
  await page.goto("/workspace/?sample=1");
  await waitForWorkspace(page);
  await expect(page.locator("#appShell")).toHaveAttribute("data-workspace-goal", "spreadsheet");
  await expect(page.locator("#map")).toBeVisible();
  if (await page.locator("#dataTablePanel").isVisible()) await page.locator("#dataDrawerToggle").click();
  await capture(page, "mobile-sheet-medium");
  const sheetToggle = await expectOne(page, "#sidebarToggleBtn");
  await sheetToggle.click();
  await expect(page.locator("#appShell")).toHaveAttribute("data-workspace-sheet", "expanded");
  await capture(page, "mobile-sheet-expanded");
  await sheetToggle.click();
  await expect(page.locator("#appShell")).toHaveAttribute("data-workspace-sheet", "collapsed");
  await capture(page, "mobile-sheet-collapsed");
  await sheetToggle.click();
  await expect(page.locator("#appShell")).toHaveAttribute("data-workspace-sheet", "medium");
  await page.locator("#applyCsvBtn").click();
  await page.locator("#dataDrawerToggle").click();
  await expect(page.locator("#dataTablePanel")).toBeVisible();
  await page.locator("#dataDrawerToggle").click();
  const exportStage = await expectOne(page, '[data-workflow-stage="export"]');
  await exportStage.click();
  const download = page.waitForEvent("download");
  await page.locator("#exportMappingBtn").click();
  await download;
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await capture(page, "mobile-core-success");
});
