import { test, expect } from "./_fixtures/with-logging";

test.describe("SmartVideo — basic attributes at runtime", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/smart-video-test", { waitUntil: "domcontentloaded" });
  });

  test("preload defaults to metadata", async ({ page }) => {
    const video = page.locator("#autoplay-video-wrapper video");
    await expect(video).toHaveAttribute("preload", "metadata");
  });

  test("hover video does not set autoplay attribute at runtime", async ({ page }) => {
    const video = page.locator("#hover-video-wrapper video");
    const hasAutoplay = await video.evaluate((el) => el.hasAttribute("autoplay"));
    expect(hasAutoplay).toBe(false);
  });
});
