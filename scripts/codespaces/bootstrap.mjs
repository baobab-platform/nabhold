#!/usr/bin/env node
/**
 * Post-create only. Codespaces must pull the private baobab-dev image BEFORE
 * this file exists, and user-level Codespaces secrets are unavailable during
 * prebuilds. Never move this authenticated package installation back into
 * updateContentCommand/onCreateCommand.
 *
 * Two separate authorization boundaries apply:
 *   1. GHCR image: package settings -> Manage Codespaces access -> nabhold.
 *   2. GitHub npm packages: package/repository access + an actual read token.
 *
 * We invoke pnpm with a closed argument array (no shell), suppress registry
 * response/error payloads during package-access checks, and never persist or
 * print a raw token. Package versions come from the immutable manifest.
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const PINNED_PNPM = "11.24.0";
const GITHUB_REGISTRY = "https://npm.pkg.github.com";
const PACKAGE_SCOPE = "@baobab-platform/";
const VALID_VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/;
const SOURCE = fileURLToPath(import.meta.url);

export function approvedPrivatePackages(manifest) {
  const all = { ...manifest.dependencies, ...manifest.devDependencies, ...manifest.optionalDependencies };
  const entries = Object.entries(all)
    .filter(([name]) => name.startsWith(PACKAGE_SCOPE))
    .sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) throw new Error("no pinned organisation packages declared");
  for (const [name, version] of entries) {
    if (!/^@baobab-platform\/[a-z0-9][a-z0-9._-]*$/.test(name) || !VALID_VERSION.test(version)) {
      throw new Error("organisation dependency is not an exact published version");
    }
  }
  return entries;
}

export function diagnostic(status, output = "") {
  // Do not ever include response bodies/URLs/token-bearing error text in logs.
  const raw = String(output);
  if (status === "ETIMEDOUT" || /ETIMEDOUT|ENOTFOUND|ECONNRESET|EAI_AGAIN|ERR_SOCKET_TIMEOUT/i.test(raw)) {
    return "Network/DNS/TLS problem reaching GitHub Packages; check Codespaces egress and GitHub status.";
  }
  if (/\b401\b|E401|UNAUTHORIZED|NO AUTHORIZATION HEADER/i.test(raw)) {
    return "GitHub Packages authentication rejected (401). Check the injected Codespaces token and read:packages entitlement.";
  }
  if (/\b403\b|E403|FORBIDDEN/i.test(raw)) {
    return "GitHub Packages permission denied (403). Review organisation SSO and the package's Codespaces/Actions repository access.";
  }
  if (/\b404\b|E404|NOT_FOUND/i.test(raw)) {
    return "Package version not visible (404). Confirm publication, exact version and package read access; private packages may hide permission denial as 404.";
  }
  return "GitHub Packages check failed. Verify package access, the published version, registry availability and pnpm/Corepack.";
}

function execute(binary, args, options = {}) {
  return spawnSync(binary, args, {
    cwd: root, env: { ...process.env, CI: "true" }, timeout: 60000,
    encoding: "utf8", maxBuffer: 128 * 1024, ...options,
  });
}

export function runBootstrap({ executeCommand = execute, log = console.log, fail = console.error } = {}) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    if (manifest.packageManager !== `pnpm@${PINNED_PNPM}`) {
      throw new Error("manifest pnpm version differs from the reviewed Codespaces baseline");
    }
    const major = Number(process.versions.node.split(".")[0]);
    if (major !== 24 || Number(process.versions.node.split(".")[1]) < 19) {
      throw new Error("Node 24.19+ is required; use the reviewed baobab-dev frontend image");
    }
  } catch (error) {
    fail(`Codespaces bootstrap: invalid pinned toolchain/manifest: ${error.message}`);
    return 2;
  }

  const configured = executeCommand(process.execPath, [join(root, "scripts/codespaces/configure-private-npm.mjs")]);
  if (configured.error || configured.status !== 0) {
    fail("Codespaces bootstrap: no usable package token. Configure BAOBAB_PACKAGES_READ_TOKEN (read:packages) or authorize GITHUB_TOKEN for these packages.");
    return 2;
  }
  const version = executeCommand("pnpm", ["--version"]);
  if (version.error || version.status !== 0 || version.stdout.trim() !== PINNED_PNPM) {
    fail("Codespaces bootstrap: incorrect pnpm version (required 11.24.0). Inspect the pinned baobab-dev image/Corepack configuration.");
    return 2;
  }
  let packages;
  try {
    packages = approvedPrivatePackages(manifest);
  } catch (error) {
    fail(`Codespaces bootstrap: ${error.message}`);
    return 2;
  }

  for (const [name, version] of packages) {
    const result = executeCommand("pnpm", ["view", `${name}@${version}`, "version", "--registry", GITHUB_REGISTRY]);
    if (result.error || result.status !== 0 || result.stdout.trim().replace(/^"|"$/g, "") !== version) {
      fail(`Codespaces bootstrap: ${name}@${version}: ${diagnostic(result.error?.code, result.stderr)}`);
      fail("Check baobab-platform package settings -> Manage Codespaces access -> nabhold, plus Shared repository read/packages permission. No token was printed.");
      return 3;
    }
    log(`Verified org package read: ${name}@${version}`);
  }

  log("Verified GitHub Packages access; installing exact pnpm lockfile.");
  const installed = executeCommand("pnpm", ["install", "--frozen-lockfile"], {
    timeout: 15 * 60 * 1000, stdio: "inherit",
  });
  if (installed.error || installed.status !== 0) {
    fail("Codespaces bootstrap: locked package installation failed; review the pnpm error above (no bypass of package access or lockfile integrity).");
    return 4;
  }
  log("Codespaces dependency bootstrap completed; package versions remain lockfile-pinned.");
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === SOURCE) {
  process.exitCode = runBootstrap();
}
