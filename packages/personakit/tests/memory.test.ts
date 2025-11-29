import { describe, it, expect } from "vitest";
import {
  generateSessionId,
  trimHistory,
  createInMemoryStore,
} from "../src/memory/memoryUtils.js";
import type { Message } from "../src/types.js";

describe("generateSessionId", () => {
  it("should generate unique IDs", () => {
    const id1 = generateSessionId();
    const id2 = generateSessionId();
    expect(id1).not.toBe(id2);
  });

  it("should generate valid UUID format", () => {
    const id = generateSessionId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });
});

describe("trimHistory", () => {
  const createMessage = (role: Message["role"], content: string): Message => ({
    id: crypto.randomUUID(),
    role,
    content,
  });

  it("should keep messages under limit", () => {
    const messages = [
      createMessage("user", "Hello"),
      createMessage("assistant", "Hi"),
    ];

    const trimmed = trimHistory(messages, 10);
    expect(trimmed).toHaveLength(2);
  });

  it("should trim to limit", () => {
    const messages = Array.from({ length: 10 }, (_, i) =>
      createMessage(i % 2 === 0 ? "user" : "assistant", `Message ${i}`)
    );

    const trimmed = trimHistory(messages, 4);
    expect(trimmed).toHaveLength(4);
    expect(trimmed[0].content).toBe("Message 6");
  });

  it("should preserve system messages", () => {
    const messages: Message[] = [
      createMessage("system", "System prompt"),
      createMessage("user", "Hello 1"),
      createMessage("assistant", "Hi 1"),
      createMessage("user", "Hello 2"),
      createMessage("assistant", "Hi 2"),
    ];

    const trimmed = trimHistory(messages, 2);
    expect(trimmed.some((m) => m.role === "system")).toBe(true);
  });
});

describe("createInMemoryStore", () => {
  it("should store and retrieve messages", async () => {
    const store = createInMemoryStore();
    const messages: Message[] = [
      { id: "1", role: "user", content: "Hello" },
      { id: "2", role: "assistant", content: "Hi" },
    ];

    await store.set("session1", messages);
    const retrieved = await store.get("session1");
    expect(retrieved).toEqual(messages);
  });

  it("should return null for non-existent key", async () => {
    const store = createInMemoryStore();
    const result = await store.get("nonexistent");
    expect(result).toBeNull();
  });

  it("should delete messages", async () => {
    const store = createInMemoryStore();
    await store.set("session1", [{ id: "1", role: "user", content: "Hello" }]);
    await store.delete("session1");
    const result = await store.get("session1");
    expect(result).toBeNull();
  });

  it("should list keys by prefix", async () => {
    const store = createInMemoryStore();
    await store.set("user:1:session", []);
    await store.set("user:1:history", []);
    await store.set("user:2:session", []);

    const keys = await store.list("user:1:");
    expect(keys).toHaveLength(2);
    expect(keys).toContain("user:1:session");
    expect(keys).toContain("user:1:history");
  });
});
