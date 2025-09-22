import { expect, test } from "vitest";
import { generateOptimalWidths, generateSizes } from "../src/utils/images";

test("generateOptimalWidths dedupes when maxWidth equals a default", () => {
  // 1080 is in DEFAULT_RESPONSIVE_WIDTHS
  const widths = generateOptimalWidths(1080);
  const occurrences = widths.filter((w) => w === 1080).length;

  expect(occurrences).toBe(1);
  expect(widths[widths.length - 1]).toBe(1080);
});

test("generateOptimalWidths for very small images doesn't upscale", () => {
  const widths = generateOptimalWidths(400);
  expect(widths).toEqual([400]);
});

test("generateOptimalWidths large images include all defaults plus maxWidth", () => {
  const widths = generateOptimalWidths(4000);
  expect(widths[widths.length - 1]).toBe(4000);
  // Sanity: includes typical defaults like 640 and 1920
  expect(widths).toEqual(expect.arrayContaining([640, 1920]));
});

test("generateSizes with single width yields a simple size", () => {
  expect(generateSizes([800])).toBe("800px");
});

test("generateSizes with multiple widths emits ordered media conditions", () => {
  expect(generateSizes([640, 1080, 1920])).toBe("(max-width: 640px) 640px, (max-width: 1080px) 1080px, 1920px");
});
