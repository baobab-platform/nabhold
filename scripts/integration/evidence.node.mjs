import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, statSync, mkdirSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { scenarios, SmokeObservations, startEvidence, writeObservations, finishEvidence } from "./evidence.ts";
import IntegrationReporter from "../../tests/platform/reporter.ts";

/** Real files and git state, synthetic observations only. These tests prove
 * that receipt mechanics cannot label missing/skipped/failed execution PASS;
 * they do not claim an IAM, CP, Redis or browser integration has run.
 */
function fixture(t) {
  const cwd = mkdtempSync(join(tmpdir(), "nabhold-evidence-test-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", args, { cwd, stdio: "ignore" });
  git("init", "-q");
  git("config", "user.email", "synthetic@example.test");
  git("config", "user.name", "Synthetic Test");
  writeFileSync(join(cwd, ".gitignore"), ".integration/\n");
  git("add", ".gitignore"); git("commit", "-qm", "synthetic fixture");
  const env = Object.fromEntries(["INFRASTRUCTURE", "IAM", "CP", "SHARED"].map(name => [`NABHOLD_INTEGRATION_${name}_SHA`, "a".repeat(40)]));
  env.NABHOLD_INTEGRATION_PASSWORD = "MUST-NOT-BE-IN-RECEIPT";
  env.NABHOLD_OIDC_ISSUER = "https://private-host.invalid/secret-tenant";
  return { cwd, env, start: () => startEvidence(env, cwd) };
}
function observations(status = "passed") {
  const value = new SmokeObservations();
  value.begin([...scenarios]);
  for (const id of scenarios) value.endTest(id, status);
  return value;
}
const receipt = run => JSON.parse(readFileSync(join(run.directory, "completed", "receipt.json"), "utf8"));

test("complete smoke keeps exact local/declared pins, private files and verifiable digest", t => {
  const f = fixture(t), run = f.start();
  writeObservations(run.directory, observations().finish(true));
  assert.equal(finishEvidence(run, 0), true);
  const bytes = readFileSync(join(run.directory, "completed", "receipt.json"), "utf8");
  const value = JSON.parse(bytes);
  assert.equal(value.outcome, "PASS");
  assert.equal(value.acceptanceClaimed, false);
  assert.equal(value.dependencyRuntimeAttested, false);
  assert.match(value.nabhold.sha, /^[a-f0-9]{40}$/);
  assert.equal(value.declaredDependencies.cp, f.env.NABHOLD_INTEGRATION_CP_SHA);
  assert.equal(value.profile, "keycloak-identity-smoke");
  assert.equal(bytes.includes(f.env.NABHOLD_INTEGRATION_PASSWORD), false);
  assert.equal(bytes.includes(f.env.NABHOLD_OIDC_ISSUER), false);
  assert.equal(readFileSync(join(run.directory, "completed", "receipt.sha256"), "utf8"), createHash("sha256").update(bytes).digest("hex") + "  receipt.json\n");
  assert.equal(statSync(run.directory).mode & 0o777, 0o700);
  for (const name of ["started.json", "observations.json", "completed/receipt.json", "completed/receipt.sha256"]) {
    assert.equal(statSync(join(run.directory, name)).mode & 0o777, 0o600);
  }
  assert.throws(() => finishEvidence(run, 0)); // Write once; no green overwrite.
  assert.notEqual(f.start().directory, run.directory);
});

for (const status of ["failed", "timedOut", "skipped", "interrupted"]) {
  test(`${status} scenario never passes even with process exit zero`, t => {
    const run = fixture(t).start();
    writeObservations(run.directory, observations(status).finish(true));
    assert.equal(finishEvidence(run, 0), false);
    assert.equal(receipt(run).observations.results[scenarios[0]], status);
  });
}
test("setup failure, missing reporter and killed process preserve incomplete outcomes", t => {
  const f = fixture(t);
  const missing = f.start();
  assert.equal(finishEvidence(missing, 0), false);
  assert.equal(receipt(missing).observations.results[scenarios[0]], "notRun");
  const setup = f.start(), value = new SmokeObservations();
  value.error(); writeObservations(setup.directory, value.finish(false));
  assert.equal(finishEvidence(setup, 1), false);
  const killed = f.start();
  writeObservations(killed.directory, observations().finish(true));
  assert.equal(finishEvidence(killed, null), false);
});
test("unexpected/duplicate scenarios, filtered suite and global errors cannot pass", t => {
  const f = fixture(t);
  for (const change of [
    o => o.begin([scenarios[0]]),
    o => o.begin([...scenarios, scenarios[0]]),
    o => o.endTest(scenarios[0], "passed"),
    o => o.endTest("secret callback URL", "passed"),
    o => o.endTest(scenarios[0], "secret credential"),
    o => o.error(),
  ]) {
    const run = f.start(), value = observations(); change(value);
    writeObservations(run.directory, value.finish(true));
    assert.equal(finishEvidence(run, 0), false);
    assert.equal(readFileSync(join(run.directory, "completed", "receipt.json"), "utf8").includes("secret"), false);
  }
});
test("arbitrary/malformed/oversized reporter payload is never copied into receipt", t => {
  const f = fixture(t);
  for (const text of ["not JSON", "x".repeat(4097), JSON.stringify({ ...observations().finish(true), error: "private callback" }),
    JSON.stringify({ complete: true, invalid: false, results: Object.fromEntries(scenarios.map(id => [id, "private password"])) })]) {
    const run = f.start();
    writeFileSync(join(run.directory, "observations.json"), text);
    assert.equal(finishEvidence(run, 0), false);
    assert.equal(readFileSync(join(run.directory, "completed", "receipt.json"), "utf8").includes("private"), false);
  }
});
test("uncommitted/untracked source and non-exact dependency refs are refused", t => {
  const f = fixture(t);
  writeFileSync(join(f.cwd, "untracked.txt"), "changed");
  assert.throws(f.start);
  rmSync(join(f.cwd, "untracked.txt"));
  for (const pin of ["main", "a".repeat(40) + "\n", ""]) {
    f.env.NABHOLD_INTEGRATION_CP_SHA = pin; assert.throws(f.start);
  }
});
test("shared/symlink evidence directories are refused", t => {
  const f = fixture(t), root = join(f.cwd, ".integration");
  mkdirSync(root, { mode: 0o755 }); assert.throws(f.start);
  rmSync(root, { recursive: true }); symlinkSync(tmpdir(), root); assert.throws(f.start);
});

test("actual reporter maps fixed annotations without serializing error/title/attachment payloads", t => {
  const f = fixture(t), run = f.start();
  const old = process.env.NABHOLD_INTEGRATION_RUN_DIRECTORY;
  process.env.NABHOLD_INTEGRATION_RUN_DIRECTORY = run.directory;
  t.after(() => {
    if (old === undefined) delete process.env.NABHOLD_INTEGRATION_RUN_DIRECTORY;
    else process.env.NABHOLD_INTEGRATION_RUN_DIRECTORY = old;
  });
  const reporter = new IntegrationReporter();
  const tests = scenarios.map(id => ({ annotations: [{ type: "nabhold-scenario", description: id }], title: "private test title" }));
  reporter.onBegin({}, { allTests: () => tests });
  for (const testCase of tests) reporter.onTestEnd(testCase, { status: "passed", error: { message: "private access token" }, attachments: ["private cookie"] });
  reporter.onEnd({ status: "passed" });
  assert.equal(finishEvidence(run, 0), true);
  assert.equal(readFileSync(join(run.directory, "completed", "receipt.json"), "utf8").includes("private"), false);
});

test("actual reporter preserves setup error and absent scenario outcomes", t => {
  const run = fixture(t).start(), reporter = new IntegrationReporter();
  const old = process.env.NABHOLD_INTEGRATION_RUN_DIRECTORY;
  process.env.NABHOLD_INTEGRATION_RUN_DIRECTORY = run.directory;
  t.after(() => {
    if (old === undefined) delete process.env.NABHOLD_INTEGRATION_RUN_DIRECTORY;
    else process.env.NABHOLD_INTEGRATION_RUN_DIRECTORY = old;
  });
  reporter.onError({ message: "private setup credentials" });
  reporter.onEnd({ status: "failed" });
  assert.equal(finishEvidence(run, 1), false);
  assert.equal(receipt(run).observations.invalid, true);
  assert.equal(receipt(run).observations.results[scenarios[3]], "notRun");
});

for (const operation of ["digest-write", "file-sync", "publish"]) {
  test(`partial finalization (${operation}) never publishes a completed PASS`, t => {
    const run = fixture(t).start();
    writeObservations(run.directory, observations().finish(true));
    const method = operation === "digest-write" ? "writeFileSync" : operation === "file-sync" ? "fsyncSync" : "renameSync";
    const original = fs[method];
    const mock = t.mock.method(fs, method, (...args) => {
      if (operation !== "digest-write" || String(args[0]).endsWith("receipt.sha256")) throw new Error("Synthetic finalization fault");
      return original(...args);
    });
    syncBuiltinESMExports();
    try {
      assert.throws(() => finishEvidence(run, 0), /Synthetic finalization fault/);
      assert.equal(fs.existsSync(join(run.directory, "completed")), false);
      assert.equal(fs.existsSync(join(run.directory, "receipt.json")), false);
    } finally { mock.mock.restore(); syncBuiltinESMExports(); }
  });
}
