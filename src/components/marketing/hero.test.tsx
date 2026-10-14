import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the approved dual-ambition story and accessible, working links", () => {
    const { container } = render(
      <Hero
        eyebrow="Nabhold Group Africa"
        headline="Building what lasts."
        accentHeadline="Enabling what’s next."
        introduction="We build and enable enterprises."
        primaryCta={{ label: "Explore our businesses", href: "/portfolio" }}
        secondaryCta={{ label: "Discover Baobab Platform", href: "/platform" }}
      />,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(within(heading).getByText("Building what lasts.")).toBeInTheDocument();
    expect(within(heading).getByText("Enabling what’s next.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore our businesses/ })).toHaveAttribute(
      "href",
      "/portfolio",
    );
    expect(screen.getByRole("link", { name: /Discover Baobab Platform/ })).toHaveAttribute(
      "href",
      "/platform",
    );
    // No unapproved or external placeholder photography is emitted.
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(screen.getByText("Digital enablement")).toBeInTheDocument();
  });
});
