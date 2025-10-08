import { copyFileSync, unlinkSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Usage:
 *   node scripts/sync-readme.mjs copy packages/astro-media
 *   node scripts/sync-readme.mjs clean packages/astro-media
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [, , action, pkgDirArg] = process.argv;
if (!action || !pkgDirArg) {
  console.error("Usage: node scripts/sync-readme.mjs <copy|clean> <package-dir>");
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, "..");
const pkgDir = path.resolve(repoRoot, pkgDirArg);
const src = path.join(repoRoot, "README.md");
const dest = path.join(pkgDir, "README.md");

if (action === "copy") {
  copyFileSync(src, dest);
  console.log(`README copied: ${path.relative(repoRoot, src)} -> ${path.relative(repoRoot, dest)}`);
} else if (action === "clean") {
  if (existsSync(dest)) {
    unlinkSync(dest);
    console.log(`README removed: ${path.relative(repoRoot, dest)}`);
  }
} else {
  console.error("First arg must be 'copy' or 'clean'");
  process.exit(1);
}
