import { constants, openSync, fstatSync, readSync, closeSync } from "node:fs";
import { parseEnv } from "node:util";
import { isAbsolute } from "node:path";
import { X509Certificate } from "node:crypto";
import { z } from "zod";

/** Consumer-side INT-03 preparation. This describes one real Keycloak federation
 * test path, not provider-neutral IAM qualification or a release authorisation.
 * Errors intentionally contain no submitted values, URLs, paths or credentials.
 */
export class IntegrationConfigurationError extends Error {
  constructor() { super("Integration configuration refused; consult docs/testing/codespaces-integration.md."); }
}
// JavaScript $ also matches before a terminal newline. Require true end of
// input so pins, key IDs and client names cannot differ from runtime values.
const identifier = z.string().regex(/^[a-z][a-z0-9-]{0,31}$(?![\s\S])/);
const https = z.string().url().refine(value => {
  const u = new URL(value);
  return u.protocol === "https:" && !u.username && !u.password && !u.search && !u.hash;
});
const origin = https.refine(value => new URL(value).origin === value);
const pin = z.string().regex(/^[0-9a-f]{40}$(?![\s\S])/);
const schema = z.object({
  NABHOLD_INTEGRATION_PROFILE: z.literal("keycloak-identity-smoke"),
  NABHOLD_INTEGRATION_SYNTHETIC: z.literal("true"),
  NABHOLD_INTEGRATION_INFRASTRUCTURE_SHA: pin,
  NABHOLD_INTEGRATION_IAM_SHA: pin,
  NABHOLD_INTEGRATION_CP_SHA: pin,
  NABHOLD_INTEGRATION_SHARED_SHA: pin,
  NEXT_PUBLIC_SITE_URL: origin,
  NABHOLD_OIDC_ENABLED: z.literal("true"),
  NABHOLD_OIDC_ENVIRONMENT: z.literal("integration"),
  NABHOLD_OIDC_ORIGIN: origin,
  NABHOLD_OIDC_ISSUER: https,
  NABHOLD_OIDC_CLIENT_ID: z.string().regex(/^nabhold-[a-z0-9-]+$(?![\s\S])/).max(256),
  NABHOLD_OIDC_CLIENT_SECRET: z.string().min(16).max(4096),
  NABHOLD_OIDC_ID_TOKEN_ALGORITHM: z.enum(["RS256", "ES256"]),
  NABHOLD_OIDC_INTROSPECTION_ENDPOINT: https,
  NABHOLD_OIDC_CP_ORIGIN: origin,
  BAOBAB_CONTROL_PLANE_API_URL: origin,
  NABHOLD_BFF_STORE_ENABLED: z.literal("true"),
  NABHOLD_BFF_REDIS_HOST: z.string().regex(/^[a-zA-Z0-9.-]+$(?![\s\S])/).max(253),
  NABHOLD_BFF_REDIS_PORT: z.string().regex(/^\d+$(?![\s\S])/).refine(v => Number(v) > 0 && Number(v) <= 65535),
  NABHOLD_BFF_REDIS_USERNAME: z.string().min(1).max(256),
  NABHOLD_BFF_REDIS_PASSWORD: z.string().min(1).max(4096),
  NABHOLD_BFF_REDIS_CA_PEM: z.string().max(16384).optional(),
  NABHOLD_BFF_STORE_KEYS_JSON: z.string().transform(v => JSON.parse(v) as unknown).pipe(
    z.record(identifier, z.string().regex(/^[A-Za-z0-9+/]{43}=$(?![\s\S])/).refine(v => Buffer.from(v, "base64").toString("base64") === v))
      .refine(v => Object.keys(v).length >= 1 && Object.keys(v).length <= 3)),
  NABHOLD_BFF_STORE_ACTIVE_KEY: identifier,
  NABHOLD_BFF_STORE_EPOCH: identifier,
  NODE_EXTRA_CA_CERTS: z.string().min(1),
  NABHOLD_CONTENT_DEV_FALLBACK: z.literal("false"),
  NABHOLD_DASHBOARD_PREVIEW: z.literal("false"),
  NABHOLD_CONTENT_SOURCE: z.literal(""),
  NABHOLD_CANONICAL_HOST: z.literal(""),
  NABHOLD_RELEASE_R0: z.literal("true"),
  NABHOLD_RELEASE_R1: z.literal("false"),
  NABHOLD_RELEASE_R2: z.literal("false"),
  NABHOLD_RELEASE_R3: z.literal("false"),
  NABHOLD_INTEGRATION_USERNAME: z.string().min(1).max(256),
  NABHOLD_INTEGRATION_PASSWORD: z.string().min(1).max(4096),
  NABHOLD_INTEGRATION_PRINCIPAL_ID: z.uuid(),
});
export function integrationSettings(env: Record<string, string | undefined>) {
  try {
    if (env.NODE_TLS_REJECT_UNAUTHORIZED === "0" || env.NODE_OPTIONS || env.DEBUG || env.PWDEBUG) throw new Error();
    const s = schema.parse(env);
    validateCaFile(s.NODE_EXTRA_CA_CERTS);
    if (s.NEXT_PUBLIC_SITE_URL !== s.NABHOLD_OIDC_ORIGIN ||
        s.BAOBAB_CONTROL_PLANE_API_URL !== s.NABHOLD_OIDC_CP_ORIGIN ||
        new Set([s.NABHOLD_OIDC_ORIGIN, s.NABHOLD_OIDC_CP_ORIGIN, new URL(s.NABHOLD_OIDC_ISSUER).origin]).size !== 3 ||
        new URL(s.NABHOLD_OIDC_INTROSPECTION_ENDPOINT).origin !== new URL(s.NABHOLD_OIDC_ISSUER).origin ||
        !Object.hasOwn(s.NABHOLD_BFF_STORE_KEYS_JSON, s.NABHOLD_BFF_STORE_ACTIVE_KEY)) throw new Error();
    return s;
  } catch { throw new IntegrationConfigurationError(); }
}

