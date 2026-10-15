import type { Metadata } from "next";
import { ShieldCheck, Users, Scale, Network } from "lucide-react";
import { EditorialPage } from "@/components/marketing/editorial-page";
export const metadata:Metadata={title:"Governance | Nabhold Group Africa",description:"Governance, autonomy and responsible ownership in the Nabhold Group."};
export default function Page(){return <EditorialPage breadcrumbs={[{label:"Home",href:"/"},{label:"Our Group",href:"/about/group"},{label:"Governance"}]} eyebrow="Corporate governance" title="Responsible ownership. Clear accountability." lead="Governance clarifies the rights, decisions and responsibilities of the holding company and independently operated subsidiaries." principles={[
{title:"Entity autonomy",body:"Each company retains its legal identity and operating mandates, including decisions on participating in individual markets.",icon:Users},
{title:"Board and executive oversight",body:"Responsibilities and decisions must be grounded in actual authorisations, with auditable approvals.",icon:ShieldCheck},
{title:"Risk and capital governance",body:"Financial exposure, capital allocation and material decisions follow established approval boundaries.",icon:Scale},
{title:"Digital accountability",body:"Platform entitlements and canonical identities are owned by Baobab authorities, not redefined by this digital estate.",icon:Network}
]} closing="Trust grows from demonstrable responsibility." related={[{label:"Investment approach",href:"/investment"},{label:"Group structure",href:"/platform"},{label:"Our Group",href:"/about/group"}]}/>}