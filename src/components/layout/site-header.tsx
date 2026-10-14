import Link from "next/link";
import { ArrowUpRight, LockKeyhole, Search, Trees } from "lucide-react";
import { getContentGateway } from "@/lib/content";
import { MobileNav } from "@/components/marketing/mobile-nav";

/**
 * Public navigation is editorial; the portal always routes through /sign-in.
 * Mega-menu links only target established routes and published homepage anchors.
 */
export async function SiteHeader() {
  const gateway = await getContentGateway();
  const navigation = await gateway.getNavigation();
  const primary = navigation.primary.length ? navigation.primary : [
    { label: "Our Group", href: "/about/group" },
    { label: "Businesses", href: "/portfolio" },
    { label: "Investment", href: "/#investment" },
    { label: "Markets", href: "/#markets" },
    { label: "Intelligence", href: "/#intelligence" },
    { label: "Governance", href: "/#governance" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--surface)]/95 backdrop-blur">
      <div className="bg-[var(--ink)] text-white">
        <div className="shell flex min-h-8 items-center justify-between gap-4 text-[11px]">
          <span className="hidden sm:inline">Building enduring enterprises for Africa&apos;s next generation.</span>
          <span className="sm:hidden">Nabhold Group Africa</span>
          <div className="flex gap-4 text-white/75"><Link href="/insights">Newsroom</Link><Link href="/about/group">The Group</Link></div>
        </div>
      </div>
      <div className="shell flex min-h-[76px] items-center justify-between gap-4">
        <Link href="/" aria-label="Nabhold Group Africa home" className="flex items-center gap-2.5">
          <Trees className="size-9 text-[var(--gold-deep)]" strokeWidth={1.7}/>
          <span className="flex flex-col text-sm font-extrabold leading-tight tracking-[.14em]">NABHOLD<span className="text-[10px] font-semibold tracking-[.17em] text-muted-foreground">GROUP AFRICA</span></span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-4 lg:flex">
          {primary.map((item) => (
            <div key={item.href} className="group relative">
              <Link href={item.href} className="inline-flex min-h-12 items-center text-xs font-bold transition-colors hover:text-[var(--gold-deep)] focus-visible:text-[var(--gold-deep)]">{item.label}</Link>
              {item.href === "/portfolio" ? (
                <div className="invisible absolute left-0 top-full w-72 translate-y-1 border border-border bg-[var(--surface)] p-5 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <p className="eyebrow mb-3">Our businesses</p>
                  <Link className="block py-2 text-sm hover:underline" href="/portfolio">Explore the portfolio →</Link>
                  <Link className="block py-2 text-sm hover:underline" href="/#architecture">Group structure &amp; shared capabilities →</Link>
                  <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">Baobab Platform is shared digital infrastructure, not an operating subsidiary.</p>
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/insights" aria-label="Browse insights" className="hidden p-2 lg:inline-flex"><Search size={18}/></Link>
          <Link href="/about/group" className="hidden min-h-10 items-center gap-1 bg-[var(--gold)] px-3 text-xs font-bold text-black md:inline-flex">Explore the Group <ArrowUpRight size={15}/></Link>
          <Link href="/sign-in" className="hidden min-h-10 items-center gap-2 bg-[var(--ink)] px-3 text-xs font-semibold text-white md:inline-flex"><LockKeyhole size={14}/> Executive login</Link>
          <MobileNav items={primary}/>
        </div>
      </div>
    </header>
  );
}
