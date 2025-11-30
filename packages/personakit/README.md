# PersonaKit

Build AI chat applications without the complexity. PersonaKit provides a tiny, opinionated SDK for creating persona-driven AI agents with RAG and memory.

## Installation

```bash
npm install personakit
```

## Quick Start

```typescript
import { createAgent } from "personakit";

const agent = createAgent({
  name: "DocBot",
  personality: "helpful, concise",
  instructions: "Answer using the docs.",
  knowledgeBase: "./docs",
});

// In your Next.js API route
export const POST = agent.handle;
```

## Features

- **Agent Creation** - Configure AI agents with personality and instructions
- **Knowledge Base** - RAG with pluggable vector stores and embedders
- **Memory** - Conversation persistence with KV and SQLite adapters
- **Streaming** - Built on Vercel AI SDK for real-time responses
- **React Hook** - `useChatAgent()` for instant UI integration

## React Integration

```typescript
import { useChatAgent } from "personakit/react";

function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChatAgent({
    api: "/api/chat",
  });

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

## Configuration

### Personality

Define your agent's personality using strings or markdown files:

```typescript
const agent = createAgent({
  personality: "friendly, helpful, concise",
  // or
  personality: "./path/to/persona.md",
});
```

### Knowledge Base (RAG)

Add document retrieval with automatic vector embeddings:

```typescript
const agent = createAgent({
  knowledgeBase: "./docs",
  // Optional: custom embedder and vector store
  embedder: customEmbedder,
  vectorStore: customVectorStore,
});
```

### Memory

Enable conversation persistence:

```typescript
const agent = createAgent({
  memory: {
    type: "kv", // or "sqlite"
    config: {
      // adapter-specific config
    },
  },
});
```

## Starter Template

Clone the Next.js starter template for the fastest path to deployment:

```bash
npx degit personakit/personakit/templates/next-starter my-agent
cd my-agent
pnpm install
pnpm dev
```

## Documentation

- [Getting Started](https://github.com/albertnahas/persona-kit/blob/main/docs/getting-started.md)
- [Configuration](https://github.com/albertnahas/persona-kit/blob/main/docs/configuration.md)
- [Persona](https://github.com/albertnahas/persona-kit/blob/main/docs/persona.md)
- [RAG](https://github.com/albertnahas/persona-kit/blob/main/docs/rag.md)
- [Memory](https://github.com/albertnahas/persona-kit/blob/main/docs/memory.md)
- [API Reference](https://github.com/albertnahas/persona-kit/blob/main/docs/api-reference.md)

## Examples

See PersonaKit in action:

- [Albert's Portfolio](https://albert-portfolio-nine.vercel.app/) - AI-powered portfolio assistant with RAG knowledge base

## License

MIT
