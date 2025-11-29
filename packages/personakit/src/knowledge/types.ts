import type {
  DocumentChunk,
  Embedder,
  KnowledgeBaseConfig,
  SearchResult,
  VectorStore,
} from "../types.js";

/**
 * Resolved knowledge base configuration
 */
export interface ResolvedKBConfig {
  sources: string[];
  embedder: Embedder;
  vectorStore: VectorStore;
  chunkSize: number;
  chunkOverlap: number;
}

/**
 * Knowledge base instance
 */
export interface KnowledgeBase {
  /** Search for relevant documents */
  search(query: string, limit?: number): Promise<SearchResult[]>;
  /** Add documents to the knowledge base */
  add(chunks: DocumentChunk[]): Promise<void>;
  /** Clear all documents */
  clear(): Promise<void>;
  /** Get document count */
  count(): number;
}

/**
 * Document loader interface
 */
export interface DocumentLoader {
  /** Check if loader can handle this source */
  canHandle(source: string): boolean;
  /** Load documents from source */
  load(source: string): Promise<DocumentChunk[]>;
}

/**
 * Default configuration values
 */
export const KB_DEFAULTS = {
  chunkSize: 1000,
  chunkOverlap: 200,
} as const;

/**
 * Resolve KB config with defaults
 */
export function resolveKBConfig(
  config: KnowledgeBaseConfig,
  embedder: Embedder,
  vectorStore: VectorStore
): ResolvedKBConfig {
  return {
    sources: Array.isArray(config.source) ? config.source : [config.source],
    embedder: config.embedder ?? embedder,
    vectorStore: config.vectorStore ?? vectorStore,
    chunkSize: config.chunkSize ?? KB_DEFAULTS.chunkSize,
    chunkOverlap: config.chunkOverlap ?? KB_DEFAULTS.chunkOverlap,
  };
}
