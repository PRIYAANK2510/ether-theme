# Agent guide — Ether Themes

Single entry point for AI assistants working in this repo.

## Cursor rules (`.cursor/rules/`)

| Rule | When | Purpose |
|------|------|---------|
| `agent-workflow.mdc` | Always | Graphify-first navigation, graph rebuild duty, Sequential Thinking MCP |
| `ether-core.mdc` | Always | Architecture, build workflow, source-of-truth, agent constraints |
| `ether-themes.mdc` | Palette/workbench/syntax paths | Anchor-first palette authoring, workbench derivation, syntax rules |
| `ether-snippets.mdc` | Snippet catalog paths | Snippet catalog shape and authoring conventions |

## External tooling

Graphify, cavemem, and sequential-thinking MCP servers plus caveman skills/rules/hooks live in user-global `~/.cursor/`. Project hooks in `.cursor/hooks.json` rebuild the graph after agent edits.

## Human docs

- [CONTRIBUTING.md](CONTRIBUTING.md) — setup, commands, and daily workflow
- [docs/WORKFLOW.md](docs/WORKFLOW.md) — release, Pages deploy, `[skip release]`
