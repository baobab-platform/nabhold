import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));

import { ESTATE_DEFAULT_HOME_PAGE, ESTATE_DEFAULT_NAVIGATION } from "@/integrations/payload/defaults";
import type { CorporateContentGateway } from "@/lib/content/gateway";

import { getBaobabContentConfig } from "./config";
import type { ContentEntryResolver, EntryOutcome } from "./entry-resolver";
import { CapabilityContentGateway } from "./gateway";
import { createCapabilityContentGatewayFromEnv } from "./index";

const transitional = {
  listPortfolioCompanies: vi.fn(async () => []),
  getPortfolioCompany: vi.fn(async () => null),
  listSectors: vi.fn(async () => []),
  getSector: vi.fn(async () => null),
  listInsights: vi.fn(async () => ({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 })),
  getInsight: vi.fn(async () => null),
  getNavigation: vi.fn(),
  getHomePage: vi.fn(),
  getFooter: vi.fn(),
  getSiteSettings: vi.fn(),
  getGroupProfile: vi.fn(),
} as unknown as CorporateContentGateway;

const resolverOf = (outcome: EntryOutcome) => ({ resolveEntry: vi.fn(async () => outcome) }) as unknown as ContentEntryResolver;

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("CapabilityContentGateway", () => {
  const publishedHome = {
    id: "synthetic-home",
    contentKey: "home",
    eyebrow: "Synthetic CMS heading",
    headline: "Published headline",
    introduction: "Published introduction",
    primaryCta: { label: "About", href: "/about" },
    secondaryCta: { label: "Portfolio", href: "/portfolio" },
    institutionalStatement: "Published statement",
  };

  it.each([false, true])("preserves approved hero copy and mapped media (proof=%s)", async (proof) => {
    const dto = {
      ...publishedHome,
      accentHeadline: "Published accent",
      heroGallery: [
        { id: "missing-url", alt: "Unpopulated asset" },
        { id: "published-photo", url: "/media/approved.jpg", alt: "Approved photo", width: 640, height: 800 },
      ],
    };
    const gw = new CapabilityContentGateway(resolverOf({ status: "ok", dto }), transitional, undefined, proof);
    const home = await gw.getHomePage();
    expect(home.accentHeadline).toBe(dto.accentHeadline);
    expect(home.heroGallery).toEqual([dto.heroGallery[1]]);
    expect(transitional.getHomePage).not.toHaveBeenCalled();
    if (proof) {
      expect(home.featuredPortfolioCompanies).toEqual([]);
      expect(transitional.listPortfolioCompanies).not.toHaveBeenCalled();
    }
  });

  it.each([false, true])("keeps older home records compatible without inventing proof copy (proof=%s)", async (proof) => {
    const gw = new CapabilityContentGateway(resolverOf({ status: "ok", dto: publishedHome }), transitional, undefined, proof);
    const home = await gw.getHomePage();
    expect(home.accentHeadline).toBe(proof ? undefined : ESTATE_DEFAULT_HOME_PAGE.accentHeadline);
    expect(home.heroGallery).toEqual([]);
  });

  it("refuses a published record whose missing fields would use defaults", async () => {
    const gw = new CapabilityContentGateway(resolverOf({ status: "ok", dto: { id: "record", contentKey: "navigation" } }), transitional, undefined, true);
    await expect(gw.getNavigation()).rejects.toThrow("Required published content incomplete");
  });

  it("maps actual complete published content in qualification without defaults", async () => {
    const dto = { id: "record", contentKey: "navigation", navigationItems: [{ label: "Synthetic live CMS marker", href: "/about" }] };
    const gw = new CapabilityContentGateway(resolverOf({ status: "ok", dto }), transitional, undefined, true);
    expect(await gw.getNavigation()).toEqual({ primary: dto.navigationItems });
  });
  it.each([{ status: "none" }, { status: "unavailable", reason: "DENIED" }] as EntryOutcome[])(
    "never serves defaults for a missing/denied record in qualification", async outcome => {
      const gw = new CapabilityContentGateway(resolverOf(outcome), transitional, undefined, true);
      await expect(gw.getNavigation()).rejects.toThrow("Required published content unavailable");
      expect(transitional.getNavigation).not.toHaveBeenCalled();
    });
  it("serves estate defaults, not Payload, when the capability cannot answer", async () => {
    const gw = new CapabilityContentGateway(resolverOf({ status: "unavailable", reason: "X" }), transitional);
    expect(await gw.getNavigation()).toEqual(ESTATE_DEFAULT_NAVIGATION);
    expect(transitional.getNavigation).not.toHaveBeenCalled();
  });

  it("maps a resolved navigation entry", async () => {
    const dto = { id: "r", contentKey: "navigation", navigationItems: [{ label: "Portfolio", href: "/portfolio" }] };
    const gw = new CapabilityContentGateway(resolverOf({ status: "ok", dto } as EntryOutcome), transitional);
    expect(await gw.getNavigation()).toEqual({ primary: dto.navigationItems });
  });

  it("keeps list content on the transitional gateway", async () => {
    const gw = new CapabilityContentGateway(resolverOf({ status: "none" }), transitional);
    await gw.listSectors();
    await gw.getInsight("x");
    expect(transitional.listSectors).toHaveBeenCalled();
    expect(transitional.getInsight).toHaveBeenCalledWith("x");
  });

  it("reports the outcome by key without content", async () => {
    const seen: string[] = [];
    const gw = new CapabilityContentGateway(resolverOf({ status: "none" }), transitional, (k, o) => seen.push(`${k}:${o}`));
    await gw.getFooter();
    expect(seen).toEqual(["footer:none"]);
  });
});

