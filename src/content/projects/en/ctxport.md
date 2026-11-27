---
pageSlug: "ctxport"
lang: "en"
title: "ctxport"
summary: "Collects your chats from ChatGPT, Claude, Codex, Gemini and others on your own computer, distills them into a profile of you, and imports it into other assistants, so switching AI doesn't mean introducing yourself again."
kind: "software"
order: 0.3
featured: true
stack: "Python (standard library core) · SQLite · Browser extension · MCP"
image: "/assets/ctxport-app-en.jpg"
imageDark: "/assets/ctxport-app-en-dark.jpg"
period: "Nov 2026 – present"
status: "Built with collaborators; v0.2.0 released on GitHub (checked 2026-11-27), not yet on PyPI."
links: [{"label": "v0.2.0 release", "url": "https://github.com/Memoryport/ctxport/releases/tag/v0.2.0"}, {"label": "Source", "url": "https://github.com/Memoryport/ctxport"}]
---

ctxport is open source (MIT) and developed with collaborators under the Memoryport organization.

## Features
- **Collect:** parses each platform's raw data instead of asking a model to remember: ChatGPT, Claude.ai, Claude Code, Codex, Gemini CLI, Gemini on the web, Google Antigravity, Cherry Studio and Chatbox, with official exports or an optional browser extension for the web apps.
- **Distill:** your own logged-in Claude Code or Codex writes an "episode card" per conversation, with no API key; ctxport merges and deduplicates them locally into a profile grouped by topic, each line dated, and checks that every fact made it in.
- **Fewer tokens:** by default conversations are shortened first (code reduced to what it does, long pastes to their start and end) and several are sent per question. Measured on my own history: about 1.4k tokens per conversation, against about 18k when the agent reads files one by one.
- **Import:** the profile comes in compact, standard and full sizes and goes into the instruction files of Claude Code, Codex, Gemini CLI, Antigravity and Cursor in one click; web assistants get it through the extension or by copy and paste.
- **MCP:** connected agents can search the full profile and the original conversations when they need a detail the compact profile leaves out.
- **Desktop app:** a guided local page, collect → distill → review → import, with a choice of model, reasoning effort and parallel batches, token estimates and progress; when one agent's quota runs out it can continue with the other or wait for the reset.

## Privacy
Everything stays in a local SQLite database, with no telemetry. Conversations go to the AI you chose only when you start a distillation. Instruction files of other tools are backed up before the first write, and only ctxport's own block is changed. Exports mask keys and account identifiers, and project memories name the folder, not its local path.

## Verification
At v0.2.0, CI ran 291 tests on Windows, macOS and Linux with Python 3.10, 3.12 and 3.13, all passing, and checked the package contents and size; the release workflow smoke-tested the built wheel. The whole flow (import, distill, build the profile, write it into Claude Code and Codex, connect MCP) was run on my own 3,000+ conversations.
