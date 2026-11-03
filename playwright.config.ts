import { defineConfig, devices } from "@playwright/test";

const allowedEvidence = new Set(["functional", "accessibility", "visual", "lighthouse"]);
const evidenceGate =
  process.env.CI && allowedEvidence.has(process.env.DEV11_EVIDENCE_GATE ?? "")
    ? process.env.DEV11_EVIDENCE_GATE
    : undefined;

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
  reporter: evidenceGate
    ? [
        ["list"],
        ["html", { open: "never", outputFolder: `playwright-report/dev11-${evidenceGate}` }],
        ["json", { outputFile: `reports/dev11-${evidenceGate}-playwright.json` }],
      ]
    : process.env.CI
      ? [["list"], ["html", { open: "never" }]]
      : "list",
  ...(evidenceGate ? { outputDir: `test-results/dev11-${evidenceGate}` } : {}),
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
      // Production public gates refuse previews; only the explicit separate
      // preview configuration enables the labelled development fixture.
      NABHOLD_CONTENT_DEV_FALLBACK: "false",
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
