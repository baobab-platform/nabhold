// @vitest-environment node
import type { AnchorHTMLAttributes } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("next/link", () => ({ default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a data-next-navigation="true" {...props} /> }));
import { EstateLink } from "./estate-link";

describe("estate document navigation", () => {
  it.each(["/sign-in", "/sign-in?next=ignored", "/sign-in#access", "/sign-in/",
    "https://estate.example.test/sign-in", "//estate.example.test/sign-in"])(
    "loads the sign-in document for %s", href => {
      const html = renderToStaticMarkup(<EstateLink href={href} className="reviewed" aria-label="Executive access">Sign in</EstateLink>);
      expect(html).not.toContain("data-next-navigation");
      expect(html).toContain('class="reviewed"'); expect(html).toContain('aria-label="Executive access"');
    },
  );
  it.each(["/", "/contact", "/insights", "/sign-in-other", "/sign-in/nested", "/portfolio?next=/sign-in"])(
    "retains Next navigation for %s", href => {
      expect(renderToStaticMarkup(<EstateLink href={href}>Read</EstateLink>)).toContain('data-next-navigation="true"');
    },
  );
});
