# Sample Knowledge Base

This is a sample document for the knowledge base.

## PersonaKit Features

PersonaKit provides several key features:

1. **Agent Creation**: Create AI agents with custom personalities
2. **RAG Support**: Query documents for context-aware responses
3. **Memory**: Persist conversations across sessions
4. **Streaming**: Real-time response streaming

## Usage Example

```typescript
import { createAgent } from "personakit";

const agent = createAgent({
  name: "MyBot",
  personality: "helpful",
  knowledgeBase: "./docs",
});
```

## Best Practices

- Keep persona files concise and focused
- Organize knowledge base by topic
- Use markdown for knowledge documents
- Test with various queries
