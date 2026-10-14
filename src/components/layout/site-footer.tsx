import Link from "next/link";
import { Trees, ArrowUpRight } from "lucide-react";
import { getContentGateway } from "@/lib/content";

/** Corporate wayfinding. No unverified contact coordinates or statutory claims. */
const groups = [
  { title: "Our Group", links: [{label:"About us",href:"/about/group"},{label:"How we build",href:"/#value"},{label:"Governance",href:"/#governance"}] },
  { title: "Our Businesses", links: [{label:"Portfolio",href:"/portfolio"},{label:"Group structure",href:"/#architecture"},{label:"Strategic sectors",href:"/sectors"}] },
  { title: "Investment & Markets", links: [{label:"Investment approach",href:"/#investment"},{label:"African footprint",href:"/#markets"},{label:"Intelligence",href:"/#intelligence"}] },
  { title: "Insights & Access", links: [{label:"Insights",href:"/insights"},{label:"Executive login",href:"/sign-in"}] },
];

export async function SiteFooter() {
  const gateway = await getContentGateway();
  const footer = await gateway.getFooter();
  return (
    <footer className="bg-[#101010] text-white">
      <div className="shell grid gap-10 py-16 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Link href="/" className="flex items-center gap-3"><Trees className="size-10 text-[var(--gold)]"/><span className="text-xl font-bold tracking-widest">NABHOLD<span className="block text-xs tracking-[.22em]">GROUP AFRICA</span></span></Link>
          <p className="mt-6 max-w-xs font-serif text-2xl">{footer.statement || "Strong Roots. Inspired Growth."}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">{footer.tagline || "A long-term African holding company supporting autonomous enterprises."}</p>
        </div>
        {groups.map((group) => <nav key={group.title} aria-label={group.title}><h2 className="mb-5 text-xs font-bold">{group.title}</h2><ul className="space-y-3">{group.links.map((link) => <li key={link.href}><Link href={link.href} className="text-xs leading-6 text-white/65 hover:text-[var(--gold)]">{link.label}</Link></li>)}</ul></nav>)}
      </div>
      {footer.links.length > 0 ? <nav aria-label="Additional corporate links" className="shell flex flex-wrap gap-5 border-t border-white/10 py-4">{footer.links.map((item) => <Link key={item.href} className="text-xs text-white/60 hover:text-white" href={item.href}>{item.label} <ArrowUpRight className="inline size-3"/></Link>)}</nav> : null}
      <div className="border-t border-[var(--gold)]/70"><div className="shell flex flex-col justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row"><p>© {new Date().getFullYear()} Nabhold Group Africa. All rights reserved.</p><p>Institutional information · South Africa</p></div></div>
    </footer>
  );
}
