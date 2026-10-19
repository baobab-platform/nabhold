import assert from "node:assert/strict";
import { test } from "node:test";
import { approvedPrivatePackages, diagnostic, runBootstrap } from "./bootstrap.mjs";

const manifest = {
  packageManager: "pnpm@11.24.0",
  dependencies: {
    "@baobab-platform/experience-tokens": "0.3.1",
    "@baobab-platform/experience-geo-core": "0.3.1",
    react: "19.3.0",
  },
};

test("all organisation dependencies require immutable versions", () => {
  assert.deepEqual(approvedPrivatePackages(manifest), [
    ["@baobab-platform/experience-geo-core", "0.3.1"],
    ["@baobab-platform/experience-tokens", "0.3.1"],
  ]);
  for (const version of ["^0.3.1", "~0.3.1", "latest", "workspace:*", "github:bad/repo"]) {
    assert.throws(() => approvedPrivatePackages({
      ...manifest,
      dependencies: { "@baobab-platform/experience-tokens": version },
    }), /exact published version/);
  }
  assert.throws(() => approvedPrivatePackages({ dependencies: { react: "1.2.3" } }), /no pinned/);
});

test("registry error classification never echoes response content", () => {
  assert.match(diagnostic(null, "HTTP 401 raw-PRIVATE-TOKEN"), /401/);
  assert.match(diagnostic(null, "HTTP 403 raw-PRIVATE-TOKEN"), /403/);
  assert.match(diagnostic(null, "ERR_PNPM_FETCH_404 raw-PRIVATE-TOKEN"), /404/);
  assert.match(diagnostic("ETIMEDOUT", "raw-PRIVATE-TOKEN"), /Network/);
  assert.ok(!diagnostic(1, "raw-PRIVATE-TOKEN").includes("raw-PRIVATE-TOKEN"));
});

function mockRun({ blockPackage = "", authStatus = 0 } = {}) {
  const calls = [], stdout = [], stderr = [];
  const executeCommand = (cmd, args) => {
    calls.push({ cmd, args: [...args] });
    if (args.some((s) => String(s).endsWith("configure-private-npm.mjs"))) return { status: authStatus };
    if (args[0] === "--version") return { status: 0, stdout: "11.24.0\n" };
    if (args[0] === "view") {
      if (String(args[1]).includes(blockPackage)) return { status: 1, stderr: "HTTP 403; SECRET-CANARY" };
      return { status: 0, stdout: "0.3.1\n" };
    }
    if (args[0] === "install") return { status: 0 };
    throw new Error("unexpected command");
  };
  return {
    calls, stdout, stderr,
    result: runBootstrap({
      executeCommand, manifestOverride: manifest, runtimeVersion: "24.21.0",
      log: (message) => stdout.push(message), fail: (message) => stderr.push(message),
    }),
  };
}

test("successful bootstrap validates exact package metadata before immutable install", () => {
  const x = mockRun();
  assert.equal(x.result, 0, x.stderr.join("\n"));
  assert.deepEqual(x.calls.map((c) => c.args[0]), [
    process.execPath.includes("node") ? x.calls[0].args[0] : "unused",
    "--version", "view", "view", "install",
  ]);
  assert.ok(x.calls[0].args[0].endsWith("configure-private-npm.mjs"));
  assert.ok(x.calls[2].args.includes("--registry"));
  assert.ok(x.calls[2].args.includes("https://npm.pkg.github.com"));
  assert.deepEqual(x.calls.at(-1).args, ["install", "--frozen-lockfile"]);
});

test("failed package access stops before install and never prints registry payload", () => {
  const x = mockRun({ blockPackage: "experience-tokens" });
  assert.equal(x.result, 3);
  assert.equal(x.calls.some((c) => c.args[0] === "install"), false);
  assert.ok(x.stderr.join("\n").includes("403"));
  assert.ok(!x.stderr.join("\n").includes("SECRET-CANARY"));
});

test("missing Codespaces credential fails closed without even contacting package metadata", () => {
  const x = mockRun({ authStatus: 2 });
  assert.equal(x.result, 2);
  assert.equal(x.calls.some((c) => c.args[0] === "view"), false);
});

test("unsupported runtimes fail before invoking credentials", () => {
  const calls = [];
  const result = runBootstrap({
    manifestOverride: manifest,
    runtimeVersion: "22.16.0",
    executeCommand: (cmd, args) => { calls.push(args); throw new Error("must not run"); },
    log: () => {}, fail: () => {},
  });
  assert.equal(result, 2);
  assert.equal(calls.length, 0);
});
