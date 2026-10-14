import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, ChartNoAxesCombined, Globe2, Leaf, Network, Scale, ShieldCheck, Sprout, Trees, Users } from "lucide-react";
import { getContentGateway } from "@/lib/content";
import { Hero } from "@/components/marketing/hero";
import { CompanyCard } from "@/components/marketing/company-card";
import { SectionHeader } from "@/components/marketing/section-header";

/**
 * The public estate presents Nabhold's institutional mandate without asserting
 * unverifiable investment statistics, market launch status or portfolio returns.
 * Company records and home editorial copy remain resolved by the CMS gateway.
 */
const principles = [
  { title: "Disciplined investment", body: "Patient capital, practical diligence and a long-term view of enterprise value.", icon: ChartNoAxesCombined },
  { title: "Strong governance", body: "Responsible stewardship and clear accountability at the Group and company levels.", icon: Scale },
  { title: "Shared capability", body: "Common digital infrastructure that supports rather than replaces operating autonomy.", icon: Network },
  { title: "Long-term impact", body: "Building durable businesses that contribute to communities and economic opportunity.", icon: Users },
];

const companies = [
  { name: "ZuriBeans", summary: "Business-to-business sourcing and cross-border trade.", detail: "B2B TRADE", icon: Leaf },
  { name: "Thamani Global", summary: "Consumer commerce and developing logistics experiences.", detail: "B2C COMMERCE", icon: Globe2 },
  { name: "Equator & Estate Co.", summary: "Real estate, property stewardship and development interests.", detail: "PROPERTY", icon: Building2 },
];

/** Illustration only: never conflate incorporation with commercial operation. */
function GroupArchitecture() {
  return <section id="architecture" className="scroll-mt-36 bg-[var(--surface)] py-20">
    <div className="shell"><SectionHeader eyebrow="Our Group architecture" title="Independent businesses. Shared foundations." />
      <p className="mt-5 max-w-3xl text-muted-foreground">Nabhold stewards its portfolio while operating companies retain responsibility for their own business decisions. Shared technology is an enabling relationship, not a fourth subsidiary.</p>
      <div className="mx-auto mt-10 max-w-md border border-border bg-[var(--ink)] p-6 text-center text-white"><Trees className="mx-auto mb-2 text-[var(--gold)]"/><strong className="tracking-widest">NABHOLD GROUP AFRICA</strong><p className="mt-1 text-xs text-white/65">Non-trading holding company</p></div>
      <div className="mx-auto h-9 w-px bg-[var(--gold-deep)]" aria-hidden="true"/>
      <div className="grid gap-4 md:grid-cols-3">{companies.map((company) => <div key={company.name} className="border-t-4 border-[var(--gold)] bg-[var(--paper)] p-6 text-center"><h3 className="font-serif text-2xl">{company.name}</h3><p className="mt-2 text-xs font-bold tracking-widest text-[var(--gold-deep)]">{company.detail}</p></div>)}</div>
      <div className="mt-5 flex items-start gap-4 border border-border p-5"><Network className="shrink-0 text-[var(--gold-deep)]"/><div><h3 className="font-semibold">Baobab Platform — shared digital infrastructure</h3><p className="mt-1 text-sm text-muted-foreground">A shared capability layer supporting separate legal entities and their digital estates; not represented as an operating company in the ownership hierarchy.</p></div></div>
    </div>
  </section>;
}

