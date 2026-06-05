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
npm run check:fast   # lint + typecheck + fast tests + extension + site (daily)
npm run check        # full pipeline including PNG previews (pre-release)
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

Open a PR. CI runs `npm run check` only — no publish. When you merge to `main`, release runs unless the merge commit includes `[skip release]`.

### Option 3 — Change files outside release paths

Release only watches `src/**`, `themes/**`, and `package.json` (not `README.md`). Pushing docs-only or test-only changes does not trigger publish:

```bash
git add docs/ tests/
git commit -m "docs: workflow guide"
git push origin main
```

---

## Publish flow

Extension is published to **Open VSX** (Cursor) and the **VS Code Marketplace**.

### Automatic (recommended)

**Prerequisites:** GitHub repo secrets `OVSX_PAT` and `VSCE_PAT`.

1. Edit source (`src/palettes/`, `src/snippets/catalog/`, etc.).
2. Run `npm run check`.
3. Commit source + generated output (`themes/`, `snippets/`, `package.json`).
4. Push to `main` **without** `[skip release]`.

**What CI does:**

1. `npm run check`
2. Bump patch version in `package.json` + add `CHANGELOG.md` entry
3. `npm run publish` → package VSIX → publish to Open VSX and VS Code Marketplace
4. Commit `Release vX.Y.Z [skip release]`, tag `vX.Y.Z`, push to `main`

### Manual publish (local)

Create `.env` in the repo root:

```env
OVSX_PAT=your-open-vsx-token
VSCE_PAT=your-vs-code-marketplace-token
```

Then:

```bash
npm run check
npm run publish:local   # dotenv -e .env -- npm run publish
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

| Trigger | What runs |
| --- | --- |
| Push to `main` (site/snippet/palette paths) | **Deploy Site** workflow |
| Manual | **Actions → Deploy Site → Run workflow** |

Local preview:

```bash
npm run site:dev
```

Open http://localhost:4173/ether-theme/

---

## Snippet sync (ES7+)

Some catalog modules are regenerated from the ES7+ React snippets extension:

```bash
npm run snippets:sync
```

Set `ES7_EXTENSION_ROOT` in `.env` if the extension is not at the default Cursor path. See `.env.example`.

## Quick reference

| Goal | Command / action |
| --- | --- |
| Daily verify | `npm run check:fast` |
| Pre-release verify | `npm run check` |
| Extension rebuild loop | `npm run watch` |
| Build only (full) | `npm run build` |
| Extension build (F5) | `npm run build:extension` |
| Website dev server | `npm run site:dev` |
| Typecheck website | `npm run typecheck` |
| Fast tests only | `npm run test:fast` |
| Package VSIX (no upload) | `npm run package` → `releases/*.vsix` |
| Install VSIX locally | `cursor --install-extension releases/ether-theme-*.vsix` |
| Push to main, no publish | Commit message includes `[skip release]` |
| Ship a release | Push to `main` (source/themes/package.json changes) |
| Publish from your machine | `npm run publish:local` (see `.env.example`) |
| Product site | https://priyaank2510.github.io/ether-theme/ |
| Snippet catalog | https://priyaank2510.github.io/ether-theme/snippets/ |
| Regenerate site locally | `npm run site:build` |
| Open multi-root workspace | `ether.code-workspace` (extension + website TS) |
