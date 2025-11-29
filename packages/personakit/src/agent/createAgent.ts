import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import type { Agent, AgentConfig, Message, SearchResult } from "../types.js";
import { resolveConfig } from "./types.js";
import { resolvePersonality } from "./personality.js";
import { buildSystemPrompt, buildBaseSystemPrompt } from "./prompt-builder.js";
import { createKnowledgeBase } from "../knowledge/createKnowledgeBase.js";
import { parseRequest } from "../server/requestParser.js";

/**
 * Create an AI agent with persona, instructions, and optional RAG
 */
export function createAgent(config: AgentConfig): Agent {
  const resolved = resolveConfig(config);

  let knowledgeBase: Awaited<ReturnType<typeof createKnowledgeBase>> | null =
    null;
  let personalityText: string | null = null;

  // Lazy initialization
  async function init() {
    if (personalityText === null) {
      personalityText = await resolvePersonality(resolved.personality);
    }

    if (knowledgeBase === null && resolved.knowledgeBasePaths.length > 0) {
      knowledgeBase = await createKnowledgeBase({
        source: resolved.knowledgeBasePaths,
        embedder: resolved.embedder ?? undefined,
        vectorStore: resolved.vectorStore ?? undefined,
      });
    }
  }

  async function getSystemPrompt(): Promise<string> {
    await init();
    return buildBaseSystemPrompt({
      name: resolved.name,
      personality: personalityText ?? "",
      instructions: resolved.instructions,
    });
  }

  async function search(query: string, limit = 5): Promise<SearchResult[]> {
    await init();
    if (!knowledgeBase) return [];
    return knowledgeBase.search(query, limit);
  }

  async function handle(request: Request): Promise<Response> {
    await init();

    const { messages, sessionId } = await parseRequest(request);

    // Load conversation history from memory
    let history: Message[] = [];
    if (resolved.memory && sessionId) {
      const stored = await resolved.memory.get(sessionId);
      if (stored) {
        history = stored;
      }
    }

    // Combine history with new messages
    const allMessages = [...history, ...messages];

    // Get RAG context if knowledge base exists
    let context: SearchResult[] = [];
    if (knowledgeBase) {
      const lastUserMessage = messages.findLast(
        (m: Message) => m.role === "user"
      );
      if (lastUserMessage) {
        context = await knowledgeBase.search(lastUserMessage.content, 5);
      }
    }

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt({
      name: resolved.name,
      personality: personalityText ?? "",
      instructions: resolved.instructions,
      context: context.length > 0 ? context : undefined,
    });

    // Stream response
    const result = await streamText({
      model: openai(resolved.model),
      system: systemPrompt,
      messages: allMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Save to memory after response completes
    if (resolved.memory && sessionId) {
      result.text.then(async (text: string) => {
        const newMessages: Message[] = [
          ...allMessages,
          {
            id: crypto.randomUUID(),
            role: "assistant" as const,
            content: text,
            createdAt: new Date(),
          },
        ];
        await resolved.memory!.set(sessionId, newMessages);
      });
    }

    return result.toDataStreamResponse();
  }

  return {
    name: resolved.name,
    handle,
    getSystemPrompt,
    search,
  };
}
