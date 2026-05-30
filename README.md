# Ether

Token-driven dark color themes for **VS Code** and **Cursor**, built from palette files and shipped as a single extension.

**Repository:** [github.com/PRIYAANK2510/ether-theme](https://github.com/PRIYAANK2510/ether-theme)  
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

Search **Ether Themes** in Extensions (VS Code Marketplace or Open VSX).

**From source:**

```bash
git clone https://github.com/PRIYAANK2510/ether-theme.git
cd ether-theme
npm install
npm run build
```

Press **F5** to preview, or package locally:

```bash
npm run package
code --install-extension releases/ether-theme-*.vsix
```

## Development

**Prerequisites:** Node.js 20+, VS Code or Cursor

```bash
npm install
npm run build
npm run watch    # auto-rebuild while editing palettes
```

### Scripts

| Script | When to use |
|--------|-------------|
| `npm run build` | Generate theme JSON and sync `package.json` |
| `npm run watch` | Auto-rebuild while editing palettes |
| `npm run check` | Lint + test + build |
| `npm run package` | Build a VSIX only |
| `npm run publish:local` | Package + publish (reads `.env` tokens) |

## Adding or removing a theme

**Add:** create `src/palettes/my-theme.js` exporting `{ id, label, type, uiTheme, ui, syntax }`, then `npm run build`.

**Remove:** delete the palette file and run `npm run build`. Orphan theme JSON and `package.json` entries are removed automatically.

## Publishing

Add GitHub secrets **`VSCE_PAT`** and **`OVSX_PAT`**, then:

```bash
git add .
git commit -m "Add Ether Frost theme"
git push
```

Pushes that change `src/`, `themes/`, or `package.json` auto-bump the patch version and publish. README-only changes do not release.

Manual publish: `npm run publish:local` or **Actions → Release → Run workflow**.

## Architecture

```
src/
  build.js              → CLI entry
  generator/index.js    → compose themes, write JSON, sync package.json
  workbench/            → core + extension workbench color derivation
  syntax/rules.js       → tokenColor rules
  utils/color.js        → chroma helpers + validation
  palettes/*.js         → per-theme ui + syntax (auto-loaded)
themes/*.color-theme.json
scripts/                → publish + version bump (CI)
```

## License

MIT — see [LICENSE](LICENSE).
