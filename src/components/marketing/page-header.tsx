import { cn } from "cn";
import {
  PublicBreadcrumbs,
  type PublicBreadcrumbItem,
} from "@/components/marketing/public-breadcrumbs";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: readonly PublicBreadcrumbItem[];
  className?: string;
  children?: React.ReactNode;
};

/**
 * Existing PageHeader users (Insights, Portfolio, Sectors, Sign-in) share the
 * same breadcrumb treatment as the rest of the public site. This avoids
 * duplicate navigational landmarks and preserves all existing page copy.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  className,
  children,
}: PageHeaderProps) {
  return (
    <header className={cn("shell py-12 md:py-16", className)}>
      {breadcrumbs?.length ? <PublicBreadcrumbs items={breadcrumbs} /> : null}
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="display text-5xl md:text-6xl">{title}</h1>
          {description ? (
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </header>
  );
}
