import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Compass, Globe2, Landmark, Network, ShieldCheck, Sprout, Trees, Users } from "lucide-react";
import { getContentGateway } from "@/lib/content";
import { AfricaFootprint } from "@/components/marketing/africa-footprint";

/**
 * The corporate story is an editorial composition, not a canonical registry.
 * Profile text is CMS-managed while company ownership, legal status and
 * geographical assertions must be substantiated by their own authorities.
 */
export const metadata: Metadata = {
  title: "About our Group | Nabhold Group Africa",
  description: "Discover Nabhold Group Africa's purpose, enterprise model, independently operated companies and responsible stewardship.",
};

const values = [
  { title: "Integrity", body: "Act with honesty and respect for commitments.", icon: ShieldCheck },
  { title: "Entrepreneurship", body: "Encourage initiative within accountable operating mandates.", icon: Sprout },
  { title: "Stewardship", body: "Make thoughtful long-term decisions for enduring businesses.", icon: Landmark },
  { title: "Innovation", body: "Use practical technology and insight to support progress.", icon: Compass },
];
const companies = [
  { name: "ZuriBeans", sector: "B2B sourcing and trade", icon: Globe2 },
  { name: "Thamani Global", sector: "Consumer commerce", icon: Building2 },
  { name: "Equator & Estate Co.", sector: "Real assets and development", icon: Landmark },
];
const operating = [
  { title: "Capital stewardship", body: "Invest with deliberate evaluation and governed allocation.", icon: Landmark, href: "/investment" },
  { title: "Responsible governance", body: "Support decisions through clear responsibilities and oversight.", icon: ShieldCheck, href: "/governance" },
  { title: "Operating autonomy", body: "Preserve each subsidiary's separate commercial and market mandate.", icon: Users, href: "/portfolio" },
  { title: "Shared digital capability", body: "Enable, rather than replace, operating authorities with Baobab Platform.", icon: Network, href: "/platform" },
];

