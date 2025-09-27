import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";

test("SmartImage with vignette moves rounded classes to wrapper and renders gradient overlay", async () => {
  const container = await AstroContainer.create();
  const { default: SmartImage } = await import("../src/components/SmartImage.astro");

  const html = await container.renderToString(SmartImage, {
    props: {
      src: "https://example.com/image.jpg", // remote path → <img> branch
      alt: "Vignette",
      class: "rounded-lg rounded-t-md shadow",
      vignetteRadius: 60,
      vignetteStrength: 0.4,
    },
  });

  // Rounded classes should be on the outer wrapper, not on the inner <img>.
  expect(html).toMatch(/<div[^>]*class="[^"]*rounded-lg[^"]*rounded-t-md[^"]*"[^>]*>/);

  // Inner <img> should not include rounded-* classes; only 'shadow' remains.
  const imgTag = html.match(/<img[^>]*>/)?.[0] ?? "";
  expect(imgTag).toContain('alt="Vignette"');
  expect(imgTag).toContain('class="shadow"');
  expect(imgTag).not.toMatch(/\brounded/);

  // Overlay div contains a radial-gradient in the style attribute.
  expect(html).toContain("radial-gradient(ellipse at center");
});
