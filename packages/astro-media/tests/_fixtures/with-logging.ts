import { test as base, expect } from "@playwright/test";

/**
 * Centralized, low-noise logging for all Playwright tests.
 *
 * Behavior:
 *  - Hooks into console, pageerror, requestfailed, and response events on the Page.
 *  - Buffers lines in-memory per test.
 *  - Attaches "browser.log" ONLY when the test failed, or when PW_ATTACH_LOGS=1.
 *  - Filters responses to status >= 400 to avoid noise.
 *
 * References:
 *  - Playwright "automatic fixtures" via test.extend(..., { auto: true }): ensures the fixture runs even if unused. See docs.
 *  - testInfo.attach for per-test artifacts (kept out of stdout). See docs.
 *  - Page event APIs: console/pageerror/requestfailed/response. See docs.
 */

type LogCollector = { lines: string[] };

export const test = base.extend<{
  _logCollector: LogCollector;
}>({
  // Auto-start a per-test collector.
  _logCollector: [
    async ({}, use) => {
      await use({ lines: [] });
    },
    { auto: true },
  ],

  // Wrap Playwright's "page" to attach listeners and attach logs at the end.
  page: async ({ page, _logCollector }, use, testInfo) => {
    const push = (line: string): void => {
      // Timestamp each line for easier correlation across concurrent tests.
      const ts = new Date().toISOString();
      _logCollector.lines.push(`${ts} ${line}`);
    };

    // Console logs from the page (includes our SmartVideo info paths).
    page.on("console", (msg) => {
      // Avoid repeating stack traces here; attachments are for triage.
      // The test itself can still assert on console messages if it wants to.
      push(`[console.${msg.type()}] ${msg.text()}`);
    });

    // Uncaught errors in the page context.
    page.on("pageerror", (err) => {
      push(`[pageerror] ${err.message}`);
    });

    // Failed requests (network layer).
    page.on("requestfailed", (req) => {
      const failure = req.failure()?.errorText ?? "unknown";
      push(`[requestfailed] ${failure} ${req.method()} ${req.url()}`);
    });

    // Responses: only record HTTP errors (>=400) to reduce noise.
    page.on("response", (resp) => {
      const status = resp.status();
      if (status >= 400) {
        push(`[response] ${status} ${resp.url()}`);
      }
    });

    await use(page);

    // Attach the log ONLY on failure (or explicit opt-in for all via PW_ATTACH_LOGS=1).
    const shouldAttach =
      _logCollector.lines.length > 0 && (testInfo.status !== "passed" || process.env.PW_ATTACH_LOGS === "1");

    if (shouldAttach) {
      await testInfo.attach("browser.log", {
        body: _logCollector.lines.join("\n"),
        contentType: "text/plain",
      });
    }
  },
});

export { expect };
