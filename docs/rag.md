# RAG (Retrieval-Augmented Generation)

Add a knowledge base so your agent can answer questions using your documents.

## Quick Setup

1. Create a directory with markdown files:

```
knowledge/
├── getting-started.md
├── api-reference.md
└── faq.md
```

2. Point your agent to it:

```typescript
createAgent({
  name: "DocBot",
  knowledgeBase: "./knowledge",
});
```

That's it! Your agent will now search these documents to answer questions.

## How It Works

1. **Indexing**: Documents are split into chunks and embedded using OpenAI
2. **Retrieval**: When a user asks a question, relevant chunks are found
3. **Generation**: The LLM uses the retrieved context to answer

## Supported Sources

### Local Files

```typescript
// Single file
knowledgeBase: "./faq.md"

// Directory (recursive)
knowledgeBase: "./docs"

// Multiple sources
knowledgeBase: ["./docs", "./guides", "./api.md"]
```

### URLs (experimental)

```typescript
knowledgeBase: ["https://docs.example.com/guide"]
```

## Document Format

Markdown is the recommended format:

```markdown
---
title: Getting Started
category: basics
---

# Getting Started

Content here...

## Section 1

More content...
```

- Frontmatter (optional) becomes metadata
- Content is split at paragraph boundaries
- Code blocks are preserved

## Configuration

### Chunk Size

Control how documents are split:

```typescript
const kb = await createKnowledgeBase({
  source: "./docs",
  chunkSize: 1000,    // max chars per chunk
  chunkOverlap: 200,  // overlap between chunks
});
```

### Custom Embedder

Use a different embedding provider:

```typescript
const customEmbedder: Embedder = {
  dimension: 1536,
  async embed(texts) {
    // Your embedding logic
    return embeddings;
  },
};

createAgent({
  name: "Bot",
  knowledgeBase: "./docs",
  embedder: customEmbedder,
});
```

### Custom Vector Store

Use an external vector database:

```typescript
const pgVectorStore: VectorStore = {
  async add(chunks, embeddings) {
    // Insert into PostgreSQL
  },
  async search(embedding, limit) {
    // Query PostgreSQL
    return results;
  },
  async clear() {
    // Clear all
  },
};

createAgent({
  name: "Bot",
  knowledgeBase: "./docs",
  vectorStore: pgVectorStore,
});
```

## Best Practices

1. **Organize by topic** - Group related content
2. **Keep chunks focused** - One concept per section
3. **Use clear headings** - Helps with retrieval
4. **Update regularly** - Stale docs = stale answers
5. **Test queries** - Verify the right content is found
