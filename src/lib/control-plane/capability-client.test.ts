import { createServer } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CapabilityClient,
  CapabilityNotResolvedError,
  CapabilityResolutionError,
  WorkloadTokenUnavailableError,
} from "./capability-client";
import type { ResolutionRequest } from "./resolution";

const correlationId = "7a8b9c0d-1e2f-4a3b-8c5d-6e7f8a9b0c1d";

const request: ResolutionRequest = {
  capability_key: "content.entry.resolve",
  required_contract_version: 1,
  context_id: "ctx_01k4z7g1h0",
  correlation_id: correlationId,
};

const resolved = {
  resolution_id: "res_01k4z8k4p5",
  context_id: request.context_id,
  capability_key: request.capability_key,
  contract_version: 1,
  decision: "RESOLVED",
  grant_id: "grant_01k4z8h2m1",
  binding_id: "bind_01k4z9j3n2",
  invocation: {
    service_reference: "service://baobab-cms/content",
    protocol: "http",
    contract_version: 1,
    provider_id: "provider_01k4z1a2b3",
    engine_instance_id: "ei_cmsstaging01",
  },
  resolved_at: "2026-10-08T09:00:00Z",
  expires_at: "2026-10-08T09:01:00Z",
  correlation_id: correlationId,
};

const tokens = { getToken: async () => "workload-token" };
const now = () => new Date("2026-10-08T09:00:30Z");
afterEach(() => vi.unstubAllEnvs());

function clientReturning(body: unknown, status = 200) {
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      }),
  );
  const client = new CapabilityClient({
    baseUrl: "https://cp.example.test/",
    tokens,
    fetch: fetchMock as unknown as typeof fetch,
    now,
  });

  return { client, fetchMock };
}

