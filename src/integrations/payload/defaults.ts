import type { FooterContent, GroupProfileContent, HomePageContent, Navigation, SiteSettings } from "@/lib/content/types";

/**
 * Editorial defaults are safe for publication without a CMS connection.
 * Never encode unverified market operations, investment totals or results here.
 */
export const ESTATE_DEFAULT_NAVIGATION: Navigation = {
  primary: [
    { label: "Our Group", href: "/about/group" },
    { label: "Businesses", href: "/portfolio" },
    { label: "Investment", href: "/investment" },
    { label: "Insights", href: "/insights" },
  ],
};

export const ESTATE_DEFAULT_FOOTER: FooterContent = {
  statement: "Strong Roots. Inspired Growth.",
  tagline: "Grounded enough to endure. Visionary enough to lead.",
  links: [
    { label: "Our Group", href: "/about/group" },
    { label: "Our Businesses", href: "/portfolio" },
    { label: "Insights", href: "/insights" },
    { label: "Executive access", href: "/sign-in" },
  ],
};

export const ESTATE_DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "Nabhold Group Africa",
  seoDefaults: {
    title: "Nabhold Group Africa",
    description: "A disciplined African holding company building durable enterprises.",
  },
};

export const ESTATE_DEFAULT_HOME_PAGE: HomePageContent = {
  eyebrow: "Nabhold Group Africa",
  headline: "Building what lasts.",
  accentHeadline: "Enabling what’s next.",
  introduction: "We build and steward enduring African enterprises while developing Baobab Platform to enable businesses within and beyond our Group.",
  primaryCta: { label: "Explore our businesses", href: "/portfolio" },
  secondaryCta: { label: "Discover Baobab Platform", href: "/platform" },
  featuredPortfolioCompanies: [],
  heroGallery: [],
  institutionalStatement: "Strong Roots. Inspired Growth.",
};

export const ESTATE_DEFAULT_GROUP_PROFILE: GroupProfileContent = {
  title: "Rooted in Africa. Built for generations.",
  body: [
    { type: "paragraph", text: "Nabhold Group Africa establishes, supports and stewards independently operated businesses." },
    { type: "paragraph", text: "The group sets strategic direction and investment discipline while each operating company retains responsibility for its customers, operations and digital estate." },
  ],
};
