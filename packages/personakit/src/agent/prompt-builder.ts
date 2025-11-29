import type { SearchResult } from "../types.js";

/**
 * Build the system prompt from personality, instructions, and context
 */
export function buildSystemPrompt(options: {
  name: string;
  personality: string;
  instructions: string;
  context?: SearchResult[];
}): string {
  const parts: string[] = [];

  // Agent identity
  parts.push(`You are ${options.name}.`);

  // Personality
  if (options.personality) {
    parts.push("");
    parts.push("## Personality");
    parts.push(options.personality);
  }

  // Instructions
  if (options.instructions) {
    parts.push("");
    parts.push("## Instructions");
    parts.push(options.instructions);
  }

  // RAG context
  if (options.context && options.context.length > 0) {
    parts.push("");
    parts.push("## Relevant Context");
    parts.push(
      "Use the following information to answer the user's question:"
    );
    parts.push("");

    for (const result of options.context) {
      parts.push(`### Source: ${result.chunk.source}`);
      parts.push(result.chunk.content);
      parts.push("");
    }
  }

  return parts.join("\n");
}

/**
 * Build a simple system prompt without RAG context
 */
export function buildBaseSystemPrompt(options: {
  name: string;
  personality: string;
  instructions: string;
}): string {
  return buildSystemPrompt({
    name: options.name,
    personality: options.personality,
    instructions: options.instructions,
  });
}
