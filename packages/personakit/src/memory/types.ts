import type { Message, MemoryStore } from "../types.js";

/**
 * Options for memory stores
 */
export interface MemoryStoreOptions {
  /** Time-to-live in milliseconds (optional) */
  ttl?: number;
  /** Prefix for keys */
  prefix?: string;
}

/**
 * Session data stored in memory
 */
export interface SessionData {
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Apply prefix to key
 */
export function applyPrefix(key: string, prefix?: string): string {
  return prefix ? `${prefix}:${key}` : key;
}

/**
 * Remove prefix from key
 */
export function removePrefix(key: string, prefix?: string): string {
  if (!prefix) return key;
  return key.startsWith(`${prefix}:`) ? key.slice(prefix.length + 1) : key;
}
