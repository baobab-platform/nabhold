import { Card, CardContent } from "@/components/ui/card"
import { cn } from "cn"

export function EmptyState({
  title,
  description,
  className,
  children,
}: {
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-start gap-2 p-8">
        <h3 className="font-serif text-xl">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
        {children}
      </CardContent>
    </Card>
  )
}
