import { createRequire } from "node:module";
import { resolve } from "node:path";
import type { AxeResults } from "axe-core";
const require = createRequire(resolve(process.cwd(), "package.json"));
import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`map selection has an equivalent country-list control at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/markets/map");
    if (width >= 1024) await expect(page.getByRole("link", { name: "Executive login", exact: true })).toHaveCSS("color", "rgb(255, 255, 255)");
    const countries = page.getByRole("list", { name: "Mapped countries and territories" });
    await expect(countries.getByRole("button")).toHaveCount(51);
    const search = page.getByRole("searchbox", { name: "Find a mapped country or territory" });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    await expect(page).toHaveScreenshot(`africa-footprint-${width}.png`, { fullPage: true, animations: "disabled", maxDiffPixelRatio: 0.001 });
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const report = await page.evaluate(async () => {
      const axe = (window as unknown as { axe: { run: (node: Element, options: unknown) => Promise<AxeResults> } }).axe;
      return axe.run(document.body, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } });
    });
    expect(report.violations).toEqual([]);
    await search.fill("Angola");
    const angola = countries.getByRole("button", { name: "Angola", exact: true });
    await angola.focus();
    await page.keyboard.press("Enter");
    await expect(angola).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", { name: "Angola", exact: true })).toBeVisible();
    await expect(page.getByText(/Absence of a statement is not an assertion of inactivity/)).toBeVisible();
    await search.fill("not-a-country");
    await expect(page.getByRole("status")).toContainText("No mapped country");
    await expect(page.getByRole("link", { name: "Natural Earth", exact: true })).toBeVisible();
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
