import { Badge } from "@/components/ui/badge"
import { cn } from "cn"

export function StatusBadge({
  direction,
  className,
}: {
  direction: string
  className?: string
}) {
  const d = direction.toLowerCase()
  const variant =
    d.includes("up") || d.includes("positive") || d.includes("bull")
      ? "default"
      : d.includes("down") || d.includes("negative") || d.includes("bear")
        ? "outline"
        : "secondary"

  return (
    <Badge
      variant={variant as "default" | "outline" | "secondary"}
      className={cn("capitalize", className)}
    >
      {direction}
    </Badge>
  )
}
