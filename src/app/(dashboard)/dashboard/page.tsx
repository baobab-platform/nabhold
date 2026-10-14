import { notFound } from "next/navigation"

import {
  getExecutiveOverview,
  PulseUnavailableError,
} from "@/lib/pulse/client"
import { isReleaseEnabled } from "@/lib/release/release-class"
import { previewOverview } from "@/features/pulse/preview"
import { SignalCard } from "@/components/dashboard/signal-card"
import { OpportunityTable } from "@/components/dashboard/opportunity-table"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { PreviewBanner } from "@/components/dashboard/preview-banner"
import { ChartCard } from "@/components/dashboard/chart-card"
import { SectionHeader } from "@/components/marketing/section-header"

export default async function Page() {
  if (!isReleaseEnabled("R3")) notFound()

  let data
  let preview = false
  try {
    data = await getExecutiveOverview()
  } catch (error) {
    if (
      !(error instanceof PulseUnavailableError) ||
      process.env.NABHOLD_DASHBOARD_PREVIEW !== "true"
    ) {
      throw error
    }
    data = previewOverview
    preview = true
  }

  const avgConfidence =
    data.signals.length > 0
      ? Math.round(
          (data.signals.reduce((a: number, s: { confidence: number }) => a + s.confidence, 0) /
            data.signals.length) *
            100
        )
      : 0

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Decision surface</p>
        <h1 className="mt-2 font-serif text-4xl">Executive overview</h1>
        <p role="note" className="mt-3 text-sm text-muted-foreground">
          Advisory prototype. Not sourced from a canonical Baobab capability
          (NAB-GOLIVE-MP-001 B-13); not an authoritative financial or market
          statement.
        </p>
      </div>

      {preview ? (
        <PreviewBanner description="Preview data only. No Pulse API is connected." />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Signals" value={String(data.signals.length)} />
        <KpiCard label="Opportunities" value={String(data.opportunities.length)} />
        <KpiCard
          label="Avg confidence"
          value={`${avgConfidence}%`}
          deltaTone="neutral"
        />
        <KpiCard label="Mode" value={preview ? "Preview" : "Live"} />
      </div>

      <section>
        <SectionHeader title="Market signals" className="mb-4" />
        <div className="grid gap-4 md:grid-cols-2">
          {data.signals.map(
            (s: {
              id: string
              market: string
              title: string
              direction: string
              confidence: number
            }) => (
              <SignalCard
                key={s.id}
                market={s.market}
                title={s.title}
                direction={s.direction}
                confidence={s.confidence}
              />
            )
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Ranked opportunities" className="mb-4" />
        <OpportunityTable rows={data.opportunities} />
      </section>

      <section>
        <ChartCard
          title="Illustrative confidence series"
          data={data.signals.map(
            (s: { market: string; confidence: number }, i: number) => ({
              label: s.market || `S${i + 1}`,
              value: Math.round(s.confidence * 100),
            })
          )}
        />
      </section>
    </div>
  )
}
