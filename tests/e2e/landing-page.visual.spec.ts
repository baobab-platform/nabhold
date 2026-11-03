import { expect, test } from "@playwright/test";

/**
 * Layout regressions block the PR immediately. Diagnostic pixel captures are
 * retained for independent review; new baselines must never be self-approved
 * by CI. Existing Africa map golden images remain pixel-comparison gates.
 */
const viewports = [
  { name: "320", width: 320, height: 640 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 900 },
  { name: "1440", width: 1440, height: 1000 },
] as const;

test.describe("institutional landing-page visual acceptance", () => {
  test.setTimeout(90_000);
  for (const viewport of viewports) {
    test("hero, portfolio and group structure at " + viewport.name + "px", async ({ page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const response = await page.goto("/", { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      const heading = page.locator("#home-hero-heading");
      await expect(heading).toBeVisible();
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("heading", { name: "Three mandates. Distinct possibilities." })).toBeVisible();
      await expect(page.getByRole("link", { name: "View portfolio" })).toBeVisible();
      await expect(page.locator('[aria-label="Nabhold enterprise and platform themes"]')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const hero = document.querySelector("#home-hero-heading")?.getBoundingClientRect();
        const masthead = document.querySelector("header")?.getBoundingClientRect();
        return {
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: innerWidth,
          headingLeft: hero?.left ?? -1,
          headingRight: hero?.right ?? 1e9,
          headingTop: hero?.top ?? -1,
          headingHeight: hero?.height ?? 0,
          headerBottom: masthead?.bottom ?? 0,
        };
      });
      expect(layout.scrollWidth, "No horizontal scroll at " + viewport.name).toBeLessThanOrEqual(layout.viewportWidth + 1);
      expect(layout.headingLeft).toBeGreaterThanOrEqual(0);
      expect(layout.headingRight).toBeLessThanOrEqual(viewport.width + 1);
      expect(layout.headingHeight).toBeGreaterThan(20);
      expect(layout.headingTop).toBeGreaterThanOrEqual(layout.headerBottom - 2);
      // Public-only screenshots support review, not an unreviewed golden update.
      await testInfo.attach("nabhold-landing-" + viewport.name, {
        body: await page.screenshot({ fullPage: true, animations: "disabled", caret: "hide" }),
        contentType: "image/png",
      });
    });
  }
});
