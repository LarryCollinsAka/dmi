import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const tenderId = form.get("tenderId") as string;
  const reason = form.get("reason") as string;
  const decision = form.get("decision") as string;
  const locale = (form.get("locale") as string) || "en";

  if (!tenderId ||!reason) return NextResponse.json({ error: "Reason required" }, { status: 400 });

  const tender = await prisma.tenderAnalysis.update({
    where: { id: tenderId },
    data: { recommendation: decision }
  });

  await prisma.decisionLog.create({
    data: {
      tenderId,
      userId: "demo-user",
      action: decision === "BID"? "APPROVED" : "REJECTED",
      reason,
      previousRecommendation: "CONDITIONAL",
      newRecommendation: decision,
    }
  });

  return NextResponse.redirect(new URL(`/analysis/${tenderId}?locale=${locale}`, req.url));
}