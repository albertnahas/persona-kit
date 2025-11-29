import { readFile } from "fs/promises";
import { existsSync } from "fs";
import type { PersonaConfig } from "../types.js";

/**
 * Create a persona from config
 */
export async function createPersona(config: PersonaConfig): Promise<string> {
  if (config.personalityFile) {
    return loadPersonaFile(config.personalityFile);
  }
  return config.personality ?? "";
}

/**
 * Load persona from a markdown file
 */
export async function loadPersonaFile(path: string): Promise<string> {
  if (!existsSync(path)) {
    throw new Error(`Persona file not found: ${path}`);
  }
  const content = await readFile(path, "utf-8");
  return content.trim();
}

/**
 * Check if a string is a file path
 */
export function isFilePath(value: string): boolean {
  return (
    value.endsWith(".md") ||
    value.endsWith(".txt") ||
    value.startsWith("./") ||
    value.startsWith("/")
  );
}

/**
 * Resolve personality - load from file if path, otherwise use as-is
 */
export async function resolvePersonality(
  personality: string | undefined
): Promise<string> {
  if (!personality) return "";
  if (isFilePath(personality)) {
    return loadPersonaFile(personality);
  }
  return personality;
}
