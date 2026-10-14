import { PageHeader } from "@/components/marketing/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Authorised access"
        title="Executive portal"
        description="Federated group identity is not connected yet. Authentication remains behind a server-side abstraction for the canonical Baobab identity contract."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sign in" },
        ]}
      />
      <section className="shell max-w-lg pb-20">
        <Alert variant="warning" className="mb-6">
          <AlertTitle>Identity adapter pending</AlertTitle>
          <AlertDescription>
            This form is a structural placeholder. Credentials are not accepted
            until the Baobab identity contract is wired.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Use your Nabhold executive identity when federation is enabled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@nabhold.com"
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  disabled
                />
              </div>
              <Separator />
              <Button type="button" disabled className="w-full font-bold">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
