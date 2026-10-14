import { cn } from "cn"

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  className?: string
  align?: "left" | "center"
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className={cn("display mt-4 text-4xl md:text-5xl", !eyebrow && "mt-0")}>
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
