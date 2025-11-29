# PersonaKit Next.js Starter

A ready-to-deploy AI chat application built with PersonaKit.

## Quick Start

### 1. Clone and Install

```bash
npx degit personakit/personakit/templates/next-starter my-agent
cd my-agent
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your chat application.

## Customization

### Personality

Edit `personakit/agent.ts` to change your agent's personality and instructions:

```typescript
export const agent = createAgent({
  name: "MyBot",
  personality: "friendly, helpful, concise",
  instructions: "Help users with their questions.",
});
```

Or use markdown files for more complex personas:

- `personakit/persona.md` - Personality definition
- `personakit/instructions.md` - Behavior instructions

### Knowledge Base (RAG)

1. Add markdown files to `personakit/knowledge/`
2. Uncomment the `knowledgeBase` line in `personakit/agent.ts`:

```typescript
export const agent = createAgent({
  // ...
  knowledgeBase: "./personakit/knowledge",
});
```

Your agent will now answer questions using your documents.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/personakit/personakit/tree/main/templates/next-starter)

1. Click the button above or connect your GitHub repo to Vercel
2. Add your `OPENAI_API_KEY` in environment variables
3. Deploy!

## Project Structure

```
├── app/
│   ├── api/chat/route.ts  # API endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Chat.tsx           # Main chat component
│   ├── MessageList.tsx
│   ├── InputBox.tsx
│   └── LoadingDots.tsx
├── personakit/            # ← Your configuration
│   ├── agent.ts           # Agent config
│   ├── persona.md         # Personality file
│   ├── instructions.md    # Instructions file
│   └── knowledge/         # RAG documents
└── lib/
    ├── embeddings.ts      # Custom embedder (optional)
    └── vectorStore.ts     # Custom vector store (optional)
```

## Learn More

- [PersonaKit Documentation](https://github.com/personakit/personakit)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT
