import type { Metadata } from "next";
import { Landmark, Scale, Sprout, ShieldCheck } from "lucide-react";
import { EditorialPage } from "@/components/marketing/editorial-page";
export const metadata:Metadata={title:"Investment philosophy | Nabhold Group Africa",description:"How Nabhold approaches patient capital, investment governance and long-term stewardship."};
export default function Page(){return <EditorialPage breadcrumbs={[{label:"Home",href:"/"},{label:"Investment"}]} eyebrow="Investment philosophy" title="Patient capital. Enduring enterprises." lead="We consider investments with a long-term view of operating strength, accountability and responsible value creation. Nothing on this page constitutes an investment offering." principles={[
{title:"Long-term orientation",body:"Decisions are informed by enduring enterprise fundamentals rather than short-term promises.",icon:Sprout},
{title:"Capital discipline",body:"Capital allocation requires proportionate diligence, governed approval and clear accountability.",icon:Landmark},
{title:"Independent operating mandates",body:"Subsidiaries evaluate commercial opportunities and market entry within their own legitimate authorities.",icon:Scale},
{title:"Responsible stewardship",body:"Performance, risk and organisational purpose are considered together.",icon:ShieldCheck}
]} closing="Value is built by deliberate ownership, not by promotional claims." related={[{label:"Corporate governance",href:"/governance"},{label:"Our businesses",href:"/portfolio"},{label:"Markets",href:"/markets"}]}/>}