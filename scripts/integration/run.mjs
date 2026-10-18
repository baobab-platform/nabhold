#!/usr/bin/env node
import { spawn } from "node:child_process";
import { loadIntegrationEnvironment } from "./config.ts";
import { startEvidence, finishEvidence } from "./evidence.ts";

/** The real dependency stack and HTTPS edge belong to Infrastructure. This
 * launcher cannot silently create mocks or reuse the isolated fallback server.
 * Node reads the private CA at child startup, before any OIDC HTTPS request.
 */
try {
  const mode = process.argv[2];
  if (process.argv.length !== 3 || !["check", "dev", "test"].includes(mode)) throw new Error();
  const env = loadIntegrationEnvironment();
  if (mode === "check") {
    console.log("Integration configuration valid; live services and acceptance NOT VERIFIED.");
  } else {
    // Synthetic browser credentials belong only in the browser-test process.
    const childEnv = { ...env };
    // Declared dependency pins are not runtime attestations. The clean local
    // source pin and per-run directory prevent accidental stale-result reuse.
    const evidence = mode === "test" ? startEvidence(env) : null;
    delete childEnv.NABHOLD_INTEGRATION_RUN_DIRECTORY;
    if (evidence) childEnv.NABHOLD_INTEGRATION_RUN_DIRECTORY = evidence.directory;
    if (mode === "dev") {
      delete childEnv.NABHOLD_INTEGRATION_USERNAME;
      delete childEnv.NABHOLD_INTEGRATION_PASSWORD;
      console.log("Starting integration application on private port 3000; use the configured HTTPS edge origin. Application logs suppressed to protect callback codes.");
    }
    const args = mode === "dev"
      ? ["exec", "next", "dev", "--hostname", "0.0.0.0", "--port", "3000"]
      : ["exec", "playwright", "test", "--config", "playwright.integration.config.ts"];
    const child = spawn("pnpm", args, { env: childEnv, stdio: mode === "dev" ? "ignore" : "inherit", shell: false });
    for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => child.kill(signal));
    let finished = false;
    const finish = (code) => {
      if (finished) return;
      finished = true;
      try {
        const passed = evidence ? finishEvidence(evidence, code) : code === 0;
        process.exitCode = passed ? 0 : (code || 2);
        if (evidence) console.log(`Sanitized identity-smoke receipt: ${evidence.directory}/completed/receipt.json; acceptance NOT CLAIMED.`);
      } catch {
        console.error("Integration receipt unavailable; no acceptance evidence produced.");
        process.exitCode = 2;
      }
    };
    child.once("error", () => { console.error("Integration process failed to start."); finish(2); });
    child.once("exit", finish);
  }
} catch {
  console.error("Integration configuration refused; consult docs/testing/codespaces-integration.md.");
  process.exitCode = 2;
}
