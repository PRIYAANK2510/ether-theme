# Ether

Token-driven dark color themes for **VS Code** and **Cursor**, built from palette files and shipped as a single extension.

**Repository:** [github.com/Priyaank/ether-theme](https://github.com/Priyaank/ether-theme)  
**Publisher:** [Priyaank](https://marketplace.visualstudio.com/manage) on the VS Code Marketplace

## Themes

| Theme | Accent | Character |
|-------|--------|-----------|
| **Ether Aurora** | Electric teal | Deep space navy — arctic greens, solar ambers, glacial syntax |
| **Ether Ember** | Molten amber | Charcoal workshop — warm copper control flow, gold types |
| **Ether Obsidian** | Burnished gold | Pure monochrome obsidian — ivory text, minimal chromatic noise |
| **Ether Vesper** | Rose | Violet-black twilight — dusk lavender text, romantic contrast |

Select a theme via **Preferences: Color Theme** (`Ctrl+K Ctrl+T`).

## Install

**From the Marketplace (after publish):** search **Ether** in Extensions.

**From source / VSIX:**

```bash
git clone https://github.com/Priyaank/ether-theme.git
cd ether-theme
npm install
npm run build
```

Press **F5** to preview in an Extension Development Host, or:

```bash
npm run package
code --install-extension releases/ether-theme-0.1.0.vsix
```

## Development

### Prerequisites

- Node.js 20+
- VS Code or Cursor

### Setup

```bash
npm install
npm run build
```

### Preview (F5)

1. Open this folder as the workspace root.
2. Press **F5** (Run → Start Debugging).
3. In the Extension Development Host, open **Preferences: Color Theme** and pick any Ether theme.

Run `npm run watch` to rebuild when `src/` changes, then **Developer: Reload Window** in the dev host.

### Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Generate theme JSON, remove orphaned themes, sync `package.json` |
| `npm run watch` | Rebuild when `src/**` changes |
| `npm run check` | Lint, test, and validate |
| `npm run package` | Create VSIX in `releases/` |
| `npm run package:install` | Package and install locally |
| `npm run release` | Full check + package |
| `npm run publish:local` | Publish using tokens from `.env` |
| `npm run publish:all` | Publish when `VSCE_PAT` / `OVSX_PAT` are already in the environment |

## Adding or removing a theme

**Add:** create `src/palettes/my-theme.js` exporting `{ id, label, type, uiTheme, ui, syntax }`, then `npm run build`. Palettes are auto-discovered — no manual registry edit.

**Remove:** delete the palette file and run `npm run build`. The matching `themes/*.color-theme.json` and `package.json` entry are removed automatically.

Each palette defines separate `ui` and `syntax` token objects. Workbench keys and syntax rules are shared across all themes.

## Workbench color layers

| Layer | Count | Source |
|-------|-------|--------|
| **Core** | 141 | `src/workbench/core-catalog.js` + `derive-core.js` |
| **Extension** | 68 | `src/workbench/extension-catalog.js` + `derive-extensions.js` |

### Cursor agent / Composer panel

| Region | Workbench key | Palette token |
|--------|---------------|---------------|
| Code editor + agent frame | `editor.background` | `surfaceEditor` (Cursor shares one token) |
| Chat / inline chat chrome | `chat.*`, `inlineChat.*` | `surfaceAgent` (defaults to `surfacePanel`) |
| Chat links | `textLink.foreground` | `accent` |
| Empty editor groups | `editorGroup.emptyBackground` | `surfacePanel` |

The detached **Agents Window** may ignore custom themes.

## Publishing

Publisher ID in `package.json` is **Priyaank**.

### First-time setup

1. Push the repo to GitHub: [github.com/Priyaank/ether-theme](https://github.com/Priyaank/ether-theme)
2. Create tokens:
   - **VSCE_PAT** — [Azure DevOps](https://dev.azure.com/_users/settings/tokens) with **Marketplace → Manage**
   - **OVSX_PAT** — [Open VSX](https://open-vsx.org/user-settings/tokens)
3. Copy `.env.example` → `.env` and paste both tokens (never commit `.env`)

### Publish locally

```bash
npm run publish:local
```

This runs `npm run package`, then publishes to Open VSX and the VS Code Marketplace. `vsce login` / `ovsx login` are optional when PATs are set.

### Publish via GitHub Actions

Add repository secrets `VSCE_PAT` and `OVSX_PAT`, then:

```bash
git tag v0.1.0
git push origin v0.1.0
```

CI runs checks, packages the VSIX, and publishes to both registries.

## Architecture

```
src/
  build.js                         → CLI entry
  generator/index.js               → compose themes, write JSON, sync package.json
  workbench/
    core-catalog.js                → core workbench key manifest (141 keys)
    extension-catalog.js           → extension key manifest (68 keys)
    derive-core.js                 → palette ui → core workbench colors
    derive-extensions.js           → palette ui → extension workbench colors
    constants.js                   → re-exports catalogs + syntax rule count
  syntax/rules.js                  → 36 tokenColor rules
  utils/color.js                   → chroma helpers + validation
  palettes/*.js                    → per-theme ui + syntax palettes (auto-loaded)
themes/*.color-theme.json          → generated output (shipped in VSIX)
tests/generator.test.js            → vitest suite
```

## Troubleshooting

**Stale TypeScript errors:** this repo is JavaScript-only. Reload the window and close ghost tabs for deleted `.ts` paths. See `jsconfig.json` and `.vscode/settings.json`.

**F5 fails with `npm is not recognized`:** reload Cursor after installing Node, or run the **build** task (uses `node src/build.js` directly).

## License

MIT — see [LICENSE](LICENSE).
