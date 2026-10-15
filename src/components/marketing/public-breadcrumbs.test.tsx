import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublicBreadcrumbs } from "./public-breadcrumbs";
import { PageHeader } from "./page-header";

describe("PublicBreadcrumbs", () => {
  it("links to actual ancestors and marks only the last item as current", () => {
    render(
      <PublicBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Markets", href: "/markets" },
          { label: "African Map", href: "/markets/map" },
        ]}
      />,
    );
    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(within(breadcrumb).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(breadcrumb).getByRole("link", { name: "Markets" })).toHaveAttribute("href", "/markets");
    // The current destination deliberately does not re-link to itself.
    const current = within(breadcrumb).getByText("African Map");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.closest("a")).toBeNull();
    expect(breadcrumb.querySelectorAll('a[href="/markets/map"]')).toHaveLength(0);
  });

  it("retains long, authoritative content titles with a full-text tooltip", () => {
    const publishedTitle = "A Long Published Research Title With Meaningful Editorial Language";
    render(
      <PublicBreadcrumbs
        contrast="dark"
        items={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights" },
          { label: publishedTitle },
        ]}
      />,
    );
    const current = screen.getByText(publishedTitle);
    expect(current).toHaveAttribute("title", publishedTitle);
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveClass("truncate");
  });

  it("does not render a breadcrumb landmark for an empty list", () => {
    render(<PublicBreadcrumbs items={[]} />);
    expect(screen.queryByRole("navigation", { name: /breadcrumb/i })).not.toBeInTheDocument();
  });

  it("preserves the original PageHeader breadcrumb pattern", () => {
    render(
      <PageHeader
        eyebrow="Portfolio"
        title="Independent businesses"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}
      />,
    );
    expect(screen.getAllByRole("navigation", { name: /breadcrumb/i })).toHaveLength(1);
    expect(screen.getByText("Portfolio", { selector: '[aria-current="page"]' })).toBeInTheDocument();
  });
});
