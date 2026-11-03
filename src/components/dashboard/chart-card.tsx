import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/dashboard/empty-state"
import { cn } from "cn"

type Point = Readonly<{ label: string; value: number }>

/**
 * Executive signal evidence is read-only and server-composed. The former
 * Recharts client island shipped an entire interactive charting runtime into
 * the estate for a preview-only surface. Render a bounded, accessible SVG and
 * the exact source values instead; a chart cannot create Pulse authority.
 *
 * The executive page is behind the existing release/session gate. This
 * component does not fetch data, grant access or fabricate missing readings.
 */
export function ChartCard({
  title,
  data,
  className,
  source,
  asOf,
}: {
  title: string
  data: readonly Point[]
  source: "PULSE_OWNER" | "SYNTHETIC_PREVIEW"
  asOf: string
  className?: string
}) {
  const valid =
    data.length > 0 &&
    data.length <= 40 &&
    data.every(
      (point) =>
        Number.isFinite(point.value) &&
        point.value >= 0 &&
        point.value <= 100 &&
        typeof point.label === "string" &&
        point.label.length > 0 &&
        point.label.length <= 120,
    )
  const left = 20
  const right = 620
  const top = 18
  const bottom = 178
  const coords = valid
    ? data.map((point, i) => ({
        x: left + (data.length === 1 ? (right - left) / 2 : (i * (right - left)) / (data.length - 1)),
        y: bottom - (point.value / 100) * (bottom - top),
      }))
    : []
  const points = coords.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!valid ? (
          <EmptyState
            title="No qualified series yet"
            description="A bounded, valid confidence series will appear when Pulse provides one."
          />
        ) : (
          <figure>
            <svg
              viewBox="0 0 640 200"
              className="h-52 w-full"
              aria-hidden="true"
              focusable="false"
            >
              <line x1={left} y1={top} x2={left} y2={bottom} stroke="var(--line)" />
              <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="var(--line)" />
              {[0, 25, 50, 75, 100].map((value) => (
                <line
                  key={value}
                  x1={left}
                  y1={bottom - value * (bottom - top) / 100}
                  x2={right}
                  y2={bottom - value * (bottom - top) / 100}
                  stroke="var(--line)"
                  opacity={0.45}
                />
              ))}
              {coords.length > 1 ? (
                <polygon
                  points={`${left},${bottom} ${points} ${right},${bottom}`}
                  fill="var(--forest)"
                  fillOpacity={0.12}
                />
              ) : null}
              <polyline
                points={points}
                stroke="var(--forest)"
                strokeWidth={3}
                strokeLinejoin="round"
                fill="none"
              />
              {coords.map(({ x, y }, i) => (
                <circle key={i} cx={x} cy={y} r={4} fill="var(--forest)" />
              ))}
            </svg>
            <figcaption className="mt-2 text-xs text-muted-foreground">
              Illustrative signal confidence, from the currently resolved overview.
              Values are not financial, market-approval or legal-authority evidence.
              <span className="mt-1 block">
                Source: {source === "SYNTHETIC_PREVIEW" ? "Synthetic development fixture, not Pulse" : "Pulse executive overview API"}.
                Reported as of: {asOf || "Not supplied"}.
              </span>
            </figcaption>
            <div className="mt-4 max-h-48 overflow-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Exact confidence readings in chart order</caption>
                <thead>
                  <tr><th scope="col" className="py-2 pr-3">Signal</th><th scope="col" className="py-2">Confidence</th></tr>
                </thead>
                <tbody>
                  {data.map((point, i) => (
                    <tr key={i} className="border-t border-border">
                      <th scope="row" className="py-2 pr-3 font-medium">{point.label}</th>
                      <td className="py-2">{point.value}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>
        )}
      </CardContent>
    </Card>
  )
}
