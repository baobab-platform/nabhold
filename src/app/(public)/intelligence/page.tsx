import type { Metadata } from "next";
import { ChartNoAxesCombined, BookOpen, Compass, ShieldCheck } from "lucide-react";
import { EditorialPage } from "@/components/marketing/editorial-page";
export const metadata:Metadata={title:"Intelligence | Nabhold Group Africa",description:"Market research, sector perspectives and evidence-aware decision support."};
export default function Page(){return <EditorialPage eyebrow="Nabhold intelligence" title="Better intelligence. Better decisions." lead="Our ambition is evidence-aware research that helps the Group understand changing African markets. Only published, approved research is made available publicly." principles={[
{title:"Market intelligence",body:"Research into commercial context and changing market conditions, with clear source attribution.",icon:Compass},
{title:"Sector outlooks",body:"Longer-horizon perspectives on sectors relevant to the Group's strategic interests.",icon:ChartNoAxesCombined},
{title:"Published perspectives",body:"Editorial research and articles are surfaced through the corporate content gateway.",icon:BookOpen},
{title:"Responsible interpretation",body:"Evidence, uncertainty and publication approvals matter as much as the analytical output.",icon:ShieldCheck}
]} closing="Insight earns credibility when its evidence is transparent." related={[{label:"Published insights",href:"/insights"},{label:"African markets",href:"/markets"},{label:"Investment approach",href:"/investment"}]}/>}