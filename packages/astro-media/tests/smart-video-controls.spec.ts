import { test, expect } from "./_fixtures/with-logging";

test.describe("SmartVideo — controls rendering", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Attach detailed browser/network logs for observability-driven debugging.
    await page.goto("/smart-video-test", { waitUntil: "domcontentloaded" });
  });

  test("controls attribute is set and video can be played/paused", async ({ page }, testInfo) => {
    // WebKit in Playwright on Linux/Windows frequently lacks H.264/AAC and/or WebM support,
    // so decoded playback may never become ready. Run this strict playback test elsewhere.
    if (testInfo.project.name === "webkit") {
      test.skip(
        true,
        "Playwright WebKit on non-macOS often lacks required codecs; skipping decoded-playback assertion.",
      );
    }

    const video = page.locator("#controls-video-wrapper video");

    await video.scrollIntoViewIfNeeded();

    // Controls attribute should be present when controls={true}
    await expect(video).toHaveAttribute("controls", "");

    // Programmatically play and then pause to verify media element is wired correctly.
    // This avoids depending on UA shadow controls structure.
    await page.evaluate(async (sel) => {
      const v = document.querySelector(sel) as HTMLVideoElement | null;
      if (!v) throw new Error("video not found");
      await v.play();
    }, "#controls-video-wrapper video");

    await expect
      .poll(
        async () => {
          return await page.evaluate((sel) => {
            const v = document.querySelector(sel) as HTMLVideoElement | null;
            return v ? !v.paused && v.readyState > 2 : false;
          }, "#controls-video-wrapper video");
        },
        { timeout: 20_000 },
      )
      .toBe(true);

    // Pause and confirm
    await page.evaluate((sel) => {
      const v = document.querySelector(sel) as HTMLVideoElement | null;
      v?.pause();
    }, "#controls-video-wrapper video");

    await expect
      .poll(async () => {
        return await page.evaluate((sel) => {
          const v = document.querySelector(sel) as HTMLVideoElement | null;
          return v ? v.paused : false;
        }, "#controls-video-wrapper video");
      })
      .toBe(true);
  });
});
