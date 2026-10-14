import Link from "next/link";
import { ArrowUpRight, LockKeyhole, ChevronDown, Building2, Landmark, Globe2, ChartNoAxesCombined, ShieldCheck, Network, BookOpen, Trees } from "lucide-react";
import { getContentGateway } from "@/lib/content";
import { MobileNav } from "@/components/marketing/mobile-nav";

/**
 * Public navigation is editorial; the portal always routes through /sign-in.
 * Mega-menu links only target established routes and published homepage anchors.
 */
export async function SiteHeader() {
  const gateway = await getContentGateway();
  const navigation = await gateway.getNavigation();
  const primary = [
    { label: "Our Group", href: "/about/group" },
    { label: "Businesses", href: "/portfolio" },
    { label: "Investment", href: "/investment" },
    { label: "Markets", href: "/markets" },
    { label: "Intelligence", href: "/intelligence" },
    { label: "Governance", href: "/governance" },
  ];

  void navigation; // CMS remains queried while the institutional route map is stabilised.
  const iconFor = (href: string) => href === "/portfolio" ? Building2 : href === "/investment" ? Landmark : href === "/markets" ? Globe2 : href === "/intelligence" ? ChartNoAxesCombined : href === "/governance" ? ShieldCheck : Trees;
  const submenus: Record<string, { label: string; href: string; description: string }[]> = {
    "/about/group": [{label:"Our story",href:"/about/group",description:"Purpose and long-term stewardship"},{label:"Group governance",href:"/governance",description:"Accountability and oversight"}],
    "/portfolio": [{label:"Our companies",href:"/portfolio",description:"Autonomous operating companies"},{label:"Shared capabilities",href:"/platform",description:"Baobab Platform — not a subsidiary"},{label:"Strategic sectors",href:"/sectors",description:"Areas of enterprise activity"}],
    "/investment": [{label:"Investment philosophy",href:"/investment",description:"Patient capital and responsible allocation"},{label:"Governance",href:"/governance",description:"Approval and risk discipline"}],
    "/markets": [{label:"African footprint",href:"/markets",description:"Clearly labelled market status"},{label:"Sectors",href:"/sectors",description:"Where businesses focus"}],
    "/intelligence": [{label:"Market intelligence",href:"/intelligence",description:"Research and decision support"},{label:"Published insights",href:"/insights",description:"Public articles and commentary"}],
    "/governance": [{label:"Governance framework",href:"/governance",description:"Responsible ownership"},{label:"Group structure",href:"/platform",description:"Enterprise and platform boundaries"}],
  };
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--surface)]/95 backdrop-blur">
      <div className="bg-[var(--ink)] text-white">
        <div className="shell flex min-h-8 items-center justify-between gap-4 text-[11px]">
          <span className="hidden sm:inline">Building enduring enterprises for Africa&apos;s next generation.</span>
          <span className="sm:hidden">Nabhold Group Africa</span>
          <nav aria-label="Utility" className="flex gap-4 text-white/75"><Link href="/insights">Newsroom</Link><Link href="/about/group">Our Story</Link><Link href="/contact">Contact</Link><span>EN</span></nav>
        </div>
      </div>
      <div className="shell flex min-h-[76px] items-center justify-between gap-4">
        <Link href="/" aria-label="Nabhold Group Africa home" className="flex items-center gap-2.5">
          <Trees className="size-9 text-[var(--gold-deep)]" strokeWidth={1.7}/>
          <span className="flex flex-col text-sm font-extrabold leading-tight tracking-[.14em]">NABHOLD<span className="text-[10px] font-semibold tracking-[.17em] text-muted-foreground">GROUP AFRICA</span></span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-4 lg:flex">
          {primary.map((item) => (
            <div key={item.href} className="group">
              <Link href={item.href} className="inline-flex min-h-12 items-center gap-1.5 text-xs font-bold transition-colors hover:text-[var(--gold-deep)] focus-visible:text-[var(--gold-deep)]">{(() => { const MenuIcon = iconFor(item.href); return <MenuIcon size={15}/>; })()}{item.label}<ChevronDown size={12}/></Link>
              <div className="invisible fixed left-1/2 top-[108px] z-50 grid w-[min(94vw,1040px)] -translate-x-1/2 translate-y-1 grid-cols-[1fr_2fr] gap-8 border border-border bg-[var(--surface)] p-8 opacity-0 shadow-2xl transition-opacity group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="border-r border-border pr-6"><p className="eyebrow mb-4">{item.label}</p><p className="font-serif text-3xl">Building enduring African enterprises.</p><p className="mt-4 text-sm leading-6 text-muted-foreground">Explore the Group&apos;s companies, outlook and stewardship.</p></div><div className="grid grid-cols-2 gap-2">
                {submenus[item.href]?.map((child) => <Link key={child.href} href={child.href} className="flex items-start gap-3 rounded-md p-4 hover:bg-[var(--paper)] focus-visible:bg-[var(--paper)]"><Network size={18} className="mt-1 shrink-0 text-[var(--gold-deep)]"/><span><strong className="block text-sm">{child.label}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{child.description}</span></span></Link>)}
              </div></div>
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/insights" aria-label="Browse insights" className="hidden p-2 lg:inline-flex"><BookOpen size={18}/></Link>
          <Link href="/contact" className="hidden min-h-10 items-center gap-1 bg-[var(--gold)] px-3 text-xs font-bold text-black md:inline-flex">Contact us <ArrowUpRight size={15}/></Link>
          <Link href="/sign-in" className="hidden min-h-10 items-center gap-2 bg-[var(--ink)] px-3 text-xs font-semibold text-white md:inline-flex"><LockKeyhole size={14}/> Executive login</Link>
          <MobileNav items={primary}/>
        </div>
      </div>
    </header>
  );
}
