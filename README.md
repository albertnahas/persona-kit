# PersonaKit

Build AI chat applications without the complexity. PersonaKit provides a tiny, opinionated SDK for creating persona-driven AI agents with RAG and memory.

## Features

- **Agent Creation** - Configure AI agents with personality and instructions
- **Knowledge Base** - RAG with pluggable vector stores and embedders
- **Memory** - Conversation persistence with KV and SQLite adapters
- **Streaming** - Built on Vercel AI SDK for real-time responses
- **React Hook** - `useChatAgent()` for instant UI integration

## Quick Start

```bash
npm install personakit
```

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

## Packages

| Package | Description |
|---------|-------------|
| [personakit](./packages/personakit) | Core SDK |
| [next-starter](./templates/next-starter) | Next.js template |
| [basic-node](./examples/basic-node) | Node.js example |

## Template

Clone the starter template for the fastest path to deployment:

```bash
npx degit personakit/personakit/templates/next-starter my-agent
cd my-agent
pnpm install
pnpm dev
```

Edit `personakit/agent.ts`, drop docs in `personakit/knowledge/`, deploy to Vercel.

## Examples in Production

See PersonaKit in action:

- **[Albert's Portfolio](https://albert-portfolio-nine.vercel.app/)** - AI-powered portfolio assistant with RAG knowledge base

Building with PersonaKit? [Add your project!](https://github.com/albertnahas/persona-kit/issues/new)

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Configuration](./docs/configuration.md)
- [Persona](./docs/persona.md)
- [RAG](./docs/rag.md)
- [Memory](./docs/memory.md)
- [API Reference](./docs/api-reference.md)

## License

MIT
