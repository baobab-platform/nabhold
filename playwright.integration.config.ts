import { defineConfig, devices } from "@playwright/test";
import { integrationSettings } from "./scripts/integration/config";

const settings = integrationSettings(process.env);
/** Separate from the public fallback suite. Infrastructure starts the HTTPS
 * estate/issuer/CP/Redis network. Omitting webServer deliberately prevents
 * silently attaching the public HTTP dev/fallback server to a real-service run.
 * Browser CA trust must be installed in the container; never ignore TLS errors.
 */
export default defineConfig({
  testDir: "./tests/platform",
  testMatch: "**/*.spec.ts",
  globalSetup: "./tests/platform/preflight.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 60000,
  reporter: [["./tests/platform/reporter.ts"]],
  outputDir: "test-results/integration",
  preserveOutput: "never",
  use: {
    baseURL: settings.NABHOLD_OIDC_ORIGIN,
    ignoreHTTPSErrors: false,
    // Traces/HAR/screenshots can capture callback codes, cookies and passwords.
    // No storageState is exported; each test gets a fresh browser context.
    trace: "off", screenshot: "off", video: "off",
    serviceWorkers: "block",
  },
  projects: [{ name: "keycloak-identity-smoke", use: {
    ...devices["Desktop Chrome"],
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    } : undefined,
  } }],
});
