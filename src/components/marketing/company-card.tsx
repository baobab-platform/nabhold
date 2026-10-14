import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "cn"

type CompanyCardProps = {
  slug: string
  name: string
  summary: string
  sector?: string
  image?: { url: string; alt: string; width?: number; height?: number } | null
  index?: number
  className?: string
}

export function CompanyCard({
  slug,
  name,
  summary,
  sector,
  index,
  image,
  className,
}: CompanyCardProps) {
  return (
    <Link href={`/portfolio/${slug}`} className={cn("group block h-full", className)}>
      <Card className="h-full min-h-72 transition-shadow group-hover:shadow-lg">
        {image?.url ? <div className="relative aspect-[16/10] overflow-hidden"><Image src={image.url} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div> : <div className="h-2 bg-[var(--gold)]" aria-hidden="true" />}
        <CardContent className="flex h-full flex-col p-7">
          <div className="flex items-start justify-between gap-3">
            {typeof index === "number" ? (
              <span className="text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : (
              <span />
            )}
            {sector ? <Badge variant="secondary">{sector}</Badge> : null}
          </div>
          <h2 className="mt-8 font-serif text-3xl">{name}</h2>
          <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{summary}</p>
          <span className="mt-7 inline-block font-bold text-[var(--gold-deep)]">
            View company →
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
