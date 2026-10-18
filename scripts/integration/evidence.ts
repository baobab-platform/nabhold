import { createHash, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, lstatSync, writeFileSync, readFileSync, openSync, closeSync, fsyncSync, renameSync } from "node:fs";
import { join } from "node:path";

/** Estate-local G17 observations, not a Shared contract or an acceptance
 * decision. Only these fixed identifiers/statuses cross the reporter boundary.
 * Never serialize Playwright errors, titles, attachments, URLs or test values.
 */
export const scenarios = ["NAB-ID-01", "NAB-ID-02", "NAB-ID-03", "NAB-ID-04"] as const;
const statuses = ["passed", "failed", "timedOut", "skipped", "interrupted", "notRun"] as const;
type Status = typeof statuses[number];
type Scenario = typeof scenarios[number];
type Observations = { complete: boolean; invalid: boolean; results: Record<Scenario, Status> };
const empty = (): Observations => ({ complete: false, invalid: false,
  results: Object.fromEntries(scenarios.map(id => [id, "notRun"])) as Record<Scenario, Status> });

export class SmokeObservations {
  private value = empty();
  begin(ids: unknown[]) {
    if (ids.length !== scenarios.length || scenarios.some(id => ids.filter(v => v === id).length !== 1)) this.value.invalid = true;
  }
  endTest(id: unknown, status: unknown) {
    if (!scenarios.includes(id as Scenario) || !statuses.includes(status as Status) || status === "notRun" ||
        this.value.results[id as Scenario] !== "notRun") { this.value.invalid = true; return; }
    this.value.results[id as Scenario] = status as Status;
  }
  error() { this.value.invalid = true; }
  finish(passed: boolean) { this.value.complete = passed; return structuredClone(this.value); }
}

/** The runner owns the directory and final receipt. A reporter crash, setup
 * error or killed child cannot leave a previous green run masquerading as this
 * run: every invocation gets a fresh private directory and write-once files.
 * Dependency SHAs are operator declarations, not remote runtime attestation.
 */
export function startEvidence(env: Record<string, string | undefined>, cwd = process.cwd()) {
  const git = (args: string[]) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  const sha = git(["rev-parse", "HEAD"]);
  if (!/^[a-f0-9]{40}$/.test(sha) || git(["status", "--porcelain", "--untracked-files=normal"])) throw new Error("Unpinned source");
  const pins: Record<string, string> = {};
  for (const name of ["INFRASTRUCTURE", "IAM", "CP", "SHARED"]) {
    const pin = env[`NABHOLD_INTEGRATION_${name}_SHA`];
    if (!pin || !/^[a-f0-9]{40}$(?![\s\S])/.test(pin)) throw new Error("Unpinned dependency");
    pins[name.toLowerCase()] = pin;
  }
  const root = join(cwd, ".integration");
  mkdirSync(root, { mode: 0o700, recursive: true });
  const stat = lstatSync(root);
  if (!stat.isDirectory() || stat.isSymbolicLink() || stat.uid !== process.getuid?.() || (stat.mode & 0o077)) throw new Error("Unsafe evidence directory");
  const directory = mkdtempSync(join(root, "identity-smoke-"));
  const manifest = { schema: "nabhold.identity-smoke.observation.v1", runId: randomUUID(),
    startedAt: new Date().toISOString(), profile: "keycloak-identity-smoke", syntheticIdentities: true,
    nabhold: { sha, worktree: "clean" }, declaredDependencies: pins,
    dependencyRuntimeAttested: false, acceptanceClaimed: false };
  writeFileSync(join(directory, "started.json"), JSON.stringify(manifest, null, 2) + "\n", { flag: "wx", mode: 0o600 });
  return { directory, manifest };
}

export function writeObservations(directory: string, value: Observations) {
  writeFileSync(join(directory, "observations.json"), JSON.stringify(value), { flag: "wx", mode: 0o600 });
}

function syncPath(path: string) {
  const fd = openSync(path, "r");
  try { fsyncSync(fd); } finally { closeSync(fd); }
}

/** Parse a strictly bounded, fixed-vocabulary projection. Even an unexpected
 * reporter payload cannot copy arbitrary diagnostic strings into the receipt.
 * A digest detects accidental alteration; it is not a signature. Infrastructure
 * must retain/attest artifacts and independently bind deployed revisions.
 */
export function finishEvidence(run: ReturnType<typeof startEvidence>, exitCode: number | null) {
  let observation = empty();
  try {
    const path = join(run.directory, "observations.json");
    const stat = lstatSync(path);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 4096) throw new Error();
    const raw = JSON.parse(readFileSync(path, "utf8"));
    if (Object.keys(raw).sort().join() !== "complete,invalid,results" ||
        typeof raw.complete !== "boolean" || typeof raw.invalid !== "boolean" ||
        Object.keys(raw.results).sort().join() !== [...scenarios].sort().join() ||
        scenarios.some(id => !statuses.includes(raw.results[id]))) throw new Error();
    observation = { complete: raw.complete, invalid: raw.invalid,
      results: Object.fromEntries(scenarios.map(id => [id, raw.results[id]])) as Record<Scenario, Status> };
  } catch { observation.invalid = true; }
  const passed = exitCode === 0 && observation.complete && !observation.invalid &&
    scenarios.every(id => observation.results[id] === "passed");
  const receipt = { ...run.manifest, endedAt: new Date().toISOString(),
    outcome: passed ? "PASS" : "INCOMPLETE_OR_FAILED", observations: observation,
    processSucceeded: exitCode === 0 };
  const bytes = JSON.stringify(receipt, null, 2) + "\n";
  // Stage and sync BOTH files before exposing a completed bundle. A crash or
  // write failure leaves only .finalizing (incomplete), never a standalone
  // published PASS. Renaming a directory on this filesystem publishes the pair
  // atomically; synchronizing the parent persists the directory entry as well.
  // A repeated finalization cannot replace the nonempty completed directory.
  const pending = join(run.directory, ".finalizing");
  mkdirSync(pending, { mode: 0o700 });
  writeFileSync(join(pending, "receipt.json"), bytes, { flag: "wx", mode: 0o600 });
  syncPath(join(pending, "receipt.json"));
  writeFileSync(join(pending, "receipt.sha256"), createHash("sha256").update(bytes).digest("hex") + "  receipt.json\n", { flag: "wx", mode: 0o600 });
  syncPath(join(pending, "receipt.sha256"));
  syncPath(pending);
  renameSync(pending, join(run.directory, "completed"));
  syncPath(run.directory);
  return passed;
}
