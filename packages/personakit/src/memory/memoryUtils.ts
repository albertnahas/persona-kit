import type { Message, MemoryStore } from "../types.js";

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Extract session ID from request headers or generate new one
 */
export function getSessionId(request: Request): string {
  const sessionHeader = request.headers.get("x-session-id");
  if (sessionHeader) return sessionHeader;

  // Try to get from cookie
  const cookies = request.headers.get("cookie");
  if (cookies) {
    const match = cookies.match(/personakit-session=([^;]+)/);
    if (match) return match[1];
  }

  return generateSessionId();
}

/**
 * Trim conversation history to a maximum number of messages
 */
export function trimHistory(messages: Message[], maxMessages: number): Message[] {
  if (messages.length <= maxMessages) return messages;

  // Always keep system messages
  const systemMessages = messages.filter((m) => m.role === "system");
  const nonSystemMessages = messages.filter((m) => m.role !== "system");

  const trimmed = nonSystemMessages.slice(-maxMessages);
  return [...systemMessages, ...trimmed];
}

/**
 * Get the last N messages from history
 */
export function getRecentMessages(
  messages: Message[],
  count: number
): Message[] {
  return messages.slice(-count);
}

/**
 * Create an in-memory store for testing/development
 */
export function createInMemoryStore(): MemoryStore {
  const store = new Map<string, Message[]>();

  return {
    async get(key: string): Promise<Message[] | null> {
      return store.get(key) ?? null;
    },

    async set(key: string, messages: Message[]): Promise<void> {
      store.set(key, messages);
    },

    async delete(key: string): Promise<void> {
      store.delete(key);
    },

    async list(prefix: string): Promise<string[]> {
      return Array.from(store.keys()).filter((k) => k.startsWith(prefix));
    },
  };
}
