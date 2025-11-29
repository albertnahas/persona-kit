## 1. Monorepo Setup

- [x] 1.1 Initialize pnpm workspace at project root
- [x] 1.2 Create root `package.json` with workspace configuration
- [x] 1.3 Create `pnpm-workspace.yaml`
- [x] 1.4 Create root `tsconfig.json` with path aliases
- [x] 1.5 Add `.gitignore` for node_modules, dist, .env files
- [x] 1.6 Add MIT LICENSE file
- [x] 1.7 Create root README.md with project overview

## 2. GitHub Configuration

- [x] 2.1 Create `.github/workflows/test.yml` for CI
- [x] 2.2 Create `.github/workflows/release.yml` for npm publish
- [x] 2.3 Create `.github/workflows/lint.yml` for code quality
- [x] 2.4 Create `.github/ISSUE_TEMPLATE/` with bug and feature templates
- [x] 2.5 Create `.github/FUNDING.yml` for sponsorship

## 3. SDK Package Foundation

- [x] 3.1 Create `packages/personakit/package.json` with dependencies
- [x] 3.2 Create `packages/personakit/tsconfig.json` for library build
- [x] 3.3 Set up build script (tsup)
- [x] 3.4 Create `src/index.ts` with placeholder exports
- [x] 3.5 Add `src/types.ts` with core type definitions

## 4. Agent Core Implementation

- [x] 4.1 Implement `src/agent/types.ts` (AgentConfig, PersonaConfig)
- [x] 4.2 Implement `src/agent/createAgent.ts`
- [x] 4.3 Implement `src/agent/personality.ts` (persona loading)
- [x] 4.4 Implement `src/agent/prompt-builder.ts` (merges persona + instructions)
- [x] 4.5 Add tests for agent creation (`tests/agent.test.ts`)

## 5. Knowledge Base Implementation

- [x] 5.1 Implement `src/knowledge/types.ts` (KnowledgeBaseConfig, Embedder)
- [x] 5.2 Implement `src/knowledge/loaders/markdown.ts`
- [x] 5.3 Implement `src/knowledge/loaders/file.ts`
- [x] 5.4 Implement `src/knowledge/loaders/web.ts`
- [x] 5.5 Implement `src/knowledge/embedder.ts` (OpenAI default)
- [x] 5.6 Implement `src/knowledge/vectorStore.ts` (interface)
- [x] 5.7 Implement `src/knowledge/createKnowledgeBase.ts`
- [x] 5.8 Add in-memory vector store implementation
- [x] 5.9 Add tests for knowledge base (`tests/rag.test.ts`)

## 6. Memory Store Implementation

- [x] 6.1 Implement `src/memory/types.ts` (MemoryStore interface)
- [x] 6.2 Implement `src/memory/kv.ts` (Vercel KV adapter)
- [x] 6.3 Implement `src/memory/sqlite.ts` (SQLite adapter)
- [x] 6.4 Implement `src/memory/memoryUtils.ts` (session helpers)
- [x] 6.5 Add tests for memory stores (`tests/memory.test.ts`)

## 7. Server Handler Implementation

- [x] 7.1 Implement `src/server/requestParser.ts`
- [x] 7.2 Implement `src/server/handler.ts` (Request handler)
- [x] 7.3 Integrate RAG context injection
- [x] 7.4 Integrate memory load/save
- [x] 7.5 Add streaming response support
- [x] 7.6 Add tests for handler (`tests/handler.test.ts`)

## 8. React Hook Implementation

- [x] 8.1 Implement `src/react/useChatAgent.ts`
- [x] 8.2 Add React peer dependency
- [x] 8.3 Configure separate entry point for React exports

## 9. Next.js Template Foundation

- [x] 9.1 Create `templates/next-starter/` with Next.js 14
- [x] 9.2 Install shadcn/ui and Tailwind CSS
- [x] 9.3 Create `app/layout.tsx` and `app/page.tsx`
- [x] 9.4 Create `next.config.js`
- [x] 9.5 Link to local personakit package via workspace

## 10. Template Chat UI

- [x] 10.1 Create `components/Chat.tsx` (main chat container)
- [x] 10.2 Create `components/MessageList.tsx`
- [x] 10.3 Create `components/InputBox.tsx`
- [x] 10.4 Create `components/LoadingDots.tsx`
- [x] 10.5 Add streaming state handling
- [x] 10.6 Make responsive for mobile/desktop

## 11. Template Configuration

- [x] 11.1 Create `personakit/agent.ts` with example config
- [x] 11.2 Create `personakit/persona.md` example
- [x] 11.3 Create `personakit/instructions.md` example
- [x] 11.4 Create `personakit/knowledge/docs.md` example
- [x] 11.5 Create `personakit/knowledge/faq.md` example
- [x] 11.6 Create `app/api/chat/route.ts`
- [x] 11.7 Create `lib/embeddings.ts` (optional override)
- [x] 11.8 Create `lib/vectorStore.ts` (optional pgvector)

## 12. Template Polish

- [x] 12.1 Add `.env.example` with required variables
- [x] 12.2 Create template README.md with setup instructions
- [x] 12.3 Add Vercel deployment configuration
- [x] 12.4 Test full clone-to-deploy flow

## 13. Basic Node Example

- [x] 13.1 Create `examples/basic-node/package.json`
- [x] 13.2 Create `examples/basic-node/index.ts` (Express server)
- [x] 13.3 Create `examples/basic-node/agent.ts`
- [x] 13.4 Create `examples/basic-node/knowledge/sample.md`
- [x] 13.5 Create `examples/basic-node/README.md`

## 14. Documentation

- [x] 14.1 Create `docs/getting-started.md`
- [x] 14.2 Create `docs/configuration.md`
- [x] 14.3 Create `docs/persona.md`
- [x] 14.4 Create `docs/rag.md`
- [x] 14.5 Create `docs/memory.md`
- [x] 14.6 Create `docs/vector-stores.md`
- [x] 14.7 Create `docs/api-reference.md`
- [x] 14.8 Create `docs/roadmap.md`

## 15. Final Validation

- [x] 15.1 Run all tests
- [x] 15.2 Build SDK package
- [x] 15.3 Test template with built SDK
- [x] 15.4 Verify Vercel deployment works
- [x] 15.5 Verify npm publish dry-run
