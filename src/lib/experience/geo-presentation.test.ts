import { describe, expect, it } from "vitest"
import { projectAfricaPoint } from "./geo-presentation"

describe("BXS editorial projection boundary", () => {
  it("preserves the existing equirectangular country projection", () => {
    expect(projectAfricaPoint([0, 0], 620, 660)).toEqual([
      (20 / 73) * 620,
      (39 / 78) * 660,
    ])
  })
  it("rejects malformed coordinates and viewports", () => {
    expect(() => projectAfricaPoint([181, 0], 620, 660)).toThrow(RangeError)
    expect(() => projectAfricaPoint([0, Number.NaN], 620, 660)).toThrow(RangeError)
    expect(() => projectAfricaPoint([0, 0], -1, 660)).toThrow(RangeError)
  })
})
