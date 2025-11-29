/**
 * Custom embeddings configuration
 *
 * Uncomment and modify to use a different embedding provider.
 * By default, PersonaKit uses OpenAI's text-embedding-3-small model.
 */

// import type { Embedder } from "personakit";

// export const customEmbedder: Embedder = {
//   dimension: 1536,
//   async embed(texts: string[]): Promise<number[][]> {
//     // Implement your custom embedding logic here
//     // Example: Use a different OpenAI model, Cohere, or local embeddings
//     throw new Error("Custom embedder not implemented");
//   },
// };
