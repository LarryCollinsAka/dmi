"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const t = {
  en: {
    title: "Upload Tender Document",
    subtitle: "127-page bilingual tender → Evidence-to-Decision brief",
    drop: "Drop your RFP PDF here",
    hint: "PDF, DOCX, PNG up to 150MB • Bilingual FR/EN auto-detected",
    browse: "Browse files",
    pipeline: "Pipeline",
    analyze: "Analyze with Gemini Long-Context",
    analyzing: "Analyzing 184k tokens...",
    meta: "127 pages • 184k tokens • FR/EN",
  },
  fr: {
    title: "Téléverser le Document",
    subtitle: "Appel d'offres bilingue 127 pages → Brief Evidence-to-Decision",
    drop: "Déposez votre DAO PDF ici",
    hint: "PDF, DOCX, PNG jusqu'à 150MB • Bilingue FR/EN détecté auto",
    browse: "Parcourir",
    pipeline: "Pipeline DMI",
    analyze: "Analyser avec Gemini Long-Contexte",
    analyzing: "Analyse de 184k tokens...",
    meta: "127 pages • 184k tokens • FR/EN",
  }
};

export default function UploadPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<"en" | "fr">("en");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const tr = locale === "en"? t.en : t.fr;

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("locale", locale);

      console.log("Calling /api/analyze...");
      const res = await fetch("/api/analyze", { method: "POST", body: fd });

      if (!res.ok) {
        const err = await res.text();
        console.error("API error:", err);
        alert(`API error: ${res.status} - ${err}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Created:", data);
      router.push(`/analysis/${data.tenderId}?locale=${locale}`);
    } catch (e: any) {
      console.error(e);
      alert("Fetch failed: " + e.message);
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-end gap-2 mb-6">
        <Button variant={locale==='en'?'default':'outline'} size="sm" onClick={()=>setLocale('en')}>EN</Button>
        <Button variant={locale==='fr'?'default':'outline'} size="sm" onClick={()=>setLocale('fr')}>FR</Button>
      </div>

      <h1 className="text-3xl font-bold">{tr.title}</h1>
      <p className="text-zinc-500 mt-1">{tr.subtitle}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="lg:col-span-2 p-8 border-dashed border-2">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">📄</div>
            <p className="font-medium">{tr.drop}</p>
            <p className="text-xs text-zinc-500 mt-1">{tr.hint}</p>

            <input
              type="file"
              id="file"
              className="hidden"
              accept=".pdf,.docx,.png,.jpg"
              onChange={(e)=> setFile(e.target.files?.[0] || null)}
            />
            <div className="mt-4">
              <Button variant="outline" type="button" onClick={() => document.getElementById('file')?.click()}>
                {tr.browse}
              </Button>
            </div>

            {file && (
              <div className="mt-6 w-full bg-zinc-50 p-4 rounded-lg flex justify-between items-center border">
                <div className="text-left">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-zinc-500">{tr.meta}</p>
                </div>
                <Badge>Bilingual detected</Badge>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 h-fit">
          <h3 className="font-semibold text-sm">{tr.pipeline}</h3>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between"><span className="text-zinc-500">1. Observe</span><span className="text-zinc-700">File uploaded</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">2. Understand</span><span className="text-zinc-700">Gemini 1M ctx</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">3. Decide</span><span className="text-zinc-700">BID/NO-BID</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">4. Act</span><span className="text-zinc-700">Governance log</span></div>
          </div>

          <Button
            className="w-full mt-6 bg-black text-white hover:bg-zinc-800"
            type="button"
            disabled={file === null || loading}
            onClick={handleAnalyze}
          >
            {loading? tr.analyzing : tr.analyze}
          </Button>
          <p className="text- text-zinc-400 mt-2 text-center">System: GEMINI_1.5_PRO • Locale: {locale.toUpperCase()}</p>
        </Card>
      </div>
    </main>
  );
}