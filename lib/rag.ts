// Stub for Vercel build - Qdrant disabled for MVP demo
// Later: npm install @qdrantjs/qdrant-rest and restore real client

export const qdrant: any = null;
export const FRAMEWORK_COLLECTION = "frameworks";

export async function searchFrameworks(query: string) {
  // Mock SND30 mapping for demo
  return [
    { framework: "SND30", score: 0.87, citation: "Pillar 2 §3.1" },
    { framework: "SDG", score: 0.72, citation: "SDG 9.c" },
  ];
}

export async function indexFrameworkDoc() {
  return { ok: true };
}