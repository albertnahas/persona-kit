import { describe, it, expect } from "vitest";
import { chunkContent } from "../src/knowledge/loaders/markdown.js";
import { createInMemoryVectorStore } from "../src/knowledge/vectorStore.js";
import type { DocumentChunk } from "../src/types.js";

describe("chunkContent", () => {
  it("should return single chunk for small content", () => {
    const content = "This is a small piece of content.";
    const chunks = chunkContent(content, 1000, 200);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(content);
  });

  it("should split content at paragraph boundaries", () => {
    const content = `First paragraph with some content.

Second paragraph with more content.

Third paragraph to complete the test.`;

    const chunks = chunkContent(content, 50, 10);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it("should handle empty content", () => {
    const chunks = chunkContent("", 1000, 200);
    expect(chunks).toHaveLength(0);
  });

  it("should handle whitespace-only content", () => {
    const chunks = chunkContent("   \n\n   ", 1000, 200);
    expect(chunks).toHaveLength(0);
  });
});

describe("createInMemoryVectorStore", () => {
  it("should add and search documents", async () => {
    const store = createInMemoryVectorStore();

    const chunks: DocumentChunk[] = [
      {
        id: "1",
        content: "Hello world",
        source: "test.md",
        metadata: {},
      },
      {
        id: "2",
        content: "Goodbye world",
        source: "test.md",
        metadata: {},
      },
    ];

    // Simple mock embeddings (unit vectors)
    const embeddings = [
      [1, 0, 0],
      [0, 1, 0],
    ];

    await store.add(chunks, embeddings);

    // Search with vector similar to first document
    const results = await store.search([0.9, 0.1, 0], 2);
    expect(results).toHaveLength(2);
    expect(results[0].chunk.id).toBe("1");
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it("should respect limit parameter", async () => {
    const store = createInMemoryVectorStore();

    const chunks: DocumentChunk[] = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      content: `Document ${i}`,
      source: "test.md",
      metadata: {},
    }));

    const embeddings = chunks.map((_, i) => {
      const vec = new Array(10).fill(0);
      vec[i] = 1;
      return vec;
    });

    await store.add(chunks, embeddings);

    const results = await store.search(new Array(10).fill(0.1), 3);
    expect(results).toHaveLength(3);
  });

  it("should clear all documents", async () => {
    const store = createInMemoryVectorStore();

    await store.add(
      [{ id: "1", content: "Test", source: "test.md", metadata: {} }],
      [[1, 0, 0]]
    );

    await store.clear();

    const results = await store.search([1, 0, 0], 10);
    expect(results).toHaveLength(0);
  });
});
