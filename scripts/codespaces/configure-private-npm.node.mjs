/**
 * Codespaces auth tests must never contain a live credential or perform a
 * network fetch. They test only the on-disk user-config contract and failures.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./configure-private-npm.mjs", import.meta.url));

function run(env, seed = "") {
  const home = mkdtempSync(join(tmpdir(), "nabhold-codespaces-auth-"));
  if (seed) writeFileSync(join(home, ".npmrc"), seed);
  const result = spawnSync(process.execPath, [script], {
    encoding: "utf8",
    env: {
      HOME: home,
      PATH: process.env.PATH || "",
      CODESPACES: "true",
      ...env,
    },
  });
  return { home, result, read: () => readFileSync(join(home, ".npmrc"), "utf8") };
}

test("Codespaces GITHUB_TOKEN uses a placeholder, not a stored secret", () => {
  const fixture = run({
    GITHUB_TOKEN: "synthetic-temporary-repo-token",
    BAOBAB_PACKAGES_READ_TOKEN: "",
  });
  try {
    assert.equal(fixture.result.status, 0, fixture.result.stderr);
    const config = fixture.read();
    assert.match(config, /@baobab-platform:registry=https:\/\/npm\.pkg\.github\.com/);
    assert.ok(config.includes('//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}'));
    assert.ok(!config.includes("synthetic-temporary-repo-token"));
    assert.equal(statSync(join(fixture.home, ".npmrc")).mode & 0o077, 0);
    assert.ok(!fixture.result.stdout.includes("synthetic-temporary-repo-token"));
  } finally {
    rmSync(fixture.home, { recursive: true, force: true });
  }
});

test("A dedicated read-only Codespaces package secret takes precedence", () => {
  const fixture = run({
    GITHUB_TOKEN: "synthetic-built-in",
    BAOBAB_PACKAGES_READ_TOKEN: "synthetic-read-only",
  }, "registry=https://registry.npmjs.org\ncustom-setting=true\n");
  try {
    assert.equal(fixture.result.status, 0, fixture.result.stderr);
    const config = fixture.read();
    assert.ok(config.includes('//npm.pkg.github.com/:_authToken=${BAOBAB_PACKAGES_READ_TOKEN}'));
    assert.ok(!config.includes("synthetic-built-in"));
    assert.ok(!config.includes("synthetic-read-only"));
    assert.ok(config.includes("custom-setting=true"));
  } finally {
    rmSync(fixture.home, { recursive: true, force: true });
  }
});

test("Reconfiguration removes old GitHub token lines and remains idempotent", () => {
  const fixture = run({
    GITHUB_TOKEN: "synthetic-temporary-repo-token",
    BAOBAB_PACKAGES_READ_TOKEN: "",
  }, "//npm.pkg.github.com/:_authToken=synthetic-old-expired-token\n");
  try {
    assert.equal(fixture.result.status, 0, fixture.result.stderr);
    const config = fixture.read();
    assert.ok(!config.includes("synthetic-old-expired-token"));
    const second = spawnSync(process.execPath, [script], {
      encoding: "utf8",
      env: {
        HOME: fixture.home,
        PATH: process.env.PATH || "",
        GITHUB_TOKEN: "synthetic-new-token",
        BAOBAB_PACKAGES_READ_TOKEN: "",
        CODESPACES: "true",
      },
    });
    assert.equal(second.status, 0, second.stderr);
    assert.equal(fixture.read(), config);
    assert.equal(fixture.read().split("//npm.pkg.github.com/:_authToken=").length - 1, 1);
  } finally {
    rmSync(fixture.home, { recursive: true, force: true });
  }
});

test("Absence of a token fails closed without writing an npmrc", () => {
  const fixture = run({ GITHUB_TOKEN: "", BAOBAB_PACKAGES_READ_TOKEN: "" });
  try {
    assert.equal(fixture.result.status, 2);
    assert.match(fixture.result.stderr, /Codespaces package setup needs/);
    assert.equal(existsSync(join(fixture.home, ".npmrc")), false);
  } finally {
    rmSync(fixture.home, { recursive: true, force: true });
  }
});
