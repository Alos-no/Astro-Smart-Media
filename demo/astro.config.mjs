import { defineConfig } from "astro/config";

/**
 * Vite needs to resolve dependencies imported by linked workspace packages
 * located outside the demo's project root (e.g. packages/astro-media).
 * We expand the allowed filesystem roots and force pre-bundling of `hls.js`.
 *
 * References:
 *  - server.fs.allow / searchForWorkspaceRoot: https://vite.dev/config/server-options#server-fs-allow
 *  - optimizeDeps.include for linked deps: https://vite.dev/config/dep-optimization-options#optimizedeps-include
 *  - preserveSymlinks for monorepos: https://vite.dev/config/shared-options#resolve-preservesymlinks
 */
export default defineConfig({
  vite: {
    resolve: {
      // Helpful in monorepos with symlinked packages.
      preserveSymlinks: false,
    },
    server: {
      fs: {
        // Auto-detect typical monorepo roots (pnpm/yarn workspaces).
        searchForWorkspaceRoot: true,

        // Explicitly allow reading from the workspace root & packages.
        // Adjust these if your repo layout changes.
        allow: [
          "..", // parent (workspace root)
          "../packages", // linked package sources
          "../node_modules", // dependencies installed at workspace root
          "../../", // safety net for nested setups
        ],
      },
    },
    optimizeDeps: {
      // Force hls.js to be pre-bundled even when imported from a linked package
      // or via dynamic import. This avoids "failed to resolve import" during analysis.
      include: ["hls.js"],
    },
  },
});
