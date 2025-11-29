# Persona

Create rich agent personalities using strings or markdown files.

## Inline Personality

Simple personality traits as a string:

```typescript
createAgent({
  name: "SupportBot",
  personality: "helpful, patient, professional",
});
```

## Markdown Personality Files

For complex personas, use a markdown file:

```typescript
createAgent({
  name: "SupportBot",
  personality: "./persona.md",
});
```

### Example persona.md

```markdown
# Customer Support Agent

## Personality Traits

- Friendly and approachable
- Patient with frustrated customers
- Professional but not robotic

## Communication Style

- Use simple, clear language
- Acknowledge customer feelings
- Provide step-by-step solutions

## Values

- Customer satisfaction first
- Honesty about limitations
- Quick resolution when possible

## Things to Avoid

- Technical jargon
- Dismissive responses
- Making promises you can't keep
```

## Combining Personality and Instructions

Personality defines *who* the agent is. Instructions define *what* it does.

```typescript
createAgent({
  name: "CodeReviewer",

  personality: `
    You are a senior developer who gives constructive feedback.
    You're encouraging but honest about issues.
    You explain the "why" behind suggestions.
  `,

  instructions: `
    Review code for:
    1. Security vulnerabilities
    2. Performance issues
    3. Code style violations
    4. Potential bugs

    Format feedback as:
    - Summary
    - Issues (with severity)
    - Suggestions
  `,
});
```

## Best Practices

1. **Be specific** - "friendly" is vague; "uses casual greetings and emoji sparingly" is specific
2. **Define boundaries** - What the agent should NOT do
3. **Include examples** - Show the tone you want
4. **Test variations** - Try different phrasings
5. **Keep it focused** - 3-5 key traits is usually enough
