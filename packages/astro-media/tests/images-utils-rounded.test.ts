import { expect, test } from "vitest";
import { extractRoundedClasses, removeRoundedClasses } from "../src/utils/images";

test("extractRoundedClasses returns only rounded-* tokens", () => {
  const input = "rounded-lg p-4 rounded-t-md shadow rounded";
  const out = extractRoundedClasses(input);

  expect(out.split(/\s+/).sort()).toEqual(["rounded", "rounded-lg", "rounded-t-md"].sort());
});

test("removeRoundedClasses strips rounded-* and trims whitespace", () => {
  const input = "rounded-lg p-4 rounded-t-md shadow rounded  ";
  const out = removeRoundedClasses(input);

  expect(out).toBe("p-4 shadow");
});

test("handles empty/undefined class strings", () => {
  expect(extractRoundedClasses(undefined)).toBe("");
  expect(removeRoundedClasses(undefined)).toBe("");
  expect(removeRoundedClasses("")).toBe("");
});
