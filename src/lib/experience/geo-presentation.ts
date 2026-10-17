import { assertLonLat } from "@baobab-platform/experience-geo-core"

/**
 * Nabhold editorial SVG projection, not a transport route or GPS authority.
 * Shared Geo Core rejects malformed lon/lat. Legal market status remains a
 * separately attributed, subsidiary-specific view model.
 */
export function projectAfricaPoint(
  point: readonly number[],
  width: number,
  height: number,
): [number, number] {
  assertLonLat(point)
  if (![width, height].every((n) => Number.isFinite(n) && n > 0)) {
    throw new RangeError("Map viewport dimensions must be finite and positive")
  }
  return [((point[0] + 20) / 73) * width, ((39 - point[1]) / 78) * height]
}
