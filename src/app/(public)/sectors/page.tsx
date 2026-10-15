import Link from "next/link"

import { getContentGateway } from "@/lib/content"
import { PageHeader } from "@/components/marketing/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/dashboard/empty-state"

export default async function Page() {
  const gateway = await getContentGateway()
  const sectors = await gateway.listSectors()

  return (
    <>
      <PageHeader
        eyebrow="Strategic interests"
        title="Sectors we understand."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Businesses", href: "/portfolio" },
          { label: "Sectors" },
        ]}
      />
      <section className="shell pb-20">
        {sectors.length === 0 ? (
          <EmptyState
            title="Sectors not yet published"
            description="Sector narratives will appear once available from the content gateway."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sectors.map((s: { slug: string; name: string; summary?: string }) => (
              <Card key={s.slug}>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl">
                    <Link href={`/sectors/${s.slug}`} className="hover:underline">
                      {s.name}
                    </Link>
                  </h2>
                  {s.summary ? (
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {s.summary}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
