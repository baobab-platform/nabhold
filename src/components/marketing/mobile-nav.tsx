"use client"

import * as React from "react"
import Link from "next/link"
import { MenuIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }

export function MobileNav({
  items,
  portalHref = "/sign-in",
}: {
  items: NavItem[]
  portalHref?: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-9 items-center justify-center rounded-xl border border-border lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100%,20rem)]">
        <SheetHeader>
          <SheetTitle className="font-serif">Nabhold</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile primary" className="mt-6 grid gap-1">
          {items.map((item) => (
            <React.Fragment key={item.href}>
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
            {item.children?.length ? <div className="mb-3 ml-4 grid gap-1 border-l border-border pl-3">{item.children.filter(child => child.href !== item.href).map(child => <Link key={child.href} href={child.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted">{child.label}</Link>)}</div> : null}
            </React.Fragment>
          ))}
          <Link
            href={portalHref}
            onClick={() => setOpen(false)}
            className="mt-4 rounded-xl bg-primary px-3 py-3 text-center text-sm font-bold text-primary-foreground"
          >
            Executive portal
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
