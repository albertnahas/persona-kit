# PersonaKit Documentation

## What is PersonaKit?

PersonaKit is a developer toolkit for building AI chat applications without complexity. It provides:

- **Agent Creation**: Configure AI agents with personality and instructions
- **Knowledge Base**: RAG with pluggable vector stores
- **Memory**: Conversation persistence
- **Streaming**: Built on Vercel AI SDK

## Quick Start

```typescript
import { createAgent } from "personakit";

const agent = createAgent({
  name: "MyBot",
  personality: "helpful, friendly",
  instructions: "Answer questions clearly.",
});
```

## Configuration Options

### name (required)
The display name of your agent.

### personality (optional)
Personality traits as a string or path to a markdown file.

### instructions (optional)
System instructions for the agent's behavior.

### knowledgeBase (optional)
Path to documents for RAG capabilities.

### model (optional)
The OpenAI model to use. Default: `gpt-4-turbo-preview`
