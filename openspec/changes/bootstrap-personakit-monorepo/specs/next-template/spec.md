## ADDED Requirements

### Requirement: Clone and Deploy Workflow
The template SHALL enable "clone, configure, deploy" in under 5 minutes.

#### Scenario: Clone and run
- **WHEN** developer clones template and runs `pnpm install && pnpm dev`
- **THEN** chat interface is available at localhost:3000

#### Scenario: Deploy to Vercel
- **WHEN** developer pushes to GitHub and connects to Vercel
- **THEN** app deploys without additional configuration

### Requirement: Chat UI Components
The template SHALL include a complete chat interface using shadcn/ui.

#### Scenario: Message rendering
- **WHEN** messages are received
- **THEN** user and assistant messages are displayed with distinct styling

#### Scenario: Input handling
- **WHEN** user types and presses Enter or clicks Send
- **THEN** message is sent to API and input is cleared

#### Scenario: Loading state
- **WHEN** waiting for response
- **THEN** typing indicator is displayed

#### Scenario: Streaming display
- **WHEN** response is streaming
- **THEN** text appears progressively in the message bubble

### Requirement: Pre-wired API Route
The template SHALL include a working `/api/chat` route.

#### Scenario: Default configuration
- **WHEN** template is cloned without changes
- **THEN** API route works with default persona and instructions

#### Scenario: Custom agent configuration
- **WHEN** developer edits `personakit/agent.ts`
- **THEN** changes are reflected on next request

### Requirement: Persona Configuration Files
The template SHALL support persona and instructions as markdown files.

#### Scenario: Edit persona
- **WHEN** developer edits `personakit/persona.md`
- **THEN** agent personality changes on next request

#### Scenario: Edit instructions
- **WHEN** developer edits `personakit/instructions.md`
- **THEN** agent behavior changes on next request

### Requirement: Knowledge Base Directory
The template SHALL include an example knowledge base.

#### Scenario: Add documents
- **WHEN** developer adds markdown files to `personakit/knowledge/`
- **THEN** documents are indexed and available for RAG

#### Scenario: Example content
- **WHEN** template is cloned
- **THEN** example FAQ document demonstrates RAG capabilities

### Requirement: Hot Reload Support
The template SHALL support hot reload for configuration changes.

#### Scenario: Development mode
- **WHEN** running in development and persona files change
- **THEN** changes are reflected without server restart

### Requirement: Environment Configuration
The template SHALL use environment variables for secrets.

#### Scenario: API key configuration
- **WHEN** developer sets `OPENAI_API_KEY` in `.env.local`
- **THEN** agent uses the provided key for LLM and embeddings

#### Scenario: Missing API key error
- **WHEN** API key is not configured
- **THEN** clear error message explains what is needed

### Requirement: Responsive Design
The template SHALL work on mobile and desktop devices.

#### Scenario: Mobile layout
- **WHEN** viewed on a phone-sized screen
- **THEN** chat interface adapts to full-width layout

#### Scenario: Desktop layout
- **WHEN** viewed on a desktop screen
- **THEN** chat interface is centered with reasonable max-width
