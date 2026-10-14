import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

type Cta = { label: string; href: string }

type HeroProps = {
  eyebrow?: string
  headline: string
  introduction?: string
  primaryCta?: Cta
  secondaryCta?: Cta
  className?: string
}

export function Hero({
  eyebrow,
  headline,
  introduction,
  primaryCta,
  secondaryCta,
  className,
}: HeroProps) {
  return (
    <section className={cn("border-b border-border py-20 md:py-32", className)}>
      <div className="shell grid items-end gap-10 md:grid-cols-[1.25fr_.75fr]">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="display mt-6 text-6xl md:text-8xl">{headline}</h1>
        </div>
        <div>
          {introduction ? (
            <p className="text-lg leading-8 text-muted-foreground">{introduction}</p>
          ) : null}
          {(primaryCta || secondaryCta) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {primaryCta ? (
                <Link
                  href={primaryCta.href}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "min-h-11 rounded-xl px-5 font-bold"
                  )}
                >
                  {primaryCta.label}
                </Link>
              ) : null}
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "min-h-11 rounded-xl px-5 font-bold"
                  )}
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
