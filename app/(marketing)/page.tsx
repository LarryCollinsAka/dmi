"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Landing() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-white">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="font-bold">DMI • Evidence-to-Decision</span>
        <Button className="bg-black text-white hover:bg-zinc-800" onClick={() => router.push("/upload")}>
          Accéder / Access Platform
        </Button>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="inline-flex px-3 py-1 rounded-full bg-zinc-100 text-xs">SND30 • Bilingual FR/EN • ARMP Compliant</div>
        <h1 className="text-5xl font-bold mt-6 tracking-tight">Turn Tender Chaos into <br/>Auditable BID/NO-BID Decisions.</h1>
        <p className="text-zinc-600 mt-4 max-w-2xl">African SMEs spend 12h per RFP. DMI ingests 127-page bilingual tenders with Gemini long-context, extracts requirements with page-grounded citations, and produces a governance-ready decision brief with human accountability.</p>
        <div className="flex gap-3 mt-8">
          <Button size="lg" className="bg-black text-white hover:bg-zinc-800" onClick={() => router.push("/upload")}>
            Téléverser le Document — Upload Document
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push("/governance")}>
            Voir la Gouvernance / View Governance
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-20 border-t pt-10">
          <div><p className="text-2xl font-bold">184k</p><p className="text-xs text-zinc-500">Tokens per RFP processed</p></div>
          <div><p className="text-2xl font-bold">100%</p><p className="text-xs text-zinc-500">Citations grounded to page §</p></div>
          <div><p className="text-2xl font-bold">RBAC</p><p className="text-xs text-zinc-500">Analyst → Reviewer → Admin audit trail</p></div>
          <div><p className="text-2xl font-bold">SND30</p><p className="text-xs text-zinc-500">Aligned with Cameroon 2030 vision</p></div>
        </div>
      </section>
    </div>
  );
}