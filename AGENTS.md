# Agent guide — Ether Themes

Single entry point for AI assistants working in this repo.

## What this is

VS Code/Cursor extension: **35 dark palettes**, **496 snippets**, **8 bundled language grammars** (35 grammar contributions including injections). Build-time generation only — no runtime extension code. React product site at `apps/website/`.

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
npm run watch          # extension rebuild loop (fast — no previews/site)
npm run site:dev       # website dev server
npm run check:fast     # lint + typecheck + fast tests + extension + site build
npm run check          # full pipeline including PNG previews
npm run build:extension  # themes + snippets only (F5 prelaunch)
```

Claim work complete only after `npm run check:fast` passes (or `npm run check` for palette/preview changes).

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
