import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "cn";

/**
 * Accessible, presentation-only trail for the public digital estate.
 *
 * The caller owns the hierarchy: pages use their canonical parent routes and
 * CMS-backed detail pages supply the actual published title. Do not derive
 * titles from slugs or infer parentage from URL segments. This component is
 * intentionally not mounted in the shared layout: the homepage needs no
 * breadcrumbs, and putting a route-aware client component in that layout
 * would lose authoritative server-rendered titles.
 */
export type PublicBreadcrumbItem = Readonly<{
  label: string;
  /** Omit for the current page; the last item is never a clickable link. */
  href?: string;
}>;

export function PublicBreadcrumbs({
  items,
  contrast = "light",
  className,
}: {
  items: readonly PublicBreadcrumbItem[];
  /** 'dark' is used over institutional dark hero surfaces. */
  contrast?: "light" | "dark";
  className?: string;
}) {
  if (!items.length) return null;

  const dark = contrast === "dark";

  return (
    <Breadcrumb className={cn("mb-7", dark && "text-white/75", className)}>
      <BreadcrumbList className={cn("text-xs sm:text-sm", dark && "text-white/70")}>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <Fragment key={`${index}-${item.href ?? "current"}`}>
              {/* Separator and crumb are siblings, never nested <li> tags. */}
              {index > 0 ? (
                <BreadcrumbSeparator className={dark ? "text-white/45" : undefined} />
              ) : null}
              <BreadcrumbItem>
                {current || !item.href ? (
                  <BreadcrumbPage
                    className={cn(
                      "max-w-[13rem] truncate sm:max-w-[24rem] md:max-w-[36rem]",
                      dark ? "text-white" : "text-foreground",
                    )}
                    title={item.label}
                  >
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className={cn(
                      "font-medium underline-offset-4 hover:underline focus-visible:underline",
                      dark && "text-white/75 hover:text-white",
                    )}
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
