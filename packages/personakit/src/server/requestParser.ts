import type { ChatRequest, Message } from "../types.js";

/**
 * Parse incoming chat request
 */
export async function parseRequest(request: Request): Promise<ChatRequest> {
  const body = await request.json();

  // Validate messages array
  if (!body.messages || !Array.isArray(body.messages)) {
    throw new Error("Request must include messages array");
  }

  const messages: Message[] = body.messages.map(
    (m: { id?: string; role: string; content: string }, index: number) => ({
      id: m.id ?? `msg-${index}`,
      role: validateRole(m.role),
      content: m.content ?? "",
    })
  );

  // Get session ID from body or headers
  const sessionId =
    body.sessionId ??
    request.headers.get("x-session-id") ??
    getSessionFromCookie(request);

  return {
    messages,
    sessionId,
  };
}

/**
 * Validate message role
 */
function validateRole(role: string): "user" | "assistant" | "system" {
  if (role === "user" || role === "assistant" || role === "system") {
    return role;
  }
  throw new Error(`Invalid message role: ${role}`);
}

/**
 * Extract session ID from cookie
 */
function getSessionFromCookie(request: Request): string | undefined {
  const cookies = request.headers.get("cookie");
  if (!cookies) return undefined;

  const match = cookies.match(/personakit-session=([^;]+)/);
  return match?.[1];
}

/**
 * Create error response
 */
export function createErrorResponse(
  message: string,
  status = 400
): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Create JSON response
 */
export function createJsonResponse(
  data: unknown,
  status = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
