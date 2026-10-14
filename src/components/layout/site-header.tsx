import Link from "next/link"

import { getContentGateway } from "@/lib/content"
import { buttonVariants } from "@/components/ui/button"
import { MobileNav } from "@/components/marketing/mobile-nav"
import { cn } from "cn"

export async function SiteHeader() {
  const gateway = await getContentGateway()
  const navigation = await gateway.getNavigation()

  return (
    <header className="border-b border-border bg-[var(--paper)]/90 backdrop-blur">
      <div className="shell flex min-h-20 items-center justify-between gap-6">
        <Link href="/" className="font-serif text-xl font-bold">
          NABHOLD <span className="text-[var(--gold-deep)]">GROUP AFRICA</span>
        </Link>
        <nav aria-label="Primary" className="hidden gap-7 md:flex">
          {navigation.primary.map((item) => (
            <Link
              className="text-sm font-semibold transition-colors hover:text-[var(--gold-deep)]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "default" }),
              "hidden min-h-10 rounded-xl px-4 font-bold md:inline-flex"
            )}
          >
            Executive portal
          </Link>
          <MobileNav items={navigation.primary} />
        </div>
      </div>
    </header>
  )
}
