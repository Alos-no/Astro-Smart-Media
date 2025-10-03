/** @type {import("prettier").Config} */
export default {
  // Load Astro support so .astro files format with Prettier (CLI + editors).
  // Recommended by the official plugin.
  // https://github.com/withastro/prettier-plugin-astro
  plugins: ["prettier-plugin-astro"],

  // Ensure the Astro parser is explicitly set (recommended by plugin docs).
  overrides: [
    {
      files: "*.astro",
      options: { parser: "astro" },
    },
  ],

  // House style.
  semi: true,
  printWidth: 120,
  tabWidth: 2,

  // Let Prettier treat whitespace in HTML as insignificant (less early wrapping).
  // Default is "css" (conservative around inline elements). See docs.
  // Caveat: if you rely on literal spaces around inline tags for layout, keep "css".
  htmlWhitespaceSensitivity: "ignore",
};
