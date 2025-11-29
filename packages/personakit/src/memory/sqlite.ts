import type { Message, MemoryStore } from "../types.js";
import type { MemoryStoreOptions, SessionData } from "./types.js";

/**
 * SQLite database interface
 * Compatible with better-sqlite3, sql.js, etc.
 */
export interface SQLiteDB {
  /** Execute raw SQL (for table creation) */
  run(sql: string): void;
  /** Prepare a statement */
  prepare(sql: string): SQLiteStatement;
}

export interface SQLiteStatement {
  run(...params: unknown[]): void;
  get(...params: unknown[]): unknown;
  all(...params: unknown[]): unknown[];
}

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS personakit_memory (
    key TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )
`;

const INSERT_SQL = `
  INSERT OR REPLACE INTO personakit_memory (key, data, created_at, updated_at)
  VALUES (?, ?, ?, ?)
`;

const SELECT_SQL = `
  SELECT data, created_at, updated_at FROM personakit_memory WHERE key = ?
`;

const DELETE_SQL = `
  DELETE FROM personakit_memory WHERE key = ?
`;

const LIST_SQL = `
  SELECT key FROM personakit_memory WHERE key LIKE ?
`;

/**
 * Create a SQLite-based memory store
 */
export function createSQLiteMemory(
  db: SQLiteDB,
  options?: MemoryStoreOptions
): MemoryStore {
  const prefix = options?.prefix ?? "personakit";

  // Initialize table using prepared statement
  const createStmt = db.prepare(CREATE_TABLE_SQL);
  createStmt.run();

  function fullKey(key: string): string {
    return `${prefix}:${key}`;
  }

  return {
    async get(key: string): Promise<Message[] | null> {
      const stmt = db.prepare(SELECT_SQL);
      const row = stmt.get(fullKey(key)) as
        | { data: string; created_at: number; updated_at: number }
        | undefined;

      if (!row) return null;

      try {
        const data = JSON.parse(row.data) as SessionData;
        return data.messages;
      } catch {
        return null;
      }
    },

    async set(key: string, messages: Message[]): Promise<void> {
      const fk = fullKey(key);
      const now = Date.now();

      // Get existing created_at
      const existingStmt = db.prepare(SELECT_SQL);
      const existing = existingStmt.get(fk) as
        | { created_at: number }
        | undefined;
      const createdAt = existing?.created_at ?? now;

      const data: SessionData = {
        messages,
        createdAt,
        updatedAt: now,
      };

      const stmt = db.prepare(INSERT_SQL);
      stmt.run(fk, JSON.stringify(data), createdAt, now);
    },

    async delete(key: string): Promise<void> {
      const stmt = db.prepare(DELETE_SQL);
      stmt.run(fullKey(key));
    },

    async list(keyPrefix: string): Promise<string[]> {
      const stmt = db.prepare(LIST_SQL);
      const rows = stmt.all(`${prefix}:${keyPrefix}%`) as { key: string }[];
      return rows.map((r) => r.key.replace(`${prefix}:`, ""));
    },
  };
}
