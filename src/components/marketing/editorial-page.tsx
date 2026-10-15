import Link from "next/link";
import { PublicBreadcrumbs, type PublicBreadcrumbItem } from "@/components/marketing/public-breadcrumbs";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

/** Publication-safe modular editorial layout; avoids unsourced KPIs or offers. */
export type EditorialItem = { title:string; body:string; icon:LucideIcon };
export function EditorialPage({eyebrow,title,lead,principles,closing,related,breadcrumbs}:{eyebrow:string;title:string;lead:string;principles:EditorialItem[];closing:string;related:{label:string;href:string}[];breadcrumbs:readonly PublicBreadcrumbItem[]}) {
 return <article>
   <header className="bg-[#121212] py-24 text-white"><div className="shell"><PublicBreadcrumbs items={breadcrumbs} contrast="dark" /><p className="eyebrow !text-[var(--gold)]">{eyebrow}</p><h1 className="display mt-7 max-w-5xl text-5xl md:text-7xl">{title}</h1><p className="mt-8 max-w-2xl text-lg leading-8 text-white/70">{lead}</p></div></header>
   <section className="shell py-20"><p className="eyebrow">Our approach</p><h2 className="mt-4 max-w-3xl font-serif text-4xl">Strong foundations. Deliberate decisions.</h2><div className="mt-12 grid gap-6 md:grid-cols-2">{principles.map(item=><section key={item.title} className="border-t-2 border-[var(--gold)] p-7 bg-[var(--surface)]"><item.icon className="size-9 text-[var(--gold-deep)]"/><h3 className="mt-6 font-serif text-3xl">{item.title}</h3><p className="mt-4 leading-7 text-muted-foreground">{item.body}</p></section>)}</div></section>
   <section className="bg-[var(--paper)] py-16"><div className="shell grid gap-8 md:grid-cols-2"><div><p className="eyebrow">Our perspective</p><h2 className="mt-5 font-serif text-4xl">{closing}</h2></div><div><p className="mb-5 text-sm font-semibold">Discover more</p><nav aria-label="Related reading" className="grid gap-3">{related.map(link=><Link key={link.href} href={link.href} className="flex items-center justify-between border-b border-border py-3 hover:text-[var(--gold-deep)]">{link.label}<ArrowUpRight size={18}/></Link>)}</nav></div></div></section>
 </article>;
}
