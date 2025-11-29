# Frequently Asked Questions

## General

### What is this chat application?
This is an AI chat application built with PersonaKit. It uses OpenAI's language models to provide helpful responses.

### How does it work?
When you send a message, it's processed by an AI agent configured with specific personality traits and instructions. The agent can also search through a knowledge base to provide accurate information.

### Is my data stored?
By default, conversation history is not persisted between sessions. This can be configured by the application owner.

## Technical

### What model is being used?
The default model is GPT-4 Turbo, but this can be configured.

### Can I add my own documents?
Yes! Drop markdown files into the `personakit/knowledge` folder and uncomment the `knowledgeBase` option in `agent.ts`.

### How do I customize the personality?
Edit `personakit/agent.ts` or `personakit/persona.md` to change the agent's personality.

## Troubleshooting

### Why am I getting errors?
Make sure you have set the `OPENAI_API_KEY` environment variable.

### The responses are slow
Large knowledge bases may take longer to process. Consider optimizing your documents or using a faster model.
