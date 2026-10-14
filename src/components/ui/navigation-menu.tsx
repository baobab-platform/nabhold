"use client"

import { NavigationMenu as NavPrimitive } from "@base-ui/react/navigation-menu"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

function NavigationMenu({ className, ...props }: NavPrimitive.Root.Props) {
  return (
    <NavPrimitive.Root
      data-slot="navigation-menu"
      className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    />
  )
}

function NavigationMenuList({ className, ...props }: NavPrimitive.List.Props) {
  return (
    <NavPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
      {...props}
    />
  )
}

function NavigationMenuItem({ className, ...props }: NavPrimitive.Item.Props) {
  return (
    <NavPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavPrimitive.Trigger.Props) {
  return (
    <NavPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        "group inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors hover:bg-muted focus:bg-muted focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="relative top-px ml-1 size-3 transition duration-200 group-data-popup-open:rotate-180"
        aria-hidden
      />
    </NavPrimitive.Trigger>
  )
}

function NavigationMenuContent({ className, ...props }: NavPrimitive.Content.Props) {
  return (
    <NavPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "bg-popover text-popover-foreground absolute top-full left-0 mt-1.5 w-auto min-w-48 rounded-xl border border-border p-3 shadow-md",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuLink({ className, ...props }: NavPrimitive.Link.Props) {
  return (
    <NavPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "hover:bg-muted block rounded-lg p-2 text-sm transition-colors",
        className
      )}
      {...props}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
}
