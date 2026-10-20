import { EstateLink as Link } from "@/components/navigation/estate-link";
import Image from "next/image";
import {
  ArrowUpRight,
  Building2,
  Globe2,
  Network,
  Sprout,
} from "lucide-react";
import { cn } from "cn";

type Cta = { label: string; href: string };
type HeroImage = { url: string; alt: string };

interface HeroProps {
  eyebrow?: string;
  headline: string;
  accentHeadline?: string;
  introduction?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  heroMedia?: HeroImage | null;
  heroGallery?: HeroImage[];
  className?: string;
}

/**
 * Signature institutional hero: enterprise-building + enterprise-enablement.
 *
 * The four-image editorial mosaic accepts ONLY images resolved through the
 * corporate content gateway. In the absence of approved CMS imagery, it uses
 * typographic sector panels instead of external stock photography, so the
 * page remains visually complete without implying undocumented operations.
 *
 * Media descriptions are supplied by the editor. The first available image
 * is prioritized for largest-contentful-paint; remaining images load lazily.
 */
const editorialPanels = [
  {
    label: "Enterprise building",
    kicker: "STEWARDSHIP",
    icon: Building2,
    gradient: "from-[#65522c] via-[#29261f] to-[#111111]",
  },
  {
    label: "Trade & sourcing",
    kicker: "ORIGINS",
    icon: Sprout,
    gradient: "from-[#365449] via-[#1f3930] to-[#101b18]",
  },
  {
    label: "Consumer & real assets",
    kicker: "ENTERPRISE",
    icon: Globe2,
    gradient: "from-[#55514c] via-[#292723] to-[#101010]",
  },
  {
    label: "Digital enablement",
    kicker: "BAOBAB PLATFORM",
    icon: Network,
    gradient: "from-[#9d6819] via-[#3f3219] to-[#111111]",
  },
] as const;

export function Hero({
  eyebrow = "Nabhold Group Africa",
  headline,
  accentHeadline,
  introduction,
  primaryCta,
  secondaryCta,
  heroMedia,
  heroGallery = [],
  className,
}: HeroProps) {
  // Preserve original CMS media order and avoid duplicated photo placements.
  const sources = [heroMedia, ...heroGallery].filter(
    (item): item is HeroImage => Boolean(item?.url && item.alt?.trim()),
  );
  const uniqueSources = Array.from(
    new Map(sources.map((item) => [item.url, item])).values(),
  ).slice(0, 4);

  return (
    <section
      aria-labelledby="home-hero-heading"
      className={cn("relative isolate overflow-hidden bg-[#08090A] text-white", className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-[var(--gold)]/[.055] blur-[110px]"
      />
      <div className="shell relative grid min-h-[min(780px,calc(100svh-112px))] items-stretch gap-10 py-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-8 lg:py-16">
        <div className="flex flex-col justify-center py-7 lg:py-12">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-0.5 w-9 bg-[var(--gold)]" />
            <p className="text-xs font-bold uppercase tracking-[.19em] text-[var(--gold)]">
              {eyebrow}
            </p>
          </div>
          <h1
            id="home-hero-heading"
            className="mt-7 max-w-[15ch] font-serif text-[clamp(3.25rem,5.2vw,5.75rem)] leading-[1.02] tracking-[-.045em]"
          >
            <span className="block text-white">{headline}</span>
            {accentHeadline ? (
              <span className="mt-2 block text-[var(--gold)]">{accentHeadline}</span>
            ) : null}
          </h1>
          {introduction ? (
            <p className="mt-8 max-w-[36rem] text-base leading-8 text-white/75 md:text-lg">
              {introduction}
            </p>
          ) : null}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            {primaryCta ? (
              <Link
                href={primaryCta.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--gold)] px-6 py-3 text-sm font-bold text-[#111] transition-colors hover:bg-[#ffd06a] focus-visible:outline-white"
              >
                {primaryCta.label}<ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ) : null}
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)] focus-visible:outline-white"
              >
                {secondaryCta.label}<ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ) : null}
          </div>
          <div className="mt-12 grid max-w-lg grid-cols-2 gap-5 border-t border-white/20 pt-6">
            <div>
              <Building2 className="mb-2 size-6 text-[var(--gold)]" aria-hidden="true" />
              <strong className="block text-sm">We build</strong>
              <p className="mt-1 text-xs leading-5 text-white/55">Through independent Group enterprises.</p>
            </div>
            <div>
              <Network className="mb-2 size-6 text-[var(--gold)]" aria-hidden="true" />
              <strong className="block text-sm">We enable</strong>
              <p className="mt-1 text-xs leading-5 text-white/55">Through emerging shared enterprise capabilities.</p>
            </div>
          </div>
        </div>

        {/* Approved photography populates the mosaic; unpublished images do not. */}
        <div
          className="grid min-h-[360px] grid-cols-2 grid-rows-2 gap-1.5 self-stretch lg:min-h-[540px]"
          aria-label="Nabhold enterprise and platform themes"
        >
          {editorialPanels.map((panel, index) => {
            const image = uniqueSources[index];
            return (
              <div
                key={panel.label}
                className={cn(
                  "group relative isolate flex min-h-[170px] flex-col justify-end overflow-hidden p-5 sm:p-6",
                  "bg-gradient-to-br",
                  panel.gradient,
                )}
              >
                {image ? (
                  <>
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="-z-20 object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.035]"
                    />
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  </>
                ) : (
                  <>
                    <panel.icon
                      aria-hidden="true"
                      strokeWidth={0.8}
                      className="absolute right-4 top-4 -z-10 size-24 text-white/20 sm:size-36"
                    />
                    <div aria-hidden="true" className="absolute -left-10 -top-10 -z-10 size-44 rounded-full border border-white/15" />
                  </>
                )}
                <p className="text-[10px] font-bold tracking-[.2em] text-[var(--gold)]">
                  {panel.kicker}
                </p>
                <h2 className="mt-2 max-w-[14ch] font-serif text-xl leading-tight sm:text-2xl">
                  {panel.label}
                </h2>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-t border-white/15 bg-[#131313]">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3 text-[11px] font-bold uppercase tracking-[.18em] text-white/70">
          <span>Independent enterprises</span>
          <span className="text-[var(--gold)]" aria-hidden="true">✦</span>
          <span>Shared capability</span>
          <span className="text-[var(--gold)]" aria-hidden="true">✦</span>
          <span>Long-term ambition</span>
        </div>
      </div>
    </section>
  );
}
