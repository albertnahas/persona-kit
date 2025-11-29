import { createAgent } from "personakit";

/**
 * Your AI agent configuration
 *
 * Edit this file to customize your agent's behavior.
 * Changes take effect on the next request (hot reload in dev mode).
 */
export const agent = createAgent({
  // Give your agent a name
  name: "PersonaKit Assistant",

  // Load personality from file for easier editing
  personality: "./personakit/persona.md",

  // Load instructions from file
  instructions: "./personakit/instructions.md",

  // Enable knowledge base with RAG
  knowledgeBase: "./personakit/knowledge",

  // Model to use (default: gpt-4-turbo-preview)
  // model: "gpt-4o",

  // Memory configuration (optional)
  // memory: false, // Disable memory
});
