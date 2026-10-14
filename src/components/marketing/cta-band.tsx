import { cn } from "cn"

type CtaBandProps = {
  title: string
  description?: string
  className?: string
}

export function CtaBand({ title, description, className }: CtaBandProps) {
  return (
    <section className={cn("bg-[var(--forest)] py-20 text-white", className)}>
      <div className="shell grid gap-10 md:grid-cols-2">
        <h2 className="display text-5xl">{title}</h2>
        {description ? (
          <p className="self-end text-lg leading-8 text-white/75">{description}</p>
        ) : null}
      </div>
    </section>
  )
}
