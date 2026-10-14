import Link from "next/link";
import { ArrowUpRight, LockKeyhole, ChevronDown, Building2, Landmark, Globe2, ShieldCheck, Network, BookOpen, Trees, Compass, MapPinned } from "lucide-react";
import { MobileNav } from "@/components/marketing/mobile-nav";

/**
 * Single route inventory for both desktop and mobile. Only the three
 * hierarchical categories open mega menus; Insights navigates directly.
 * This prevents the old all-items-dropdown behaviour and duplicate links.
 */
export const siteNavigation = [
  { label:"Our Group",href:"/about/group",icon:Trees,children:[
    {label:"Our story",href:"/about/group",description:"Identity, purpose and corporate profile",icon:Trees},
    {label:"Governance",href:"/governance",description:"Accountability and stewardship",icon:ShieldCheck},
    {label:"Shared capability",href:"/platform",description:"Baobab Platform and Group relationships",icon:Network}
  ]},
  { label:"Businesses",href:"/portfolio",icon:Building2,children:[
    {label:"Our portfolio",href:"/portfolio",description:"Independent operating companies",icon:Building2},
    {label:"Strategic sectors",href:"/sectors",description:"Distinct enterprise mandates",icon:Compass},
    {label:"Shared digital infrastructure",href:"/platform",description:"Baobab Platform — not a subsidiary",icon:Network}
  ]},
  { label:"Investment",href:"/investment",icon:Landmark,children:[
    {label:"Investment philosophy",href:"/investment",description:"Long-term capital stewardship",icon:Landmark},
    {label:"Markets & footprint",href:"/markets",description:"Geographic market perspectives",icon:Globe2},
    {label:"Interactive Africa map",href:"/markets/map",description:"Explore selected market contexts",icon:MapPinned}
  ]},
  { label:"Insights",href:"/insights",icon:BookOpen,children:[] }
] as const;

export function SiteHeader() {
  return <header className="sticky top-0 z-50 border-b border-border bg-[var(--surface)]/95 backdrop-blur">
    <div className="bg-[#111] text-white"><div className="shell flex min-h-9 items-center justify-between gap-3 text-[11px]"><span className="hidden sm:block">Building enduring enterprises for Africa&apos;s next generation.</span><span className="sm:hidden">Nabhold Group Africa</span><nav aria-label="Utility" className="flex gap-4"><Link href="/insights">Newsroom</Link><Link href="/contact">Contact</Link><span aria-label="Current language English">EN</span></nav></div></div>
    <div className="shell flex min-h-[76px] items-center justify-between gap-4">
      <Link href="/" aria-label="Nabhold Group Africa home" className="flex shrink-0 items-center gap-2"><Trees className="size-9 text-[var(--gold-deep)]"/><span className="text-sm font-extrabold tracking-widest">NABHOLD<span className="block text-[10px] text-muted-foreground">GROUP AFRICA</span></span></Link>
      <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex xl:gap-7">
        {siteNavigation.map(item=><div key={item.href} className="group">
          <Link href={item.href} className="flex min-h-12 items-center gap-1.5 text-sm font-semibold hover:text-[var(--gold-deep)] focus-visible:text-[var(--gold-deep)]"><item.icon size={16}/>{item.label}{item.children.length>0?<ChevronDown size={13}/>:null}</Link>
          {item.children.length>0?<div className="invisible fixed left-1/2 top-[112px] z-50 grid w-[min(92vw,990px)] -translate-x-1/2 grid-cols-[.85fr_1.5fr] gap-8 border border-border bg-[var(--surface)] p-8 opacity-0 shadow-2xl transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <div className="border-r border-border pr-6"><p className="eyebrow">{item.label}</p><h2 className="mt-4 font-serif text-3xl">{item.label==="Our Group"?"Our purpose and stewardship.":item.label==="Businesses"?"Distinct enterprises. Shared ambition.":"Where long-term value begins."}</h2><Link className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--gold-deep)]" href={item.href}>Explore {item.label}<ArrowUpRight size={15}/></Link></div>
            <div className="grid grid-cols-2 gap-2">{item.children.map(child=><Link key={child.href} href={child.href} className="flex items-start gap-3 p-4 hover:bg-[var(--paper)] focus-visible:bg-[var(--paper)]"><child.icon size={23} className="shrink-0 text-[var(--gold-deep)]"/><span><strong className="block text-sm">{child.label}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{child.description}</span></span></Link>)}</div>
          </div>:null}
        </div>)}
      </nav>
      <div className="flex items-center gap-2"><Link href="/sign-in" className="hidden min-h-10 items-center gap-2 bg-[var(--ink)] px-3 text-xs font-semibold text-white lg:inline-flex"><LockKeyhole size={14}/> Executive login</Link><MobileNav items={siteNavigation.map(({label,href,children})=>({label,href,children:children.map(({label,href})=>({label,href}))}))}/></div>
    </div>
  </header>;
}
