import { Card, CardContent } from "@/components/ui/card"
import { cn } from "cn"

type KpiCardProps = {
  label: string
  value: string
  delta?: string
  deltaTone?: "up" | "down" | "neutral"
  className?: string
}

export function KpiCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
  className,
}: KpiCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-5">
        <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-3 font-serif text-3xl">{value}</p>
        {delta ? (
          <p
            className={cn(
              "mt-2 text-sm font-medium",
              deltaTone === "up" && "text-[var(--forest)]",
              deltaTone === "down" && "text-destructive",
              deltaTone === "neutral" && "text-muted-foreground"
            )}
          >
            {delta}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
