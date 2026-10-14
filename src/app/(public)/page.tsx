import { getContentGateway } from "@/lib/content"
import { Hero } from "@/components/marketing/hero"
import { CompanyCard } from "@/components/marketing/company-card"
import { CtaBand } from "@/components/marketing/cta-band"
import { SectionHeader } from "@/components/marketing/section-header"
import { MetricStrip } from "@/components/marketing/metric-strip"

export default async function HomePage() {
  const gateway = await getContentGateway()
  const home = await gateway.getHomePage()

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nabhold Group Africa",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero
        eyebrow={home.eyebrow}
        headline={home.headline}
        introduction={home.introduction}
        primaryCta={home.primaryCta}
        secondaryCta={home.secondaryCta}
      />
      <MetricStrip
        metrics={[
          { label: "Focus", value: "Africa", hint: "Institutional holding company" },
          { label: "Model", value: "Portfolio", hint: "Autonomous operating companies" },
          { label: "Discipline", value: "Capital", hint: "Allocation with accountability" },
          { label: "Horizon", value: "Long-term", hint: "Patient ownership" },
        ]}
      />
      {home.featuredPortfolioCompanies.length > 0 ? (
        <section className="shell py-20">
          <SectionHeader eyebrow="Our portfolio" title="Independent businesses. Shared standards." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {home.featuredPortfolioCompanies.map((c, i) => (
              <CompanyCard
                key={c.slug}
                slug={c.slug}
                name={c.name}
                summary={c.summary}
                index={i}
              />
            ))}
          </div>
        </section>
      ) : null}
      {home.institutionalStatement ? (
        <CtaBand
          title={home.institutionalStatement}
          description="Institutional discipline joined to a clear understanding of African markets."
        />
      ) : null}
    </>
  )
}
