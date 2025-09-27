import type { Page, TestInfo } from "@playwright/test";

export function attachBrowserLogging(page: Page, testInfo: TestInfo): void {
  const lines: string[] = [];
  page.on("console", (msg) => lines.push(`[console.${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => lines.push(`[pageerror] ${err.message}`));
  page.on("requestfailed", (req) =>
    lines.push(`[requestfailed] ${req.failure()?.errorText ?? "unknown"} ${req.url()}`),
  );
  page.on("response", (resp) => lines.push(`[response] ${resp.status()} ${resp.url()}`));
  testInfo.attach("browser.log", { body: lines.join("\n"), contentType: "text/plain" }).catch(() => {});
}