describe("capability gateway composition", () => {
  const full = () => {
    vi.stubEnv("NABHOLD_CONTENT_SOURCE", "capability");
    vi.stubEnv("NABHOLD_CONTENT_TENANT_ID", "tn_nabhold1");
    vi.stubEnv("NABHOLD_CONTENT_CONTEXT_ID", "11111111-2222-4333-8444-555555555555");
    vi.stubEnv("NABHOLD_CONTENT_LEGAL_ENTITY_ID", "NABHOLD");
    vi.stubEnv("NABHOLD_CONTENT_DIGITAL_ESTATE_ID", "DE-1");
    vi.stubEnv("NABHOLD_SERVICE_ORIGINS", JSON.stringify({ "baobab-cms": "https://cms.example" }));
    vi.stubEnv("BAOBAB_CONTROL_PLANE_API_URL", "https://cp.example");
  };

  it("is off unless the flag is exactly 'capability'", () => {
    expect(getBaobabContentConfig()).toBeNull();
    vi.stubEnv("NABHOLD_CONTENT_SOURCE", "true");
    expect(getBaobabContentConfig()).toBeNull();
    expect(createCapabilityContentGatewayFromEnv(transitional)).toBeNull();
  });

  it("does not silently choose Payload when required capability configuration is missing", () => {
    vi.stubEnv("NABHOLD_CONTENT_FALLBACK", "disabled");
    expect(() => createCapabilityContentGatewayFromEnv(transitional)).toThrow("Required capability content");
  });

  it("is on only when everything is configured", () => {
    full();
    expect(getBaobabContentConfig()).toMatchObject({ tenantId: "tn_nabhold1", locale: "en-ZA" });
    expect(createCapabilityContentGatewayFromEnv(transitional)).not.toBeNull();
  });

  it("bounds configured timeouts before constructing a request signal", () => {
    full();
    vi.stubEnv("NABHOLD_CONTENT_TIMEOUT_MS", "4294967296");
    expect(getBaobabContentConfig()?.timeoutMs).toBe(5000);
    vi.stubEnv("NABHOLD_CONTENT_TIMEOUT_MS", "60000");
    expect(getBaobabContentConfig()?.timeoutMs).toBe(60000);
  });

  it.each([
    ["NABHOLD_CONTENT_TENANT_ID", "Nabhold"],
    ["NABHOLD_CONTENT_CONTEXT_ID", ""],
    ["NABHOLD_CONTENT_CONTEXT_ID", "not-a-context"],
    ["NABHOLD_CONTENT_DIGITAL_ESTATE_ID", ""],
    ["NABHOLD_SERVICE_ORIGINS", "not json"],
    ["NABHOLD_SERVICE_ORIGINS", JSON.stringify({ x: "https://cms.example/path" })],
    ["NABHOLD_CONTENT_LOCALE", "english"],
    ["BAOBAB_CONTROL_PLANE_API_URL", ""],
  ])("stays off when %s is missing or invalid", (name, value) => {
    full();
    vi.stubEnv(name, value);
    expect(createCapabilityContentGatewayFromEnv(transitional)).toBeNull();
  });

  it("allows Organisation-bound content without a LegalEntity", () => {
    full();
    vi.stubEnv("NABHOLD_CONTENT_LEGAL_ENTITY_ID", "");
    expect(getBaobabContentConfig()?.legalEntityId).toBeUndefined();
    expect(createCapabilityContentGatewayFromEnv(transitional)).not.toBeNull();
  });

  it("requires https origins in production", () => {
    full();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NABHOLD_SERVICE_ORIGINS", JSON.stringify({ "baobab-cms": "http://cms.example" }));
    expect(getBaobabContentConfig()).toBeNull();
  });
});