export default async function HomePage() {
  const gateway = await getContentGateway();
  const home = await gateway.getHomePage();
  const structuredData = { "@context": "https://schema.org", "@type": "Organization", name: "Nabhold Group Africa" };

  return <div className="overflow-hidden">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/>
    <Hero eyebrow={home.eyebrow} headline={home.headline} introduction={home.introduction} primaryCta={home.primaryCta} secondaryCta={home.secondaryCta}/>
    <section className="border-b border-border bg-[var(--surface)] py-8"><div className="shell grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[
      ["Mandate","Holding company"],["Operating model","Autonomous businesses"],["Platform","Shared infrastructure"],["Horizon","Long-term value"]
    ].map(([label,value]) => <div key={label} className="border-l-2 border-[var(--gold)] pl-4"><p className="eyebrow">{label}</p><p className="mt-2 font-serif text-2xl">{value}</p></div>)}</div></section>

    <section className="shell grid items-center gap-7 py-20 lg:grid-cols-2">
      <div><p className="eyebrow">The Group at a glance</p><h2 className="display mt-5 text-4xl md:text-5xl">A non-trading holding company with a long-term African vision.</h2></div>
      <div><p className="text-lg leading-8 text-muted-foreground">We support ambitious independent businesses through strategic stewardship, governance, disciplined capital allocation and shared capability. Each operating company retains its own commercial responsibilities.</p><Link className="mt-6 inline-flex items-center gap-2 font-bold text-[var(--gold-deep)]" href="/about/group">About Nabhold <ArrowUpRight size={18}/></Link></div>
    </section>

    <section id="businesses" className="scroll-mt-36 border-y border-border bg-[var(--surface)] py-20"><div className="shell"><div className="flex flex-wrap items-end justify-between gap-5"><SectionHeader eyebrow="Our businesses" title="Distinct enterprises. A shared ambition."/><Link href="/portfolio" className="inline-flex items-center gap-2 font-bold">View portfolio <ArrowRight size={17}/></Link></div>
      {home.featuredPortfolioCompanies.length ? <div className="mt-10 grid gap-5 md:grid-cols-3">{home.featuredPortfolioCompanies.map((company,index) => <CompanyCard key={company.slug} slug={company.slug} name={company.name} summary={company.summary} index={index}/>)}</div> :
      <div className="mt-10 grid gap-5 md:grid-cols-3">{companies.map((company) => <div key={company.name} className="flex min-h-64 flex-col border border-border bg-[var(--paper)] p-7"><company.icon className="mb-8 size-8 text-[var(--gold-deep)]"/><p className="eyebrow">{company.detail}</p><h3 className="mt-3 font-serif text-3xl">{company.name}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{company.summary}</p><Link className="mt-auto pt-6 font-semibold text-[var(--gold-deep)]" href="/portfolio">Explore portfolio →</Link></div>)}</div>}
    </div></section>

    <section id="value" className="scroll-mt-36 bg-[#111111] py-20 text-white"><div className="shell"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow !text-[var(--gold)]">How we create value</p><h2 className="mt-4 font-serif text-4xl md:text-5xl">Built for lasting value.</h2></div><p className="max-w-xs text-sm text-white/60">Patient capital today. Stronger African enterprises tomorrow.</p></div><div className="mt-12 grid gap-8 md:grid-cols-4">{principles.map((item) => <article className="border-l border-white/20 pl-5" key={item.title}><item.icon className="size-9 text-[var(--gold)]" strokeWidth={1.5}/><h3 className="mt-5 font-serif text-2xl">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{item.body}</p></article>)}</div></div></section>

    <GroupArchitecture/>

    <section className="shell grid gap-10 py-20 md:grid-cols-2">
      <article id="investment" className="scroll-mt-36 border-t-2 border-[var(--gold)] pt-6"><Sprout className="size-12 text-[var(--gold-deep)]"/><p className="eyebrow mt-6">Investment philosophy</p><h2 className="mt-3 font-serif text-4xl">Patient capital for real opportunities.</h2><p className="mt-4 max-w-md leading-7 text-muted-foreground">Our approach prioritises thoughtful evaluation, sustainable operating foundations and accountability. Investment decisions remain subject to the Group&apos;s governance processes.</p></article>
      <article id="governance" className="scroll-mt-36 border-t-2 border-[var(--gold)] pt-6"><ShieldCheck className="size-12 text-[var(--gold-deep)]"/><p className="eyebrow mt-6">Corporate governance</p><h2 className="mt-3 font-serif text-4xl">Responsible ownership. Autonomous businesses.</h2><p className="mt-4 max-w-md leading-7 text-muted-foreground">Group oversight and capital stewardship coexist with distinct legal entities, operating mandates and independent market decisions.</p></article>
    </section>

    <section id="markets" className="scroll-mt-36 border-t border-border bg-[var(--surface)] py-20"><div className="shell grid items-center gap-10 lg:grid-cols-2"><div><p className="eyebrow">Our African perspective</p><h2 className="display mt-4 text-5xl">Rooted in Africa. Positioned for growth.</h2><p className="mt-6 max-w-lg leading-7 text-muted-foreground">Nabhold is established in South Africa. The Group&apos;s operating companies evaluate markets on their own mandates and readiness; incorporation, proposed entry and actual trading must never be confused.</p><Link href="/sectors" className="mt-6 inline-flex gap-2 font-bold text-[var(--gold-deep)]">Explore our sectors <ArrowRight size={18}/></Link></div><div className="rounded-sm border border-border bg-[var(--paper)] p-10"><Globe2 className="size-20 text-[var(--gold-deep)]" strokeWidth={1}/><p className="mt-7 font-serif text-3xl">Africa is not one market.</p><p className="mt-4 text-sm leading-7 text-muted-foreground">Different jurisdictions, entities and growth decisions deserve specific, verified disclosures—not a promotional map of unverified operations.</p></div></div></section>

    <section id="intelligence" className="scroll-mt-36 bg-[var(--ink)] py-20 text-white"><div className="shell grid items-center gap-10 md:grid-cols-2"><div><p className="eyebrow !text-[var(--gold)]">Nabhold intelligence</p><h2 className="mt-5 font-serif text-5xl">Better intelligence. Better decisions.</h2><p className="mt-5 max-w-xl leading-7 text-white/70">Understanding African markets and identifying developments that inform responsible strategic choices. Research products are published only when ready.</p><Link href="/insights" className="mt-7 inline-flex items-center gap-2 bg-[var(--gold)] px-5 py-3 text-sm font-bold text-black">Explore insights <ArrowUpRight size={16}/></Link></div><div className="grid grid-cols-2 gap-3">{["Market intelligence","Investment research","Sector outlooks","Opportunity analysis"].map((item) => <div key={item} className="flex min-h-24 items-center gap-3 border border-white/20 p-4 text-sm"><ChartNoAxesCombined className="shrink-0 text-[var(--gold)]" size={24}/>{item}</div>)}</div></div></section>

    <section className="shell py-20"><div className="flex flex-wrap items-end justify-between gap-5"><SectionHeader eyebrow="Perspectives" title="Ideas, perspectives and progress."/><Link href="/insights" className="font-bold text-[var(--gold-deep)]">Visit insights <ArrowUpRight className="inline size-4"/></Link></div><p className="mt-6 max-w-2xl text-muted-foreground">Explore published Group commentary and strategic perspectives. Articles appear when editorial content is available.</p></section>

    <section className="bg-[var(--gold)] py-20"><div className="shell flex flex-wrap items-end justify-between gap-7"><div><p className="text-xs font-bold uppercase tracking-widest">Nabhold Group Africa</p><h2 className="mt-4 font-serif text-5xl md:text-6xl">{home.institutionalStatement || "Strong Roots. Inspired Growth."}</h2><p className="mt-4">Enduring businesses. Opportunity across generations.</p></div><Link href="/about/group" className="inline-flex min-h-12 items-center gap-2 bg-[var(--ink)] px-5 font-bold text-white">Our story <ArrowRight size={17}/></Link></div></section>
  </div>;
}
