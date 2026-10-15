import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/marketing/page-header"
import { Button } from "@/components/ui/button"
import { SESSION } from "@/lib/auth/oidc/handlers"
import { readAuthSettings } from "@/lib/auth/oidc/settings"
import { createConfidentialStoreFromEnv } from "@/lib/auth/store/redis-backend"
import { requireCurrentIdentity } from "@/lib/auth/oidc/authority"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const metadata = { robots: { index: false, follow: false } }
/** Identity landing page only. No roles or business information are projected.
 * Reading the opaque cookie alone never proves current identity or CP access.
 */
export default async function Page() {
  let identity: { principalId: string; expiresAt: number } | undefined
  let csrfToken = ""
  try {
    const settings = readAuthSettings(), store = createConfidentialStoreFromEnv()
    const handles = (await cookies()).getAll(SESSION)
    const raw = (await headers()).get("cookie") ?? ""
    const count = raw.split(";").filter(part => part.trim().split("=", 1)[0] === SESSION).length
    if (!settings || !store || handles.length !== 1 || count !== 1) throw new Error()
    const session = await store.readSession(handles[0].value)
    if (!session) throw new Error()
    identity = await requireCurrentIdentity(session, settings)
    csrfToken = session.csrfToken
  } catch { /* A failed dependency or stale identity must not render account data. */ }
  if (!identity) redirect("/sign-in")
  return <>
    <PageHeader eyebrow="Account" title="Identity checked"
      description="Your IAM session and active Control Plane identity have been checked. Executive and CMS access require their own current authorisation."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]} />
    <section className="shell max-w-lg pb-20">
      <p className="mb-6 break-all">Principal: {identity.principalId}</p>
      <form method="post" action="/api/auth/logout">
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <Button type="submit">Sign out of Nabhold</Button>
      </form>
    </section>
  </>
}
