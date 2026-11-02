import { expect, test } from "@playwright/test";

/** Preview data is explicitly non-authoritative and refused in production.
 * Keep this journey out of real CMS publication and production lab claims. */
test("development-only portfolio fixture is visibly labelled", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View portfolio" }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByText(/Development preview data only/)).toBeVisible();
  await page.getByRole("link", { name: /Zuribeans/ }).click();
  await expect(page).toHaveURL(/\/portfolio\/zuribeans$/);
  await expect(page.getByRole("heading", { level: 1, name: "Zuribeans", exact: true })).toBeVisible();
});

test("development fixture carries portfolio company metadata", async ({ page }) => {
  await page.goto("/portfolio/zuribeans");
  await expect(page).toHaveTitle(/Zuribeans/);
});
