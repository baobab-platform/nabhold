import { expect, test } from "@playwright/test";

test("Nabhold corporate routes publish correct canonical and social metadata", async ({ page }) => {
  for (const route of ["/", "/portfolio", "/markets", "/governance"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    const href = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(href, "Canonical at " + route).not.toBeNull();
    const canonical = new URL(href!, page.url());
    expect(canonical.origin, route).toBe(new URL(page.url()).origin);
    expect(canonical.pathname, route).toBe(route);
    const openGraphTitle = page.locator('meta[property="og:title"]');
    await expect(openGraphTitle, route).toHaveAttribute("content", /Nabhold/i);
    await expect(page).toHaveTitle(/Nabhold/i);
  }
});

test("robots and sitemap separate public institutional content from protected surfaces", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const policy = await robots.text();
  for (const restricted of ["/account", "/api/", "/dashboard", "/sign-in"]) {
    expect(policy, "robots: " + restricted).toContain("Disallow: " + restricted);
  }

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const publicPath of ["/portfolio", "/sectors", "/insights", "/about/group"]) {
    expect(xml).toContain("http://127.0.0.1:3000" + publicPath);
  }
  for (const restricted of ["/account", "/api/", "/dashboard", "/sign-in"]) {
    expect(xml).not.toContain("http://127.0.0.1:3000" + restricted);
  }
});
