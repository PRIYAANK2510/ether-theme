

# Ether Themes

**25 dark token-driven color themes** and **392 web development snippets** for VS Code and Cursor.



[Install on VS Code](https://marketplace.visualstudio.com/items?itemName=Priyaank.ether-theme) · [Install on Cursor](https://open-vsx.org/extension/PRIYAANK2510/ether-theme) · [GitHub](https://github.com/PRIYAANK2510/ether-theme)

---

## Install

Search **Ether Themes** in the Extensions panel, or use the links above.

**Quick pick:** `Ctrl+K Ctrl+T` (Windows/Linux) · `Cmd+K Cmd+T` (macOS)

## Themes

Each palette is built **anchor-first**: set `surfacePanel` (sidebar) and `surfaceEditor` (editor), then fill surfaces, text, accent, and syntax. All **25 dark themes** pass WCAG contrast validation at build time.

**Comment color** is derived from the same mix as **active gutter line numbers** — subdued, italic prose that does not compete with code.


| Theme              | Character                      |
| ------------------ | ------------------------------ |
| **Ether Aurora**   | Deep navy, electric teal       |
| **Ether Clay**     | Warm sumi ink, cinnabar        |
| **Ether Coral**    | Dusty rose, soft magenta       |
| **Ether Dracula**  | Charcoal, candy Dracula syntax |
| **Ether Dusk**     | Plum twilight, rose accent     |
| **Ether Ember**    | Warm charcoal, copper          |
| **Ether Flame**    | Ember red-orange glow          |
| **Ether Frost**    | Arctic blue-gray frost         |
| **Ether Graphite** | Pure neutral gray, steel blue  |
| **Ether Lichen**   | Forest floor, moss green       |
| **Ether Luna**     | Moonlit night, silver          |
| **Ether Mint**     | Cool mint-teal developer       |
| **Ether Mirage**   | Desert dusk, mirage cyan       |
| **Ether Mocha**    | Catppuccin-style cozy pastel   |
| **Ether Moss**     | Sage forest gray-green         |
| **Ether Noir**     | Near-monochrome noir           |
| **Ether Opal**     | Opalescent violet-gray         |
| **Ether Prism**    | Prism refraction, vivid syntax |
| **Ether Sage**     | Muted sage green               |
| **Ether Sand**     | Warm parchment sand            |
| **Ether Slate**    | Atom-style gunmetal slate      |
| **Ether Stone**    | Terracotta warm stone          |
| **Ether Storm**    | Cool blue-gray slate           |
| **Ether Tide**     | Ocean tide teal                |
| **Ether Velvet**   | Velvet plum wine               |


## Highlights

- **25 dark themes** — distinct surface temperatures and accents; dark-only lineup
- **392 snippets** — Ether templates plus ES7+ React/Redux/React-Native patterns for JavaScript, TypeScript, JSX, TSX, HTML, and CSS
- **Token-driven build** — palette files in `src/palettes/` generate full `.color-theme.json` files
- **Contrast-aware** — WCAG validation on syntax roles and critical UI tokens at build time
- **Subdued comments** — comment foreground matches active line numbers in the gutter
- **58 shared syntax rules** — broad language coverage with semantic highlighting enabled
- **Polished workbench** — consistent list, tab, status bar, and button hover/selection states
- **Works in Cursor** — published on Open VSX and the VS Code Marketplace

## Snippets

Ether ships **392 snippets** across six language scopes. Type a prefix in an editor file and accept the suggestion to insert the template.


| Language        | File types            | Count | Example prefixes                                               |
| --------------- | --------------------- | ----- | -------------------------------------------------------------- |
| **JavaScript**  | `.js`, `.mjs`, `.cjs` | 43    | `fn`, `fetch`, `debounce`, `groupby`, `pipe`, `addevent`       |
| **TypeScript**  | `.ts`                 | 43    | `interface`, `discriminated`, `returntype`, `branded`, `fetch` |
| **React (JSX)** | `.jsx`                | 58    | `rfc`, `rfcserver`, `usedebounce`, `rfquery`, `rfcompound`     |
| **React (TSX)** | `.tsx`                | 63    | `rfc`, `rfpropschildren`, `useactionstate`, `rferrorboundary`  |
| **HTML**        | `.html`, `.htm`       | 37    | `html5`, `og`, `dialog`, `table`, `layout`, `datalist`         |
| **CSS**         | `.css`                | 37    | `flexcenter`, `modernreset`, `fluidtype`, `darkmode`, `layer`  |


### React and JSX/TSX


| Prefix            | Description                                    |
| ----------------- | ---------------------------------------------- |
| `rfc`             | Functional component                           |
| `rfcserver`       | Async server component                         |
| `rfcde`           | Default export component                       |
| `rfca`            | Arrow function component                       |
| `rfcmemo`         | `memo` component with `displayName`            |
| `rfcforwardref`   | `forwardRef` with `ComponentPropsWithoutRef`   |
| `rfclazy`         | Lazy loaded component with accessible fallback |
| `usestate`        | `useState` hook                                |
| `useeffect`       | `useEffect` hook                               |
| `useactionstate`  | React 19 `useActionState`                      |
| `usedebounce`     | Debounce custom hook                           |
| `uselocalstorage` | Local storage sync hook                        |
| `usecallback`     | `useCallback` hook                             |
| `usememo`         | `useMemo` hook                                 |
| `usehook`         | Custom hook scaffold                           |
| `rfctx`           | Context provider with `useMemo` value          |
| `rferrorboundary` | Error boundary with fallback prop              |
| `rfsuspense`      | Suspense wrapper                               |
| `rffetch`         | Fetch with `AbortController` + `response.ok`   |
| `rfquery`         | Loading / error / data fetch pattern           |
| `rfcompound`      | Compound component pattern                     |


### JavaScript and TypeScript


| Prefix                      | Description                           |
| --------------------------- | ------------------------------------- |
| `fn`                        | Function declaration                  |
| `fetch`                     | Fetch with headers and error handling |
| `debounce` / `throttle`     | Utility timing helpers                |
| `arrow`                     | Arrow function                        |
| `im` / `imd`                | Import / named import                 |
| `try`                       | Try/catch                             |
| `interface`                 | TypeScript interface                  |
| `discriminated`             | Discriminated union                   |
| `returntype` / `parameters` | Utility type helpers                  |
| `gfn`                       | Generic function                      |
| `satisfies`                 | `satisfies` expression                |


### HTML and CSS


| Prefix                      | Description                           |
| --------------------------- | ------------------------------------- |
| `html5`                     | Full HTML5 boilerplate with skip link |
| `og`                        | Open Graph meta tags                  |
| `viewport`                  | Viewport meta tag                     |
| `dialog`                    | Native dialog element                 |
| `form` / `input` / `button` | Form controls                         |
| `table`                     | Accessible data table                 |
| `skiplink`                  | Skip to content link                  |
| `flexcenter` / `flexcol`    | Flexbox layouts                       |
| `modernreset`               | Modern CSS reset                      |
| `grid` / `gridcenter`       | Grid layouts                          |
| `media` / `darkmode`        | Responsive and theme queries          |
| `keyframes`                 | CSS animation keyframes               |
| `vars`                      | CSS custom properties                 |


**Adding or editing snippets**

Add a definition to a file in `src/snippets/catalog/`, then run `npm run build`. Snippet JSON and `package.json` contributions are regenerated automatically.

Each definition needs `key`, `prefix`, `description`, `body`, and `languages`. Use `variants` for language-specific overrides (for example typed TSX bodies).



## Development

**Prerequisites:** Node.js 20+, VS Code or Cursor

```bash
git clone https://github.com/PRIYAANK2510/ether-theme.git
cd ether-theme
npm install
npm run build
```

Press **F5** to open the Extension Development Host and preview themes live.


| Script                  | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `npm run build`         | Generate theme JSON, snippet files, and sync `package.json` |
| `npm run watch`         | Auto-rebuild while editing palette                          |
| `npm run check`         | Lint, test, and build                                       |
| `npm run package`       | Build a `.vsix` locally                                     |
| `npm run publish:local` | Package and publish (requires `.env` tokens)                |


**Adding or removing a theme**

**Add:** create `src/palettes/ether-{name}.js` with `{ id, label, type: "dark", uiTheme: "vs-dark", ui, syntax }`. Set `surfacePanel` and `surfaceEditor` first, then derive the rest. Run `npm run build`.

**Remove:** delete the palette file and run `npm run build`. Orphan theme JSON and `package.json` entries are removed automatically.



**Publishing**

Add GitHub secrets `**VSCE_PAT`** and `**OVSX_PAT**`, then push changes to `src/`, `themes/`, or `package.json` — CI auto-bumps the patch version and publishes.

Manual publish: `npm run publish:local` or **Actions → Release → Run workflow**.

See [docs/WORKFLOW.md](docs/WORKFLOW.md) for push-without-publish and local install notes.



## License

MIT — see [LICENSE](LICENSE).