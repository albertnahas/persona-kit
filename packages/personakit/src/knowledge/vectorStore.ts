import type { DocumentChunk, SearchResult, VectorStore } from "../types.js";

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * In-memory vector store for small knowledge bases
 */
export function createInMemoryVectorStore(): VectorStore {
  const documents: { chunk: DocumentChunk; embedding: number[] }[] = [];

  return {
    async add(chunks: DocumentChunk[], embeddings: number[][]): Promise<void> {
      for (let i = 0; i < chunks.length; i++) {
        documents.push({
          chunk: chunks[i],
          embedding: embeddings[i],
        });
      }
    },

    async search(embedding: number[], limit: number): Promise<SearchResult[]> {
      const scored = documents.map((doc) => ({
        chunk: doc.chunk,
        score: cosineSimilarity(embedding, doc.embedding),
      }));

      scored.sort((a, b) => b.score - a.score);

      return scored.slice(0, limit);
    },

    async clear(): Promise<void> {
      documents.length = 0;
    },
  };
}

/**
 * Default vector store (lazy loaded)
 */
let defaultVectorStore: VectorStore | null = null;

export function getDefaultVectorStore(): VectorStore {
  if (!defaultVectorStore) {
    defaultVectorStore = createInMemoryVectorStore();
  }
  return defaultVectorStore;
}