/** Node warns and ignores an unusable extra-CA file at startup. Validate the
 * actual bounded, no-follow regular file now instead of accepting that warning
 * as a trust handoff. CA certificates are public material, so owner-only mode
 * is required for the secret environment file, not for this certificate file.
 * This establishes readable CA syntax, not live service or chain acceptance.
 */
function validateCaFile(path: string) {
  let fd: number | undefined;
  try {
    if (!isAbsolute(path)) throw new Error();
    fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    const stat = fstatSync(fd);
    const limit = 256 * 1024;
    if (!stat.isFile() || !(stat.mode & 0o444) || stat.size > limit) throw new Error();
    const bytes = Buffer.alloc(limit + 1);
    let length = 0;
    while (length < bytes.length) {
      const count = readSync(fd, bytes, length, bytes.length - length, null);
      if (!count) break;
      length += count;
    }
    if (!length || length > limit) throw new Error();
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, length));
    const certificates = text.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g);
    if (!certificates?.length || text.replace(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g, "").trim()) throw new Error();
    for (const pem of certificates) if (!new X509Certificate(pem).ca) throw new Error();
  } finally { if (fd !== undefined) closeSync(fd); }
}

/** Never source shell text or let Next's automatic .env.local selection choose
 * an unrelated environment. A standalone, owner-private file is mandatory. Node
 * parses literal dotenv values (no shell/variable expansion). The launcher's
 * child receives these values before Next loads its normal environment files.
 */
export function loadIntegrationEnvironment(source: Record<string, string | undefined> = process.env) {
  let fd: number | undefined;
  try {
    if (!source.NABHOLD_INTEGRATION_ENV_FILE || !isAbsolute(source.NABHOLD_INTEGRATION_ENV_FILE)) throw new Error();
    fd = openSync(source.NABHOLD_INTEGRATION_ENV_FILE, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    const stat = fstatSync(fd);
    if (!stat.isFile() || stat.size > 32768 || stat.uid !== process.getuid?.() || (stat.mode & 0o077)) throw new Error();
    const bytes = Buffer.alloc(32769);
    let length = 0;
    while (length < bytes.length) {
      const count = readSync(fd, bytes, length, bytes.length - length, null);
      if (!count) break;
      length += count;
    }
    if (length > 32768) throw new Error();
    const file = parseEnv(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, length)));
    // Limit the file to documented application/test settings; no PATH/loader or
    // arbitrary executable configuration can be smuggled into child processes.
    const allowed = new Set(Object.keys(schema.shape));
    if (Object.keys(file).some(k => !allowed.has(k))) throw new Error();
    const env = { ...source, ...file };
    integrationSettings(env);
    return env;
  } catch { throw new IntegrationConfigurationError(); }
  finally { if (fd !== undefined) closeSync(fd); }
}
