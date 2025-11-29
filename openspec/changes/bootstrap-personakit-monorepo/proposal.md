## Why

PersonaKit needs a clean, production-ready architecture that enables developers to ship AI-powered chat applications without complexity. The current project is empty and requires a foundational structure that separates concerns: a reusable npm SDK for the "brain" and a deployable Next.js template for the "product."

## What Changes

- **NEW**: Monorepo structure using pnpm workspaces
- **NEW**: `packages/personakit` - Core SDK with agent creation, knowledge base, memory, and server handler
- **NEW**: `templates/next-starter` - Ready-to-deploy Next.js chat application
- **NEW**: `examples/basic` - Minimal usage examples
- **NEW**: `docs/` - Documentation for GitHub Pages

### Core SDK Capabilities
- `createAgent(config)` - Create configured AI agents
- `createKnowledgeBase(config)` - RAG layer with pluggable vector stores
- `useChatAgent()` - React hook wrapping Vercel AI SDK
- Memory storage abstraction (KV, SQLite adapters)
- Streaming-ready endpoint handler for `/api/chat`

### Template Features
- Chat UI with shadcn/ui components
- Pre-wired `/api/chat` route
- Hot reload for persona and instructions
- Example knowledge base (Markdown docs)

## Impact

- Affected specs: `sdk-core`, `knowledge-base`, `memory-store`, `agent-handler`, `next-template` (all new)
- Affected code: Entire project (greenfield bootstrap)
- Breaking changes: None (new project)
