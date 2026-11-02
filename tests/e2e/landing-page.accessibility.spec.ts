import { createRequire } from "node:module";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";
import type { AxeResults } from "axe-core";

const require = createRequire(resolve(process.cwd(), "package.json"));
const routes = ["/", "/portfolio", "/markets", "/governance", "/sign-in"];

test.describe("Nabhold public WCAG 2.2 AA accessibility", () => {
  test.setTimeout(180_000);
  test("representative anonymous pages have no automated axe violations", async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        const response = await page.goto(route, { waitUntil: "domcontentloaded" });
        expect(response?.status(), route).toBe(200);
        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
        const violations = await page.evaluate(async () => {
          const axe = (window as unknown as {
            axe: { run: (node: Element, options: unknown) => Promise<AxeResults> };
          }).axe;
          const results = await axe.run(document.body, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
          });
          return results.violations.map((v) => ({
            rule: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
          }));
        });
        expect(violations, "WCAG violations on " + route + " at " + width + "px").toEqual([]);
      }
    }
  });

  test("keyboard skip link is visible and activates the main landmark", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("executive sign-in offers only governed identity provider handoff", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("button", { name: "Continue with Baobab IAM" })).toBeDisabled();
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  });
});
