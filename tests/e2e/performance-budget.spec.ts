import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const exec = promisify(execFile);
async function findChromium(directory: string): Promise<string | null> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const candidate = join(directory, entry.name);
    if (entry.isFile() && ["chrome", "headless_shell"].includes(entry.name)) return candidate;
    if (entry.isDirectory()) {
      const nested = await findChromium(candidate);
      if (nested) return nested;
    }
  }
  return null;
}

test("approved public routes meet isolated production-build Lighthouse lab budgets", async ({ page }, info) => {
  test.skip(!process.env.CI, "CI lab only; requires approved browser image and built server");
  test.setTimeout(210_000);
  await page.goto("/");
  const chrome = await findChromium(process.env.PLAYWRIGHT_BROWSERS_PATH || "/root/.cache/ms-playwright");
  expect(chrome, "A synchronized Chromium binary must exist").toBeTruthy();
  for (const [name, route] of [["home", "/"], ["markets", "/markets"]] as const) {
    const output = info.outputPath("lighthouse-" + name + ".json");
    await exec("lighthouse", [
      "http://127.0.0.1:3000" + route,
      "--quiet", "--output=json", "--output-path=" + output,
      "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage",
      "--only-categories=performance,accessibility,best-practices,seo",
    ], { env: { ...process.env, CHROME_PATH: chrome! }, timeout: 90_000, maxBuffer: 4_000_000 });
    const report = JSON.parse(await readFile(output, "utf8"));
    await info.attach("lighthouse-" + name, { path: output, contentType: "application/json" });
    const scores = Object.fromEntries(
      Object.entries(report.categories).map(([key, raw]) => [
        key, Math.round((raw as { score: number }).score * 100),
      ]),
    );
    const scripts = (report.audits["resource-summary"].details.items as Array<{ resourceType: string; transferSize: number }>)
      .find((item) => item.resourceType === "script");
    expect(scripts, route + " Lighthouse script measurement").toBeDefined();
    const cls = report.audits["cumulative-layout-shift"].numericValue as number;
    const lcp = report.audits["largest-contentful-paint"].numericValue as number;
    console.log(JSON.stringify({ profile: "CI_LAB_PRODUCTION_BUILD", route, scores,
      transferredJavaScript: scripts!.transferSize, lcp, cls }));
    expect(scripts!.transferSize, route + " transferred JS bytes").toBeLessThanOrEqual(250 * 1024);
    expect(scores.performance, route).toBeGreaterThanOrEqual(90);
    for (const category of ["accessibility", "best-practices", "seo"]) {
      expect(scores[category], route + " " + category).toBeGreaterThanOrEqual(95);
    }
    expect(cls, route + " CLS").toBeLessThanOrEqual(0.1);
    // Single-run LCP is a diagnostic: it must never be called field p75.
  }
});
