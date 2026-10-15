import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getContentGateway } from "@/lib/content";
import { PublicBreadcrumbs } from "@/components/marketing/public-breadcrumbs";

export async function generateStaticParams() {
  const gateway = await getContentGateway();
  const sectors = await gateway.listSectors();
  return sectors.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gateway = await getContentGateway();
  const sector = await gateway.getSector(slug);
  if (!sector) return {};

  return {
    title: sector.seo?.title ?? sector.name,
    description: sector.seo?.description ?? sector.summary,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gateway = await getContentGateway();
  const sector = await gateway.getSector(slug);
  if (!sector) notFound();

  return (
    <article className="shell py-20">
      <PublicBreadcrumbs items={[{label:"Home",href:"/"},{label:"Businesses",href:"/portfolio"},{label:"Sectors",href:"/sectors"},{label:sector.name}]} />
      <p className="eyebrow">Sector</p>
      <h1 className="display mt-5 text-6xl">{sector.name}</h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">
        {sector.summary}
      </p>
      {sector.description && (
        <p className="mt-6 max-w-2xl leading-7 text-[var(--muted)]">
          {sector.description}
        </p>
      )}
    </article>
  );
}
