import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "cn"

export function ErrorState({
  title = "Something went wrong",
  description,
  className,
}: {
  title?: string
  description?: string
  className?: string
}) {
  return (
    <Alert variant="destructive" className={cn(className)}>
      <AlertTitle>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </Alert>
  )
}
