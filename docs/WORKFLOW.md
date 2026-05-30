# Workflow

Basic git and publish flows for Ether Themes.

## Before you push

```bash
npm run check   # lint + test + build
```

Commit generated artifacts when you changed source:

- `themes/*.color-theme.json` (from palette edits)
- `snippets/*.code-snippets` (from catalog edits)
- `package.json` (contributions are synced by the build)

---

## Commit and push **without** publishing

Pushing to `main` under `src/**`, `themes/**`, or `package.json` triggers an automatic release. To push without publishing:

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

Release only watches `src/**`, `themes/**`, and `package.json`. Pushing docs-only or test-only changes does not trigger publish:

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

## Quick reference

| Goal | Command / action |
|------|------------------|
| Verify locally | `npm run check` |
| Build only | `npm run build` |
| Package VSIX (no upload) | `npm run package` → `releases/*.vsix` |
| Push to main, no publish | Commit message includes `[skip release]` |
| Ship a release | Push to `main` (source/themes/package.json changes) |
| Publish from your machine | `npm run publish:local` |
