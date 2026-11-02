import type { MetadataRoute } from "next";

/** Bots may index only the institutional public estate, not BFF, account
 * session, authorisation or protected executive surfaces. Robots is advisory;
 * access controls must still fail closed at the server. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/api/", "/dashboard", "/sign-in"],
    }],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/sitemap.xml`,
  };
}
