#!/usr/bin/env node
import { assertProtectedStagingEnvironment } from "../src/lib/estate/staging-protection.ts";

// Fixed GitHub destination, exact repository/event/main ref, no redirects and
// no raw API error output. This step receives only the repository read token;
// operator/workload secrets are injected into the later approved run step.
try {
  if (process.env.GITHUB_REPOSITORY !== "baobab-platform/nabhold" ||
      process.env.GITHUB_REF !== "refs/heads/main" || process.env.GITHUB_EVENT_NAME !== "workflow_dispatch" ||
      process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0" || !process.env.GITHUB_TOKEN) throw new Error();
  const response = await fetch("https://api.github.com/repos/baobab-platform/nabhold/environments/staging", {
    headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    redirect: "error", cache: "no-store", signal: AbortSignal.timeout(5000),
  });
  if (response.status !== 200 || response.redirected) throw new Error();
  // This metadata is fetched solely from GitHub, has no service credentials,
  // and is discarded after checking. Keep even this trusted response bounded.
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 64 * 1024) throw new Error();
      chunks.push(value);
    }
  } finally { void reader.cancel().catch(() => undefined); reader.releaseLock(); }
  assertProtectedStagingEnvironment(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  process.stdout.write("Independent protected staging reviewer policy verified.\n");
} catch {
  process.stderr.write("Protected staging refused: main-only dispatch, readable environment policy, independent reviewers, branch restrictions and disabled admin bypass are required.\n");
  process.exitCode = 2;
}
