import { cn } from "cn"

type ContentShellProps = {
  children: React.ReactNode
  className?: string
  as?: "div" | "section" | "main"
}

export function ContentShell({
  children,
  className,
  as: Comp = "div",
}: ContentShellProps) {
  return <Comp className={cn("shell", className)}>{children}</Comp>
}
