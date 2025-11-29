import { createAgent } from "personakit";
import path from "path";

/**
 * Your AI agent configuration
 *
 * Edit this file to customize your agent's behavior.
 * Changes take effect on the next request (hot reload in dev mode).
 *
 * IMPORTANT: When deploying to production (Vercel, etc.), use absolute paths:
 * - personality: path.join(process.cwd(), "personakit/persona.md")
 * - knowledgeBase: path.join(process.cwd(), "personakit/knowledge")
 *
 * The relative paths below work in development but will fail in production.
 */
export const agent = createAgent({
  // Give your agent a name
  name: "PersonaKit Assistant",

  // Load personality from file for easier editing
  // For production: path.join(process.cwd(), "personakit/persona.md")
  personality: "./personakit/persona.md",

  // Load instructions from file
  // For production: path.join(process.cwd(), "personakit/instructions.md")
  instructions: "./personakit/instructions.md",

  // Enable knowledge base with RAG
  // For production: path.join(process.cwd(), "personakit/knowledge")
  knowledgeBase: "./personakit/knowledge",

  // Model to use (default: gpt-4-turbo-preview)
  // model: "gpt-4o",

  // Memory configuration (optional)
  // memory: false, // Disable memory
});
