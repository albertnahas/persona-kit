## ADDED Requirements

### Requirement: Request Handler Export
The SDK SHALL export an `agent.handle` method compatible with Next.js App Router.

#### Scenario: Wire to API route
- **WHEN** developer exports `export const POST = agent.handle`
- **THEN** the route accepts chat requests and returns streaming responses

#### Scenario: Edge runtime compatible
- **WHEN** handler runs on Vercel Edge
- **THEN** streaming works without Node.js-specific APIs

### Requirement: Streaming Response
The SDK SHALL return streaming responses using the AI SDK format.

#### Scenario: Stream text chunks
- **WHEN** LLM generates response tokens
- **THEN** each token is streamed to the client immediately

#### Scenario: Stream metadata
- **WHEN** response includes tool calls or RAG citations
- **THEN** metadata is included in the stream format

### Requirement: RAG Integration in Handler
The SDK SHALL automatically query knowledge base before LLM call.

#### Scenario: Inject context
- **WHEN** agent has a knowledge base configured
- **THEN** relevant chunks are retrieved and injected into the prompt

#### Scenario: Citation tracking
- **WHEN** response uses knowledge base content
- **THEN** source documents are included in response metadata

### Requirement: Memory Integration in Handler
The SDK SHALL load and save conversation history automatically.

#### Scenario: Load history
- **WHEN** request includes session ID
- **THEN** previous messages are loaded and included in context

#### Scenario: Save response
- **WHEN** LLM completes response
- **THEN** user message and assistant response are saved to memory

### Requirement: React Hook Export
The SDK SHALL export `useChatAgent()` hook for client-side integration.

#### Scenario: Basic usage
- **WHEN** developer calls `const { messages, sendMessage } = useChatAgent()`
- **THEN** a ready-to-use chat interface state is returned

#### Scenario: Custom endpoint
- **WHEN** developer provides `useChatAgent({ endpoint: "/api/custom" })`
- **THEN** messages are sent to the specified endpoint

#### Scenario: Streaming UI updates
- **WHEN** response is streaming
- **THEN** `messages` array updates in real-time with partial content
