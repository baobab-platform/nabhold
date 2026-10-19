/** Static, offline devcontainer security and lifecycle contract.
 * This runs in prebuilds and CI before any private-package credentials exist.
 * It cannot establish package permissions or prove an image pull succeeded.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const devcontainer = JSON.parse(readFileSync(resolve(root, ".devcontainer/devcontainer.json"), "utf8"));
const app = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));

test("Codespaces uses reviewed organization GHCR image with no insecure fallback", () => {
  assert.equal(devcontainer.image, "ghcr.io/baobab-platform/baobab-dev:1.4.4-frontend");
  assert.equal(devcontainer.remoteUser, "vscode");
  assert.equal(devcontainer.init, true);
  assert.equal(devcontainer.updateRemoteUserUID, true);
  assert.equal("privileged" in devcontainer, false);
  assert.equal("overrideCommand" in devcontainer, false);
  assert.equal("build" in devcontainer, false);
  assert.deepEqual(devcontainer.forwardPorts, [3000]);
  assert.equal(devcontainer.portsAttributes["3000"].visibility, "private");
  assert.equal(devcontainer.otherPortsAttributes.visibility, "private");
  assert.equal(devcontainer.containerEnv.COREPACK_ENABLE_DOWNLOAD_PROMPT, "0");
  assert.equal(app.packageManager, "pnpm@11.24.0");
  assert.equal(app.engines.node, ">=24.19.0 <25");
});

test("repository token asks only for explicitly approved organization package sources", () => {
  const permissions = devcontainer.customizations.codespaces.repositories;
  assert.deepEqual(Object.keys(permissions).sort(), [
    "baobab-platform/baobab-dev",
    "baobab-platform/shared",
  ]);
  for (const entry of Object.values(permissions)) {
    assert.deepEqual(entry, { permissions: { contents: "read", packages: "read" } });
  }
  assert.ok(!Object.keys(permissions).some((key) => key.includes("*")));
  const config = JSON.stringify(devcontainer);
  assert.ok(!config.includes("write-all"));
  assert.ok(!config.includes("InsecureSkipVerify"));
  assert.equal("GITHUB_TOKEN" in devcontainer.containerEnv, false);
  assert.equal("BAOBAB_PACKAGES_READ_TOKEN" in devcontainer.containerEnv, false);
});

test("prebuild stays offline and does not require private npm user secrets", () => {
  assert.equal(devcontainer.waitFor, "updateContentCommand");
  assert.match(devcontainer.updateContentCommand, /^node --test scripts\/codespaces\/\*\.node\.mjs$/);
  assert.doesNotMatch(devcontainer.updateContentCommand, /pnpm install|npm ci|configure-private-npm\.mjs/);
  assert.match(devcontainer.postCreateCommand, /node scripts\/codespaces\/bootstrap\.mjs/);
  assert.match(devcontainer.postStartCommand, /configure-private-npm\.mjs/);
  assert.equal("onCreateCommand" in devcontainer, false);
});

test("committed npmrc contains only a non-sensitive scope mapping", () => {
  const projectNpmrc = readFileSync(resolve(root, ".npmrc"), "utf8");
  assert.equal(projectNpmrc.trim(), "@baobab-platform:registry=https://npm.pkg.github.com");
  assert.ok(!/authToken|password|Bearer|GITHUB_TOKEN|NODE_AUTH_TOKEN/i.test(projectNpmrc));
});
