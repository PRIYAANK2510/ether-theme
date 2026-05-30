<p align="center">
  <img src="icon.png" width="88" alt="Ether Themes" />
</p>

<h1 align="center">Ether Themes</h1>

<p align="center">
  <strong>8 dark token-driven color themes</strong> and <strong>392 web development snippets</strong> for VS Code and Cursor.
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

Each palette is built **anchor-first**: pick `surfacePanel` (sidebar) and `surfaceEditor` (editor), then derive surfaces, text, accent, and syntax from that family. All eight pass WCAG contrast validation at build time.

| Theme | Side panel | Editor | Accent | Character |
|-------|------------|--------|--------|-----------|
| **Ether Graphite** | `#161618` | `#1C1C1E` | Steel blue | Pure neutral gray |
| **Ether Storm** | `#181C22` | `#1C2028` | Soft blue | Cool blue-gray slate |
| **Ether Ember** | `#1A1816` | `#201E1A` | Copper | Warm charcoal |
| **Ether Luna** | `#0C0E14` | `#101218` | Lunar silver | Deepest moonlit night |
| **Ether Moss** | `#181C18` | `#1C221E` | Sage | Forest gray-green |
| **Ether Dusk** | `#1A1820` | `#1E1C28` | Rose | Plum twilight |
| **Ether Ink** | `#141412` | `#1A1A18` | Cinnabar | Warm sumi ink (neutral black) |
| **Ether Stone** | `#1C1A18` | `#22201C` | Terracotta | Warm stone |

## Highlights

- **8 dark themes** — distinct surface temperatures, restrained accents, no light variants
- **392 snippets** — Ether templates plus ES7+ React/Redux/React-Native patterns for JavaScript, TypeScript, JSX, TSX, HTML, and CSS
- **Token-driven build** — palette files in `src/palettes/` generate full `.color-theme.json` files
- **Contrast-aware** — WCAG validation on all syntax roles and critical UI tokens at build time
- **58 shared syntax rules** — broad language coverage with semantic highlighting enabled
- **Polished workbench** — consistent list, tab, status bar, and button hover/selection states
- **Works in Cursor** — published on Open VSX and the VS Code Marketplace

## Snippets

Ether ships **392 snippets** across six language scopes. Type a prefix in an editor file and accept the suggestion to insert the template.

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

**Add:** create `src/palettes/ether-{name}.js` with `{ id, label, type: "dark", uiTheme: "vs-dark", ui, syntax }`. Set `surfacePanel` and `surfaceEditor` first, then derive the rest. Run `npm run build`.

**Remove:** delete the palette file and run `npm run build`. Orphan theme JSON and `package.json` entries are removed automatically.

</details>

<details>
<summary><strong>Publishing</strong></summary>

Add GitHub secrets **`VSCE_PAT`** and **`OVSX_PAT`**, then push changes to `src/`, `themes/`, or `package.json` — CI auto-bumps the patch version and publishes.

Manual publish: `npm run publish:local` or **Actions → Release → Run workflow**.

See [docs/WORKFLOW.md](docs/WORKFLOW.md) for push-without-publish and local install notes.

</details>

## License

MIT — see [LICENSE](LICENSE).
