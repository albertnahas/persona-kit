import OpenAI from "openai";
import type { Embedder } from "../types.js";

/**
 * Create OpenAI embedder
 */
export function createOpenAIEmbedder(options?: {
  apiKey?: string;
  model?: string;
}): Embedder {
  const client = new OpenAI({
    apiKey: options?.apiKey ?? process.env.OPENAI_API_KEY,
  });
  const model = options?.model ?? "text-embedding-3-small";

  // Dimension for text-embedding-3-small
  const dimension = 1536;

  return {
    dimension,

    async embed(texts: string[]): Promise<number[][]> {
      if (texts.length === 0) return [];

      const response = await client.embeddings.create({
        model,
        input: texts,
      });

      return response.data.map((item) => item.embedding);
    },
  };
}

/**
 * Default embedder (lazy loaded)
 */
let defaultEmbedder: Embedder | null = null;

export function getDefaultEmbedder(): Embedder {
  if (!defaultEmbedder) {
    defaultEmbedder = createOpenAIEmbedder();
  }
  return defaultEmbedder;
}
