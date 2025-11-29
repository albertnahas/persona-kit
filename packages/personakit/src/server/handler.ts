import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import type { Agent, AgentConfig, Message, SearchResult } from "../types.js";
import { parseRequest, createErrorResponse } from "./requestParser.js";

/**
 * Options for creating a standalone handler
 */
export interface HandlerOptions {
  /** Model to use */
  model?: string;
  /** System prompt */
  systemPrompt?: string;
  /** Function to get RAG context */
  getContext?: (query: string) => Promise<SearchResult[]>;
  /** Function to load conversation history */
  loadHistory?: (sessionId: string) => Promise<Message[]>;
  /** Function to save conversation */
  saveHistory?: (sessionId: string, messages: Message[]) => Promise<void>;
}

/**
 * Create a standalone request handler
 */
export function createHandler(options: HandlerOptions = {}) {
  const model = options.model ?? "gpt-4-turbo-preview";

  return async (request: Request): Promise<Response> => {
    try {
      const { messages, sessionId } = await parseRequest(request);

      // Load history if available
      let history: Message[] = [];
      if (options.loadHistory && sessionId) {
        history = await options.loadHistory(sessionId);
      }

      // Combine history with new messages
      const allMessages = [...history, ...messages];

      // Get RAG context if available
      let systemPrompt = options.systemPrompt ?? "";
      if (options.getContext) {
        const lastUserMessage = messages.findLast((m) => m.role === "user");
        if (lastUserMessage) {
          const context = await options.getContext(lastUserMessage.content);
          if (context.length > 0) {
            systemPrompt += "\n\n## Relevant Context\n";
            for (const result of context) {
              systemPrompt += `\n### Source: ${result.chunk.source}\n`;
              systemPrompt += result.chunk.content + "\n";
            }
          }
        }
      }

      // Stream response
      const result = streamText({
        model: openai(model),
        system: systemPrompt || undefined,
        messages: allMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      // Save history after response
      if (options.saveHistory && sessionId) {
        result.text.then(async (text) => {
          const newMessages: Message[] = [
            ...allMessages,
            {
              id: crypto.randomUUID(),
              role: "assistant" as const,
              content: text,
              createdAt: new Date(),
            },
          ];
          await options.saveHistory!(sessionId, newMessages);
        });
      }

      return result.toDataStreamResponse();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      return createErrorResponse(message, 500);
    }
  };
}

/**
 * Wrap an agent's handle method with error handling
 */
export function withErrorHandling(
  handler: (request: Request) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Handler error:", error);
      return createErrorResponse(message, 500);
    }
  };
}
