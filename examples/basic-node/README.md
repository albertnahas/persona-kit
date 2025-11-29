# Basic Node.js Example

A minimal Express server demonstrating PersonaKit without Next.js.

## Setup

```bash
cd examples/basic-node
pnpm install
```

## Configure

Create a `.env` file:

```
OPENAI_API_KEY=sk-your-api-key-here
```

## Run

```bash
pnpm start
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `index.ts` - Express server with chat endpoint
- `agent.ts` - Agent configuration
- `knowledge/` - Sample documents for RAG (optional)

## How It Works

1. The Express server exposes a `/api/chat` endpoint
2. Requests are converted to Web Request format
3. PersonaKit's agent handles the request
4. Responses are streamed back to the client

## Enabling RAG

1. Add markdown files to `knowledge/`
2. Uncomment `knowledgeBase` in `agent.ts`
3. Restart the server

## Notes

- This example uses `tsx` for TypeScript execution
- Production deployments should use proper build tooling
- Consider using frameworks like Fastify for better performance
