import { test, expect } from "./_fixtures/with-logging";
import type { Page } from "@playwright/test";

// Helper function to check if a video is playing
async function isVideoPlaying(page: Page, selector: string): Promise<boolean> {
  return page.evaluate((sel: string) => {
    const video = document.querySelector(sel) as HTMLVideoElement;
    if (!video) return false;
    return video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
  }, selector);
}

test.describe("SmartVideo Component E2E", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto("/smart-video-test", { waitUntil: "domcontentloaded" });
  });

  test.describe("Autoplay Video", () => {
    const wrapperSelector = "#autoplay-video-wrapper";
    const videoSelector = `${wrapperSelector} video`;
    const posterSelector = `${wrapperSelector} [data-poster]`;

    test("should not play when out of view", async ({ page }) => {
      await expect(page.locator(posterSelector)).toBeVisible();
      // Ensure video is not playing initially
      expect(await isVideoPlaying(page, videoSelector)).toBe(false);
    });

    test("should play when scrolled into view", async ({ page }, testInfo) => {
      if (testInfo.project.name === "webkit") {
        test.skip(
          true,
          "Skipping decoded playback assertion on WebKit: Playwright WebKit CI builds often lack H.264/WebM codecs.",
        );
      }

      const videoWrapper = page.locator(wrapperSelector);
      await videoWrapper.scrollIntoViewIfNeeded();

      // Poster should be visible initially
      await expect(page.locator(posterSelector)).toBeVisible();

      // Wait for video to start playing and poster to fade out
      await expect(async () => {
        expect(await isVideoPlaying(page, videoSelector)).toBe(true);
      }).toPass({ timeout: 5000 });

      await expect(page.locator(posterSelector)).toHaveCSS("opacity", "0");
    });

    test("should pause when scrolled out of view", async ({ page }, testInfo) => {
      if (testInfo.project.name === "webkit") {
        test.skip(
          true,
          "Skipping decoded playback assertion on WebKit: Playwright WebKit CI builds often lack H.264/WebM codecs.",
        );
      }

      const videoWrapper = page.locator(wrapperSelector);
      await videoWrapper.scrollIntoViewIfNeeded();

      // Wait for it to start playing
      await expect(async () => {
        expect(await isVideoPlaying(page, videoSelector)).toBe(true);
      }).toPass({ timeout: 5000 });

      // Scroll it out of view by scrolling to the bottom of the page
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Wait for video to pause
      await expect(async () => {
        const isPaused = await page.evaluate(
          (sel) => (document.querySelector(sel) as HTMLVideoElement).paused,
          videoSelector,
        );
        expect(isPaused).toBe(true);
      }).toPass({ timeout: 2000 });
    });
  });

  test.describe("Play-on-Hover Video", () => {
    const wrapperSelector = "#hover-video-wrapper";
    const videoSelector = `${wrapperSelector} video`;
    const posterSelector = `${wrapperSelector} [data-poster]`;

    test("should not play initially", async ({ page }) => {
      const videoWrapper = page.locator(wrapperSelector);
      await videoWrapper.scrollIntoViewIfNeeded();

      await expect(page.locator(posterSelector)).toBeVisible();
      await expect(page.locator(posterSelector)).toHaveCSS("opacity", "1");
      expect(await isVideoPlaying(page, videoSelector)).toBe(false);
    });

    test("should play on mouse hover", async ({ page }, testInfo) => {
      if (testInfo.project.name === "webkit") {
        test.skip(
          true,
          "Skipping decoded playback assertion on WebKit: Playwright WebKit CI builds often lack H.264/WebM codecs.",
        );
      }

      const videoWrapper = page.locator(wrapperSelector);
      await videoWrapper.scrollIntoViewIfNeeded();
      await videoWrapper.hover();

      await expect(async () => {
        expect(await isVideoPlaying(page, videoSelector)).toBe(true);
      }).toPass({ timeout: 5000 });

      await expect(page.locator(posterSelector)).toHaveCSS("opacity", "0");
    });

    test("should pause when mouse leaves", async ({ page }, testInfo) => {
      if (testInfo.project.name === "webkit") {
        test.skip(
          true,
          "Skipping decoded playback assertion on WebKit: Playwright WebKit CI builds often lack H.264/WebM codecs.",
        );
      }

      const videoWrapper = page.locator(wrapperSelector);
      await videoWrapper.scrollIntoViewIfNeeded();

      // Hover to start playing
      await videoWrapper.hover();
      await expect(async () => {
        expect(await isVideoPlaying(page, videoSelector)).toBe(true);
      }).toPass({ timeout: 5000 });

      // Move mouse away
      await page.mouse.move(0, 0);

      // Check it's paused and poster is visible again
      await expect(async () => {
        const isPaused = await page.evaluate(
          (sel) => (document.querySelector(sel) as HTMLVideoElement).paused,
          videoSelector,
        );
        expect(isPaused).toBe(true);
      }).toPass({ timeout: 2000 });

      await expect(page.locator(posterSelector)).toHaveCSS("opacity", "1");
    });
  });
});
