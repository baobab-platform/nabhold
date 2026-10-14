import { cn } from "cn"

type Metric = { label: string; value: string; hint?: string }

type MetricStripProps = {
  metrics: Metric[]
  className?: string
}

export function MetricStrip({ metrics, className }: MetricStripProps) {
  if (metrics.length === 0) return null
  return (
    <section className={cn("border-y border-border bg-[var(--surface)] py-10", className)}>
      <div className="shell grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="eyebrow">{m.label}</p>
            <p className="mt-2 font-serif text-3xl">{m.value}</p>
            {m.hint ? (
              <p className="mt-1 text-xs text-muted-foreground">{m.hint}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}
