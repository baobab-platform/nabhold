import { MenuIcon, XIcon } from "lucide-react"

type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

/**
 * The navigation is a non-modal disclosure, not a credentialed dialog.
 * Native HTML Popover provides a browser-owned top layer, Escape/light dismiss,
 * invocation ARIA and focus restoration without shipping a drawer hydration
 * runtime on every public route. Links use ordinary document navigation so a
 * sign-in request establishes its own strict CSP and server-owned authority.
 */
export function MobileNav({
  items,
  portalHref = "/sign-in",
}: {
  items: NavItem[]
  portalHref?: string
}) {
  const id = "nabhold-mobile-primary-menu"
  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        popoverTarget={id}
        className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-background text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
      >
        <MenuIcon aria-hidden="true" className="size-5" />
      </button>
      <div
        id={id}
        popover="auto"
        className="fixed inset-y-0 right-0 left-auto m-0 max-h-dvh w-[min(100%,20rem)] overflow-y-auto overscroll-contain border-l border-border bg-background p-6 text-foreground shadow-2xl backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <span className="font-serif text-2xl font-semibold">Nabhold</span>
          <button
            type="button"
            popoverTarget={id}
            popoverTargetAction="hide"
            aria-label="Close menu"
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border focus-visible:outline-2"
          >
            <XIcon aria-hidden="true" className="size-5" />
          </button>
        </div>
        <nav aria-label="Mobile primary" className="mt-6 grid gap-1">
          {items.map((item) => (
            <div key={item.href}>
              <a
                href={item.href}
                className="block rounded-xl px-3 py-3 text-sm font-semibold hover:bg-muted focus-visible:bg-muted"
              >
                {item.label}
              </a>
              {item.children?.length ? (
                <div className="mb-3 ml-4 grid gap-1 border-l border-border pl-3">
                  {item.children
                    .filter((child) => child.href !== item.href)
                    .map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted focus-visible:bg-muted"
                      >
                        {child.label}
                      </a>
                    ))}
                </div>
              ) : null}
            </div>
          ))}
          <a
            href={portalHref}
            className="mt-4 rounded-xl bg-primary px-3 py-3 text-center text-sm font-bold text-primary-foreground"
          >
            Executive portal
          </a>
        </nav>
      </div>
    </>
  )
}
