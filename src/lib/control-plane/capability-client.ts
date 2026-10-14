import {
  resolutionRequestSchema,
  resolutionSchema,
  type Resolution,
  type ResolutionRequest,
  type ResolvedCapability,
} from "./resolution";

/**
 * Server-only client for Control Plane capability resolution
 * (masterplan G15 task 3). The CP answers "who/what/where under which
 * permitted binding"; it is not a business API proxy, so this client
 * returns an invocation descriptor and never forwards business payloads.
 *
 * Server-only: it must never be imported from a client component, and its
 * configuration has no NEXT_PUBLIC_* mirror.
 *
 * No default workload-token source exists yet (blocked on G04 IAM). Until a
 * `WorkloadTokenProvider` is supplied the client fails closed instead of
 * calling the Control Plane anonymously.
 */
export interface WorkloadTokenProvider {
  /** Returns a short-lived workload token carrying the `context:resolve` scope. */
  getToken(): Promise<string>;
}

export class WorkloadTokenUnavailableError extends Error {
  constructor() {
    super("No workload token provider is configured (IAM integration pending).");
    this.name = "WorkloadTokenUnavailableError";
  }
}

export const unavailableTokenProvider: WorkloadTokenProvider = {
  async getToken() {
    throw new WorkloadTokenUnavailableError();
  },
};

export class CapabilityResolutionError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "CapabilityResolutionError";
  }
}

/** A well-formed non-RESOLVED decision; a business outcome, not a transport failure. */
export class CapabilityNotResolvedError extends Error {
  readonly resolution: Resolution;

  constructor(resolution: Resolution) {
    super(
      `Capability ${resolution.capability_key} not resolved: ` +
        `${resolution.decision} (${resolution.reason_code ?? "no reason"})`,
    );
    this.name = "CapabilityNotResolvedError";
    this.resolution = resolution;
  }
}

export interface CapabilityClientOptions {
  baseUrl: string;
  /** Explicit local-test exception: HTTP loopback only, never production. */
  allowLocalHttp?: boolean;
  tokens?: WorkloadTokenProvider;
  timeoutMs?: number;
  fetch?: typeof fetch;
  now?: () => Date;
}

const DEFAULT_TIMEOUT_MS = 5_000;
const MAX_TIMEOUT_MS = 60_000;
const MAX_RESPONSE_BYTES = 256 * 1024;
const RESOLVE_PATH = "/v1/capabilities/resolve";

/**
 * Deployment configuration selects the trusted CP origin; the request never
 * does. Validate before obtaining a credential, and resolve only the fixed
 * canonical route. HTTPS is required unless an explicit local-test exception
 * selects loopback. URL credentials, base paths and query/fragment hints are
 * refused rather than silently stripped or echoed into errors.
 */
function resolutionEndpoint(options: CapabilityClientOptions): string {
  try {
    const url = new URL(options.baseUrl);
    const localHttp = options.allowLocalHttp === true && process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if ((url.protocol !== "https:" && !localHttp) || url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash) throw new Error();
    return new URL(RESOLVE_PATH, url).toString();
  } catch {
    throw new CapabilityResolutionError("Control Plane origin is not safe for credentialed resolution");
  }
}

/**
 * Count decoded stream bytes, not Content-Length: compression, omission and
 * misleading headers must not bypass the memory ceiling. The same deadline
 * covers headers and body. Cancelling the reader on abort also bounds a peer
 * that sends headers then stalls. Cleanup never waits for a peer's cancellation
 * acknowledgement. Only valid UTF-8 JSON crosses into contract validation.
 */
async function readResolution(response: Response, signal: AbortSignal): Promise<unknown> {
  if (!response.body || !/^application\/json(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")) {
    void response.body?.cancel().catch(() => undefined);
    throw new Error("Invalid resolution media type");
  }
  const reader = response.body.getReader();
  const cancel = () => { void reader.cancel().catch(() => undefined); };
  signal.addEventListener("abort", cancel, { once: true });
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      signal.throwIfAborted();
      const { done, value } = await reader.read();
      signal.throwIfAborted();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_RESPONSE_BYTES) throw new Error("Resolution size exceeded");
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } finally {
    signal.removeEventListener("abort", cancel);
    cancel();
    reader.releaseLock();
  }
}

export class CapabilityClient {
  private readonly endpoint: string;
  private readonly tokens: WorkloadTokenProvider;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly now: () => Date;

