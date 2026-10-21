import type { CorporateContentGateway } from "@/lib/content/gateway";
import type {
  FooterContent,
  GroupProfileContent,
  HomePageContent,
  Navigation,
  SiteSettings,
} from "@/lib/content/types";
import {
  ESTATE_DEFAULT_FOOTER,
  ESTATE_DEFAULT_GROUP_PROFILE,
  ESTATE_DEFAULT_HOME_PAGE,
  ESTATE_DEFAULT_NAVIGATION,
  ESTATE_DEFAULT_SITE_SETTINGS,
} from "@/integrations/payload/defaults";
import {
  toFooter,
  toGroupProfile,
  toHomePageFields,
  toNavigation,
  toSiteSettings,
} from "@/integrations/payload/mappers";
import type { PageDto } from "@/integrations/payload/dto/page.dto";

import type { ContentEntryResolver } from "./entry-resolver";
import { extractPlainTextBlocks } from "@/integrations/payload/mappers/rich-text";

/**
 * Content port backed by the canonical `content.entry.resolve` capability for
 * the five singleton keys (home, navigation, footer, site-settings,
 * group-profile). Portfolio, sectors and insights have no resolve keys yet,
 * so they stay on the transitional Payload gateway.
 *
 * Honesty rule: when the capability cannot answer, the estate serves its own
 * defaults for that key, exactly as it does when Payload is unavailable. It
 * never quietly reads the same key from Payload, so what a visitor sees is
 * never from a source the operator did not choose.
 */
export class CapabilityContentGateway implements CorporateContentGateway {
  constructor(
    private readonly resolver: ContentEntryResolver,
    private readonly transitional: CorporateContentGateway,
    private readonly onOutcome: (key: string, outcome: string) => void = () => {},
    private readonly requirePublishedContent = false,
  ) {}

  private async entry(contentKey: string): Promise<PageDto | null> {
    const outcome = await this.resolver.resolveEntry(contentKey);
    this.onOutcome(
      contentKey,
      outcome.status === "unavailable" ? `unavailable:${outcome.reason}` : outcome.status,
    );
    // Qualification must observe real published content. Defaults must never
    // disguise a denial, outage, withdrawal or missing record as a provider pass.
    if (this.requirePublishedContent && outcome.status !== "ok") {
      throw new Error("Required published content unavailable");
    }
    if (this.requirePublishedContent && outcome.status === "ok") {
      const dto = outcome.dto;
      const complete = contentKey === "navigation" ? !!dto.navigationItems?.length
        : contentKey === "footer" ? dto.statement !== undefined && dto.tagline !== undefined && dto.footerLinks !== undefined
        : contentKey === "home" ? [dto.eyebrow, dto.headline, dto.introduction, dto.primaryCta, dto.secondaryCta, dto.institutionalStatement].every(v => v !== undefined)
        : contentKey === "site-settings" ? dto.siteName !== undefined && dto.seo !== undefined
        : contentKey === "group-profile" ? dto.title !== undefined && extractPlainTextBlocks(dto.content).length > 0 && dto.seo !== undefined
        : false;
      if (!complete) throw new Error("Required published content incomplete");
    }
    return outcome.status === "ok" ? outcome.dto : null;
  }

  async getSiteSettings(): Promise<SiteSettings> {
    return toSiteSettings(await this.entry("site-settings"), ESTATE_DEFAULT_SITE_SETTINGS);
  }

  async getNavigation(): Promise<Navigation> {
    return toNavigation(await this.entry("navigation"), ESTATE_DEFAULT_NAVIGATION);
  }

  async getFooter(): Promise<FooterContent> {
    return toFooter(await this.entry("footer"), ESTATE_DEFAULT_FOOTER);
  }

  async getGroupProfile(): Promise<GroupProfileContent> {
    return toGroupProfile(await this.entry("group-profile"), ESTATE_DEFAULT_GROUP_PROFILE);
  }

  async getHomePage(): Promise<HomePageContent> {
    const dto = await this.entry("home");
    // The bounded home/nav/footer proof has no qualified portfolio capability.
    // Do not quietly add defaults or direct-Payload records to its result.
    const companies = this.requirePublishedContent ? [] : await this.transitional.listPortfolioCompanies();

    if (!dto) {
      return {
        ...ESTATE_DEFAULT_HOME_PAGE,
        featuredPortfolioCompanies: companies.slice(0, 3),
      };
    }

    const fields = toHomePageFields(dto);
    const featured = fields.featuredPortfolioCompanySlugs.length
      ? companies.filter((company) =>
          fields.featuredPortfolioCompanySlugs.includes(company.slug),
        )
      : companies.slice(0, 3);

    return {
      ...fields.canonical,
      eyebrow: fields.eyebrow ?? ESTATE_DEFAULT_HOME_PAGE.eyebrow,
      headline: fields.headline ?? ESTATE_DEFAULT_HOME_PAGE.headline,
      introduction: fields.introduction ?? ESTATE_DEFAULT_HOME_PAGE.introduction,
      primaryCta: fields.primaryCta ?? ESTATE_DEFAULT_HOME_PAGE.primaryCta,
      secondaryCta: fields.secondaryCta ?? ESTATE_DEFAULT_HOME_PAGE.secondaryCta,
      featuredPortfolioCompanies: featured,
      institutionalStatement:
        fields.institutionalStatement ??
        ESTATE_DEFAULT_HOME_PAGE.institutionalStatement,
      heroMedia: fields.heroMedia,
      seo: fields.seo,
    };
  }

  listPortfolioCompanies: CorporateContentGateway["listPortfolioCompanies"] = (...a) =>
    this.transitional.listPortfolioCompanies(...a);
  getPortfolioCompany: CorporateContentGateway["getPortfolioCompany"] = (...a) =>
    this.transitional.getPortfolioCompany(...a);
  listSectors: CorporateContentGateway["listSectors"] = (...a) => this.transitional.listSectors(...a);
  getSector: CorporateContentGateway["getSector"] = (...a) => this.transitional.getSector(...a);
  listInsights: CorporateContentGateway["listInsights"] = (...a) => this.transitional.listInsights(...a);
  getInsight: CorporateContentGateway["getInsight"] = (...a) => this.transitional.getInsight(...a);
}
