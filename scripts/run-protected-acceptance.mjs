#!/usr/bin/env node
import { constants, openSync, fstatSync, readSync, closeSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { OPERATOR_ROLES } from "../src/lib/estate/operator-preflight.ts";
import { WORKLOAD_CREDENTIALS, runProtectedAcceptance } from "../src/lib/estate/protected-acceptance.ts";

/**
 * Operator-only read/resolve harness; no credential CLI flags or secret files.
 * Real plans must be owner-private regular files, read through one no-follow
 * descriptor with a 32 KiB ceiling. Errors never expose paths, IDs or tokens.
 * Stdout contains only the sanitized non-authorising report, suitable for an
 * evidence artifact. A successful exit still requires independent acceptance.
 */
try {
  const args = process.argv.slice(2);
  const requireStaging = args.at(-1) === "--require-staging";
  if (requireStaging) args.pop();
  if (args.length !== 0 && (args.length !== 2 || args[0] !== "--input" || !args[1] || args[1].startsWith("--"))) throw new Error();
  const input = args[1] ?? fileURLToPath(new URL("../docs/go-live/onboarding/protected-acceptance-plan.json", import.meta.url));
  const fd = openSync(input, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  let bytes;
  let length = 0;
  try {
    const info = fstatSync(fd);
    if (!info.isFile() || info.size > 32 * 1024 || (args.length && ((info.mode & 0o077) !== 0 || info.uid !== process.getuid()))) throw new Error();
    bytes = Buffer.alloc(32 * 1024 + 1);
    while (length < bytes.length) {
      const count = readSync(fd, bytes, length, bytes.length - length, null);
      if (!count) break;
      length += count;
    }
  } finally { closeSync(fd); }
  if (length > 32 * 1024) throw new Error();
  const plan = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, length)));
  if (requireStaging && plan.operators?.environment !== "staging") throw new Error();
  const credentials = {
    operators: Object.fromEntries(OPERATOR_ROLES.map((role) => [role, process.env[`NABHOLD_OPERATOR_${role.toUpperCase()}_TOKEN`]])),
    workloads: Object.fromEntries(WORKLOAD_CREDENTIALS.map((role) => [role, process.env[`NABHOLD_ACCEPTANCE_${role.toUpperCase()}_TOKEN`]])),
  };
  const report = await runProtectedAcceptance(plan, credentials);
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  if (report.status !== "OBSERVED_NOT_ACCEPTED") process.exitCode = 2;
} catch {
  process.stderr.write("Protected acceptance refused: supply a valid private non-secret plan and separate documented credentials.\n");
  process.exitCode = 2;
}
