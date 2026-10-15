import type { Metadata } from "next";
import { Network, Building2, ShieldCheck, Globe2 } from "lucide-react";
import { EditorialPage } from "@/components/marketing/editorial-page";
export const metadata:Metadata={title:"Shared digital capabilities | Nabhold Group Africa",description:"Baobab Platform and the separation of shared technology from corporate ownership."};
export default function Page(){return <EditorialPage breadcrumbs={[{label:"Home",href:"/"},{label:"Our Group",href:"/about/group"},{label:"Baobab Platform"}]} eyebrow="Shared capability" title="Connected by capability. Independent by design." lead="Baobab Platform provides shared digital infrastructure for distinct legal entities. It is not presented as an operating subsidiary in Nabhold's corporate ownership tree." principles={[
{title:"Distinct companies",body:"Nabhold, ZuriBeans, Thamani Global and Equator & Estate Co. preserve their own legal and operating boundaries.",icon:Building2},
{title:"Shared infrastructure",body:"Common digital services provide technology capability without transferring operating decisions to the platform.",icon:Network},
{title:"Governed identity",body:"Access rights and organisational contexts are resolved by their authoritative platform services.",icon:ShieldCheck},
{title:"Market independence",body:"Technology supports company-specific market entry, regional operations and expansion decisions.",icon:Globe2}
]} closing="Shared technology should strengthen autonomy—not obscure it." related={[{label:"Our portfolio",href:"/portfolio"},{label:"Governance",href:"/governance"},{label:"Intelligence",href:"/intelligence"}]}/>}