import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { ChartCard } from "./chart-card"

describe("executive evidence chart remains server-side and honest", () => {
  it("renders bounded, exact source values with a visual chart and accessible table", () => {
    const html = renderToStaticMarkup(
      <ChartCard
        title="Illustrative confidence"
        source="PULSE_OWNER"
        asOf="2026-11-03T00:00:00Z"
        data={[
          { label: "Uganda", value: 75 },
          { label: "South Africa", value: 40 },
        ]}
      />,
    )
    expect(html).toContain("Illustrative confidence")
    expect(html).toContain("<svg")
    expect(html).toContain("<polyline")
    expect(html).toContain("<table")
    expect(html).toContain("Uganda</th>")
    expect(html).toContain("South Africa</th>")
    expect(html).toContain(">75%</td>")
    expect(html).toContain(">40%</td>")
    expect(html).toContain("not financial, market-approval or legal-authority evidence")
    expect(html).toContain("Source: Pulse executive overview API")
    expect(html).toContain("Reported as of: 2026-11-03T00:00:00Z")
  })

  it("does not silently clamp, fabricate or graph invalid input", () => {
    for (const data of [
      [],
      [{ label: "invalid", value: Number.NaN }],
      [{ label: "oversized", value: 101 }],
      [{ label: "negative", value: -1 }],
      Array.from({ length: 41 }, (_, i) => ({ label: String(i), value: 50 })),
    ]) {
      const html = renderToStaticMarkup(<ChartCard title="Signals" source="SYNTHETIC_PREVIEW" asOf="Preview data" data={data} />)
      expect(html).toContain("No qualified series yet")
      expect(html).not.toContain("<svg")
    }
  })

  it("escapes untrusted labels and never converts them to HTML or links", () => {
    const html = renderToStaticMarkup(
      <ChartCard title="Signals" source="SYNTHETIC_PREVIEW" asOf="Preview data" data={[{ label: "<script>alert(1)</script>", value: 1 }]} />,
    )
    expect(html).toContain("&lt;script&gt;")
    expect(html).toContain("Source: Synthetic development fixture, not Pulse")
    expect(html).not.toContain("<script>")
    expect(html).not.toContain("href=")
  })
})
