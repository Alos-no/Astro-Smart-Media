import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";

test("SmartImage renders <img> for string src (remote/unconfigured)", async () => {
  const container = await AstroContainer.create();
  const { default: SmartImage } = await import("../src/components/SmartImage.astro");

  const html = await container.renderToString(SmartImage, {
    props: {
      src: "https://example.com/image.jpg",
      alt: "Remote",
      class: "rounded-lg",
      loading: "lazy",
    },
  });

  expect(html).toContain("<img");
  expect(html).toContain('alt="Remote"');
});
