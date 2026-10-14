import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "cn"

type Crumb = { label: string; href?: string }

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  breadcrumbs?: Crumb[]
  className?: string
  children?: React.ReactNode
}

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
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            {breadcrumbs.map((c, i) => {
              const last = i === breadcrumbs.length - 1
              return (
                <BreadcrumbItem key={`${c.label}-${i}`}>
                  {i > 0 ? <BreadcrumbSeparator /> : null}
                  {last || !c.href ? (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}
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
  )
}
