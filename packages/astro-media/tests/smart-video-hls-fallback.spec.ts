import { test, expect } from "./_fixtures/with-logging";

test.describe("SmartVideo — HLS fatal error fallback", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept ALL .m3u8 requests and return 404 to force a fatal HLS error.
    await page.route("**/*.m3u8", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/vnd.apple.mpegurl",
        body: "not found",
      });
    });

    await page.goto("/smart-video-test", { waitUntil: "domcontentloaded" });
  });

  test("falls back to appended <source> elements after fatal HLS error", async ({ page }) => {
    const wrapper = page.locator("#autoplay-video-wrapper");
    const video = wrapper.locator("video");

    await wrapper.scrollIntoViewIfNeeded();

    // Wait for fallback sources to be appended by the client script
    const sources = video.locator("source");
    await expect(sources).toHaveCount(2, { timeout: 10_000 });

    // Validate type/src ordering: webm then mp4, based on implementation.
    const webmType = await sources.nth(0).getAttribute("type");
    const webmSrc = await sources.nth(0).getAttribute("src");
    const mp4Type = await sources.nth(1).getAttribute("type");
    const mp4Src = await sources.nth(1).getAttribute("src");

    expect(webmType).toBe("video/webm");
    expect(mp4Type).toBe("video/mp4");
    expect(webmSrc).toMatch(/\/videos\/fallback\.webm$/);
    expect(mp4Src).toMatch(/\/videos\/fallback\.mp4$/);
  });
});
