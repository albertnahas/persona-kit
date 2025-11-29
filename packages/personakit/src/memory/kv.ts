import type { Message, MemoryStore } from "../types.js";
import type { MemoryStoreOptions, SessionData } from "./types.js";
import { applyPrefix } from "./types.js";

/**
 * KV client interface (compatible with Vercel KV, Upstash, etc.)
 */
export interface KVClient {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, options?: { ex?: number }): Promise<void>;
  del(key: string): Promise<void>;
  keys(pattern: string): Promise<string[]>;
}

/**
 * Create a KV-based memory store
 */
export function createKVMemory(
  client: KVClient,
  options?: MemoryStoreOptions
): MemoryStore {
  const prefix = options?.prefix ?? "personakit";
  const ttlSeconds = options?.ttl ? Math.floor(options.ttl / 1000) : undefined;

  return {
    async get(key: string): Promise<Message[] | null> {
      const fullKey = applyPrefix(key, prefix);
      const data = await client.get<SessionData>(fullKey);
      return data?.messages ?? null;
    },

    async set(key: string, messages: Message[]): Promise<void> {
      const fullKey = applyPrefix(key, prefix);
      const now = Date.now();

      const existing = await client.get<SessionData>(fullKey);
      const data: SessionData = {
        messages,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };

      await client.set(fullKey, data, ttlSeconds ? { ex: ttlSeconds } : undefined);
    },

    async delete(key: string): Promise<void> {
      const fullKey = applyPrefix(key, prefix);
      await client.del(fullKey);
    },

    async list(keyPrefix: string): Promise<string[]> {
      const pattern = applyPrefix(`${keyPrefix}*`, prefix);
      const keys = await client.keys(pattern);
      return keys.map((k) => k.replace(`${prefix}:`, ""));
    },
  };
}
