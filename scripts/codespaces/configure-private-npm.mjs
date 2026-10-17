#!/usr/bin/env node
/**
 * Configure an interactive Codespace for Nabhold's privately published Shared
 * Experience packages. Neither the source repository nor the generated npmrc
 * contains a credential: pnpm 11 expands the variable at request time from a
 * **user-level** npmrc, but deliberately refuses project-level interpolation.
 *
 * Only the two approved token SOURCES are considered. A dedicated, read-only
 * Codespaces secret takes precedence over the built-in Codespaces GITHUB_TOKEN.
 * Access to the package itself must still be granted by GitHub; this helper
 * cannot create an entitlement, modify scopes or bypass pnpm supply-chain CI.
 */
import { chmodSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

const AUTH_KEY = "//npm.pkg.github.com/:_authToken";
const REGISTRY = "@baobab-platform:registry=https://npm.pkg.github.com";
const SECRET_NAME = "BAOBAB_PACKAGES_READ_TOKEN";
const tokenVariable = process.env[SECRET_NAME]
  ? SECRET_NAME
  : process.env.GITHUB_TOKEN
    ? "GITHUB_TOKEN"
    : null;

if (!tokenVariable) {
  console.error(
    "Codespaces package setup needs GITHUB_TOKEN or the BAOBAB_PACKAGES_READ_TOKEN Codespaces secret. " +
    "No credentials were saved. See README.md#github-codespaces for package permissions and setup.",
  );
  process.exitCode = 2;
} else {
  // Do not print token value, use it in a shell command, or place it in
  // application .env files. Only the literal variable placeholder is stored.
  const home = process.env.HOME || homedir();
  const npmrc = join(home, ".npmrc");
  const current = existsSync(npmrc) ? readFileSync(npmrc, "utf8") : "";
  const retained = current.split(/\r?\n/).filter((line) =>
    line.trim() &&
    !line.trim().startsWith(`${AUTH_KEY}=`) &&
    line.trim() !== REGISTRY,
  );
  retained.push(REGISTRY);
  retained.push(`${AUTH_KEY}=\${${tokenVariable}}`);

  // Atomically replace this user's private config. Avoid a short-lived
  // world-readable file even if the process has a permissive umask. Preserved
  // unrelated user registry settings are not printed to terminal or CI logs.
  let temporary = null;
  try {
    mkdirSync(dirname(npmrc), { recursive: true });
    temporary = join(home, `.${process.pid}.baobab-npmrc.tmp`);
    writeFileSync(temporary, retained.join("\n") + "\n", { mode: 0o600, flag: "wx" });
    renameSync(temporary, npmrc);
    temporary = null;
    chmodSync(npmrc, 0o600);
    console.log(
      "Private GitHub Packages auth source configured in user npmrc (credential not stored). " +
      "Package-read permission is verified by the ensuing frozen pnpm install.",
    );
  } finally {
    if (temporary) rmSync(temporary, { force: true });
  }
}
