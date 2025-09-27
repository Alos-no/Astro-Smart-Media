import { test, expect } from "./_fixtures/with-logging";

test.describe("SmartImage — local asset <Picture> (E2E via demo)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/smart-image");
  });

  test("renders <picture> with AVIF/WebP <source> types and <img> fallback", async ({ page }) => {
    // The first local example on the page uses the demo asset and <SmartImage>.
    const pic = page.locator("picture").first();
    await expect(pic).toBeVisible();

    const sources = pic.locator("source");
    const types = await sources.evaluateAll((els) => els.map((el) => el.getAttribute("type")));

    // Expect modern formats; order is implementation-defined but both should be present.
    expect(types).toEqual(expect.arrayContaining(["image/avif", "image/webp"]));

    // And an <img> fallback exists
    await expect(pic.locator("img")).toBeVisible();
  });
});
