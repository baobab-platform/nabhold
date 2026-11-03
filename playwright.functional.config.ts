import { defineConfig } from "@playwright/test";
import publicConfig from "./playwright.config";

/** Separate diagnostics from functional journeys so an accessibility, visual
 * or throttled lab failure has its own required CI gate and evidence. */
export default defineConfig(publicConfig, {
  testIgnore: [
    "**/*.visual.spec.ts",
    "**/*.accessibility.spec.ts",
    "**/performance-budget.spec.ts",
    "**/portfolio-preview.spec.ts",
  ],
});
