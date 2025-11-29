## ADDED Requirements

### Requirement: Knowledge Base Creation
The SDK SHALL export a `createKnowledgeBase(config)` function for RAG capabilities.

#### Scenario: Create KB from directory
- **WHEN** developer calls `createKnowledgeBase({ source: "./docs" })`
- **THEN** all markdown files in the directory are indexed for retrieval

#### Scenario: Create KB from file list
- **WHEN** developer provides `source: ["./faq.md", "./guide.md"]`
- **THEN** only specified files are indexed

#### Scenario: Create KB from URLs
- **WHEN** developer provides `source: ["https://docs.example.com/api"]`
- **THEN** web content is fetched, parsed, and indexed

### Requirement: Markdown Loader
The SDK SHALL include a markdown document loader.

#### Scenario: Load markdown file
- **WHEN** loader processes a `.md` file
- **THEN** frontmatter is extracted as metadata and content is chunked for embedding

#### Scenario: Chunk large documents
- **WHEN** markdown file exceeds chunk size limit (default 1000 tokens)
- **THEN** document is split at paragraph boundaries with overlap

### Requirement: Embedder Interface
The SDK SHALL define an embedder interface with OpenAI as default implementation.

#### Scenario: Default embedder
- **WHEN** no custom embedder is provided
- **THEN** OpenAI text-embedding-3-small is used

#### Scenario: Custom embedder injection
- **WHEN** developer provides `embedder: customEmbedder`
- **THEN** custom embedder is used for all embedding operations

### Requirement: Vector Search
The SDK SHALL provide vector similarity search for retrieval.

#### Scenario: Query knowledge base
- **WHEN** `kb.search(query, { limit: 5 })` is called
- **THEN** top 5 most similar chunks are returned with scores

#### Scenario: Filter by metadata
- **WHEN** search includes metadata filter
- **THEN** only chunks matching filter criteria are considered

### Requirement: Pluggable Vector Store
The SDK SHALL support pluggable vector store backends.

#### Scenario: In-memory store default
- **WHEN** no vector store is configured
- **THEN** embeddings are stored in memory (suitable for small KBs)

#### Scenario: External vector store
- **WHEN** developer provides `vectorStore: chromaAdapter`
- **THEN** embeddings are persisted to the external store
