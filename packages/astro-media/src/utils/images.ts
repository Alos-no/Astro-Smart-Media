/**
 * @file Image-related utility functions for the <SmartImage> component.
 * @description These helpers handle the logic for generating responsive image attributes
 * and manipulating CSS classes for effects like vignetting with rounded corners.
 */

import { DEFAULT_RESPONSIVE_WIDTHS } from "../constants";

/**
 * Generates an array of optimal image widths based on the original image's max width.
 * It filters the default breakpoints to ensure no up-scaling occurs and includes the
 * original width for the highest quality version.
 *
 * @param {number} maxWidth The natural width of the source image.
 * @returns {number[]} A sorted array of image widths to generate.
 */
export const generateOptimalWidths = (maxWidth: number): number[] => {
  // Combine default widths (filtered to be <= maxWidth) with the actual maxWidth.
  // A Set is used to prevent duplicate values if maxWidth is already in the defaults.
  const widths = new Set([...DEFAULT_RESPONSIVE_WIDTHS.filter((w) => w <= maxWidth), maxWidth]);

  // Return a sorted array.
  return Array.from(widths).sort((a, b) => a - b);
};

/**
 * Generates an HTML `sizes` attribute string from an array of widths.
 * This creates a set of media conditions that instruct the browser to download
 * the most appropriate image size based on the viewport width. The final width
 * in the array is used as the default size without a media query.
 *
 * @param {number[]} widths - A sorted array of image widths.
 * @returns {string} The complete `sizes` attribute string.
 * @example
 * generateSizes([640, 1024])
 * // => "(max-width: 640px) 640px, 1024px"
 */
export const generateSizes = (widths: number[]): string => {
  // Map each width to a media condition, except for the last one.
  return widths.map((w, i) => (i === widths.length - 1 ? `${w}px` : `(max-width: ${w}px) ${w}px`)).join(", ");
};

/**
 * Extracts TailwindCSS `rounded-*` classes from a string.
 * This is used to move border-radius styles from the inner `<img>` to an outer
 * wrapper `<div>` when applying a vignette, ensuring the effect is properly clipped.
 *
 * @param {string | undefined} classes - The original CSS class string.
 * @returns {string} A string containing only the `rounded-*` classes, or an empty string.
 */
export const extractRoundedClasses = (classes?: string): string => {
  // If no classes are provided, return an empty string.
  if (!classes) {
    return "";
  }

  // Use a regex to find all classes that start with "rounded".
  const matches = classes.match(/\brounded\S*/g);

  // Join the matches back into a single string.
  return matches ? matches.join(" ") : "";
};

/**
 * Removes TailwindCSS `rounded-*` classes from a string.
 * This is the counterpart to `extractRoundedClasses`, used to clean the class list
 * that will be applied to the inner `<img>` or `<picture>` element.
 *
 * @param {string | undefined} classes - The original CSS class string.
 * @returns {string} The class string with all `rounded-*` classes removed.
 */
export const removeRoundedClasses = (classes?: string): string => {
  // If no classes are provided, return an empty string.
  if (!classes) {
    return "";
  }

  // Use regex to replace all "rounded" classes, collapse internal whitespace, then trim.
  return classes
    .replace(/\brounded\S*/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
