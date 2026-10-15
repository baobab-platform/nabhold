import { PageHeader } from "@/components/marketing/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { readAuthSettings } from "@/lib/auth/oidc/settings"

// Read deployment configuration at request time; never bake activation or
// client metadata into a public static page. Passwords remain with Baobab IAM.
export const dynamic = "force-dynamic"
export default function Page() {
  let enabled = false
  try { enabled = readAuthSettings() !== null } catch { /* Fail closed without exposing configuration details. */ }
  return <>
    <PageHeader eyebrow="Authorised access" title="Executive portal"
      description="Sign in through Baobab IAM. Access to executive information requires separate authorisation."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sign in" }]} />
    <section className="shell max-w-lg pb-20"><Card>
      <CardHeader><CardTitle>Sign in</CardTitle><CardDescription>
        {enabled ? "Continue to the approved identity provider." : "Federated sign-in is awaiting protected configuration and acceptance."}
      </CardDescription></CardHeader>
      <CardContent><form method="post" action="/api/auth/login">
        <Button type="submit" disabled={!enabled} className="w-full font-bold">Continue with Baobab IAM</Button>
      </form></CardContent>
    </Card></section>
  </>
}