  constructor(options: CapabilityClientOptions) {
    this.endpoint = resolutionEndpoint(options);
    this.tokens = options.tokens ?? unavailableTokenProvider;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    if (!Number.isInteger(this.timeoutMs) || this.timeoutMs < 1 || this.timeoutMs > MAX_TIMEOUT_MS) {
      throw new CapabilityResolutionError("Control Plane timeout must be between 1 and 60000 milliseconds");
    }
    this.fetchImpl = options.fetch ?? fetch;
    this.now = options.now ?? (() => new Date());
  }

  /**
   * Returns the Control Plane's decision for any outcome. Use `resolve` when
   * the caller can only proceed on RESOLVED.
   */
  async resolveDecision(input: ResolutionRequest): Promise<Resolution> {
    const request = resolutionRequestSchema.parse(input);
    // Recheck at use time: changing process configuration after construction
    // must not turn off TLS verification for a bearer-authenticated request.
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") {
      throw new CapabilityResolutionError("Control Plane TLS verification is required");
    }
    if (process.env.NODE_ENV === "production" && this.endpoint.startsWith("http:")) {
      throw new CapabilityResolutionError("Control Plane production transport requires HTTPS");
    }
    const token = await this.tokens.getToken();
    // RFC 6750 opaque bearer syntax; token claims remain IAM/CP-owned. Refuse
    // empty or injected header values before invoking any transport.
    if (!token || token.length > 16_384 || !/^[A-Za-z0-9\-._~+/]+=*$(?![\s\S])/.test(token)) {
      throw new WorkloadTokenUnavailableError();
    }

    let response: Response;
    const signal = AbortSignal.timeout(this.timeoutMs);
    try {
      response = await this.fetchImpl(this.endpoint, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
          accept: "application/json",
          "x-correlation-id": request.correlation_id,
        },
        body: JSON.stringify(request),
        cache: "no-store",
        redirect: "error",
        signal,
      });
    } catch {
      throw new CapabilityResolutionError(
        "Control Plane capability resolution is unreachable",
      );
    }

    if (response.status !== 200 || response.redirected) {
      void response.body?.cancel().catch(() => undefined);
      throw new CapabilityResolutionError(
        `Control Plane capability resolution failed with HTTP ${response.status}`,
      );
    }

    let parsed;
    try {
      parsed = resolutionSchema.safeParse(await readResolution(response, signal));
    } catch {
      throw new CapabilityResolutionError(
        "Control Plane returned an unreadable resolution",
      );
    }

    if (!parsed.success) {
      throw new CapabilityResolutionError(
        "Control Plane returned a resolution that violates the Shared contract",
      );
    }

    const resolution = parsed.data;
    if (
      resolution.correlation_id !== request.correlation_id ||
      resolution.capability_key !== request.capability_key ||
      resolution.context_id !== request.context_id
    ) {
      throw new CapabilityResolutionError(
        "Control Plane resolution does not match the request",
      );
    }

    return resolution;
  }

  /**
   * Resolves a capability or throws. Anything other than a fresh RESOLVED
   * decision for the requested contract version is refused.
   */
  async resolve(input: ResolutionRequest): Promise<ResolvedCapability> {
    const resolution = await this.resolveDecision(input);

    if (resolution.decision !== "RESOLVED" || !resolution.invocation) {
      throw new CapabilityNotResolvedError(resolution);
    }

    if (
      resolution.expires_at &&
      new Date(resolution.expires_at).getTime() <= this.now().getTime()
    ) {
      throw new CapabilityResolutionError(
        "Control Plane resolution has already expired",
      );
    }

    if (
      input.required_contract_version !== undefined &&
      resolution.invocation.contract_version !== input.required_contract_version
    ) {
      throw new CapabilityResolutionError(
        "Resolved contract version does not match the required version",
      );
    }

    return resolution as ResolvedCapability;
  }
}

/**
 * Builds a client from server configuration, or `null` when the Control
 * Plane is not configured so callers can degrade instead of guessing a URL.
 */
export function createCapabilityClientFromEnv(
  tokens?: WorkloadTokenProvider,
): CapabilityClient | null {
  const baseUrl = process.env.BAOBAB_CONTROL_PLANE_API_URL;
  if (!baseUrl) return null;

  const configuredTimeout = Number(process.env.BAOBAB_CONTROL_PLANE_TIMEOUT_MS);

  return new CapabilityClient({
    baseUrl,
    tokens,
    timeoutMs:
      Number.isInteger(configuredTimeout) && configuredTimeout > 0
        && configuredTimeout <= MAX_TIMEOUT_MS
        ? configuredTimeout
        : undefined,
  });
}
