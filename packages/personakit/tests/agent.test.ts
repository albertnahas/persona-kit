import { describe, it, expect } from "vitest";
import { resolveConfig } from "../src/agent/types.js";
import { buildSystemPrompt, buildBaseSystemPrompt } from "../src/agent/prompt-builder.js";
import { isFilePath } from "../src/agent/personality.js";

describe("resolveConfig", () => {
  it("should resolve minimal config with defaults", () => {
    const config = resolveConfig({ name: "TestBot" });
    expect(config.name).toBe("TestBot");
    expect(config.personality).toBe("");
    expect(config.instructions).toBe("");
    expect(config.knowledgeBasePaths).toEqual([]);
    expect(config.memory).toBeNull();
    expect(config.model).toBe("gpt-4-turbo-preview");
  });

  it("should resolve full config", () => {
    const config = resolveConfig({
      name: "FullBot",
      personality: "helpful",
      instructions: "Be concise",
      knowledgeBase: "./docs",
      model: "gpt-4o",
    });
    expect(config.name).toBe("FullBot");
    expect(config.personality).toBe("helpful");
    expect(config.instructions).toBe("Be concise");
    expect(config.knowledgeBasePaths).toEqual(["./docs"]);
    expect(config.model).toBe("gpt-4o");
  });

  it("should handle array knowledge base", () => {
    const config = resolveConfig({
      name: "Bot",
      knowledgeBase: ["./docs", "./faq"],
    });
    expect(config.knowledgeBasePaths).toEqual(["./docs", "./faq"]);
  });

  it("should handle memory: false", () => {
    const config = resolveConfig({
      name: "Bot",
      memory: false,
    });
    expect(config.memory).toBeNull();
  });
});

describe("buildSystemPrompt", () => {
  it("should build minimal prompt with name", () => {
    const prompt = buildBaseSystemPrompt({
      name: "TestBot",
      personality: "",
      instructions: "",
    });
    expect(prompt).toContain("You are TestBot.");
  });

  it("should include personality", () => {
    const prompt = buildBaseSystemPrompt({
      name: "TestBot",
      personality: "helpful and friendly",
      instructions: "",
    });
    expect(prompt).toContain("## Personality");
    expect(prompt).toContain("helpful and friendly");
  });

  it("should include instructions", () => {
    const prompt = buildBaseSystemPrompt({
      name: "TestBot",
      personality: "",
      instructions: "Always be concise",
    });
    expect(prompt).toContain("## Instructions");
    expect(prompt).toContain("Always be concise");
  });

  it("should include RAG context", () => {
    const prompt = buildSystemPrompt({
      name: "TestBot",
      personality: "",
      instructions: "",
      context: [
        {
          chunk: {
            id: "1",
            content: "Example content",
            source: "docs/example.md",
            metadata: {},
          },
          score: 0.9,
        },
      ],
    });
    expect(prompt).toContain("## Relevant Context");
    expect(prompt).toContain("Example content");
    expect(prompt).toContain("docs/example.md");
  });
});

describe("isFilePath", () => {
  it("should detect markdown files", () => {
    expect(isFilePath("persona.md")).toBe(true);
    expect(isFilePath("./persona.md")).toBe(true);
  });

  it("should detect relative paths", () => {
    expect(isFilePath("./config")).toBe(true);
    expect(isFilePath("/absolute/path")).toBe(true);
  });

  it("should reject plain strings", () => {
    expect(isFilePath("helpful and friendly")).toBe(false);
    expect(isFilePath("Be concise")).toBe(false);
  });
});
