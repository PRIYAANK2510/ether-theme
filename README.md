# Ether

Token-driven dark and light color themes for **VS Code** and **Cursor**, built from palette files and shipped as a single extension.

**Repository:** [github.com/PRIYAANK2510/ether-theme](https://github.com/PRIYAANK2510/ether-theme)  
**Publisher:** [Priyaank](https://marketplace.visualstudio.com/manage) on the VS Code Marketplace

## Themes

| Theme | Type | Accent | Character |
|-------|------|--------|-----------|
| **Ether Abyss** | Dark | Bioluminescent cyan | Abyssal deep sea — void black-blue, glowing aquatic syntax |
| **Ether Aurora** | Dark | Electric teal | Deep space navy — arctic greens, solar ambers, glacial syntax |
| **Ether Brass** | Dark | Antique brass | Walnut workshop — copper browns, burnished gold control flow |
| **Ether Carbon** | Dark | Silver white | Neutral graphite — monochrome UI, crisp contrast, minimal color |
| **Ether Crimson** | Dark | Scarlet | Deep wine black — warm reds, ember syntax, dramatic contrast |
| **Ether Eclipse** | Dark | Hot coral | Total eclipse void — salmon accents on pure black |
| **Ether Ember** | Dark | Molten amber | Charcoal workshop — warm copper control flow, gold types |
| **Ether Forest** | Dark | Sage green | Moss-black canopy — earthy greens, natural calm, soft highlights |
| **Ether Haze** | Dark | Soft mint | Smoky blue-gray fog — muted desaturated calm, gentle contrast |
| **Ether Jade** | Dark | Vivid emerald | Imperial jade jewel — rich green-black, luminous syntax |
| **Ether Linen** | Light | Rust terracotta | Warm cream paper — ink navy text, editorial readability |
| **Ether Midnight** | Dark | Periwinkle | Classic Ether dark — balanced blue-violet surfaces, familiar feel |
| **Ether Nebula** | Dark | Orchid purple | Cosmic violet haze — nebula magentas, starlight syntax |
| **Ether Obsidian** | Dark | Burnished gold | Pure monochrome obsidian — ivory text, minimal chromatic noise |
| **Ether Pearl** | Light | Cobalt blue | Cool pearl white — slate text, crisp professional clarity |
| **Ether Plasma** | Dark | Chartreuse | Fusion reactor — electric lime on void black, high energy |
| **Ether Sangria** | Dark | Dusty peach | Wine cellar burgundy — deep maroon surfaces, warm peach accent |
| **Ether Slate** | Dark | Steel blue | Cool industrial gray — muted blues, professional restraint |
| **Ether Terra** | Dark | Terracotta clay | Red earth sienna — desert clay tones, warm organic warmth |
| **Ether Vesper** | Dark | Rose | Violet-black twilight — dusk lavender text, romantic contrast |

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
