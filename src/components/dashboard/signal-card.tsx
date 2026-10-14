import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { cn } from "cn"

type SignalCardProps = {
  market: string
  title: string
  direction: string
  confidence: number
  className?: string
}

export function SignalCard({
  market,
  title,
  direction,
  confidence,
  className,
}: SignalCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold tracking-wide uppercase">{market}</span>
          <StatusBadge direction={direction} />
        </div>
        <h3 className="mt-6 text-xl font-bold">{title}</h3>
        <p className="mt-2 text-sm text-[var(--gold-deep)]">
          {direction} · {Math.round(confidence * 100)}%
        </p>
      </CardContent>
    </Card>
  )
}
