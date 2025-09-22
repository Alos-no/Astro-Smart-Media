import { test, expect } from "./_fixtures/with-logging";

test.describe("SmartVideo — autoplay blocked behavior @autoplay-policy", () => {
  test("logs muted-retry when autoplay policy blocks play()", async ({ page }, testInfo) => {
    // Only meaningful on the chromium-autoplay-blocked project; skip elsewhere.
    if (!testInfo.project.name.includes("autoplay-blocked")) {
      test.skip();
    }

    const logs: string[] = [];
    page.on("console", (msg) => logs.push(msg.text()));

    await page.goto("/smart-video-test", { waitUntil: "domcontentloaded" });

    const wrapper = page.locator("#autoplay-video-wrapper");
    await wrapper.scrollIntoViewIfNeeded();

    // Wait for our client script's IntersectionObserver to mark the container as intersecting.
    const container = wrapper.locator('[data-component="smart-video"]');
    await expect(container).toHaveAttribute("data-is-intersecting", "true");

    // Expect our info log to appear due to play() rejection.
    await expect
      .poll(() => logs.some((l) => l.includes("SmartVideo: Autoplay was blocked. Muting and retrying.")), {
        timeout: 10_000,
      })
      .toBe(true);

    // Also verify the element has been forced muted by our retry logic.
    const isMuted = await wrapper.locator("video").evaluate((v) => (v as HTMLVideoElement).muted);
    expect(isMuted).toBe(true);
  });
});
