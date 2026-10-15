import { randomBytes, createHash } from "node:crypto";
import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { ConfidentialSessionStore, ConfidentialStoreError, newOpaqueHandle } from "../../src/lib/auth/store/confidential-store";
import { TlsRedisBackend } from "../../src/lib/auth/store/redis-backend";

/**
 * Actual TLS/ACL Redis acceptance for the storage primitive, never staging or
 * IAM acceptance. The server source commit is pinned in CI; certificate,
 * password, keys and records are generated per run and erased afterwards.
 * Distinct store/transport instances emulate separate BFF workers. No fake
 * atomic backend can satisfy this suite and a missing binary fails the job.
 */
let directory: string, child: ChildProcess, backend: TlsRedisBackend;
let a: ConfidentialSessionStore, b: ConfidentialSessionStore;
const keyring = { active: "test-key", keys: { "test-key": randomBytes(32) } };
let settings: ConstructorParameters<typeof TlsRedisBackend>[0];
const record = (duration = 60000) => ({ issuer: "https://iam.example.test/", subject: "external-subject", accessToken: "private-token-not-in-redis",
  csrfToken: newOpaqueHandle(), createdAt: Date.now(), expiresAt: Date.now() + duration });
const keyFor = (kind: string, handle: string) => `nabhold:bff:v1:test-epoch:${kind}:${createHash("sha256").update(handle).digest("hex")}`;

beforeAll(async () => {
  const binary = process.env.NABHOLD_TEST_REDIS_BINARY;
  if (!binary) throw new Error("NABHOLD_TEST_REDIS_BINARY must identify the pinned real Redis server");
  directory = await mkdtemp(join(tmpdir(), "nabhold-redis-tls-"));
  execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", join(directory, "key.pem"),
    "-out", join(directory, "cert.pem"), "-days", "1", "-subj", "/CN=localhost", "-addext", "subjectAltName=DNS:localhost"], { stdio: "ignore" });
  const password = randomBytes(32).toString("hex");
  // Restrict the fixture exactly as the production runbook requires. The
  // server never receives a plaintext password in argv or its ACL file.
  await writeFile(join(directory, "users.acl"), `user default off\nuser fixture on #${createHash("sha256").update(password).digest("hex")} ~nabhold:bff:v1:* +set +get +getdel +del +ping +hello +client|setinfo +client|setname\n`, { mode: 0o600 });
  const reservation = createServer();
  await new Promise<void>((resolve) => reservation.listen(0, "127.0.0.1", resolve));
  const address = reservation.address();
  if (!address || typeof address === "string") throw new Error("Port reservation unavailable");
  await new Promise<void>((resolve) => reservation.close(() => resolve()));
  child = spawn(binary, ["--port", "0", "--tls-port", String(address.port), "--bind", "127.0.0.1", "--tls-cert-file", join(directory, "cert.pem"),
    "--tls-key-file", join(directory, "key.pem"), "--tls-ca-cert-file", join(directory, "cert.pem"), "--tls-auth-clients", "no",
    "--aclfile", join(directory, "users.acl"), "--dir", directory, "--save", "", "--appendonly", "no"], { stdio: "ignore" });
  child.on("error", () => undefined);
  settings = { host: "localhost", port: address.port, username: "fixture", password, ca: await readFile(join(directory, "cert.pem"), "utf8") };
  backend = new TlsRedisBackend(settings);
  // Bounded startup polling is fixture setup, not a retry of a login consume.
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    try { await backend.execute(["GET", keyFor("session", newOpaqueHandle())]); ready = true; break; }
    catch { if (child.exitCode !== null) break; await new Promise((r) => setTimeout(r, 100)); }
  }
  if (!ready) throw new Error("Pinned TLS Redis fixture failed to start");
  a = new ConfidentialSessionStore(backend, keyring, "test-epoch");
  b = new ConfidentialSessionStore(new TlsRedisBackend(settings), keyring, "test-epoch");
});
afterAll(async () => {
  if (child?.pid && child.exitCode === null) {
    await new Promise<void>((resolve) => { child.once("exit", () => resolve()); child.kill("SIGTERM"); });
  }
  if (directory) await rm(directory, { recursive: true, force: true });
});

describe("actual Redis TLS confidential session custody", () => {
  it("allows exactly one callback consumer across two worker instances", async () => {
    const time = Date.now(), browser = newOpaqueHandle();
    const pending = { issuer: "https://iam.example.test/", clientId: "reviewed-fixture", redirectUri: "https://estate.example.test/api/auth/callback", scopes: ["openid" as const],
      state: newOpaqueHandle(), nonce: newOpaqueHandle(), codeVerifier: newOpaqueHandle(), createdAt: time, expiresAt: time + 300000 };
    const handle = await a.issueLogin(pending, browser);
    const results = await Promise.all(Array.from({ length: 16 }, (_, i) => (i % 2 ? a : b).consumeLogin(handle, browser)));
    expect(results.filter((r) => r !== null)).toEqual([pending]);
    expect(await b.consumeLogin(handle, browser)).toBeNull();
  });
  it("keeps server tokens encrypted and revokes across workers", async () => {
    const value = record(), handle = await a.createSession(value);
    const raw = await backend.execute(["GET", keyFor("session", handle)]);
    expect(typeof raw).toBe("string");
    expect(String(raw)).not.toContain(value.accessToken);
    expect(String(raw)).not.toContain(value.subject);
    expect(String(raw)).not.toContain(handle);
    expect(await b.readSession(handle)).toEqual(value);
    await a.revokeSession(handle);
    expect(await b.readSession(handle)).toBeNull();
  });
  it("uses actual Redis expiry without renewing on a read", async () => {
    const handle = await a.createSession(record(500));
    expect(await b.readSession(handle)).not.toBeNull();
    await new Promise((r) => setTimeout(r, 700));
    expect(await b.readSession(handle)).toBeNull();
  });
  it("does not consume another browser's transaction twice", async () => {
    const time = Date.now(), browser = newOpaqueHandle();
    const handle = await a.issueLogin({ issuer: "https://iam.example.test/", clientId: "reviewed-fixture", redirectUri: "https://estate.example.test/api/auth/callback", scopes: ["openid" as const],
      state: newOpaqueHandle(), nonce: newOpaqueHandle(), codeVerifier: newOpaqueHandle(), createdAt: time, expiresAt: time + 300000 }, browser);
    await expect(b.consumeLogin(handle, newOpaqueHandle())).rejects.toThrow(ConfidentialStoreError);
    expect(await a.consumeLogin(handle, browser)).toBeNull();
  });
  it("refuses an untrusted certificate, bad credentials and a different ACL namespace", async () => {
    const withoutTrust = { ...settings, ca: undefined };
    await expect(new TlsRedisBackend(withoutTrust).execute(["GET", keyFor("session", newOpaqueHandle())])).rejects.toThrow(ConfidentialStoreError);
    await expect(new TlsRedisBackend({ ...settings, password: randomBytes(32).toString("hex") }).execute(["GET", keyFor("session", newOpaqueHandle())])).rejects.toThrow(ConfidentialStoreError);
    await expect(backend.execute(["GET", "other-estate:private-session"])).rejects.toThrow(ConfidentialStoreError);
  });
});
