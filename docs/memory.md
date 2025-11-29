# Memory

Persist conversations across sessions with pluggable memory stores.

## Overview

Memory allows your agent to:
- Remember previous messages in a conversation
- Maintain context across page refreshes
- Build long-running conversations

## Built-in Adapters

### KV Memory (Vercel KV, Upstash)

```typescript
import { createAgent, createKVMemory } from "personakit";
import { kv } from "@vercel/kv";

const agent = createAgent({
  name: "Bot",
  memory: createKVMemory(kv, {
    prefix: "chat",
    ttl: 86400000, // 24 hours in ms
  }),
});
```

### SQLite Memory

For local development or self-hosted deployments:

```typescript
import { createSQLiteMemory } from "personakit";
import Database from "better-sqlite3";

const db = new Database("memory.db");

const agent = createAgent({
  name: "Bot",
  memory: createSQLiteMemory(db),
});
```

### In-Memory (Development)

```typescript
import { createInMemoryStore } from "personakit";

const agent = createAgent({
  name: "Bot",
  memory: createInMemoryStore(),
});
```

## Session Management

Sessions are identified by a session ID sent with each request.

### Via Header

```typescript
fetch("/api/chat", {
  method: "POST",
  headers: {
    "x-session-id": "user-123-session-456",
  },
  body: JSON.stringify({ messages }),
});
```

### Via Cookie

Set `personakit-session` cookie on the client.

### Via Request Body

```typescript
fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({
    messages,
    sessionId: "user-123-session-456",
  }),
});
```

## Disabling Memory

For stateless operation:

```typescript
createAgent({
  name: "Bot",
  memory: false,
});
```

## Custom Memory Store

Implement the `MemoryStore` interface:

```typescript
interface MemoryStore {
  get(key: string): Promise<Message[] | null>;
  set(key: string, value: Message[]): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}
```

Example with Redis:

```typescript
const redisMemory: MemoryStore = {
  async get(key) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
  async set(key, messages) {
    await redis.set(key, JSON.stringify(messages));
  },
  async delete(key) {
    await redis.del(key);
  },
  async list(prefix) {
    return redis.keys(`${prefix}*`);
  },
};
```

## Best Practices

1. **Set TTL** - Clean up old sessions automatically
2. **Use prefixes** - Organize keys by user or feature
3. **Trim history** - Keep conversations manageable
4. **Handle failures** - Memory errors shouldn't break chat
