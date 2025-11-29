# Configuration

## AgentConfig

The main configuration object for `createAgent()`.

```typescript
interface AgentConfig {
  name: string;
  personality?: string;
  instructions?: string;
  knowledgeBase?: string | string[];
  memory?: MemoryStore | false;
  embedder?: Embedder;
  vectorStore?: VectorStore;
  model?: string;
}
```

### name (required)

The display name of your agent. Used in the system prompt.

```typescript
createAgent({
  name: "DocBot",
  // ...
});
```

### personality

Personality traits as a string or path to a markdown file.

```typescript
// Inline string
createAgent({
  name: "Bot",
  personality: "helpful, friendly, concise",
});

// File path
createAgent({
  name: "Bot",
  personality: "./persona.md",
});
```

### instructions

System instructions for agent behavior.

```typescript
createAgent({
  name: "Bot",
  instructions: `
    Answer questions based on the provided context.
    Be concise and accurate.
    Ask for clarification when needed.
  `,
});
```

### knowledgeBase

Path to documents for RAG (Retrieval-Augmented Generation).

```typescript
// Single directory
createAgent({
  name: "Bot",
  knowledgeBase: "./docs",
});

// Multiple sources
createAgent({
  name: "Bot",
  knowledgeBase: ["./docs", "./faq.md"],
});
```

### memory

Memory store for conversation persistence. Set to `false` to disable.

```typescript
import { createKVMemory } from "personakit";

createAgent({
  name: "Bot",
  memory: createKVMemory(kvClient),
});

// Disable memory
createAgent({
  name: "Bot",
  memory: false,
});
```

### model

The OpenAI model to use. Default: `gpt-4-turbo-preview`.

```typescript
createAgent({
  name: "Bot",
  model: "gpt-4o",
});
```

## Environment Variables

### OPENAI_API_KEY (required)

Your OpenAI API key.

```bash
OPENAI_API_KEY=sk-...
```

## KnowledgeBaseConfig

Configuration for `createKnowledgeBase()`.

```typescript
interface KnowledgeBaseConfig {
  source: string | string[];
  embedder?: Embedder;
  vectorStore?: VectorStore;
  chunkSize?: number;
  chunkOverlap?: number;
}
```

### source (required)

Files, directories, or URLs to index.

### chunkSize

Maximum characters per chunk. Default: 1000.

### chunkOverlap

Characters of overlap between chunks. Default: 200.
