## ADDED Requirements

### Requirement: Agent Creation
The SDK SHALL export a `createAgent(config)` function that returns a configured agent instance.

#### Scenario: Create agent with minimal config
- **WHEN** developer calls `createAgent({ name: "Bot", instructions: "Be helpful" })`
- **THEN** an agent instance is returned with default personality and no knowledge base

#### Scenario: Create agent with full config
- **WHEN** developer provides name, personality, instructions, and knowledgeBase path
- **THEN** an agent instance is returned with all configurations merged into the system prompt

#### Scenario: Invalid config rejected
- **WHEN** developer calls `createAgent({})` without required `name` field
- **THEN** a descriptive error is thrown at configuration time

### Requirement: Persona Configuration
The SDK SHALL support persona configuration via string or file path.

#### Scenario: Inline persona string
- **WHEN** config includes `personality: "helpful, concise, friendly"`
- **THEN** personality traits are merged into the system prompt

#### Scenario: Persona from markdown file
- **WHEN** config includes `personality: "./persona.md"`
- **THEN** file contents are loaded and merged into the system prompt

### Requirement: Instructions Merging
The SDK SHALL merge instructions with persona into a coherent system prompt.

#### Scenario: Instructions override defaults
- **WHEN** agent has both personality and instructions defined
- **THEN** the system prompt contains personality context followed by specific instructions

### Requirement: TypeScript Types Export
The SDK SHALL export TypeScript types for all public interfaces.

#### Scenario: Type imports available
- **WHEN** developer imports `AgentConfig`, `PersonaConfig`, `KnowledgeBaseConfig`
- **THEN** full type definitions with JSDoc comments are available

#### Scenario: Type safety on config
- **WHEN** developer provides incorrectly typed config
- **THEN** TypeScript compiler reports the error at build time
