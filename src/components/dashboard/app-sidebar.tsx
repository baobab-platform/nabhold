"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

type Item = {
  label: string
  href?: string
  disabled?: boolean
  hint?: string
}

const DEFAULT_ITEMS: Item[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Pulse", disabled: true, hint: "Coming with a later release flag" },
  {
    label: "Portfolio",
    disabled: true,
    hint: "Coming with a later release flag",
  },
  {
    label: "Reports",
    disabled: true,
    hint: "Coming with a later release flag",
  },
]

export function AppSidebar({ items = DEFAULT_ITEMS }: { items?: Item[] }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Executive" className="grid gap-1 text-sm font-semibold">
      {items.map((item) => {
        if (item.disabled || !item.href) {
          return (
            <span
              key={item.label}
              className="cursor-not-allowed rounded-xl px-3 py-2 text-black/35"
              aria-disabled="true"
              title={item.hint}
            >
              {item.label}
            </span>
          )
        }
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-3 py-2 transition-colors hover:bg-[var(--sidebar-accent)]",
              active && "bg-[var(--sidebar-accent)] text-[var(--forest)]"
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
