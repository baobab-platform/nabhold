import { insightQuerySchema } from "@/lib/content/schemas"
import { listInsights } from "@/features/insights/queries"
import { PageHeader } from "@/components/marketing/page-header"
import { InsightCard } from "@/components/marketing/insight-card"
import { EmptyState } from "@/components/dashboard/empty-state"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const parsed = insightQuerySchema.safeParse(rawParams)
  const query = parsed.success ? parsed.data : {}

  const insights = await listInsights(query)

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Considered views, published when useful."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Insights" },
        ]}
      />
      <section className="shell pb-20">
        {insights.items.length === 0 ? (
          <EmptyState
            title="No publications yet"
            description="Corporate publications and strategic commentary will appear here as released."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {insights.items.map((insight) => (
              <InsightCard
                key={insight.slug}
                slug={insight.slug}
                title={insight.title}
                summary={insight.excerpt}
                topic={insight.contentType}
                publishedAt={new Date(insight.publishedAt).toLocaleDateString(
                  "en-ZA",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
