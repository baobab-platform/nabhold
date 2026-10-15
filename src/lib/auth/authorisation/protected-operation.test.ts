// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("./executive-capability", () => ({
  requireExecutiveCapability: vi.fn(async () => ({
    principalId: "principal", contextId: "current", expiresAt: Date.now() + 30_000,
  })),
}));
import { withExecutiveCapability } from "./protected-operation";
import { requireExecutiveCapability } from "./executive-capability";
import { AuthenticationDenied } from "../oidc/settings";

describe("G04B-04 protected operation boundary", () => {
  const mapping = { expectedOrganisationId: "server-owned", expectedTenantId: "server-owned",
    capabilityKey: "content.entry.resolve", contractVersion: 1 };
  const session = { subject: "human" };
  const dependencies = {} as Parameters<typeof withExecutiveCapability>[2];

  it("refuses absent sessions before attempting CP", async () => {
    vi.clearAllMocks();
    const operation = vi.fn(async () => "should-not-run");
    await expect(withExecutiveCapability(null, mapping, dependencies, operation)).rejects.toBeInstanceOf(AuthenticationDenied);
    expect(requireExecutiveCapability).not.toHaveBeenCalled();
    expect(operation).not.toHaveBeenCalled();
  });
  it("checks current authority before executing the operation", async () => {
    vi.mocked(requireExecutiveCapability).mockResolvedValueOnce({
      principalId: "principal", contextId: "current", expiresAt: Date.now() + 30_000,
    });
    const operation = vi.fn(async () => "ok");
    await expect(withExecutiveCapability(session as never, mapping, dependencies, operation)).resolves.toBe("ok");
    expect(requireExecutiveCapability).toHaveBeenCalledWith(session, mapping, dependencies);
    expect(operation).toHaveBeenCalledOnce();
  });
  it("does not dispatch if current authority expires or is rejected", async () => {
    vi.mocked(requireExecutiveCapability).mockResolvedValueOnce({
      principalId: "principal", contextId: "current", expiresAt: Date.now() - 1,
    });
    const operation = vi.fn(async () => "unsafe");
    await expect(withExecutiveCapability(session as never, mapping, dependencies, operation)).rejects.toBeInstanceOf(AuthenticationDenied);
    vi.mocked(requireExecutiveCapability).mockRejectedValueOnce(new AuthenticationDenied());
    await expect(withExecutiveCapability(session as never, mapping, dependencies, operation)).rejects.toBeInstanceOf(AuthenticationDenied);
    expect(operation).not.toHaveBeenCalled();
  });
});
