import { expect, test } from "@playwright/test";

test("visitor reaches a portfolio company", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore the group" }).click();
  await page.getByRole("link", { name: /Zuribeans/ }).click();
  await expect(page.getByRole("heading", { name: "Zuribeans" })).toBeVisible();
});

test("portfolio company page exposes basic SEO metadata", async ({ page }) => {
  await page.goto("/portfolio/zuribeans");
  await expect(page).toHaveTitle(/Zuribeans/);
});

test("insights listing renders a graceful empty state without a CMS", async ({
  page,
}) => {
  await page.goto("/insights");
  await expect(
    page.getByRole("heading", { name: /Considered views/ }),
  ).toBeVisible();
});

test("sectors listing renders", async ({ page }) => {
  await page.goto("/sectors");
  await expect(
    page.getByRole("heading", { name: "Sectors we understand." }),
  ).toBeVisible();
});

test("an unknown portfolio company returns 404", async ({ page }) => {
  const response = await page.goto("/portfolio/not-a-real-company");
  expect(response?.status()).toBe(404);
});

// SSR markup must remain valid through browser parsing and hydration. A
// successful screenshot alone would miss repaired, invalid breadcrumb trees.
for (const route of ["/portfolio", "/portfolio/zuribeans", "/insights", "/sectors", "/sign-in"]) {
  test(`public breadcrumb hydrates without errors: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("nav[aria-label=breadcrumb] li li")).toHaveCount(0);
    // Exercising the client-side drawer also proves hydration completed.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile primary" })).toBeVisible();
    expect(errors).toEqual([]);
  });
}
