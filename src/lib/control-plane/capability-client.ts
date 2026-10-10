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
  tokens?: WorkloadTokenProvider;
  timeoutMs?: number;
  fetch?: typeof fetch;
  now?: () => Date;
}

const DEFAULT_TIMEOUT_MS = 5_000;
const RESOLVE_PATH = "/v1/capabilities/resolve";

export class CapabilityClient {
  private readonly baseUrl: string;
  private readonly tokens: WorkloadTokenProvider;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly now: () => Date;

  constructor(options: CapabilityClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.tokens = options.tokens ?? unavailableTokenProvider;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = options.fetch ?? fetch;
    this.now = options.now ?? (() => new Date());
  }

  /**
   * Returns the Control Plane's decision for any outcome. Use `resolve` when
   * the caller can only proceed on RESOLVED.
   */
  async resolveDecision(input: ResolutionRequest): Promise<Resolution> {
    const request = resolutionRequestSchema.parse(input);
    const token = await this.tokens.getToken();

    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}${RESOLVE_PATH}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
          "x-correlation-id": request.correlation_id,
        },
        body: JSON.stringify(request),
        cache: "no-store",
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (error) {
      throw new CapabilityResolutionError(
        "Control Plane capability resolution is unreachable",
        { cause: error },
      );
    }

    if (!response.ok) {
      throw new CapabilityResolutionError(
        `Control Plane capability resolution failed with HTTP ${response.status}`,
      );
    }

    let parsed;
    try {
      parsed = resolutionSchema.safeParse(await response.json());
    } catch (error) {
      throw new CapabilityResolutionError(
        "Control Plane returned a non-JSON resolution",
        { cause: error },
      );
    }

    if (!parsed.success) {
      throw new CapabilityResolutionError(
        "Control Plane returned a resolution that violates the Shared contract",
        { cause: parsed.error },
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
        ? configuredTimeout
        : undefined,
  });
}
