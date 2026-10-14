"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight,MapPinned} from "lucide-react";
import geo from "@/data/africa-geometry.json";
import {MARKET_STATEMENTS,type MarketStatement} from "@/data/market-status";
type Point=number[];
type Shape={name:string;coords:Point[][][]};
type Props={compact?:boolean; statements?:MarketStatement[]; title?:string};
/**
 * Country boundary geometry is vendored so the map works without third-party
 * browser network requests. Coordinates are lon/lat; conversion is a small
 * equirectangular projection, suitable for editorial country selection.
 * The map does not imply location-specific operational approval.
 */
export function AfricaFootprint({compact=false,statements=MARKET_STATEMENTS,title="African market contexts"}:Props){
 const [selected,setSelected]=useState<string>("South Africa");
 const geometry=geo as Shape[];
 const byCountry=useMemo(()=>new Map(statements.map(s=>[s.country,s])),[statements]);
 const W=620,H=660;
 const xy=(p:Point):[number,number]=>[(p[0]+20)/73*W,(39-p[1])/78*H];
 const pathFor=(coords:Point[][][])=>coords.map(poly=>poly.map(ring=>ring.map((point,i)=>{const [x,y]=xy(point);return `${i===0?"M":"L"}${x.toFixed(1)},${y.toFixed(1)}`}).join(" ")+" Z").join(" ")).join(" ");
 const selectedInfo=byCountry.get(selected);
 return <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
  <div className="rounded-lg border border-border bg-[#eae8e1] p-4 sm:p-6">
   <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-widest">{title}</p><p className="text-[11px] text-muted-foreground">Select a country to inspect status</p></div>
   <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Geographic map of African countries; use adjacent country buttons for keyboard access" className={compact?"mx-auto max-h-80 w-full":"mx-auto max-h-[650px] w-full"}>
     {geometry.map(country=>{const s=byCountry.get(country.name);const active=country.name===selected;return <path key={country.name} d={pathFor(country.coords)} fill={active?"#FCA300":s?.status==="registered"?"#e3ba61":s?.status==="operating"?"#32644c":s?.status==="interest"?"#b4c9d1":"#c9c7be"} stroke="#fffdf8" strokeWidth={active?2.5:1.1} strokeLinejoin="round" className="cursor-pointer transition-colors hover:fill-[#ffcd69]" onClick={()=>setSelected(country.name)}><title>{country.name}{s?`: ${s.status}`:" — no published status"}</title></path>})}
   </svg>
   <div className="mt-4 flex flex-wrap gap-4 text-xs"><span><span className="mr-1 inline-block size-3 bg-[#e3ba61]"/>Registered</span><span><span className="mr-1 inline-block size-3 bg-[#b4c9d1]"/>Strategic interest</span><span><span className="mr-1 inline-block size-3 bg-[#32644c]"/>Verified operations</span><span><span className="mr-1 inline-block size-3 bg-[#c9c7be]"/>Unspecified</span></div>
  </div>
  <aside className="flex flex-col gap-4"><div className="border-t-4 border-[var(--gold)] bg-[var(--surface)] p-6"><MapPinned className="mb-4 text-[var(--gold-deep)]"/><h3 className="font-serif text-3xl">{selected}</h3>{selectedInfo?<><p className="eyebrow mt-3">{selectedInfo.status==="interest"?"Strategic interest":selectedInfo.status==="registered"?"Legal registration":"Verified operating status"}</p><p className="mt-4 text-sm leading-7 text-muted-foreground">{selectedInfo.description}</p><p className="mt-4 text-xs text-muted-foreground">Source: {selectedInfo.attribution}</p></>:<p className="mt-4 text-sm leading-7 text-muted-foreground">No independently publishable market declaration is available for this country. Absence of a statement is not an assertion of inactivity.</p>}</div>
  <div className="flex flex-wrap gap-2">{statements.map(s=><button type="button" key={s.country} onClick={()=>setSelected(s.country)} aria-pressed={selected===s.country} className={`min-h-11 border px-4 py-2 text-sm font-semibold ${selected===s.country?"border-[var(--gold-deep)] bg-[var(--gold)] text-black":"border-border bg-[var(--surface)]"}`}>{s.country}</button>)}</div>
  {!compact&&<Link href="/investment" className="mt-auto inline-flex items-center gap-2 font-bold text-[var(--gold-deep)]">How we evaluate markets <ArrowUpRight size={16}/></Link>}
  </aside>
 </div>;
}
