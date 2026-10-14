import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "cn"

type InsightCardProps = {
  slug: string
  title: string
  summary?: string
  topic?: string
  publishedAt?: string
  className?: string
}

export function InsightCard({
  slug,
  title,
  summary,
  topic,
  publishedAt,
  className,
}: InsightCardProps) {
  return (
    <Link href={`/insights/${slug}`} className={cn("group block", className)}>
      <Card className="transition-shadow group-hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            {topic ? <Badge variant="outline">{topic}</Badge> : null}
            {publishedAt ? (
              <time className="text-xs text-muted-foreground">{publishedAt}</time>
            ) : null}
          </div>
          <h2 className="mt-4 font-serif text-2xl group-hover:underline">{title}</h2>
          {summary ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{summary}</p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  )
}
