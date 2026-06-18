# Contributing to Ether Themes

Thanks for helping improve Ether — themes, snippets, grammars, and the product site.

## Prerequisites

| Tool              | Version                                 |
| ----------------- | --------------------------------------- |
| Node.js           | **20+** (CI uses **24** — see `.nvmrc`) |
| pnpm              | **10+** (see `packageManager` in `package.json`) |
| VS Code or Cursor | **1.85+** for extension dev (F5)        |

```bash
git clone https://github.com/PRIYAANK2510/ether-theme.git
cd ether-theme
corepack enable
pnpm install
```

## Project layout

```
Ether/
├── src/                    # Extension source (edit here)
│   ├── palettes/           # Theme definitions
│   ├── snippets/catalog/   # Snippet definitions
│   ├── grammars/           # TextMate grammars
│   ├── generator/          # Theme + preview pipeline
│   └── build.js            # Build orchestrator
├── apps/website/           # React product site (GitHub Pages)
├── shared/                 # Extension → website data bridge
├── themes/                 # Generated — do not hand-edit
├── snippets/               # Generated — do not hand-edit
├── docs/previews/          # Generated PNG previews
├── tests/                  # Vitest suites
└── site/                   # Generated site output (gitignored)
```

## Daily commands

| Command              | When to use                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| `pnpm run watch`      | Palette/snippet edits — rebuilds extension artifacts (no PNG previews, no site) |
| `pnpm run site:dev`   | Website UI work → http://localhost:4173/ether-theme/                            |
| `pnpm run check:fast` | Before every push — lint, extension build, fast tests, site prepare, typecheck, site build |
| `pnpm run check`      | Before release — adds PNG previews; site integration test runs after full build (no rebuild) |

### Extension development (F5)

1. Open this folder in VS Code/Cursor
2. Press **F5** — runs `build:extension` then launches Extension Development Host
3. `Ctrl+K Ctrl+T` to preview themes

### Website development

```bash
pnpm run site:dev
```

TypeScript lives in `apps/website/`. Run `pnpm run typecheck` for IDE-equivalent checks.

## What to edit

| Change       | Edit                        | Generated output                                                   |
| ------------ | --------------------------- | ------------------------------------------------------------------ |
| Theme colors | `src/palettes/*.js`         | `themes/*.color-theme.json`, `docs/previews/*.png`, README gallery |
| Snippets     | `src/snippets/catalog/*.js` | `snippets/*.code-snippets`                                         |
| Grammars     | `src/grammars/`             | `package.json` language associations                               |
| Product site | `apps/website/src/`         | `site/` (on build)                                                 |

**Never hand-edit** `themes/`, `snippets/`, or `package.json` contributes blocks — the build syncs them.

## Tests

```bash
pnpm run test              # all tests
pnpm run test:fast         # generator + snippets + grammars (used by check:fast)
pnpm run test:site         # site artifact checks (used by check; skips rebuild if site/ exists)
pnpm exec vitest run -t "palette"   # filter by name
```

## Before you push

```bash
pnpm run check:fast
```

Commit generated artifacts when you changed source:

- `themes/*.color-theme.json`
- `snippets/*.code-snippets`
- `docs/previews/*.png` and README gallery block (palette changes)
- `package.json` (if contributes changed)

### Push without publishing

Automatic release triggers on `src/**`, `themes/**`, or `package.json` changes to `main`. To skip:

```bash
git commit -m "chore: update docs [skip release]"
```

See [docs/WORKFLOW.md](docs/WORKFLOW.md) for release and GitHub Pages details.

## Code style

- **Extension source**: ESM JavaScript, JSDoc types, 2-space indent
- **Website**: TypeScript + React, SCSS modules, `cn()` helper from `@/lib/cn`
- **Tests**: Vitest in `tests/` — add coverage for new validation rules

## Publishing (maintainers)

Copy `.env` with `VSCE_PAT` and `OVSX_PAT`, then `pnpm run publish:local`. See [docs/WORKFLOW.md](docs/WORKFLOW.md).
