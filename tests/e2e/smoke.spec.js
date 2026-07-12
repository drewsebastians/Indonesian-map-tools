const fs = require("node:fs");
const path = require("node:path");
const { expect, test } = require("@playwright/test");

const artifactDir = path.resolve(__dirname, "..", "..", "artifacts", "batch-1");

test("load, color, save, SVG export, and smallest PNG export", async ({ page }) => {
  fs.mkdirSync(artifactDir, { recursive: true });
  const requests = [];
  const failed = [];
  const pageErrors = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => requests.push({ url: request.url(), method: request.method(), resourceType: request.resourceType() }));
  page.on("requestfailed", (request) => failed.push({ url: request.url(), errorText: request.failure() && request.failure().errorText }));
  page.on("response", (response) => {
    const url = response.url();
    if (url.startsWith("http://127.0.0.1:4173/") && response.status() >= 400) {
      failed.push({ url, status: response.status() });
    }
  });

  await page.goto("/");
  await expect(page.locator("#loadingIndicator")).toContainText(/wilayah dimuat/i, { timeout: 60000 });
  await expect(page.locator(".leaflet-interactive").first()).toBeVisible();

  const regionValue = await page.locator("#regionSelect option").evaluateAll((options) => {
    const option = options.find((item) => item.textContent && item.textContent.includes("Surabaya"));
    return option && option.value;
  });
  expect(regionValue).toBeTruthy();

  await page.locator("#regionSelect").selectOption(regionValue);
  await expect(page.locator("#selectedRegion")).toContainText("Surabaya");
  await page.locator("#colorPicker").evaluate((input) => {
    input.value = "#E74C3C";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.locator("#applyColorBtn").click();
  await expect(page.locator("#highlightCount")).toHaveText("1");

  const projectDownload = page.waitForEvent("download");
  await page.locator("#saveProjectBtn").click();
  expect((await projectDownload).suggestedFilename()).toBe("peta-warna-indonesia-project.json");

  const svgDownload = page.waitForEvent("download");
  await page.locator("#exportSvgBtn").click();
  expect((await svgDownload).suggestedFilename()).toBe("peta-warna-indonesia.svg");

  await page.locator("#exportLabels").uncheck();
  await page.locator("#pngSize").selectOption("1920x1080");
  const pngDownload = page.waitForEvent("download");
  await page.locator("#exportPngBtn").click();
  expect((await pngDownload).suggestedFilename()).toBe("peta-warna-indonesia.png");

  fs.writeFileSync(path.join(artifactDir, "smoke-network.json"), `${JSON.stringify({ requests, failed }, null, 2)}\n`);
  expect(pageErrors).toEqual([]);
  expect(failed).toEqual([]);
});

