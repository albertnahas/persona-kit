import { readdir, stat } from "fs/promises";
import { join } from "path";
import type { DocumentChunk } from "../../types.js";
import type { DocumentLoader } from "../types.js";
import { createMarkdownLoader } from "./markdown.js";

/**
 * Recursively get all files in a directory
 */
async function getFilesRecursive(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFilesRecursive(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * File/directory loader that delegates to specific loaders
 */
export function createFileLoader(options?: {
  chunkSize?: number;
  chunkOverlap?: number;
}): DocumentLoader {
  const markdownLoader = createMarkdownLoader(options);

  return {
    canHandle(_source: string): boolean {
      // Can handle directories and supported file types
      return true;
    },

    async load(source: string): Promise<DocumentChunk[]> {
      const stats = await stat(source);
      const chunks: DocumentChunk[] = [];

      if (stats.isDirectory()) {
        const files = await getFilesRecursive(source);
        for (const file of files) {
          if (markdownLoader.canHandle(file)) {
            chunks.push(...(await markdownLoader.load(file)));
          }
        }
      } else if (markdownLoader.canHandle(source)) {
        chunks.push(...(await markdownLoader.load(source)));
      }

      return chunks;
    },
  };
}
