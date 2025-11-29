import type {
  DocumentChunk,
  KnowledgeBaseConfig,
  SearchResult,
} from "../types.js";
import type { KnowledgeBase } from "./types.js";
import { resolveKBConfig } from "./types.js";
import { createFileLoader } from "./loaders/file.js";
import { createWebLoader } from "./loaders/web.js";
import { getDefaultEmbedder } from "./embedder.js";
import { getDefaultVectorStore } from "./vectorStore.js";

/**
 * Create a knowledge base from files, directories, or URLs
 */
export async function createKnowledgeBase(
  config: KnowledgeBaseConfig
): Promise<KnowledgeBase> {
  const resolved = resolveKBConfig(
    config,
    getDefaultEmbedder(),
    getDefaultVectorStore()
  );

  const fileLoader = createFileLoader({
    chunkSize: resolved.chunkSize,
    chunkOverlap: resolved.chunkOverlap,
  });

  const webLoader = createWebLoader({
    chunkSize: resolved.chunkSize,
    chunkOverlap: resolved.chunkOverlap,
  });

  let documentCount = 0;

  // Load all documents from sources
  const allChunks: DocumentChunk[] = [];

  for (const source of resolved.sources) {
    let chunks: DocumentChunk[];

    if (webLoader.canHandle(source)) {
      chunks = await webLoader.load(source);
    } else {
      chunks = await fileLoader.load(source);
    }

    allChunks.push(...chunks);
  }

  // Generate embeddings and add to vector store
  if (allChunks.length > 0) {
    const texts = allChunks.map((c) => c.content);
    const embeddings = await resolved.embedder.embed(texts);
    await resolved.vectorStore.add(allChunks, embeddings);
    documentCount = allChunks.length;
  }

  return {
    async search(query: string, limit = 5): Promise<SearchResult[]> {
      const [queryEmbedding] = await resolved.embedder.embed([query]);
      return resolved.vectorStore.search(queryEmbedding, limit);
    },

    async add(chunks: DocumentChunk[]): Promise<void> {
      const texts = chunks.map((c) => c.content);
      const embeddings = await resolved.embedder.embed(texts);
      await resolved.vectorStore.add(chunks, embeddings);
      documentCount += chunks.length;
    },

    async clear(): Promise<void> {
      await resolved.vectorStore.clear();
      documentCount = 0;
    },

    count(): number {
      return documentCount;
    },
  };
}
