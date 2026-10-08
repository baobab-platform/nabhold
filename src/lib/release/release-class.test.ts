import { afterEach, describe, expect, it, vi } from "vitest";

import {
  assertReleaseEnabled,
  isReleaseEnabled,
  ReleaseNotEnabledError,
  releaseFlagName,
} from "./release-class";

describe("release classes", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("enables only R0 by default", () => {
    expect(isReleaseEnabled("R0")).toBe(true);
    expect(isReleaseEnabled("R1")).toBe(false);
    expect(isReleaseEnabled("R2")).toBe(false);
    expect(isReleaseEnabled("R3")).toBe(false);
  });

  it("enables R1-R3 only for the exact value 'true'", () => {
    for (const value of ["1", "TRUE", "yes", "", " true"]) {
      vi.stubEnv("NABHOLD_RELEASE_R1", value);
      expect(isReleaseEnabled("R1")).toBe(false);
    }

    vi.stubEnv("NABHOLD_RELEASE_R1", "true");
    expect(isReleaseEnabled("R1")).toBe(true);
  });

  it("does not infer one release class from another", () => {
    vi.stubEnv("NABHOLD_RELEASE_R1", "true");

    expect(isReleaseEnabled("R2")).toBe(false);
    expect(isReleaseEnabled("R3")).toBe(false);
  });

  it("lets R0 be switched off explicitly as a kill switch", () => {
    vi.stubEnv("NABHOLD_RELEASE_R0", "false");

    expect(isReleaseEnabled("R0")).toBe(false);
  });

  it("fails closed when a disabled class is asserted", () => {
    expect(() => assertReleaseEnabled("R3")).toThrow(ReleaseNotEnabledError);
    expect(() => assertReleaseEnabled("R0")).not.toThrow();
  });

  it("names the flag for each class", () => {
    expect(releaseFlagName("R2")).toBe("NABHOLD_RELEASE_R2");
  });
});
