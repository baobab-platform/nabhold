import { defineConfig, devices } from "@playwright/test";
import baseConfig from "./playwright.config";

/**
 * This suite validates explicit *development preview* fixture behavior only.
 * It cannot qualify published Payload/CMS content, IAM or staging acceptance.
 * Run after the production build's real-browser and Lighthouse gates.
 */
export default defineConfig(baseConfig, {
  testMatch: "**/portfolio-preview.spec.ts",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  use: { ...baseConfig.use, baseURL: "http://127.0.0.1:3001" },
  webServer: {
    command: "pnpm dev --hostname 127.0.0.1 --port 3001",
    url: "http://127.0.0.1:3001/api/health",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3001",
      NABHOLD_DASHBOARD_PREVIEW: "false",
      NABHOLD_CONTENT_DEV_FALLBACK: "true",
    },
  },
});
