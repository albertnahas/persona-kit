# API Reference

## createAgent

Create an AI agent with persona and optional RAG.

```typescript
function createAgent(config: AgentConfig): Agent;
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | Yes | Agent display name |
| personality | string | No | Personality traits or file path |
| instructions | string | No | System instructions |
| knowledgeBase | string \| string[] | No | RAG sources |
| memory | MemoryStore \| false | No | Conversation persistence |
| embedder | Embedder | No | Custom embedder |
| vectorStore | VectorStore | No | Custom vector store |
| model | string | No | OpenAI model (default: gpt-4-turbo-preview) |

### Returns

```typescript
interface Agent {
  name: string;
  handle: (request: Request) => Promise<Response>;
  getSystemPrompt: () => Promise<string>;
  search: (query: string, limit?: number) => Promise<SearchResult[]>;
}
```

### Example

```typescript
const agent = createAgent({
  name: "DocBot",
  personality: "helpful, concise",
  instructions: "Answer using the documentation.",
  knowledgeBase: "./docs",
});
```

---

## createKnowledgeBase

Create a standalone knowledge base for RAG.

```typescript
function createKnowledgeBase(config: KnowledgeBaseConfig): Promise<KnowledgeBase>;
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| source | string \| string[] | Yes | Files, directories, or URLs |
| embedder | Embedder | No | Custom embedder |
| vectorStore | VectorStore | No | Custom vector store |
| chunkSize | number | No | Max chars per chunk (default: 1000) |
| chunkOverlap | number | No | Overlap between chunks (default: 200) |

### Returns

```typescript
interface KnowledgeBase {
  search: (query: string, limit?: number) => Promise<SearchResult[]>;
  add: (chunks: DocumentChunk[]) => Promise<void>;
  clear: () => Promise<void>;
  count: () => number;
}
```

---

## useChatAgent

React hook for chat integration.

```typescript
function useChatAgent(options?: UseChatAgentOptions): ChatAgentReturn;
```

### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| endpoint | string | "/api/chat" | API endpoint |
| sessionId | string | - | Session ID for memory |
| initialMessages | Message[] | - | Initial conversation |
| onFinish | (message) => void | - | Called when response completes |
| onError | (error) => void | - | Called on error |

### Returns

| Name | Type | Description |
|------|------|-------------|
| messages | Message[] | Conversation messages |
| input | string | Current input value |
| handleInputChange | ChangeEventHandler | Input change handler |
| handleSubmit | FormEventHandler | Form submit handler |
| sendMessage | (content: string) => Promise | Send message programmatically |
| clearMessages | () => void | Clear conversation |
| isLoading | boolean | Response in progress |
| error | Error \| undefined | Current error |
| reload | () => void | Reload last message |
| stop | () => void | Stop generation |

---

## createKVMemory

Create a KV-based memory store.

```typescript
function createKVMemory(client: KVClient, options?: MemoryStoreOptions): MemoryStore;
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| client | KVClient | KV client (Vercel KV, Upstash, etc.) |
| options.prefix | string | Key prefix (default: "personakit") |
| options.ttl | number | TTL in milliseconds |

---

## createSQLiteMemory

Create a SQLite-based memory store.

```typescript
function createSQLiteMemory(db: SQLiteDB, options?: MemoryStoreOptions): MemoryStore;
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| db | SQLiteDB | SQLite database instance |
| options.prefix | string | Key prefix (default: "personakit") |

---

## Types

### Message

```typescript
interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
}
```

### DocumentChunk

```typescript
interface DocumentChunk {
  id: string;
  content: string;
  source: string;
  metadata: Record<string, unknown>;
}
```

### SearchResult

```typescript
interface SearchResult {
  chunk: DocumentChunk;
  score: number;
}
```

### Embedder

```typescript
interface Embedder {
  embed(texts: string[]): Promise<number[][]>;
  dimension: number;
}
```

### VectorStore

```typescript
interface VectorStore {
  add(chunks: DocumentChunk[], embeddings: number[][]): Promise<void>;
  search(embedding: number[], limit: number): Promise<SearchResult[]>;
  clear(): Promise<void>;
}
```

### MemoryStore

```typescript
interface MemoryStore {
  get(key: string): Promise<Message[] | null>;
  set(key: string, value: Message[]): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}
```
