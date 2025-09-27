import { defineConfig } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 5178);

export default defineConfig({
  // Look for Playwright E2E files under the package. (Previously: "./tests")
  testDir: "./packages/astro-media/tests",

  // Only pick up Playwright E2E specs; Vitest handles *.test.ts separately.
  testMatch: "**/*.spec.ts",

  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    // Force Astro dev to the same port Playwright is waiting on.
    command: `pnpm dev --port ${PORT} --host`,
    cwd: "./demo",

    // Prefer 'port' over 'url' so PW waits for 127.0.0.1:<port> and auto-sets baseURL.
    port: PORT,

    // Give Astro a little more time on cold starts / first install.
    timeout: 60 * 1000,

    // Helpful locally; CI will always start a fresh server.
    reuseExistingServer: !process.env.CI,

    // Pipe output so DEBUG=pw:webserver isn't your only visibility tool.
    stdout: "pipe",
    stderr: "pipe",
  },

  // Projects: Chromium/Firefox/WebKit run "normal" specs; the autoplay-policy spec
  // runs only in the special Chromium project.
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
      grepInvert: /@autoplay-policy/,
    },
    {
      name: "firefox",
      use: { browserName: "firefox" },
      grepInvert: /@autoplay-policy/,
    },
    {
      name: "webkit",
      use: { browserName: "webkit" },
      grepInvert: /@autoplay-policy/,
    },
    {
      // Forces user-gesture requirement so the video.play() promise rejects,
      // exercising our "mute and retry" logic path.
      name: "chromium-autoplay-blocked",
      use: {
        browserName: "chromium",
        launchOptions: { args: ["--autoplay-policy=document-user-activation-required"] },
      },
      grep: /@autoplay-policy/,
    },
  ],
});
