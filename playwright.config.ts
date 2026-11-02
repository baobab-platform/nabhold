import { defineConfig, devices } from "@playwright/test";

/**
 * Public, fixture-labelled experience tests only. Never use this configuration
 * for IAM/CP credentialed acceptance; that stays in playwright.integration.config.
 *
 * Preserve the "chromium" project name for approved Africa map pixel baselines.
 * The five profiles exercise desktop and touch-browser behavior independently.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    // CI measures and tests the same built output. Dev/HMR can change pixels
    // mid-run and distort Lighthouse and accessibility results.
    command: `pnpm ${process.env.CI ? "start" : "dev"} --hostname 127.0.0.1`,
    url: "http://127.0.0.1:3000/api/health",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
      NABHOLD_DASHBOARD_PREVIEW: "false",
      // Read-only editorial fixture, visibly labelled, never CMS acceptance.
      NABHOLD_CONTENT_DEV_FALLBACK: "true",
    },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox-desktop", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit-desktop", use: { ...devices["Desktop Safari"] } },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"] } },
    { name: "webkit-mobile", use: { ...devices["iPhone 15"] } },
  ],
});
