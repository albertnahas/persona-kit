// Core exports
export { createAgent } from "./agent/createAgent.js";
export { createKnowledgeBase } from "./knowledge/createKnowledgeBase.js";
export { createPersona } from "./agent/personality.js";

// Memory adapters
export { createKVMemory } from "./memory/kv.js";
export { createSQLiteMemory } from "./memory/sqlite.js";

// Types
export type {
  Agent,
  AgentConfig,
  ChatRequest,
  DocumentChunk,
  Embedder,
  KnowledgeBaseConfig,
  MemoryStore,
  Message,
  PersonaConfig,
  SearchResult,
  VectorStore,
} from "./types.js";
