import { QdrantClient } from "@qdrantjs/qdrant-rest";
export const qdrant = new QdrantClient({ url: process.env.QDRANT_URL || "http://localhost:6333" });
export const FRAMEWORK_COLLECTION = "frameworks";

export async function ensureCollection() {
  try {
    await qdrant.getCollection(FRAMEWORK_COLLECTION);
  } catch {
    await qdrant.createCollection(FRAMEWORK_COLLECTION, { vectors: { size: 768, distance: "Cosine" } });
  }
}