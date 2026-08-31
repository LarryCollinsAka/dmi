export async function analyzeWithGemini(fileBuffer: Buffer) {
  // Mock analysis - returns same data as /api/analyze mock
  return { recommendation: "CONDITIONAL", confidence: 73, tokens: 184000 };
}
export const genAI: any = null;