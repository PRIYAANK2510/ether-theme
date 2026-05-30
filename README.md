# Ether

Token-driven color themes for **VS Code** and **Cursor**, generated from a plain JavaScript build pipeline.

## Themes

| Theme | Type | Status |
|-------|------|--------|
| Ether Aurora | Dark | Included |
| Ether Ember | Dark | Included |
| Ether Obsidian | Dark | Included |
| Ether Vesper | Dark | Included |

Select a theme via **Preferences: Color Theme** (`Ctrl+K Ctrl+T`).

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
2. Press **F5** (or Run → Start Debugging).
3. In the Extension Development Host, open **Preferences: Color Theme** and choose any **Ether** theme.

Optional: run `npm run watch` in a terminal to rebuild when anything under `src/` changes, then **Developer: Reload Window** in the dev host.

### Troubleshooting (stale TypeScript errors)

This repo is **JavaScript-only** — there are no `.ts` files or `tsconfig.json`. If the Problems panel still shows errors for deleted paths like `src/rules/*.ts` or `scripts/validate-themes.ts`:

1. Close any open tabs for those ghost files.
2. Run **Developer: Reload Window** (`Ctrl+Shift+P`).
3. Confirm workspace settings keep TypeScript validation disabled (see `.vscode/settings.json`).

IntelliSense for source and tests comes from `jsconfig.json`.

If F5 fails with **`npm is not recognized`**, Node was likely installed while Cursor was already open. Either reload the window (**Developer: Reload Window**) or run the **build** task directly — it uses `node src/build.js` and adds Node to PATH for tasks.

## Adding a theme

1. Create `src/palettes/my-theme.js` exporting `{ id, label, type, uiTheme, ui, syntax }`.
2. Run `npm run build`.

Palettes are auto-discovered — no registry edit needed. Workbench keys and syntax rules are shared.

## Removing a theme

1. Delete `src/palettes/my-theme.js`.
2. Run `npm run build`.

Build automatically removes the matching `themes/my-theme.color-theme.json` and drops it from `package.json` → `contributes.themes`. Reload the Extension Development Host to update the theme picker.

## Workbench color layers

The generator emits two workbench layers:

| Layer | Count | Source |
|-------|-------|--------|
| **Core** | 141 keys | `src/workbench/core-catalog.js` + `derive-core.js` |
| **Extension** | 68 keys | `src/workbench/extension-catalog.js` + `derive-extensions.js` |

## Cursor agent / Composer panel

| What | Workbench key | Palette token |
|------|---------------|---------------|
| Code editor + agent frame | `editor.background` | `surfaceEditor` (Cursor shares one token — cannot split) |
| Chat / inline chat chrome | `chat.*`, `inlineChat.*` | `surfaceAgent` (defaults to `surfacePanel`) |
| Chat links | `textLink.foreground` | `accent` |
| Empty editor groups | `editorGroup.emptyBackground` | `surfacePanel` |

```javascript
ui: {
  surfacePanel: "#191C22",   // sidebar, empty editor groups
  surfaceAgent: "#191C22",   // chat bubbles / inline chat
  surfaceEditor: "#1E2127",  // code canvas (+ agent frame — Cursor limitation)
}
```

The detached **Agents Window** may ignore custom themes and use Cursor built-in palettes.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Generate theme JSON, remove orphaned themes, sync `package.json` |
| `npm run watch` | Rebuild when `src/**` changes |
| `npm run validate` | Same as build (validation is inline) |
| `npm run check` | Lint, test, and validate |
| `npm run package` | Create VSIX in `releases/` |
| `npm run publish:openvsx` | Publish VSIX to [Open VSX](https://open-vsx.org/) |
| `npm run publish:marketplace` | Publish to VS Code Marketplace |
| `npm run publish:all` | Package and publish to both registries |

## Publishing

### 1. Publisher

`publisher` in `package.json` is set to **Priyaank** (your VS Code Marketplace publisher ID).

### Publish with tokens (no login)

`vsce login` / `ovsx login` are optional. Both tools read PATs from environment variables:

| Variable | Used for |
|----------|----------|
| `VSCE_PAT` | VS Code Marketplace (`vsce publish`) |
| `OVSX_PAT` | Open VSX / Cursor (`ovsx publish`) |

**Local:** copy `.env.example` → `.env`, paste your tokens, then:

```bash
npm run publish:local
```

**CI / shell with env already set:** `npm run publish:all` (reads `VSCE_PAT` / `OVSX_PAT` from the environment).

**GitHub Actions:** add repository secrets `VSCE_PAT` and `OVSX_PAT`, then push a version tag (`v0.1.0`) — CI publishes automatically.

Create tokens:

- **VSCE_PAT** — [Azure DevOps PAT](https://dev.azure.com) with **Marketplace → Manage**
- **OVSX_PAT** — [Open VSX token](https://open-vsx.org/user-settings/tokens)

### Manual login (optional)

```bash
npx vsce login Priyaank
npx ovsx login
```

### VS Code Marketplace

1. Create a publisher at [marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)
2. Set `VSCE_PAT` (see above) or run `npx vsce login Priyaank`
3. Publish: `npm run publish:marketplace`

### Open VSX

1. Create a PAT at [open-vsx.org/user-settings/tokens](https://open-vsx.org/user-settings/tokens)
2. Set `OVSX_PAT` (see above) or run `npx ovsx login`
3. Publish: `npm run publish:openvsx`

### Local VSIX install

```bash
npm run package
code --install-extension releases/ether-theme-0.1.0.vsix
```

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
  syntax/rules.js                  → tokenColor rules
  utils/color.js                   → chroma helpers + validation
  palettes/*.js                    → per-theme ui + syntax palettes (auto-loaded)
themes/*.color-theme.json          → generated output (shipped in VSIX)
```

UI and syntax palettes live in separate objects inside each palette file and never share base token imports.

## License

MIT — see [LICENSE](LICENSE).
