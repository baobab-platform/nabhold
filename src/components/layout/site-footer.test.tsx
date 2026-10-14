import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/** The CMS supplementary links must remain distinct from editorial columns. */
vi.mock("@/lib/content", () => ({
  getContentGateway: vi.fn(async () => ({
    getFooter: vi.fn(async () => ({
      statement: "Strong Roots. Inspired Growth.",
      tagline: "A CMS-managed description.",
      links: [{ label: "CMS policy link", href: "/insights" }],
    })),
  })),
}));

const { SiteFooter } = await import("./site-footer");

describe("SiteFooter", () => {
  it("renders eight editorial navigation groups and preserves the CMS link strip", async () => {
    render(await SiteFooter());

    const footer = screen.getByRole("contentinfo");
    const expectedGroups = [
      "Our Group",
      "Our Businesses",
      "Investment",
      "Markets & Footprint",
      "Governance",
      "Intelligence & Insights",
      "Platform & Enablement",
      "Connect & Access",
    ];
    for (const name of expectedGroups) {
      expect(within(footer).getByRole("navigation", { name })).toBeInTheDocument();
    }

    const supplemental = within(footer).getByRole("navigation", {
      name: "Additional corporate links",
    });
    expect(within(supplemental).getByRole("link", { name: /CMS policy link/ })).toHaveAttribute(
      "href",
      "/insights",
    );
    expect(within(footer).getByText("A CMS-managed description.")).toBeInTheDocument();
    expect(
      within(footer).getByRole("link", { name: /Interactive Africa map/ }),
    ).toHaveAttribute("href", "/markets/map");
    expect(
      within(footer).queryByRole("link", { name: "How we build" }),
    ).not.toBeInTheDocument();
  });
});
