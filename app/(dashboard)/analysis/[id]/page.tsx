import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ locale?: string }>;
};

export default async function AnalysisPage({ params, searchParams }: Props) {
  // Next.js 16: params and searchParams are Promises — must await
  const { id } = await params;
  const { locale: localeParam } = await searchParams;
  const locale = (localeParam as "en" | "fr") || "en";

  if (!id) return notFound();

  const tender = await prisma.tenderAnalysis.findUnique({
    where: { id },
    include: {
      requirements: {
        include: { translations: true, frameworkMatches: { include: { frameworkDoc: { include: { framework: true } } } } }
      },
      decisionLogs: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!tender) return notFound();

  const t = (en: string, fr: string) => locale === "fr"? fr : en;

  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{t("Evidence-to-Decision Brief", "Brief Evidence-to-Decision")}</h1>
          <p className="text-xs text-zinc-500 mt-1">{tender.fileName} • {tender.tokens} tokens • {tender.localeDetected} • ID: {id.slice(0,8)}</p>
        </div>
        <Badge className={tender.recommendation === "BID"? "bg-green-600" : tender.recommendation === "NO-BID"? "bg-red-600" : "bg-amber-500"}>
          {tender.recommendation} • {tender.confidence}%
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          {tender.requirements.map((r) => {
            const trans = r.translations.find(x => x.locale === locale) || r.translations[0];
            return (
              <Card key={r.id} className="p-5">
                <div className="flex justify-between">
                  <span className="text-xs font-mono text-zinc-500">{r.section} • p.{r.page}</span>
                  <Badge variant="outline" className={r.status === "met"? "border-green-500 text-green-700" : r.status === "partial"? "border-amber-500 text-amber-700" : "border-red-500 text-red-700"}>{r.status}</Badge>
                </div>
                <h3 className="font-semibold mt-2">{trans?.label}</h3>
                {trans?.gap && <p className="text-sm text-red-600 mt-1">{t("Gap:", "Écart:")} {trans.gap}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text- text-zinc-400 border rounded px-2 py-1">SND30 • SDG • AU2063 alignment</span>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h4 className="font-semibold text-sm">{t("Governance Decision", "Décision de Gouvernance")}</h4>
            <form action={`/api/decision`} method="POST" className="mt-4 space-y-3">
              <input type="hidden" name="tenderId" value={tender.id} />
              <input type="hidden" name="locale" value={locale} />
              <textarea name="reason" required placeholder={t("Reason mandatory for audit", "Motif obligatoire pour audit")} className="w-full border rounded p-2 text-xs h-20"></textarea>
              <div className="flex gap-2">
                <Button name="decision" value="BID" type="submit" className="flex-1 bg-green-600 hover:bg-green-700">BID</Button>
                <Button name="decision" value="NO-BID" type="submit" variant="outline" className="flex-1 border-red-500 text-red-600">NO-BID</Button>
              </div>
            </form>
          </Card>

          <Card className="p-5">
            <h4 className="font-semibold text-sm">{t("Audit Trail", "Journal d'Audit")}</h4>
            <div className="mt-3 space-y-2">
              {tender.decisionLogs.map(log => (
                <div key={log.id} className="text- border-b pb-2">
                  <div className="flex justify-between"><span className="font-bold">{log.action}</span><span className="text-zinc-500">{new Date(log.createdAt).toLocaleTimeString()}</span></div>
                  <div className="text-zinc-600">{log.reason}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}