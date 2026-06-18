# Agent guide — Ether Themes

Single entry point for AI assistants working in this repo.

## Graphify (default navigation)

This repo uses [Graphify](https://github.com/rhanka/graphify) as the **default** way to understand structure. Prefer graph queries over grepping or reading raw files for architecture, flow, and relationship questions.

```bash
pnpm run graphify          # full AST graph rebuild
pnpm run graphify:rebuild  # fast hook rebuild (also runs automatically via Cursor hook)
pnpm exec graphify query "..." --graph .graphify/graph.json
pnpm exec graphify explain "generateAllThemes"
```

- Graph artifacts: `.graphify/graph.json`, `.graphify/GRAPH_REPORT.md`, `.graphify/graph.html`
- Cursor: `.cursor/rules/graphify.mdc` (always-on) + `.cursor/mcp.json` (graphify MCP)
- **Auto-update:** `.cursor/hooks.json` rebuilds the graph after agent edits (on successful `stop`)
- Start each session with `.graphify/GRAPH_REPORT.md` when the graph exists

## What this is

VS Code/Cursor extension: **50 dark palettes**, **496 snippets**, **8 bundled language grammars** (35 grammar contributions including injections). Build-time generation only — no runtime extension code. React product site at `apps/website/`.

## Source of truth

| Edit                                 | Never hand-edit                        |
| ------------------------------------ | -------------------------------------- |
| `src/palettes/`                      | `themes/*.color-theme.json`            |
| `src/snippets/catalog/` (non-synced) | `snippets/*.code-snippets`             |
| `src/grammars/`                      | `package.json` contributes             |
| `apps/website/src/`                  | `site/`, `apps/website/src/generated/` |

Bridge modules for the site live in `shared/` (not `src/shared/`).

## Commands

```bash
pnpm run watch            # extension rebuild loop (fast — no previews/site)
pnpm run site:dev         # website dev server
pnpm run check:fast       # lint → extension build → tests → site prepare → typecheck → site build
pnpm run check            # lint → fast tests → full build → typecheck → site artifact test
pnpm run build:extension  # themes + grammars + snippets (F5 prelaunch / VSIX prepublish)
```

Claim work complete only after `pnpm run check:fast` passes (or `pnpm run check` for palette/preview changes).

## Architecture

```
src/palettes/*.js  →  src/generator/ + src/workbench/ + src/syntax/
                   →  themes/*.color-theme.json

src/snippets/catalog/*.js  →  src/snippets/generator.js
                          →  snippets/*.code-snippets

shared/*.js  →  apps/website/scripts/prepare-data.mjs  →  site-data.ts

src/build.js  →  orchestrates all + optional site build
```

## Cursor rules

Detailed conventions in `.cursor/rules/`:

- `graphify.mdc` — **default** Graphify-first navigation (always-on)
- `ether-core.mdc` — architecture, build workflow
- `ether-themes.mdc` — palette authoring (anchor-first)
- `ether-snippets.mdc` — snippet catalog shape

## Constraints

- Do not commit, push, publish, or bump version unless explicitly asked
- Minimal diffs — match existing patterns
- ESM only in extension source; TypeScript in website
- Preview themes via F5, not by editing generated JSON

## Human docs

- [CONTRIBUTING.md](CONTRIBUTING.md) — setup and daily workflow
- [docs/WORKFLOW.md](docs/WORKFLOW.md) — release, Pages deploy, `[skip release]`
