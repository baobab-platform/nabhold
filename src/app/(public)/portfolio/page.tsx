import { listPortfolioCompanies } from "@/features/portfolio/queries"
import { PageHeader } from "@/components/marketing/page-header"
import { CompanyCard } from "@/components/marketing/company-card"
import { PreviewBanner } from "@/components/dashboard/preview-banner"
import { EmptyState } from "@/components/dashboard/empty-state"

export default async function Page() {
  const portfolio = await listPortfolioCompanies()

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Independent businesses. Shared discipline."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Portfolio" },
        ]}
      />
      <section className="shell pb-20">
        {portfolio.some((c) => c.devFallback) ? (
          <div className="mb-8">
            <PreviewBanner description="Development preview data only. No Payload content is connected." />
          </div>
        ) : null}
        {portfolio.length === 0 ? (
          <EmptyState
            title="Portfolio content is not yet available"
            description="Companies will appear here once published through the corporate content gateway."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((c) => (
              <CompanyCard
                key={c.slug}
                slug={c.slug}
                name={c.name}
                summary={c.summary}
                sector={c.sector}
                image={c.logo ?? null}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
