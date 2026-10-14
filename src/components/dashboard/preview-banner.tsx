import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PreviewBanner({
  title = "Preview data only",
  description = "No live upstream is connected. Figures are illustrative.",
}: {
  title?: string
  description?: string
}) {
  return (
    <Alert variant="warning" role="status">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
