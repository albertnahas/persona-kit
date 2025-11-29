import type { DocumentChunk } from "../../types.js";
import type { DocumentLoader } from "../types.js";
import { chunkContent } from "./markdown.js";

/**
 * Simple HTML to text conversion
 */
function htmlToText(html: string): string {
  return html
    // Remove scripts and styles
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    // Convert common elements
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    // Remove remaining tags
    .replace(/<[^>]+>/g, "")
    // Decode entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    // Clean up whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Web URL loader
 */
export function createWebLoader(options?: {
  chunkSize?: number;
  chunkOverlap?: number;
}): DocumentLoader {
  const chunkSize = options?.chunkSize ?? 1000;
  const chunkOverlap = options?.chunkOverlap ?? 200;

  return {
    canHandle(source: string): boolean {
      return source.startsWith("http://") || source.startsWith("https://");
    },

    async load(source: string): Promise<DocumentChunk[]> {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${source}: ${response.status}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      const raw = await response.text();

      let content: string;
      if (contentType.includes("text/html")) {
        content = htmlToText(raw);
      } else {
        content = raw;
      }

      const chunks = chunkContent(content, chunkSize, chunkOverlap);

      return chunks.map((text, index) => ({
        id: `${new URL(source).hostname}-${index}`,
        content: text,
        source,
        metadata: {
          url: source,
          chunkIndex: index,
          totalChunks: chunks.length,
        },
      }));
    },
  };
}
