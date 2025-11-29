# Vector Stores

Store and search document embeddings with pluggable backends.

## Default: In-Memory

By default, PersonaKit uses an in-memory vector store. Good for:
- Development
- Small knowledge bases (<1000 chunks)
- Serverless with small docs

Limitations:
- Lost on restart
- Limited by memory
- Single instance only

## VectorStore Interface

```typescript
interface VectorStore {
  add(chunks: DocumentChunk[], embeddings: number[][]): Promise<void>;
  search(embedding: number[], limit: number): Promise<SearchResult[]>;
  clear(): Promise<void>;
}
```

## Custom Implementations

### PostgreSQL with pgvector

```typescript
import { Pool } from "pg";

function createPgVectorStore(pool: Pool): VectorStore {
  return {
    async add(chunks, embeddings) {
      for (let i = 0; i < chunks.length; i++) {
        await pool.query(
          `INSERT INTO documents (id, content, source, embedding)
           VALUES ($1, $2, $3, $4)`,
          [chunks[i].id, chunks[i].content, chunks[i].source, embeddings[i]]
        );
      }
    },

    async search(embedding, limit) {
      const result = await pool.query(
        `SELECT id, content, source, 1 - (embedding <=> $1) as score
         FROM documents
         ORDER BY embedding <=> $1
         LIMIT $2`,
        [embedding, limit]
      );

      return result.rows.map((row) => ({
        chunk: { id: row.id, content: row.content, source: row.source, metadata: {} },
        score: row.score,
      }));
    },

    async clear() {
      await pool.query("TRUNCATE documents");
    },
  };
}
```

### Chroma

```typescript
import { ChromaClient } from "chromadb";

function createChromaStore(client: ChromaClient, collectionName: string): VectorStore {
  let collection: Collection;

  return {
    async add(chunks, embeddings) {
      collection = await client.getOrCreateCollection({ name: collectionName });
      await collection.add({
        ids: chunks.map((c) => c.id),
        documents: chunks.map((c) => c.content),
        embeddings,
        metadatas: chunks.map((c) => ({ source: c.source })),
      });
    },

    async search(embedding, limit) {
      collection = await client.getOrCreateCollection({ name: collectionName });
      const results = await collection.query({
        queryEmbeddings: [embedding],
        nResults: limit,
      });

      return results.documents[0].map((doc, i) => ({
        chunk: {
          id: results.ids[0][i],
          content: doc,
          source: results.metadatas[0][i].source,
          metadata: {},
        },
        score: 1 - (results.distances?.[0][i] ?? 0),
      }));
    },

    async clear() {
      await client.deleteCollection({ name: collectionName });
    },
  };
}
```

### Pinecone

```typescript
import { Pinecone } from "@pinecone-database/pinecone";

function createPineconeStore(client: Pinecone, indexName: string): VectorStore {
  const index = client.index(indexName);

  return {
    async add(chunks, embeddings) {
      await index.upsert(
        chunks.map((chunk, i) => ({
          id: chunk.id,
          values: embeddings[i],
          metadata: { content: chunk.content, source: chunk.source },
        }))
      );
    },

    async search(embedding, limit) {
      const results = await index.query({
        vector: embedding,
        topK: limit,
        includeMetadata: true,
      });

      return results.matches.map((match) => ({
        chunk: {
          id: match.id,
          content: match.metadata?.content as string,
          source: match.metadata?.source as string,
          metadata: {},
        },
        score: match.score ?? 0,
      }));
    },

    async clear() {
      await index.deleteAll();
    },
  };
}
```

## Usage

```typescript
import { createAgent } from "personakit";

const vectorStore = createPgVectorStore(pool);

const agent = createAgent({
  name: "Bot",
  knowledgeBase: "./docs",
  vectorStore,
});
```

## Choosing a Vector Store

| Store | Best For |
|-------|----------|
| In-Memory | Development, small docs |
| PostgreSQL + pgvector | Existing Postgres, moderate scale |
| Chroma | Self-hosted, open source |
| Pinecone | Managed, large scale |
| Weaviate | Complex queries, hybrid search |