describe("CapabilityClient", () => {
  it("posts only the contract request with a bearer workload token", async () => {
    const { client, fetchMock } = clientReturning(resolved);

    const result = await client.resolve(request);

    expect(result.invocation.service_reference).toBe(
      "service://baobab-cms/content",
    );
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://cp.example.test/v1/capabilities/resolve");
    expect(init.headers).toMatchObject({
      authorization: "Bearer workload-token",
      "x-correlation-id": correlationId,
    });
    expect(JSON.parse(init.body as string)).toEqual(request);
    expect(init.redirect).toBe("error");
    expect(init.cache).toBe("no-store");
  });

  it("rejects client-supplied tenant or legal-entity authority", async () => {
    const { client, fetchMock } = clientReturning(resolved);

    await expect(
      client.resolve({
        ...request,
        tenant_id: "tenant-x",
        legal_entity_id: "NABHOLD",
      } as unknown as ResolutionRequest),
    ).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed without a workload token provider", async () => {
    const fetchMock = vi.fn();
    const client = new CapabilityClient({
      baseUrl: "https://cp.example.test",
      fetch: fetchMock as unknown as typeof fetch,
    });

    await expect(client.resolve(request)).rejects.toThrow(
      WorkloadTokenUnavailableError,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces a denied decision as a business outcome", async () => {
    const { client } = clientReturning({
      resolution_id: "res_1",
      context_id: request.context_id,
      capability_key: request.capability_key,
      decision: "UNAVAILABLE",
      reason_code: "BINDING_NOT_FOUND",
      resolved_at: "2026-10-08T09:00:00Z",
      correlation_id: correlationId,
    });

    await expect(client.resolve(request)).rejects.toThrow(
      CapabilityNotResolvedError,
    );
    await expect(client.resolveDecision(request)).resolves.toMatchObject({
      decision: "UNAVAILABLE",
    });
  });

  it("refuses an expired resolution", async () => {
    const { client } = clientReturning({
      ...resolved,
      expires_at: "2026-10-08T09:00:10Z",
    });

    await expect(client.resolve(request)).rejects.toThrow(
      "already expired",
    );
  });

  it("refuses a resolution for a different capability, context or correlation", async () => {
    for (const mismatch of [
      { capability_key: "identity.authentication.perform" },
      { context_id: "ctx_other" },
      { correlation_id: "11111111-1111-4111-8111-111111111111" },
    ]) {
      const { client } = clientReturning({ ...resolved, ...mismatch });

      await expect(client.resolve(request)).rejects.toThrow(
        CapabilityResolutionError,
      );
    }
  });

  it("refuses a RESOLVED decision that lacks a binding or invocation", async () => {
    const { client } = clientReturning({
      ...resolved,
      binding_id: undefined,
      invocation: undefined,
    });

    await expect(client.resolve(request)).rejects.toThrow(
      CapabilityResolutionError,
    );
  });

  it("refuses an unexpected contract version", async () => {
    const { client } = clientReturning({
      ...resolved,
      invocation: { ...resolved.invocation, contract_version: 2 },
    });

    await expect(client.resolve(request)).rejects.toThrow(
      "contract version",
    );
  });

  it("maps transport and HTTP failures to resolution errors", async () => {
    const failing = new CapabilityClient({
      baseUrl: "https://cp.example.test",
      tokens,
      fetch: (async () => {
        throw new TypeError("network down");
      }) as unknown as typeof fetch,
    });
    await expect(failing.resolve(request)).rejects.toThrow(
      CapabilityResolutionError,
    );

    const { client } = clientReturning({ title: "Unauthorized" }, 401);
    await expect(client.resolve(request)).rejects.toThrow("HTTP 401");
  });

  it.each([
    "http://cp.example.test", "https://user:secret@cp.example.test",
    "https://cp.example.test/prefix", "https://cp.example.test?hint=secret",
    "https://cp.example.test#secret", "service://cp", "not-a-url",
  ])("refuses unsafe origin %s before acquiring a token", (baseUrl) => {
    const getToken = vi.fn();
    expect(() => new CapabilityClient({ baseUrl, tokens: { getToken } })).toThrow(CapabilityResolutionError);
    expect(getToken).not.toHaveBeenCalled();
  });

  it("limits explicit HTTP exceptions to non-production loopback", () => {
    for (const host of ["127.0.0.1", "localhost", "[::1]"]) {
      expect(() => new CapabilityClient({ baseUrl: `http://${host}:8080`, allowLocalHttp: true })).not.toThrow();
    }
    expect(() => new CapabilityClient({ baseUrl: "http://cp.example.test", allowLocalHttp: true })).toThrow();
    expect(() => new CapabilityClient({ baseUrl: "http://127.0.0.1:8080" })).toThrow();
    vi.stubEnv("NODE_ENV", "production");
    expect(() => new CapabilityClient({ baseUrl: "http://127.0.0.1:8080", allowLocalHttp: true })).toThrow();
  });

  it("refuses TLS bypass before acquiring credentials", async () => {
    const getToken = vi.fn();
    const fetchMock = vi.fn();
    const client = new CapabilityClient({ baseUrl: "https://cp.example.test", tokens: { getToken }, fetch: fetchMock });
    vi.stubEnv("NODE_TLS_REJECT_UNAUTHORIZED", "0");
    await expect(client.resolve(request)).rejects.toThrow("TLS verification");
    expect(getToken).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses a local HTTP client reused under production configuration", async () => {
    const getToken = vi.fn();
    const client = new CapabilityClient({ baseUrl: "http://127.0.0.1:8080", allowLocalHttp: true, tokens: { getToken } });
    vi.stubEnv("NODE_ENV", "production");
    await expect(client.resolve(request)).rejects.toThrow("requires HTTPS");
    expect(getToken).not.toHaveBeenCalled();
  });

  it.each(["", "injected\r\nheader", "valid-token\n", " ", "a".repeat(16_385)])(
    "refuses empty, injected or oversized bearer values", async (token) => {
      const fetchMock = vi.fn();
      const client = new CapabilityClient({ baseUrl: "https://cp.example.test", tokens: { getToken: async () => token }, fetch: fetchMock });
      await expect(client.resolve(request)).rejects.toThrow(WorkloadTokenUnavailableError);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it.each([0, -1, 1.5, NaN, Infinity, 60_001])("refuses invalid deadline %s", (timeoutMs) => {
    expect(() => new CapabilityClient({ baseUrl: "https://cp.example.test", timeoutMs })).toThrow("timeout");
  });

  it("bounds actual streamed bytes despite a misleading Content-Length", async () => {
    const cancelled = vi.fn();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(" ".repeat(256 * 1024)));
        controller.enqueue(new TextEncoder().encode(JSON.stringify(resolved)));
      },
      cancel: cancelled,
    });
    const client = new CapabilityClient({ baseUrl: "https://cp.example.test", tokens,
      fetch: async () => new Response(body, { headers: { "content-type": "application/json", "content-length": "1" } }) });
    await expect(client.resolve(request)).rejects.toThrow("unreadable resolution");
    expect(cancelled).toHaveBeenCalledOnce();
  });

  it("cancels a stalled response body at the request deadline", async () => {
    const cancelled = vi.fn();
    const body = new ReadableStream<Uint8Array>({ cancel: cancelled });
    const client = new CapabilityClient({ baseUrl: "https://cp.example.test", tokens, timeoutMs: 20,
      fetch: async () => new Response(body, { headers: { "content-type": "application/json" } }) });
    await expect(client.resolve(request)).rejects.toThrow("unreadable resolution");
    expect(cancelled).toHaveBeenCalledOnce();
  });

  it("refuses non-JSON media, invalid UTF-8, malformed JSON and unexpected success statuses", async () => {
    for (const response of [
      new Response(JSON.stringify(resolved), { headers: { "content-type": "text/html" } }),
      new Response(new Uint8Array([0xff]), { headers: { "content-type": "application/json" } }),
      new Response("upstream-secret", { headers: { "content-type": "application/json" } }),
      new Response(JSON.stringify(resolved), { status: 201, headers: { "content-type": "application/json" } }),
    ]) {
      const client = new CapabilityClient({ baseUrl: "https://cp.example.test", tokens, fetch: async () => response });
      await expect(client.resolve(request)).rejects.toThrow(CapabilityResolutionError);
    }
  });

  it("keeps raw transport and validation details out of error causes", async () => {
    for (const fetchImpl of [
      async () => { throw new Error("private-url-and-token"); },
      async () => new Response(JSON.stringify({ ...resolved, decision: "private-upstream-value" }),
        { headers: { "content-type": "application/json" } }),
    ]) {
      const client = new CapabilityClient({ baseUrl: "https://cp.example.test", tokens, fetch: fetchImpl });
      const error = await client.resolve(request).catch((caught: Error) => caught);
      expect(error).toBeInstanceOf(CapabilityResolutionError);
      expect((error as Error).cause).toBeUndefined();
      expect(String(error)).not.toContain("private-");
    }
  });

  it("refuses a real same-origin redirect without sending a second credentialed request", async () => {
    const paths: string[] = [];
    const server = createServer((req, res) => {
      paths.push(req.url ?? "");
      req.resume();
      res.writeHead(307, { location: "/redirect-target" }).end();
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("Missing test listener");
      const client = new CapabilityClient({ baseUrl: `http://127.0.0.1:${address.port}`, allowLocalHttp: true, tokens });
      await expect(client.resolve(request)).rejects.toThrow("unreachable");
      expect(paths).toEqual(["/v1/capabilities/resolve"]);
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
