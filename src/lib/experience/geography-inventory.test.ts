import { describe, it, expect } from "vitest";
import shapes from "@/data/africa-geometry.json";
import provenance from "@/data/africa-geometry-provenance.json";
import { projectAfricaPoint } from "./geo-presentation";

describe("licensed editorial geography inventory", () => {
  it("matches the declared partial inventory and retains valid closed rings", () => {
    expect(shapes).toHaveLength(provenance.displayFeatureCount);
    expect(new Set(shapes.map(shape => shape.name)).size).toBe(shapes.length);
    for (const shape of shapes) for (const polygon of shape.coords) for (const ring of polygon) {
      expect(ring.length).toBeGreaterThanOrEqual(4);
      expect(ring[0]).toEqual(ring[ring.length - 1]);
      for (const point of ring) expect(() => projectAfricaPoint(point, 620, 660)).not.toThrow();
    }
    expect(provenance.omittedSmallStates).toContain("Seychelles");
    expect(provenance.boundaryNotice).toContain("not a legal boundary decision");
  });
});
