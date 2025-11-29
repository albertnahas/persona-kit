import { readFile } from "fs/promises";
import { basename } from "path";
import type { DocumentChunk } from "../../types.js";
import type { DocumentLoader } from "../types.js";

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): {
  metadata: Record<string, unknown>;
  content: string;
} {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  const frontmatter = match[1];
  const metadata: Record<string, unknown> = {};

  // Simple YAML parsing for key: value pairs
  for (const line of frontmatter.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      metadata[key] = value;
    }
  }

  return {
    metadata,
    content: content.slice(match[0].length),
  };
}

/**
 * Split content into chunks at paragraph boundaries
 */
export function chunkContent(
  content: string,
  chunkSize: number,
  overlap: number
): string[] {
  const paragraphs = content.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    if (currentChunk.length + trimmed.length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());

      // Keep overlap from end of previous chunk
      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-Math.floor(overlap / 5));
      currentChunk = overlapWords.join(" ") + "\n\n" + trimmed;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + trimmed;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Markdown document loader
 */
export function createMarkdownLoader(options?: {
  chunkSize?: number;
  chunkOverlap?: number;
}): DocumentLoader {
  const chunkSize = options?.chunkSize ?? 1000;
  const chunkOverlap = options?.chunkOverlap ?? 200;

  return {
    canHandle(source: string): boolean {
      return source.endsWith(".md") || source.endsWith(".markdown");
    },

    async load(source: string): Promise<DocumentChunk[]> {
      const raw = await readFile(source, "utf-8");
      const { metadata, content } = parseFrontmatter(raw);
      const chunks = chunkContent(content, chunkSize, chunkOverlap);

      return chunks.map((text, index) => ({
        id: `${basename(source)}-${index}`,
        content: text,
        source,
        metadata: {
          ...metadata,
          chunkIndex: index,
          totalChunks: chunks.length,
        },
      }));
    },
  };
}
