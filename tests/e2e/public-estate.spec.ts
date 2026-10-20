import { expect, test } from "@playwright/test";

test("visitor reaches a portfolio company", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View portfolio" }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await page.getByRole("link", { name: /Zuribeans/ }).click();
  await expect(page).toHaveURL(/\/portfolio\/zuribeans$/);
  await expect(page.getByRole("heading", { level: 1, name: "Zuribeans", exact: true })).toBeVisible();
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

// ADR-SHARED-040: the public layout, not a leaf page, owns the one main
// landmark. Multiple landmarks confuse skip links and assistive technology.
for (const route of ["/", "/markets", "/markets/map"]) {
  test(`public page has exactly one skip target and main landmark: ${route}`, async ({ page }) => {
    await page.goto(route);
    const main = page.getByRole("main");
    await expect(main).toHaveCount(1);
    await expect(main).toHaveAttribute("id", "main");
    await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('a[href="#main"]')).toHaveCount(1);
  });
}

// A sign-in-only CSP exception must be installed by a new document, not RSC.
// These source/UI tests exercise navigation even while IAM is disabled; the
// separate real-component smoke owns the credentialed federation assertions.
for (const width of [1280, 390]) {
  test(`executive sign-in loads a fresh document at width ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/contact");
    const documentResponse = page.waitForResponse(response => response.request().isNavigationRequest() &&
      new URL(response.url()).pathname === "/sign-in");
    if (width >= 1024) {
      await page.getByRole("banner").getByRole("link", { name: "Executive login", exact: true }).click();
    } else {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("navigation", { name: "Mobile primary" }).getByRole("link", { name: "Executive portal", exact: true }).click();
    }
    expect((await documentResponse).status()).toBe(200);
    await expect(page).toHaveURL(/\/sign-in$/);
    await expect(page.getByRole("heading", { level: 1, name: "Executive portal", exact: true })).toBeVisible();
  });
}