export default async function Page() {
  const gateway = await getContentGateway();
  const profile = await gateway.getGroupProfile();

  return <article>
    <header className="relative overflow-hidden bg-[#111111] py-24 text-white md:py-32">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#3b2b0e]/50 to-transparent" aria-hidden="true" />
      <div className="shell relative"><p className="eyebrow !text-[var(--gold)]">Our Group · Our Story</p>
        <h1 className="display mt-7 max-w-5xl text-5xl md:text-7xl">{profile.title}</h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75">An African holding company committed to patient enterprise-building, accountable ownership and independently operated businesses.</p>
        <div className="mt-9 flex flex-wrap gap-3"><Link href="/portfolio" className="inline-flex min-h-12 items-center gap-2 bg-[var(--gold)] px-5 font-bold text-black">Explore our businesses <ArrowRight size={18}/></Link><Link href="#operating-model" className="inline-flex min-h-12 items-center gap-2 border border-white/40 px-5 font-semibold text-white">How our Group works <ArrowUpRight size={18}/></Link></div>
      </div>
    </header>
    <section id="identity" className="shell grid gap-9 py-20 lg:grid-cols-[.85fr_1.15fr]"><div><p className="eyebrow">Who we are</p><h2 className="mt-5 font-serif text-4xl md:text-5xl">One Group. Distinct ambitions.</h2></div><div className="space-y-5 text-lg leading-8 text-muted-foreground">{profile.body.map((block,index)=>block.type==="heading"?<h3 key={index} className="font-serif text-2xl text-foreground">{block.text}</h3>:<p key={index}>{block.text}</p>)}</div></section>
    <section className="bg-[var(--surface)] py-20"><div className="shell"><p className="eyebrow">Our direction</p><div className="mt-10 grid gap-6 lg:grid-cols-2"><div className="border-t-4 border-[var(--gold)] bg-[var(--paper)] p-8"><Compass className="text-[var(--gold-deep)]" size={34}/><h2 className="mt-6 font-serif text-4xl">Our purpose</h2><p className="mt-5 leading-8 text-muted-foreground">To establish and steward enduring African enterprises through responsible investment, governance and strategic support.</p></div><div className="border-t-4 border-[var(--gold)] bg-[var(--paper)] p-8"><Trees className="text-[var(--gold-deep)]" size={34}/><h2 className="mt-6 font-serif text-4xl">Our aspiration</h2><p className="mt-5 leading-8 text-muted-foreground">To build a respected African group known for accountable ownership, entrepreneurial independence and lasting value.</p></div></div><p className="mt-5 text-xs text-muted-foreground">These are editorial descriptions of the Group&apos;s direction, not representations of separately approved corporate policy.</p></div></section>
    <section className="shell py-20"><p className="eyebrow">Principles that guide us</p><h2 className="mt-4 font-serif text-4xl">Values expressed through action.</h2><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{values.map(v=><div key={v.title} className="border-t-2 border-[var(--gold)] p-5"><v.icon className="text-[var(--gold-deep)]" size={30}/><h3 className="mt-5 font-serif text-2xl">{v.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{v.body}</p></div>)}</div></section>
    <section className="bg-[#141414] py-20 text-white"><div className="shell"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow !text-[var(--gold)]">Our companies</p><h2 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl">Independent enterprises. Shared ambition.</h2></div><Link href="/portfolio" className="inline-flex gap-2 font-semibold text-[var(--gold)]">View portfolio <ArrowUpRight size={18}/></Link></div><div className="mt-12 grid gap-4 md:grid-cols-3">{companies.map(company=><div key={company.name} className="border border-white/20 p-6"><company.icon className="text-[var(--gold)]" size={32}/><h3 className="mt-8 font-serif text-3xl">{company.name}</h3><p className="mt-3 text-sm text-white/65">{company.sector}</p></div>)}</div></div></section>
    <section id="operating-model" className="shell scroll-mt-32 py-20"><p className="eyebrow">How the Group works</p><h2 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl">Distinct legal entities. Clear responsibilities.</h2><p className="mt-5 max-w-3xl leading-8 text-muted-foreground">The holding company supports and stewards the portfolio. Subsidiaries retain their own operating decisions. Baobab Platform is a shared technology capability, not an additional subsidiary.</p><div className="mt-10 rounded-md border border-border bg-[var(--surface)] p-6"><div className="mx-auto max-w-md bg-[#111] p-6 text-center text-white"><Trees className="mx-auto text-[var(--gold)]"/><strong className="mt-2 block">Nabhold Group Africa</strong><p className="mt-1 text-xs text-white/65">Non-trading holding company</p></div><div className="mx-auto h-8 w-px bg-[var(--gold-deep)]"/><div className="grid gap-3 md:grid-cols-3">{companies.map(c=><div key={c.name} className="border-t-4 border-[var(--gold)] bg-[var(--paper)] p-5 text-center"><strong>{c.name}</strong><p className="mt-2 text-xs text-muted-foreground">Separate operating mandate</p></div>)}</div><div className="mt-5 flex items-start gap-3 border border-border p-5"><Network className="shrink-0 text-[var(--gold-deep)]"/><div><strong>Baobab Platform — shared infrastructure</strong><p className="mt-2 text-sm text-muted-foreground">Technology service relationships remain distinct from corporate ownership.</p></div></div></div><div className="mt-10 grid gap-5 md:grid-cols-2">{operating.map(item=><Link href={item.href} key={item.title} className="group flex gap-4 border-b border-border p-5 hover:bg-[var(--surface)]"><item.icon size={28} className="shrink-0 text-[var(--gold-deep)]"/><div><h3 className="font-serif text-2xl">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p><span className="mt-3 inline-block text-xs font-bold text-[var(--gold-deep)]">Learn more ↗</span></div></Link>)}</div></section>
    <section className="bg-[var(--surface)] py-20"><div className="shell"><div className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Our African outlook</p><h2 className="mt-4 font-serif text-4xl">Rooted here. Looking forward.</h2></div><Link href="/markets/map" className="inline-flex gap-2 font-bold text-[var(--gold-deep)]">Explore the map <ArrowUpRight size={18}/></Link></div><AfricaFootprint compact /></div></section>
    <section className="shell grid gap-10 py-20 md:grid-cols-2"><div><p className="eyebrow">Leadership and stewardship</p><h2 className="mt-5 font-serif text-4xl">Accountability is a continuing responsibility.</h2></div><div><p className="text-lg leading-8 text-muted-foreground">Nabhold&apos;s governance depends on appropriate authority, transparent decisions and respect for each company&apos;s responsibilities. Verified executive and board profiles can be introduced following formal publication approval.</p><Link href="/governance" className="mt-7 inline-flex gap-2 font-bold text-[var(--gold-deep)]">Our governance approach <ArrowUpRight size={18}/></Link></div></section>
    <section className="bg-[var(--gold)] py-20"><div className="shell flex flex-wrap items-end justify-between gap-7"><div><p className="text-xs font-bold uppercase tracking-widest">Our future</p><h2 className="mt-5 font-serif text-5xl">Strong Roots. Inspired Growth.</h2><p className="mt-5 max-w-xl">Building businesses that can endure, adapt and contribute to African enterprise.</p></div><Link href="/investment" className="inline-flex min-h-12 items-center gap-2 bg-[#111] px-5 font-semibold text-white">How we invest <ArrowRight size={18}/></Link></div></section>
  </article>;
}
