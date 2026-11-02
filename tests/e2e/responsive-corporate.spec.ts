import { expect, test } from "@playwright/test";

test("public holding-company routes preserve semantics and viewport constraints", async ({ page }) => {
  for (const route of ["/", "/about/group", "/governance", "/investment", "/portfolio",
    "/sectors", "/markets", "/platform", "/insights", "/intelligence", "/contact", "/sign-in"]) {
    const response = await page.goto(route);
    expect(response?.status(), "Status at " + route).toBe(200);
    await expect(page.getByRole("main"), route).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 }), route).toHaveCount(1);
    await expect(page.locator('a[href="#main"]'), route).toHaveCount(1);
  }
});

test("enterprise navigation remains usable on desktop and mobile", async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow, "Horizontal overflow at " + width + "px").toBeLessThanOrEqual(1);
    if (width < 1024) {
      await page.getByRole("button", { name: "Open menu" }).click();
      const navigation = page.getByRole("navigation", { name: "Mobile primary" });
      await expect(navigation).toBeVisible();
      await expect(navigation.getByRole("link", { name: "Our Group", exact: true })).toBeVisible();
      await expect(navigation.getByRole("link", { name: "Executive portal" })).toBeVisible();
      await navigation.getByRole("link", { name: "Our Group", exact: true }).click();
      await expect(page).toHaveURL(/\/about\/group$/);
    } else {
      const navigation = page.getByRole("navigation", { name: "Primary", exact: true });
      await expect(navigation).toBeVisible();
      await navigation.getByRole("link", { name: "Insights", exact: true }).click();
      await expect(page).toHaveURL(/\/insights$/);
    }
  }
});

test("portfolio is a group gateway, not a direct checkout", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View portfolio" }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: /checkout|place order/i })).toHaveCount(0);
});

test("unknown portfolio and private routes fail without publicly exposing authority", async ({ request }) => {
  expect((await request.get("/portfolio/not-a-real-company")).status()).toBe(404);
  expect((await request.get("/dashboard", { maxRedirects: 0 })).status()).toBe(404);
  expect((await request.post("/api/auth/login", { maxRedirects: 0 })).status()).toBe(404);
});
