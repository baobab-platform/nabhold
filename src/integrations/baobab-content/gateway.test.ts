import { afterEach, describe, expect, it, vi } from "vitest";

import { ESTATE_DEFAULT_NAVIGATION } from "@/integrations/payload/defaults";
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

  it("is on only when everything is configured", () => {
    full();
    expect(getBaobabContentConfig()).toMatchObject({ tenantId: "tn_nabhold1", locale: "en-ZA" });
    expect(createCapabilityContentGatewayFromEnv(transitional)).not.toBeNull();
  });

  it.each([
    ["NABHOLD_CONTENT_TENANT_ID", "Nabhold"],
    ["NABHOLD_CONTENT_CONTEXT_ID", ""],
    ["NABHOLD_CONTENT_LEGAL_ENTITY_ID", ""],
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

  it("requires https origins in production", () => {
    full();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NABHOLD_SERVICE_ORIGINS", JSON.stringify({ "baobab-cms": "http://cms.example" }));
    expect(getBaobabContentConfig()).toBeNull();
  });
});
