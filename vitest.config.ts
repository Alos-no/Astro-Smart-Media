/// <reference types="vitest/config" />

import { getViteConfig } from "astro/config";

// Vitest config that mirrors the Astro project behavior during tests.
// This is the officially recommended approach and unlocks the Container API.
// Ref: Astro Testing docs.
export default getViteConfig({
  test: {
    include: ["packages/**/tests/**/*.test.ts"],
    environment: "node",
    reporters: ["default"],
    coverage: {
      reporter: ["text", "html"],
    },

    // Keep output quiet unless a test fails; then Vitest prints captured console.*.
    // This provides "non-spammy" diagnostics for unit tests.
    silent: "passed-only",
  },

  // Permit asset imports from the monorepo demo project used by tests.
  // See: Vite server.fs.allow (allow files outside the workspace root).
  server: {
    fs: {
      // Allow parent and the demo folder so `../../../demo/src/assets/poster.jpg` resolves.
      allow: ["..", "demo", "packages"],
    },
  },
});
