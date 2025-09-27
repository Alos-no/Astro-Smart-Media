import { expect, test } from "vitest";
import { generateOptimalWidths, generateSizes } from "../src/utils/images";

test("generateOptimalWidths respects max source width", () => {
  const widths = generateOptimalWidths(1100);
  expect(widths[widths.length - 1]).toBe(1100);
  expect(widths.every((w) => w <= 1100)).toBe(true);
});

test("generateSizes emits comma-separated media list", () => {
  const sizes = generateSizes([640, 1080]);
  expect(sizes).toBe("(max-width: 640px) 640px, 1080px");
});
