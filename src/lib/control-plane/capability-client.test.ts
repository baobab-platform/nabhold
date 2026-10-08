import { describe, expect, it, vi } from "vitest";

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
});
