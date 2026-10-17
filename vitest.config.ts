import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({ esbuild: { jsx: "automatic" }, test: { environment: "jsdom", setupFiles: ["./src/test/setup.ts"], exclude: ["tests/e2e/**", "tests/integration/**", "node_modules/**"] }, resolve: { alias: { "@": path.resolve(__dirname, "src") } } });
