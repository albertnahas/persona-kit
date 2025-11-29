# PersonaKit Architecture Design

## Context

PersonaKit is a developer toolkit for building AI chat applications. The architecture must support:

- Reusable SDK published to npm
- Clone-and-deploy template for rapid adoption
- Future expansion to SaaS without major refactoring

**Stakeholders**: Open-source developers, indie hackers, small teams wanting to ship AI chat without LangChain complexity.

## Goals / Non-Goals

### Goals

- Ship minimal, opinionated SDK (<100KB bundled)
- Enable "clone -> config -> deploy" workflow in <5 minutes
- Support RAG with pluggable vector stores
- Streaming responses via Vercel AI SDK
- Memory persistence abstraction

### Non-Goals

- Multi-agent orchestration (future capability)
- Built-in hosted vector DB (use external providers)
- SaaS dashboard (deferred to later phase)
- Support for non-TypeScript projects

## Decisions

### D1: Monorepo with pnpm workspaces

**Decision**: Use pnpm workspaces over turborepo for simplicity.

**Alternatives considered**:

- Turborepo: More features but adds complexity for a new project
- Separate repos: Harder to maintain consistency

**Rationale**: pnpm workspaces provide sufficient isolation and are simpler to configure. Can migrate to turborepo if build times become an issue.

### D2: Vercel AI SDK as streaming foundation

**Decision**: Build `useChatAgent()` as a thin wrapper around Vercel AI SDK's `useChat()`.

**Alternatives considered**:

- Custom streaming implementation: More control but reinvents the wheel
- LangChain: Heavy, complex, poor DX

**Rationale**: Vercel AI SDK is well-maintained, TypeScript-first, and handles edge cases in streaming.

### D3: RAG with pluggable embedders

**Decision**: Default to OpenAI embeddings but allow injection of custom embedders.

**Alternatives considered**:

- Single provider: Simpler but locks users in
- Multi-provider out-of-box: Too much code for v1

**Rationale**: Start with one good default, design the interface for extensibility.

### D4: Memory as interface, not implementation

**Decision**: Define `MemoryStore` interface with KV and SQLite adapters included.

**Alternatives considered**:

- No memory: Simpler but useless for real apps
- Only in-memory: No persistence
- Only database: Requires infrastructure

**Rationale**: Interface allows users to bring their own storage while providing sensible defaults.

### D5: Handler pattern for API routes

**Decision**: Export `agent.handle` as a Request handler compatible with Next.js App Router.

**Alternatives considered**:

- Export separate functions: More flexible but worse DX
- Framework-specific exports: Limits portability

**Rationale**: Request/Response handlers work across Next.js, Express, and edge runtimes.

### D6: Unscoped package name

**Decision**: Use `personakit` as the npm package name (unscoped).

**Alternatives considered**:

- `@personakit/core`: Requires npm org setup, more friction

**Rationale**: Immediate `npm install personakit`, easier SEO and discoverability. Can introduce `@personakit/cli` later without renaming.

### D7: OpenAI-only for v1

**Decision**: Support OpenAI as the only model provider in v1.

**Alternatives considered**:

- Multi-provider from day one: More boilerplate and testing

**Rationale**: Ship fast, embedder architecture supports future providers.

### D8: MIT License

**Decision**: Use MIT license for maximum adoption.

**Alternatives considered**:

- Apache 2.0: More legal protection but less adoption-friendly

**Rationale**: Adoption > protection. Same playbook as Supabase, Clerk, NextAuth.

## Package Structure

```text
packages/personakit/
├── src/
│   ├── index.ts              # Public exports
│   ├── agent/
│   │   ├── createAgent.ts
│   │   ├── types.ts
│   │   ├── personality.ts
│   │   └── prompt-builder.ts # merges persona + instructions + system
│   ├── knowledge/
│   │   ├── createKnowledgeBase.ts
│   │   ├── vectorStore.ts    # interface only
│   │   ├── embedder.ts       # default: OpenAI embeddings
│   │   └── loaders/
│   │       ├── markdown.ts
│   │       ├── file.ts
│   │       └── web.ts
│   ├── memory/
│   │   ├── types.ts
│   │   ├── kv.ts             # Vercel KV adapter
│   │   ├── sqlite.ts         # local sqlite adapter
│   │   └── memoryUtils.ts
│   ├── server/
│   │   ├── handler.ts        # next/express-friendly handler
│   │   └── requestParser.ts
│   └── react/
│       └── useChatAgent.ts   # thin wrapper over Vercel AI
├── tests/
│   ├── agent.test.ts
│   ├── rag.test.ts
│   ├── memory.test.ts
│   └── handler.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Template Structure

```text
templates/next-starter/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/chat/route.ts     # imports agent.ts, calls agent.handle
├── components/
│   ├── Chat.tsx
│   ├── MessageList.tsx
│   ├── InputBox.tsx
│   └── LoadingDots.tsx
├── personakit/               # user edits this folder only
│   ├── agent.ts              # createAgent() config
│   ├── persona.md
│   ├── instructions.md
│   └── knowledge/
│       ├── docs.md
│       └── faq.md
├── lib/
│   ├── embeddings.ts         # optional override provider
│   └── vectorStore.ts        # optional external store (pgvector)
├── public/
│   └── favicon.ico
├── package.json
├── README.md
└── next.config.js
```

## Monorepo Structure

```text
personakit/
├── packages/
│   └── personakit/           # npm publish target (SDK)
├── templates/
│   └── next-starter/         # clone -> config -> deploy starter
├── examples/
│   └── basic-node/           # minimal backend-only sample
├── docs/
│   ├── getting-started.md
│   ├── configuration.md
│   ├── persona.md
│   ├── rag.md
│   ├── memory.md
│   ├── vector-stores.md
│   ├── api-reference.md
│   └── roadmap.md
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   │   ├── test.yml
│   │   ├── release.yml
│   │   └── lint.yml
│   └── FUNDING.yml
├── package.json
├── pnpm-workspace.yaml
├── LICENSE
└── README.md
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| OpenAI dependency | Abstract behind embedder interface; document alternatives |
| Vercel AI SDK breaking changes | Pin version; wrap in thin abstraction layer |
| Vector store vendor lock-in | Define `VectorStore` interface from day one |
| Template diverges from SDK | Use workspace linking; run template tests against local SDK |

## Migration Plan

Not applicable - greenfield project.

## Resolved Questions

1. **Package name**: `personakit` (unscoped) - immediate npm install, better SEO
2. **Default model provider**: OpenAI-only for v1 - ship fast, architecture supports future providers
3. **License**: MIT - adoption over protection
