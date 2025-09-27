// Minimal declaration so tsc can type-check and emit when importing .astro files
// See: https://github.com/withastro/astro/issues/8364
declare module "*.astro" {
  import type { AstroComponentFactory } from "astro/runtime/server/index.js";
  const Component: AstroComponentFactory;
  export default Component;
}
