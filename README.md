<p align="center">
  <img src="icon.png" width="88" alt="Ether Themes" />
</p>

<h1 align="center">Ether Themes</h1>

<p align="center">
  <strong>20 token-driven color themes</strong> and <strong>223 web development snippets</strong> for VS Code and Cursor.
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=Priyaank.ether-theme"><img src="https://img.shields.io/visual-studio-marketplace/v/Priyaank.ether-theme?label=VS%20Code&color=007ACC&logo=visualstudiocode" alt="VS Code Marketplace version" /></a>
  <a href="https://open-vsx.org/extension/PRIYAANK2510/ether-theme"><img src="https://img.shields.io/open-vsx/v/PRIYAANK2510/ether-theme?label=Open%20VSX&color=0098FF" alt="Open VSX version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=Priyaank.ether-theme">Install on VS Code</a>
  ·
  <a href="https://open-vsx.org/extension/PRIYAANK2510/ether-theme">Install on Cursor</a>
  ·
  <a href="https://github.com/PRIYAANK2510/ether-theme">GitHub</a>
</p>

---

## Install

Search **Ether Themes** in the Extensions panel, or use the links above.

**Quick pick:** `Ctrl+K Ctrl+T` (Windows/Linux) · `Cmd+K Cmd+T` (macOS)

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

## Highlights

- **20 themes** — 18 dark and 2 light variants in one extension
- **223 snippets** — production-ready React, JavaScript, TypeScript, HTML, and CSS templates
- **Token-driven build** — palette files in `src/palettes/` generate full `.color-theme.json` files
- **Contrast-aware** — WCAG validation on critical token pairs at build time
- **Consistent syntax** — 36 shared `tokenColor` rules across every theme
- **Works in Cursor** — published on Open VSX and the VS Code Marketplace

## Snippets

Ether ships **223 snippets** across six language scopes. Type a prefix in an editor file and accept the suggestion to insert the template.

| Language | File types | Count | Example prefixes |
|----------|------------|------:|------------------|
| **JavaScript** | `.js`, `.mjs`, `.cjs` | 43 | `fn`, `fetch`, `debounce`, `groupby`, `pipe`, `addevent` |
| **TypeScript** | `.ts` | 43 | `interface`, `discriminated`, `returntype`, `branded`, `fetch` |
| **React (JSX)** | `.jsx` | 58 | `rfc`, `rfcserver`, `usedebounce`, `rfquery`, `rfcompound` |
| **React (TSX)** | `.tsx` | 63 | `rfc`, `rfpropschildren`, `useactionstate`, `rferrorboundary` |
| **HTML** | `.html`, `.htm` | 37 | `html5`, `og`, `dialog`, `table`, `layout`, `datalist` |
| **CSS** | `.css` | 37 | `flexcenter`, `modernreset`, `fluidtype`, `darkmode`, `layer` |

### React and JSX/TSX

| Prefix | Description |
|--------|-------------|
| `rfc` | Functional component |
| `rfcserver` | Async server component |
| `rfcde` | Default export component |
| `rfca` | Arrow function component |
| `rfcmemo` | `memo` component with `displayName` |
| `rfcforwardref` | `forwardRef` with `ComponentPropsWithoutRef` |
| `rfclazy` | Lazy loaded component with accessible fallback |
| `usestate` | `useState` hook |
| `useeffect` | `useEffect` hook |
| `useactionstate` | React 19 `useActionState` |
| `usedebounce` | Debounce custom hook |
| `uselocalstorage` | Local storage sync hook |
| `usecallback` | `useCallback` hook |
| `usememo` | `useMemo` hook |
| `usehook` | Custom hook scaffold |
| `rfctx` | Context provider with `useMemo` value |
| `rferrorboundary` | Error boundary with fallback prop |
| `rfsuspense` | Suspense wrapper |
| `rffetch` | Fetch with `AbortController` + `response.ok` |
| `rfquery` | Loading / error / data fetch pattern |
| `rfcompound` | Compound component pattern |

### JavaScript and TypeScript

| Prefix | Description |
|--------|-------------|
| `fn` | Function declaration |
| `fetch` | Fetch with headers and error handling |
| `debounce` / `throttle` | Utility timing helpers |
| `arrow` | Arrow function |
| `im` / `imd` | Import / named import |
| `try` | Try/catch |
| `interface` | TypeScript interface |
| `discriminated` | Discriminated union |
| `returntype` / `parameters` | Utility type helpers |
| `gfn` | Generic function |
| `satisfies` | `satisfies` expression |

### HTML and CSS

| Prefix | Description |
|--------|-------------|
| `html5` | Full HTML5 boilerplate with skip link |
| `og` | Open Graph meta tags |
| `viewport` | Viewport meta tag |
| `dialog` | Native dialog element |
| `form` / `input` / `button` | Form controls |
| `table` | Accessible data table |
| `skiplink` | Skip to content link |
| `flexcenter` / `flexcol` | Flexbox layouts |
| `modernreset` | Modern CSS reset |
| `grid` / `gridcenter` | Grid layouts |
| `media` / `darkmode` | Responsive and theme queries |
| `keyframes` | CSS animation keyframes |
| `vars` | CSS custom properties |

<details>
<summary><strong>Adding or editing snippets</strong></summary>

Add a definition to a file in `src/snippets/catalog/`, then run `npm run build`. Snippet JSON and `package.json` contributions are regenerated automatically.

Each definition needs `key`, `prefix`, `description`, `body`, and `languages`. Use `variants` for language-specific overrides (for example typed TSX bodies).

</details>

## Development

**Prerequisites:** Node.js 20+, VS Code or Cursor

```bash
git clone https://github.com/PRIYAANK2510/ether-theme.git
cd ether-theme
npm install
npm run build
```

Press **F5** to open the Extension Development Host and preview themes live.

| Script | Purpose |
|--------|---------|
| `npm run build` | Generate theme JSON, snippet files, and sync `package.json` |
| `npm run watch` | Auto-rebuild while editing palettes |
| `npm run check` | Lint, test, and build |
| `npm run package` | Build a `.vsix` locally |
| `npm run publish:local` | Package and publish (requires `.env` tokens) |

<details>
<summary><strong>Adding or removing a theme</strong></summary>

**Add:** create `src/palettes/my-theme.js` exporting `{ id, label, type, uiTheme, ui, syntax }`, then run `npm run build`.

**Remove:** delete the palette file and run `npm run build`. Orphan theme JSON and `package.json` entries are removed automatically.

</details>

<details>
<summary><strong>Publishing</strong></summary>

Add GitHub secrets **`VSCE_PAT`** and **`OVSX_PAT`**, then push changes to `src/`, `themes/`, or `package.json` — CI auto-bumps the patch version and publishes.

Manual publish: `npm run publish:local` or **Actions → Release → Run workflow**.

</details>

## License

MIT — see [LICENSE](LICENSE).
