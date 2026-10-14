import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { getSession } from "@/lib/auth/session"
import { isReleaseEnabled } from "@/lib/release/release-class"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export const metadata = { robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isReleaseEnabled("R1")) notFound()
  const session = await getSession()
  if (!session) redirect("/sign-in")

  const initials = session.displayName
    .split(/\s+/)
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[var(--sidebar)]">
      <header className="bg-[var(--ink)] text-white">
        <div className="shell flex min-h-16 items-center justify-between">
          <Link href="/dashboard" className="font-serif text-xl">
            Nabhold Executive
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-white/65 sm:inline">
              {session.displayName}
            </span>
            <Avatar className="size-8 border border-white/20">
              <AvatarFallback className="bg-white/10 text-xs text-white">
                {initials || "EX"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="shell grid gap-8 py-8 md:grid-cols-[200px_1fr]">
        <aside>
          <AppSidebar />
        </aside>
        <main id="main">{children}</main>
      </div>
    </div>
  )
}
