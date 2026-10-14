import Link from "next/link";
import { ArrowUpRight, Network, Trees } from "lucide-react";
import { getContentGateway } from "@/lib/content";

/**
 * Institutional sitemap: eight editorial groups in a four-column/two-row
 * desktop matrix. Use only real, published routes and existing page anchors.
 *
 * This array is distinct from the separately CMS-managed footer.links strip;
 * that strip remains rendered intact and in its original position.
 */
const footerGroups = [
  {
    title: "Our Group",
    links: [
      { label: "About Nabhold", href: "/about/group" },
      { label: "Who we are", href: "/about/group#identity" },
      { label: "How our Group works", href: "/about/group#operating-model" },
    ],
  },
  {
    title: "Our Businesses",
    links: [
      { label: "Our portfolio", href: "/portfolio" },
      { label: "Strategic sectors", href: "/sectors" },
    ],
  },
  {
    title: "Investment",
    links: [
      { label: "Investment philosophy", href: "/investment" },
      { label: "African opportunities", href: "/markets" },
    ],
  },
  {
    title: "Markets & Footprint",
    links: [
      { label: "Our markets", href: "/markets" },
      { label: "Interactive Africa map", href: "/markets/map" },
    ],
  },
  {
    title: "Governance",
    links: [
      { label: "Corporate governance", href: "/governance" },
      { label: "Group operating model", href: "/about/group#operating-model" },
    ],
  },
  {
    title: "Intelligence & Insights",
    links: [
      { label: "Market intelligence", href: "/intelligence" },
      { label: "Published perspectives", href: "/insights" },
    ],
  },
  {
    title: "Platform & Enablement",
    links: [
      { label: "Baobab Platform", href: "/platform" },
      { label: "Shared capability", href: "/platform" },
    ],
  },
  {
    title: "Connect & Access",
    links: [
      { label: "Contact the Group", href: "/contact" },
      { label: "Executive login", href: "/sign-in" },
    ],
  },
] as const;

export async function SiteFooter() {
  const gateway = await getContentGateway();
  const footer = await gateway.getFooter();

  return (
    <footer className="bg-[#101010] text-white">
      <div className="shell grid gap-12 py-16 lg:grid-cols-[minmax(205px,1fr)_minmax(0,3.7fr)] lg:gap-10">
        {/* Preserve the original branding column and the CMS-owned statement. */}
        <div>
          <Link href="/" aria-label="Nabhold Group Africa home" className="flex items-center gap-3">
            <Trees className="size-10 shrink-0 text-[var(--gold)]" aria-hidden="true" />
            <span className="text-xl font-bold tracking-widest">
              NABHOLD<span className="block text-xs tracking-[.22em]">GROUP AFRICA</span>
            </span>
          </Link>
          <p className="mt-6 max-w-xs font-serif text-2xl">
            {footer.statement || "Strong Roots. Inspired Growth."}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/65">
            {footer.tagline || "A long-term African holding company supporting autonomous enterprises."}
          </p>
          <Link href="/platform" className="group mt-8 flex max-w-xs items-start gap-3 border-l-2 border-[var(--gold)] pl-4 focus-visible:text-[var(--gold)]">
            <Network className="mt-1 size-5 shrink-0 text-[var(--gold)]" aria-hidden="true" />
            <span>
              <strong className="block text-sm">Enabling what&apos;s next.</strong>
              <span className="mt-1 block text-xs leading-5 text-white/65">
                Discover the emerging Baobab Platform for Group and external enterprises.
              </span>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--gold)]">
                Discover the platform <ArrowUpRight size={13} aria-hidden="true" />
              </span>
            </span>
          </Link>
        </div>

        {/* Four columns × two rows at desktop; two at tablet and one on mobile. */}
        <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 md:grid-cols-4">
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="mb-5 text-xs font-bold tracking-wide text-white">{group.title}</h2>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-xs leading-6 text-white/65 transition-colors hover:text-[var(--gold)] focus-visible:text-[var(--gold)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Deliberately unchanged: separate CMS-managed corporate link strip. */}
      {footer.links.length > 0 ? (
        <nav aria-label="Additional corporate links" className="shell flex flex-wrap gap-5 border-t border-white/10 py-4">
          {footer.links.map((item) => (
            <Link key={item.href} className="text-xs text-white/60 hover:text-white" href={item.href}>
              {item.label} <ArrowUpRight className="inline size-3" />
            </Link>
          ))}
        </nav>
      ) : null}
      <div className="border-t border-[var(--gold)]/70">
        <div className="shell flex flex-col justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Nabhold Group Africa. All rights reserved.</p>
          <p>Institutional information · South Africa</p>
        </div>
      </div>
    </footer>
  );
}
