import { agent } from "@/personakit/agent";

// Using Node.js runtime because the SDK uses fs for loading
// personas and knowledge files at build/startup time
export const runtime = "nodejs";

export async function POST(request: Request) {
  return agent.handle(request);
}
