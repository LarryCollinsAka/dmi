import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const locale = (form.get("locale") as string) || "en";

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    console.log(`Analyzing ${file.name} locale=${locale}`);

    // Create Tender
    const tender = await prisma.tenderAnalysis.create({
      data: {
        fileName: file.name,
        uploadedBy: "demo-user",
        localeDetected: "bilingual",
        recommendation: "CONDITIONAL",
        confidence: 73,
        tokens: 184000,
      }
    });

    // Mock bilingual requirements
    const mock = [
      { section: "§4.2", page: 37, en: "Rural digital infrastructure", fr: "Infrastructure numérique rurale", gap_en: "Missing partnership", gap_fr: "Partenariat manquant", status: "partial" },
      { section: "§5.1", page: 42, en: "ISO 9001 certification", fr: "Certification ISO 9001", gap_en: "Expired 2024", gap_fr: "Expirée 2024", status: "not_met" },
      { section: "§7.3", page: 89, en: "Local content 30%", fr: "Contenu local 30%", gap_en: "Not demonstrated", gap_fr: "Non démontré", status: "partial" },
    ];

    for (const m of mock) {
      const reqRow = await prisma.requirement.create({
        data: { tenderId: tender.id, section: m.section, page: m.page, status: m.status }
      });
      await prisma.requirementTranslation.createMany({
        data: [
          { requirementId: reqRow.id, locale: "en", label: m.en, gap: m.gap_en },
          { requirementId: reqRow.id, locale: "fr", label: m.fr, gap: m.gap_fr },
        ]
      });
    }

    await prisma.decisionLog.create({
      data: {
        tenderId: tender.id,
        userId: "demo-user",
        action: "ANALYZED",
        reason: `Initial analysis in ${locale}`,
        newRecommendation: "CONDITIONAL",
      }
    });

    return NextResponse.json({ tenderId: tender.id });
  } catch (e: any) {
    console.error("Analyze error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}