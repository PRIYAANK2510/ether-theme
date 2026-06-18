# Workflow

Basic git and publish flows for Ether Themes.

## Project layout

```
Ether/
├── src/                      # VS Code extension source
│   ├── build.js              # Build orchestrator
│   ├── palettes/             # Theme palette definitions
│   ├── generator/            # Theme JSON + preview PNG pipeline
│   ├── snippets/             # Snippet catalog + generator
│   ├── grammars/             # Bundled TextMate grammars (partially shipped)
│   ├── syntax/               # Syntax token rules
│   ├── workbench/            # Workbench color derivation
│   └── utils/                # Shared color utilities
├── apps/
│   └── website/              # React product site (GitHub Pages SPA)
├── shared/                   # Build bridge (extension data → website)
├── themes/                   # Generated *.color-theme.json (shipped)
├── snippets/                 # Generated *.code-snippets (shipped)
├── docs/previews/            # Theme preview PNGs (README + site)
├── scripts/                  # Publish + version bump
├── tests/                    # Vitest suites
└── site/                     # Generated deploy output (gitignored)
```

The website reads palettes and snippets automatically at build time via `apps/website/scripts/prepare-data.mjs`. No manual site updates when adding themes or snippets.

## Before you push

```bash
pnpm run check:fast   # lint → extension build → fast tests → site prepare → typecheck → site build
pnpm run check        # lint → fast tests → full build → typecheck → site artifact test
```

Commit generated artifacts when you changed source:

- `themes/*.color-theme.json` (from palette edits)
- `docs/previews/*.png` and the README gallery block (from palette edits)
- `snippets/*.code-snippets` (from catalog edits)
- `package.json` (contributions are synced by the build)

---

## Commit and push **without** publishing

Pushing to `main` under `src/`**, `themes/**`, or `package.json` triggers an automatic release. To push without publishing:

### Option 1 — `[skip release]` in the commit message

```bash
git add .
git commit -m "chore: update cursor rules [skip release]"
git push origin main
```

The Release workflow checks for `[skip release]` and skips bump/publish.

### Option 2 — Use a branch + PR

```bash
git checkout -b my-branch
git add .
git commit -m "feat: add snippet"
git push -u origin my-branch
```

Open a PR. CI runs `pnpm run check` only — no publish. When you merge to `main`, release runs unless the merge commit includes `[skip release]`.

### Option 3 — Change files outside release paths

Release only watches `src/**`, `themes/**`, and `package.json` (not `README.md`). Pushing docs-only or test-only changes does not trigger publish:

```bash
git add docs/ tests/
git commit -m "docs: workflow guide"
git push origin main
```

---

## Publish flow

Extension is published to **Open VSX** (Cursor) and the **VS Code Marketplace** only — no GitHub Releases. CI pushes git tags for version history; do not create GitHub Releases manually.

### Automatic (recommended)

**Prerequisites:** GitHub repo secrets `OVSX_PAT` and `VSCE_PAT`.

1. Edit source (`src/palettes/`, `src/snippets/catalog/`, etc.).
2. Run `pnpm run check`.
3. Commit source + generated output (`themes/`, `snippets/`, `package.json`).
4. Push to `main` **without** `[skip release]`.

**What CI does:**

1. `pnpm run check`
2. Bump patch version in `package.json` + add `CHANGELOG.md` entry
3. `pnpm run publish` → package VSIX → publish to Open VSX and VS Code Marketplace
4. Commit `chore: release vX.Y.Z [skip release]`, tag `vX.Y.Z`, push to `main` (tag only — not a GitHub Release)

### Manual publish (local)

Create `.env` in the repo root:

```env
OVSX_PAT=your-open-vsx-token
VSCE_PAT=your-vs-code-marketplace-token
```

Then:

```bash
pnpm run check
pnpm run publish
```

This runs `vsce package`, publishes the VSIX to Open VSX, then to the VS Code Marketplace.

### Manual publish (GitHub Actions)

**Actions → Release → Run workflow** on `main`.

Same steps as automatic release (check → bump → publish → tag). Useful when you want a release without a new source push.

---

## Product site (GitHub Pages)

**Live site:** https://priyaank2510.github.io/ether-theme/ (themes + snippets)

### One-time setup

If **Deploy Site** fails with `Get Pages site failed`, enable Pages once:

1. Repo **Settings → Pages**
2. **Build and deployment → Source:** **GitHub Actions**

### Deploy

| Trigger                                     | What runs                                |
| ------------------------------------------- | ---------------------------------------- |
| Push to `main` (site/snippet/palette paths) | **Deploy Site** workflow                 |
| Manual                                      | **Actions → Deploy Site → Run workflow** |

Local preview:

```bash
pnpm run site:dev
```

Open http://localhost:4173/ether-theme/

---

## Quick reference

| Goal                      | Command / action                                         |
| ------------------------- | -------------------------------------------------------- |
| Daily verify              | `pnpm run check:fast`                                     |
| Pre-release verify        | `pnpm run check`                                          |
| Extension rebuild loop    | `pnpm run watch`                                          |
| Build only (full)         | `pnpm run build`                                          |
| Extension build (F5)      | `pnpm run build:extension`                                |
| Website dev server        | `pnpm run site:dev`                                       |
| Typecheck website         | `pnpm run typecheck` (ensures stale/missing site data, then `tsc`) |
| Site data only            | `pnpm run site:prepare`                                              |
| Fast tests only           | `pnpm run test:fast`                                      |
| Package VSIX (no upload)  | `pnpm run package` → `releases/*.vsix`                    |
| Install VSIX locally      | `cursor --install-extension releases/ether-theme-*.vsix` |
| Push to main, no publish  | Commit message includes `[skip release]`                 |
| Ship a release            | Push to `main` (source/themes/package.json changes)      |
| Publish from your machine | `pnpm run publish:local` (loads `.env` via Node; set `VSCE_PAT` / `OVSX_PAT`) |
| Product site              | https://priyaank2510.github.io/ether-theme/              |
| Snippet catalog           | https://priyaank2510.github.io/ether-theme/snippets/     |
| Regenerate site locally   | `pnpm run site:build`                                     |
| Open multi-root workspace | `ether.code-workspace` (extension + website TS)          |
