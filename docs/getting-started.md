# Getting Started

PersonaKit is a developer toolkit for building AI chat applications without complexity.

## Installation

```bash
npm install personakit
# or
pnpm add personakit
# or
yarn add personakit
```

## Quick Start

### 1. Create an Agent

```typescript
import { createAgent } from "personakit";

export const agent = createAgent({
  name: "MyBot",
  personality: "helpful, friendly, concise",
  instructions: "Answer questions clearly and accurately.",
});
```

### 2. Wire to API Route (Next.js)

```typescript
// app/api/chat/route.ts
import { agent } from "@/agent";

export const POST = agent.handle;
```

### 3. Use the React Hook

```typescript
"use client";

import { useChatAgent } from "personakit/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChatAgent();

  return (
    <form onSubmit={handleSubmit}>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
      <input value={input} onChange={handleInputChange} />
      <button type="submit" disabled={isLoading}>
        Send
      </button>
    </form>
  );
}
```

## Using the Template

For the fastest start, clone the Next.js template:

```bash
npx degit personakit/personakit/templates/next-starter my-agent
cd my-agent
pnpm install
```

Add your API key to `.env.local`:

```
OPENAI_API_KEY=sk-your-key-here
```

Run the development server:

```bash
pnpm dev
```

## Next Steps

- [Configuration](./configuration.md) - Learn about all configuration options
- [Persona](./persona.md) - Create rich agent personalities
- [RAG](./rag.md) - Add knowledge base for context-aware responses
- [Memory](./memory.md) - Persist conversations
