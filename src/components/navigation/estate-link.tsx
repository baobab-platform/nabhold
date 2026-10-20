import NextLink from "next/link";
import type { AnchorHTMLAttributes } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/** Sign-in has a document-level CSP exception. A client-side transition cannot
 * install that policy: use a real document navigation for every sign-in entry,
 * including CMS-owned links/CTAs. Other estate links retain Next navigation.
 * This changes navigation only; it never rewrites or trusts a link destination.
 */
export function EstateLink({ href, ...props }: Props) {
  let signIn = false;
  try {
    signIn = new URL(href, "https://estate.invalid").pathname.replace(/\/$/, "") === "/sign-in";
  } catch { /* Preserve existing link validation/rendering for other values. */ }
  return signIn ? <a href={href} {...props} /> : <NextLink href={href} {...props} />;
}
