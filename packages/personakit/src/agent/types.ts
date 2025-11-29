import type {
  AgentConfig,
  Embedder,
  MemoryStore,
  VectorStore,
} from "../types.js";

/**
 * Internal agent configuration with resolved values
 */
export interface ResolvedAgentConfig {
  name: string;
  personality: string;
  instructions: string;
  knowledgeBasePaths: string[];
  memory: MemoryStore | null;
  embedder: Embedder | null;
  vectorStore: VectorStore | null;
  model: string;
}

/**
 * Resolve agent config with defaults
 */
export function resolveConfig(config: AgentConfig): ResolvedAgentConfig {
  return {
    name: config.name,
    personality: config.personality ?? "",
    instructions: config.instructions ?? "",
    knowledgeBasePaths: config.knowledgeBase
      ? Array.isArray(config.knowledgeBase)
        ? config.knowledgeBase
        : [config.knowledgeBase]
      : [],
    memory: config.memory === false ? null : (config.memory ?? null),
    embedder: config.embedder ?? null,
    vectorStore: config.vectorStore ?? null,
    model: config.model ?? "gpt-4-turbo-preview",
  };
}
