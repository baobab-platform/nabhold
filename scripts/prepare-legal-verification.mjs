#!/usr/bin/env node
import { openSync, readSync, closeSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { assessLegalVerificationPreparation, buildLegalVerificationRequests } from "../src/lib/estate/legal-verification.ts";

/**
 * Offline operator tool. Node 22/24's type stripping loads the pure TS builder;
 * no new runtime dependency or network authority is introduced. Only the closed
 * metadata packet is read, never certificates, bearer tokens or credentials.
 * Output is JSON on stdout. No upload, case creation, check, decision or file
 * write takes place, even when --organisation-id is supplied.
 */
const usage = "Usage: pnpm verification:prepare [--input packet.json] [--business NABHOLD|THAMANI-GLOBAL --organisation-id CP_UUID]";
try {
  const args = process.argv.slice(2);
  const allowed = new Set(["--input", "--business", "--organisation-id"]);
  const values = new Map();
  for (let i = 0; i < args.length; i += 2) {
    if (!allowed.has(args[i]) || !args[i + 1] || args[i + 1].startsWith("--") || values.has(args[i])) throw new Error(usage);
    values.set(args[i], args[i + 1]);
  }
  if (values.has("--business") !== values.has("--organisation-id")) throw new Error(usage);
  const inputPath = values.get("--input") ?? fileURLToPath(new URL("../docs/go-live/onboarding/za-legal-verification-packet.json", import.meta.url));
  // Bound local input; a malformed file is refused without echoing its contents.
  const fd = openSync(inputPath, "r");
  const bytes = Buffer.alloc(32 * 1024 + 1);
  let length = 0;
  try {
    // Bound bytes read as well as bytes accepted; never allocate the whole file.
    while (length < bytes.length) {
      const count = readSync(fd, bytes, length, bytes.length - length, null);
      if (count === 0) break;
      length += count;
    }
  } finally {
    closeSync(fd);
  }
  if (length > 32 * 1024) throw new Error("Packet exceeds the metadata size limit");
  const input = JSON.parse(bytes.subarray(0, length).toString("utf8"));
  const result = values.has("--business")
    ? buildLegalVerificationRequests(input, values.get("--business"), values.get("--organisation-id"))
    : assessLegalVerificationPreparation(input);
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
} catch {
  // Validation diagnostics must not print applicant-supplied values or filesystem
  // errors containing private paths. The runbook explains the schema and flags.
  process.stderr.write("Legal verification preparation refused. Check packet schema and arguments.\n" + usage + "\n");
  process.exitCode = 2;
}
