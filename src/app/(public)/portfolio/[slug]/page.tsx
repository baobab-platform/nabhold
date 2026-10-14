import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import {
  getPortfolioCompany,
  listPortfolioCompanies,
} from "@/features/portfolio/queries"
import { PageHeader } from "@/components/marketing/page-header"
import { PreviewBanner } from "@/components/dashboard/preview-banner"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export async function generateStaticParams() {
  const portfolio = await listPortfolioCompanies()
  return portfolio.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const company = await getPortfolioCompany(slug)
  if (!company) return {}

  return {
    title: company.seo?.title ?? company.name,
    description: company.seo?.description ?? company.summary,
    openGraph: {
      title: company.seo?.openGraphTitle ?? company.name,
      description: company.seo?.openGraphDescription ?? company.summary,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const c = await getPortfolioCompany(slug)
  if (!c) notFound()

  return (
    <article>
      <PageHeader
        eyebrow={`Portfolio company · ${c.sector}`}
        title={c.name}
        description={c.summary}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Portfolio", href: "/portfolio" },
          { label: c.name },
        ]}
      />
      <div className="shell pb-20">
        {c.devFallback ? (
          <div className="mb-8">
            <PreviewBanner description="Development preview data only. No Payload content is connected." />
          </div>
        ) : null}
        {c.heroMedia ? (
          <Image
            className="h-auto w-full rounded-2xl object-cover"
            src={c.heroMedia.url}
            alt={c.heroMedia.alt}
            width={c.heroMedia.width ?? 1200}
            height={c.heroMedia.height ?? 675}
            priority
          />
        ) : null}
        <div className="mt-12 grid gap-10 border-t border-border pt-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl">Overview</h2>
            <p className="mt-4 leading-7 text-muted-foreground">{c.summary}</p>
            {c.description ? (
              <p className="mt-4 leading-7 text-muted-foreground">{c.description}</p>
            ) : null}
          </div>
          <div>
            <h2 className="font-serif text-2xl">Markets</h2>
            <p className="mt-4 text-muted-foreground">{c.markets}</p>
            {c.website ? (
              <a
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "mt-8 inline-flex min-h-11 rounded-xl px-5 font-bold"
                )}
                href={c.website}
                rel="noreferrer"
                target="_blank"
              >
                Visit digital estate ↗
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
