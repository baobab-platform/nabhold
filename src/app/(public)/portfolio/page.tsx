import { listPortfolioCompanies } from "@/features/portfolio/queries"
import { PageHeader } from "@/components/marketing/page-header"
import { CompanyCard } from "@/components/marketing/company-card"
import { PreviewBanner } from "@/components/dashboard/preview-banner"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Building2, Globe2, Leaf, Network } from "lucide-react"
import Link from "next/link"

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
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {portfolio.map((c,i) => (
              <CompanyCard
                key={c.slug}
                index={i}
                className={i===0?"lg:col-span-4":i===1?"lg:col-span-2":"lg:col-span-3"}
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
      <section className="bg-[var(--ink)] py-20 text-white"><div className="shell"><p className="eyebrow !text-[var(--gold)]">Independent by design</p><h2 className="mt-5 max-w-3xl font-serif text-4xl">Distinct businesses. Shared ambition.</h2><div className="mt-12 grid gap-5 md:grid-cols-3">{[
 {title:"Trade and sourcing",icon:Leaf,body:"B2B cross-border sourcing is a dedicated operating mandate."},
 {title:"Consumer markets",icon:Globe2,body:"Consumer commerce has a distinct legal and commercial boundary."},
 {title:"Real assets",icon:Building2,body:"Property and development interests require their own investment discipline."}
].map(item=><article key={item.title} className="border-l border-white/25 pl-5"><item.icon className="text-[var(--gold)]"/><h3 className="mt-4 font-serif text-2xl">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{item.body}</p></article>)}</div><Link href="/platform" className="mt-10 inline-flex items-center gap-2 font-bold text-[var(--gold)]"><Network size={17}/> Explore shared capability →</Link></div></section>
    </>
  )
}
