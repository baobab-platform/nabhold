#!/usr/bin/env node
import { constants, openSync, fstatSync, lstatSync, readSync, closeSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { executiveObservationPlanSchema, observeExecutiveNavigation } from "../src/lib/estate/executive-navigation-observer.ts";

/** This reads an independently supplied private handoff. No action here
 * authorises that handoff, provisions a fixture or signs an acceptance result.
 * Credentials are environment-only; file values and exception details never
 * enter output. inspect is offline; observe uses real GET requests only.
 */
try {
  const [action, flag, input, ...extra] = process.argv.slice(2);
  if (!["inspect", "observe"].includes(action) || flag !== "--input" || !input || input.startsWith("--") || extra.length) throw new Error();
  const path = resolve(input);
  const parent = lstatSync(dirname(path));
  if (!parent.isDirectory() || parent.isSymbolicLink() || parent.uid !== process.getuid() || (parent.mode & 0o077)) throw new Error();
  const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  const bytes = Buffer.alloc(32 * 1024 + 1);
  let length = 0;
  try {
    const info = fstatSync(fd);
    if (!info.isFile() || info.uid !== process.getuid() || (info.mode & 0o077) || info.nlink !== 1 || info.size > 32 * 1024) throw new Error();
    while (length < bytes.length) {
      const n = readSync(fd, bytes, length, bytes.length - length, null);
      if (!n) break;
      length += n;
    }
  } finally { closeSync(fd); }
  if (length > 32 * 1024) throw new Error();
  const plan = executiveObservationPlanSchema.parse(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, length))));
  if (action === "inspect") process.stdout.write("EXECUTIVE_NAVIGATION_PLAN_SHAPE_VALID; approval=false; runtime_observed=false\n");
  else {
    const result = await observeExecutiveNavigation(plan, {
      owner_session: process.env.NABHOLD_NAVIGATION_OWNER_SESSION,
      denied_session: process.env.NABHOLD_NAVIGATION_DENIED_SESSION,
      owner_cp_token: process.env.NABHOLD_NAVIGATION_OWNER_CP_TOKEN,
      denied_cp_token: process.env.NABHOLD_NAVIGATION_DENIED_CP_TOKEN,
    });
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    if (result.status !== "OBSERVED_NOT_ACCEPTED") process.exitCode = 2;
  }
} catch {
  process.stderr.write("Executive navigation observation refused; provide a valid owner-private handoff.\n");
  process.exitCode = 2;
}
