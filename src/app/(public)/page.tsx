import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Globe2, Leaf, Landmark } from "lucide-react";
import { getContentGateway } from "@/lib/content";
import { listInsights } from "@/features/insights/queries";
import { AfricaFootprint } from "@/components/marketing/africa-footprint";
import { Hero } from "@/components/marketing/hero";
import { CompanyCard } from "@/components/marketing/company-card";
import { InsightCard } from "@/components/marketing/insight-card";
import { SectionHeader } from "@/components/marketing/section-header";

/**
 * Landing page is deliberately a portfolio-and-opportunity gateway.
 * The About page alone owns the in-depth Group story, values and structure.
 * Real CMS content takes priority over editorial fallbacks; never invent KPIs.
 */
const companies = [
  { name:"ZuriBeans",summary:"Business-to-business sourcing and cross-border trade.",category:"B2B TRADE",icon:Leaf },
  { name:"Thamani Global",summary:"Consumer commerce with developing logistics experiences.",category:"CONSUMER COMMERCE",icon:Globe2 },
  { name:"Equator & Estate Co.",summary:"Property stewardship and real estate development interests.",category:"REAL ASSETS",icon:Building2 }
];

export default async function HomePage() {
  const gateway=await getContentGateway();
  const [home,publications]=await Promise.all([gateway.getHomePage(),listInsights({pageSize:3})]);
  return <main className="overflow-hidden">
    <Hero eyebrow={home.eyebrow} headline={home.headline} accentHeadline={home.accentHeadline} introduction={home.introduction} primaryCta={home.primaryCta} secondaryCta={home.secondaryCta} heroMedia={home.heroMedia} heroGallery={home.heroGallery}/>
    <section className="shell grid items-center gap-8 py-16 lg:grid-cols-[.6fr_1.4fr]"><div><p className="eyebrow">The Group at a glance</p><h2 className="mt-4 font-serif text-4xl">Building and enabling enterprise.</h2></div><div><p className="text-lg leading-8 text-muted-foreground">Nabhold builds and stewards independently operated businesses, while Baobab Platform is being developed to support enterprises beyond the Group. Discover both dimensions of our ambition.</p><Link href="/about/group" className="mt-4 inline-flex items-center gap-2 font-bold text-[var(--gold-deep)]">Meet our Group <ArrowUpRight size={17}/></Link></div></section>
    <section className="border-y border-border bg-[var(--surface)] py-20"><div className="shell"><div className="flex flex-wrap items-end justify-between gap-5"><SectionHeader eyebrow="Our portfolio" title="Three mandates. Distinct possibilities."/><Link href="/portfolio" className="inline-flex gap-2 font-bold">View portfolio <ArrowRight size={18}/></Link></div>
      {home.featuredPortfolioCompanies.length ? <div className="mt-10 grid gap-5 md:grid-cols-3">{home.featuredPortfolioCompanies.map((company,i)=><CompanyCard key={company.slug} slug={company.slug} name={company.name} summary={company.summary} image={company.logo??null} index={i}/>)}</div> :
      <div className="mt-10 grid gap-5 md:grid-cols-3">{companies.map(company=><article key={company.name} className="flex min-h-72 flex-col border-t-4 border-[var(--gold)] bg-[var(--paper)] p-7"><company.icon size={34} className="text-[var(--gold-deep)]"/><p className="eyebrow mt-9">{company.category}</p><h3 className="mt-3 font-serif text-3xl">{company.name}</h3><p className="mt-4 text-sm leading-7 text-muted-foreground">{company.summary}</p><Link href="/portfolio" className="mt-auto pt-7 font-bold text-[var(--gold-deep)]">Explore businesses ↗</Link></article>)}</div>}
    </div></section>
    {/* Separate the platform's future enterprise-enablement role from equity ownership. */}
    <section className="relative overflow-hidden bg-[#151515] py-20 text-white">
      <div className="shell grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <p className="eyebrow !text-[var(--gold)]">Beyond our businesses</p>
          <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
            Enabling what&apos;s next for enterprises beyond our Group.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
            Baobab Platform is being developed as shared enterprise infrastructure.
            Its goal is to serve Nabhold companies and, as external onboarding becomes
            ready, other independent organisations — without conflating their legal identities.
          </p>
          <Link href="/platform" className="mt-8 inline-flex min-h-12 items-center gap-2 bg-[var(--gold)] px-5 text-sm font-bold text-black">
            Discover Baobab Platform <ArrowUpRight size={18} aria-hidden="true"/>
          </Link>
        </div>
        <div className="relative grid min-h-64 place-items-center overflow-hidden border border-white/20 bg-[#222] p-9" aria-hidden="true">
          <div className="absolute size-48 rounded-full border border-[var(--gold)]/50"/>
          <div className="absolute size-64 rounded-full border border-white/15"/>
          <div className="absolute size-80 rounded-full border border-white/10"/>
          <span className="relative font-serif text-5xl text-[var(--gold)]">BAOBAB</span>
          <span className="relative text-xs font-bold tracking-[.3em] text-white/70">PLATFORM</span>
        </div>
      </div>
    </section>
    <section className="shell grid items-center gap-10 py-20 md:grid-cols-2"><div><p className="eyebrow">Where opportunity meets enterprise</p><h2 className="mt-5 font-serif text-5xl">Progress begins with a clear mandate.</h2><p className="mt-6 max-w-xl leading-8 text-muted-foreground">Across trade, consumer markets and real assets, our companies pursue distinct opportunities. The Group provides stewardship, not a single operating strategy.</p><Link href="/sectors" className="mt-7 inline-flex gap-2 font-bold text-[var(--gold-deep)]">Explore strategic sectors <ArrowUpRight size={17}/></Link></div><div className="grid gap-4 sm:grid-cols-2">{[{title:"Trade and sourcing",icon:Leaf},{title:"Consumer markets",icon:Globe2},{title:"Real assets",icon:Building2},{title:"Long-term enterprise",icon:Landmark}].map(item=><div key={item.title} className="min-h-36 border border-border bg-[var(--surface)] p-6"><item.icon size={28} className="text-[var(--gold-deep)]"/><h3 className="mt-6 font-serif text-xl">{item.title}</h3></div>)}</div></section>
    <section className="bg-[var(--surface)] py-20"><div className="shell"><div className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">An African perspective</p><h2 className="mt-4 font-serif text-4xl">Explore emerging market contexts.</h2></div><Link href="/markets/map" className="inline-flex gap-2 font-bold text-[var(--gold-deep)]">Explore the full map <ArrowRight size={18}/></Link></div><AfricaFootprint compact/></div></section>
    <section className="shell py-20"><div className="flex flex-wrap items-end justify-between gap-5"><SectionHeader eyebrow="Perspectives and intelligence" title="Ideas worth exploring."/><Link href="/insights" className="inline-flex gap-2 font-bold text-[var(--gold-deep)]">All insights <ArrowUpRight size={17}/></Link></div>{publications.items.length ? <div className="mt-10 grid gap-5 md:grid-cols-3">{publications.items.map(item=><InsightCard key={item.slug} slug={item.slug} title={item.title} summary={item.excerpt} topic={item.contentType} publishedAt={new Date(item.publishedAt).toLocaleDateString("en-ZA")}/>)}</div>:<div className="mt-10 border-l-4 border-[var(--gold)] bg-[var(--surface)] p-7"><p className="max-w-xl text-muted-foreground">Published Group insights and market perspectives will appear here when approved. Explore our developing intelligence direction.</p><Link href="/intelligence" className="mt-4 inline-flex gap-2 font-bold text-[var(--gold-deep)]">Our intelligence approach <ArrowUpRight size={17}/></Link></div>}</section>
    <section className="bg-[var(--gold)] py-20"><div className="shell flex flex-wrap items-end justify-between gap-7"><div><p className="eyebrow">Nabhold Group Africa</p><h2 className="mt-4 font-serif text-5xl">{home.institutionalStatement||"Strong Roots. Inspired Growth."}</h2><p className="mt-4">Independent businesses. Enduring ambition.</p></div><Link href="/about/group" className="inline-flex min-h-12 items-center gap-2 bg-[#111] px-5 font-semibold text-white">Discover our story <ArrowRight size={17}/></Link></div></section>
  </main>;
}
