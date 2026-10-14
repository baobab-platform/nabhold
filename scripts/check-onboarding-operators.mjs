#!/usr/bin/env node
import { closeSync, openSync, readSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { OPERATOR_ROLES, observeOperatorAuthority } from "../src/lib/estate/operator-preflight.ts";

/**
 * Read-only operator tool, intentionally disconnected from the public BFF.
 * The input contains CP-issued UUIDs and a trusted CP origin, never passwords.
 * Each credential comes from its own process environment variable, not CLI
 * arguments, a committed manifest, browser state or a shared bootstrap token.
 * Output contains only whitelisted grant/Principal pointers and refusal codes.
 * Raw validation, fetch, TLS and CP errors are never printed: some include the
 * request URL, headers, private paths or attacker-controlled response text.
 */
try {
  const args = process.argv.slice(2);
  if (args.length !== 0 && (args.length !== 2 || args[0] !== "--input" || !args[1] || args[1].startsWith("--"))) {
    throw new Error("Invalid arguments");
  }
  // Do not turn an externally supplied TLS bypass into a seemingly successful
  // protected authority observation. Local HTTP is limited to loopback in code.
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") throw new Error("TLS bypass refused");
  const input = args[1] ?? fileURLToPath(new URL("../docs/go-live/onboarding/operator-preflight-plan.json", import.meta.url));
  const fd = openSync(input, "r");
  const bytes = Buffer.alloc(32 * 1024 + 1);
  let length = 0;
  try {
    while (length < bytes.length) {
      const count = readSync(fd, bytes, length, bytes.length - length, null);
      if (count === 0) break;
      length += count;
    }
  } finally { closeSync(fd); }
  if (length > 32 * 1024) throw new Error("Plan size exceeded");
  const plan = JSON.parse(bytes.subarray(0, length).toString("utf8"));
  const credentials = Object.fromEntries(OPERATOR_ROLES.map((role) =>
    [role, process.env[`NABHOLD_OPERATOR_${role.toUpperCase()}_TOKEN`]]));
  const report = await observeOperatorAuthority(plan, credentials);
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  // Exit 0 means only that scoped grants were freshly observed. The report
  // explicitly refuses to authorise onboarding, protected staging or release.
  if (!report.all_required_grants_observed) process.exitCode = 2;
} catch {
  process.stderr.write("Operator preflight refused. Supply a valid non-secret CP Principal plan and separate credentials through the documented environment variables.\n");
  process.exitCode = 2;
}
