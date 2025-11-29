/**
 * Configuration for creating an agent
 */
export interface AgentConfig {
  /** Unique name for the agent */
  name: string;
  /** Personality traits as string or path to markdown file */
  personality?: string;
  /** System instructions for the agent */
  instructions?: string;
  /** Path to knowledge base directory or files */
  knowledgeBase?: string | string[];
  /** Memory store configuration */
  memory?: MemoryStore | false;
  /** Custom embedder for RAG */
  embedder?: Embedder;
  /** Custom vector store for RAG */
  vectorStore?: VectorStore;
  /** Model to use (default: gpt-4-turbo-preview) */
  model?: string;
}

/**
 * Configuration for persona
 */
export interface PersonaConfig {
  /** Personality traits */
  personality?: string;
  /** Path to persona markdown file */
  personalityFile?: string;
}

/**
 * Configuration for knowledge base
 */
export interface KnowledgeBaseConfig {
  /** Source files or directories */
  source: string | string[];
  /** Custom embedder */
  embedder?: Embedder;
  /** Custom vector store */
  vectorStore?: VectorStore;
  /** Chunk size for document splitting */
  chunkSize?: number;
  /** Chunk overlap for document splitting */
  chunkOverlap?: number;
}

/**
 * A document chunk with metadata
 */
export interface DocumentChunk {
  /** Unique ID for the chunk */
  id: string;
  /** Text content */
  content: string;
  /** Source file or URL */
  source: string;
  /** Metadata */
  metadata: Record<string, unknown>;
}

/**
 * Search result from knowledge base
 */
export interface SearchResult {
  /** The document chunk */
  chunk: DocumentChunk;
  /** Similarity score (0-1) */
  score: number;
}

/**
 * Embedder interface for generating embeddings
 */
export interface Embedder {
  /** Generate embeddings for texts */
  embed(texts: string[]): Promise<number[][]>;
  /** Embedding dimension */
  dimension: number;
}

/**
 * Vector store interface for storing and searching embeddings
 */
export interface VectorStore {
  /** Add documents with embeddings */
  add(chunks: DocumentChunk[], embeddings: number[][]): Promise<void>;
  /** Search for similar documents */
  search(embedding: number[], limit: number): Promise<SearchResult[]>;
  /** Clear all documents */
  clear(): Promise<void>;
}

/**
 * Memory store interface for conversation persistence
 */
export interface MemoryStore {
  /** Get value by key */
  get(key: string): Promise<Message[] | null>;
  /** Set value for key */
  set(key: string, value: Message[]): Promise<void>;
  /** Delete key */
  delete(key: string): Promise<void>;
  /** List keys by prefix */
  list(prefix: string): Promise<string[]>;
}

/**
 * Chat message
 */
export interface Message {
  /** Message ID */
  id: string;
  /** Role: user, assistant, or system */
  role: "user" | "assistant" | "system";
  /** Message content */
  content: string;
  /** Timestamp */
  createdAt?: Date;
}

/**
 * Agent instance
 */
export interface Agent {
  /** Agent name */
  name: string;
  /** Handle incoming chat request */
  handle: (request: Request) => Promise<Response>;
  /** Get system prompt */
  getSystemPrompt(): Promise<string>;
  /** Search knowledge base */
  search(query: string, limit?: number): Promise<SearchResult[]>;
}

/**
 * Chat request body
 */
export interface ChatRequest {
  /** Messages in the conversation */
  messages: Message[];
  /** Session ID for memory */
  sessionId?: string;
}
