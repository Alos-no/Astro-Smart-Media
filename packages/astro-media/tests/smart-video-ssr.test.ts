import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test, describe } from "vitest";
import SmartVideo from "../src/components/SmartVideo.astro";

describe("SmartVideo SSR", () => {
  test("renders container, video, and poster wrapper", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SmartVideo, {
      props: {
        src: "/videos/drone",
        poster: "https://example.com/poster.jpg",
        class: "h-64",
      },
    });

    expect(html).toContain('data-component="smart-video"');
    const rootDiv = html.match(/<div[^>]*data-component="smart-video"[^>]*>/)?.[0];
    expect(rootDiv).toBeDefined();
    expect(rootDiv).toContain('class="h-64"');
    expect(rootDiv).toContain("position: relative;");
    expect(rootDiv).toContain("overflow: hidden;");
    expect(html).toContain("data-poster");
    expect(html).toContain("<video");
    expect(html).toContain("data-video");
  });

  test("applies playback attributes correctly", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SmartVideo, {
      props: {
        src: "/videos/drone",
        loop: true,
        muted: true,
        controls: true,
        playsinline: true,
      },
    });

    const videoTag = html.match(/<video[^>]*data-video[^>]*>/)?.[0];
    expect(videoTag).toBeDefined();
    expect(videoTag).toContain(" loop");
    expect(videoTag).toContain(" muted");
    expect(videoTag).toContain(" controls");
    expect(videoTag).toContain(" playsinline");
  });

  test("passes data attributes to client script", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SmartVideo, {
      props: {
        hlsSrc: "/video.m3u8",
        src: "/fallback",
        autoplay: true,
        playOnHover: false,
      },
    });

    const rootDiv = html.match(/<div[^>]*>/)?.[0];
    expect(rootDiv).toBeDefined();
    expect(rootDiv).toContain('data-hls-src="/video.m3u8"');
    expect(rootDiv).toContain('data-src-fallback="/fallback"');
    expect(rootDiv).toContain('data-autoplay="true"');
    expect(rootDiv).toContain('data-play-on-hover="false"');
  });

  test("renders JSON-LD schema when metadata is provided", async () => {
    const container = await AstroContainer.create();
    const uploadDate = new Date("2024-01-01T12:00:00Z");
    const html = await container.renderToString(SmartVideo, {
      props: {
        src: "/video",
        metadata: {
          title: "Test Video",
          description: "A test description.",
          uploadDate: uploadDate,
          duration: "PT1M5S",
        },
      },
    });

    expect(html).toContain('<script type="application/ld+json">');
    const jsonLdContent = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
    expect(jsonLdContent).toBeDefined();
    const parsedJson = JSON.parse(jsonLdContent!);
    expect(parsedJson["@type"]).toBe("VideoObject");
    expect(parsedJson.name).toBe("Test Video");
    expect(parsedJson.description).toBe("A test description.");
    expect(parsedJson.uploadDate).toBe(uploadDate.toISOString());
    expect(parsedJson.duration).toBe("PT1M5S");
  });

  test("does not render poster if no poster prop is given", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SmartVideo, {
      props: { src: "/video" },
    });
    expect(html).not.toContain("data-poster");
  });

  // ----- Root sizing (framework-agnostic) -----
  test('rootStyle includes "width: 100%" and "height: 100%" when sizeStrategy="fill"', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SmartVideo, {
      props: { src: "/video", sizeStrategy: "fill" },
    });

    const rootDiv = html.match(/<div[^>]*data-component="smart-video"[^>]*>/)?.[0] ?? "";
    const style = rootDiv.match(/style="([^"]*)"/)?.[1] ?? "";

    expect(style).toContain("position: relative;");
    expect(style).toContain("overflow: hidden;");
    expect(style).toContain("max-width: 100%;");
    expect(style).toMatch(/(?:^|;)\s*width:\s*100%;/);
    expect(style).toMatch(/(?:^|;)\s*height:\s*100%;/);
  });

  test('rootStyle omits inline width/height when sizeStrategy="none"', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SmartVideo, {
      props: { src: "/video", sizeStrategy: "none" },
    });

    const rootDiv = html.match(/<div[^>]*data-component="smart-video"[^>]*>/)?.[0] ?? "";
    const style = rootDiv.match(/style="([^"]*)"/)?.[1] ?? "";

    expect(style).toContain("position: relative;");
    expect(style).toContain("overflow: hidden;");
    expect(style).toContain("max-width: 100%;");
    expect(style).not.toMatch(/(?:^|;)\s*width:\s*100%;/);
    expect(style).not.toMatch(/(?:^|;)\s*height:\s*100%;/);
  });

  // ----- JSON-LD duration default -----
  test("JSON-LD duration falls back to DEFAULT_DURATION_ISO when not provided", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SmartVideo, {
      props: {
        src: "/video",
        metadata: {
          title: "No Duration",
          description: "Missing duration should use default.",
          uploadDate: new Date("2024-04-05T00:00:00Z"),
        },
      },
    });

    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? "";
    const parsed = JSON.parse(json);
    expect(parsed.duration).toBe("PT0M0S");
  });

  // ----- Dataset when hover is enabled -----
  test("data attributes reflect playOnHover=true even when autoplay=true is passed", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SmartVideo, {
      props: {
        src: "/video",
        autoplay: true,
        playOnHover: true,
      },
    });

    const rootDiv = html.match(/<div[^>]*data-component="smart-video"[^>]*>/)?.[0] ?? "";
    expect(rootDiv).toContain('data-autoplay="true"');
    expect(rootDiv).toContain('data-play-on-hover="true"');
    // Note: actual autoplay suppression occurs in client script (_shouldAutoplay = !playOnHover && ...).
  });
});
