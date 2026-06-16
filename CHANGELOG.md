# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).







## [1.0.18] - 2026-06-16

### Changed

- Theme palette updates (auto-release)
## [1.0.17] - 2026-06-15

### Changed

- Theme palette updates (auto-release)
## [1.0.16] - 2026-06-15

### Changed

- Theme palette updates (auto-release)
## [1.0.15] - 2026-06-15

### Changed

- Theme palette updates (auto-release)
## [1.0.14] - 2026-06-14

### Fixed

- **Inlay hint backgrounds** — parameter and type hints (`len:`, `minLength:`, `value:`, etc.) now use palette-tinted surfaces instead of the default gray badge styling across all 50 themes

## [1.0.13] - 2026-06-08

### Changed

- README hero (logo, title, tagline, badges, links) is GitHub-only and center-aligned; marketplace README starts at Install
- Publish uses the packaged VSIX so VS Marketplace and Open VSX share the stripped README

## [1.0.12] - 2026-06-08

### Changed

- README license badge uses a static MIT shield (fixes Shields.io GitHub token pool errors)
- README logo is stripped during `npm run package` so marketplace listings stay clean; GitHub repo README keeps the logo

## [1.0.11] - 2026-06-08

### Added

- **15 new dark palettes** — Abyss, Bloom, Cipher, Dune, Eclipse, Fjord, Grove, Heath, Inkwell, Jade, Kelp, Lotus, Magma, Nebula, and Onyx (50 themes total)

### Changed

- README preview gallery, website SEO copy, Footer, and theme counts updated for 50 palettes
- Theme preview PNGs and VS Code color theme JSON regenerated for all new palettes

## [1.0.10] - 2026-06-08

### Changed

- Theme palette updates (auto-release)
## [1.0.9] - 2026-06-08

### Changed

- **Breadcrumb bar** — background now matches the editor surface across all 35 themes (was panel-toned header color)
- Theme preview PNGs regenerated to reflect the breadcrumb fix

## [1.0.8] - 2026-06-05

### Added

- **9 new dark palettes** — Harbor, Petal, Cedar, Solstice, Glacier, Amethyst, Copper, Meadow, and Obsidian (35 themes total)
- **Web framework grammars** — official Astro, Vue, Svelte, and MDX TextMate grammars bundled in the extension (no separate language extensions required)
- **Angular template injections** — `{{ }}` bindings, control-flow blocks, and inline templates in HTML and TypeScript
- **Framework syntax rules** — Astro/Vue/Svelte tag and directive colors, unified fat-arrow operator styling, bracket-pair fixes for `=>` in `.astro` files
- **`npm run grammars:sync`** — script to refresh framework grammar files from upstream language-tools repos

### Changed

- **Ether Midnight** — unified violet-slate surfaces and coral accent for a cohesive sidebar/editor look
- Expanded language associations to **44** (`.jsx`, `.tsx`, `.js`, `.ts`, `.mdx`, and more)
- README preview gallery, website SEO copy, and theme counts updated for 35 palettes
- All existing themes regenerated with expanded syntax token rules

## [1.0.7] - 2026-06-06

### Changed

- Theme palette updates (auto-release)
## [1.0.6] - 2026-06-06

### Changed

- Theme palette updates (auto-release)
## [1.0.5] - 2026-06-06

### Changed

- Theme palette updates (auto-release)
## [1.0.4] - 2026-06-05

### Changed

- Theme palette updates (auto-release)
## [1.0.3] - 2026-06-05

### Changed

- Theme palette updates (auto-release)
## [1.0.2] - 2026-06-05

### Changed

- Theme palette updates (auto-release)

## [1.0.1] - 2026-06-05

### Changed

- Theme palette updates (auto-release)

## [1.0.0] - 2026-06-05

### Added — Official V1 release

- **React product website** (`apps/website/`) — theme gallery, live palette switcher, searchable snippet docs, and polished UI with motion and accessibility
- **Industry-grade CSS/SCSS syntax highlighting** — dedicated `sheet*` token lanes with enforced hue separation across all 25 palettes (properties, selectors, values, variables, at-rules)
- **Full SEO stack** — per-route meta, Open Graph, Twitter Cards, JSON-LD (`WebSite` + `SoftwareApplication`), `sitemap.xml`, `robots.txt`, OG share image, and prerendered HTML shells for every indexable route
- **Developer experience** — `CONTRIBUTING.md`, `AGENTS.md`, `.editorconfig`, `.nvmrc`, `.env.example`, expanded VS Code workspace (tasks, launch, Stylelint), `check:fast` CI gate, and `ether.code-workspace`
- **Bundled grammars** — Kotlin, AIDL, ProGuard/R8, Dotenv with 38 Android file associations
- **496 snippets** — React 19, Next.js App Router, TanStack Query, Zod, Vitest, Node, HTML, CSS
- **Website bridge modules** in `shared/` for theme tokens, snippets, brand assets, and SEO

### Changed

- Migrated from legacy `web/` and `src/docs/` static generators to the Vite + React site
- Replaced CSS Modules `composes` with Sass mixins (Stylelint-clean SCSS modules)
- Unified publisher **Priyaank** on VS Code Marketplace and Open VSX
- Release workflow respects `release: v*` commit messages without auto patch-bump

### Removed

- Legacy `web/` duplicate app and stale `src/shared/` bridge copies
- Retired `src/docs/` static site generator

## [0.2.17] - 2026-06-05

### Changed

- Theme palette updates (auto-release)

## [0.2.16] - 2026-06-05

### Changed

- Align `publisher` to **Priyaank** on both VS Code Marketplace and Open VSX (Cursor); remove the publish-time publisher swap

## [0.2.15] - 2026-06-05

### Fixed

- Replace retired Shields.io VS Marketplace API badges with a static install badge and live Open VSX version/download badges in README and `package.json`

## [0.2.14] - 2026-06-05

### Added

- **AIDL grammar** — bundled Android Interface Definition Language highlighting (`.aidl`)
- **38 Android file associations** — `res/**` XML, `libs.versions.toml`, `google-services.json`, Gradle wrapper properties, `consumer-rules.pro`, and more

### Changed

- **Kotlin grammar** — Compose & Android annotations, `expect`/`actual`, `?.` / `!!` / `?:`, `where` constraints, folding, and indentation
- **ProGuard / R8 grammar** — rewritten with proper `.proguard` scopes for keep rules, directives, and member specs
- **Theme syntax rules** expanded from **61** to **67** — Kotlin annotations, ProGuard, and AIDL token colors across all 25 palettes

## [0.2.13] - 2026-06-05

### Changed

- Industry-grade README with install badges, theme catalog, and compact snippet docs
- Marketplace SEO: keyword-rich description, 30 search tags, gallery banner, marketplace badges, and Programming Languages category
- Restored `ether` brand keyword; preview images use descriptive alt text for search indexing

## [0.2.12] - 2026-06-05

### Fixed

- **Kotlin, ProGuard, and Dotenv grammars** were excluded from the published VSIX because `.vscodeignore` ignored all of `src/**` — `.kt` files appeared uncolored in installed builds while F5 Extension Development Host worked correctly

### Changed

- `.vscodeignore` now ships `src/grammars/syntaxes/` and `src/grammars/language-configs/` in marketplace packages
- Dev-only `.cursor/` rules and `docs/WORKFLOW.md` are excluded from the VSIX
- Packaging regression test ensures bundled grammars stay included in future releases

## [0.2.11] - 2026-06-05

### Changed

- Theme palette updates (auto-release)

## [0.2.10] - 2026-06-05

### Changed

- Theme palette updates (auto-release)

## [0.2.9] - 2026-06-05

### Added

- **104 new hand-authored snippets** — catalog grows from 392 to **496** definitions
- **`testing-modern.js`** — Vitest suites, RTL `render`/`userEvent`, MSW handlers and server setup, `renderHook` tests
- **`validation.js`** — Zod object schemas, `safeParse`, discriminated unions, FormData parsing, error formatting
- **`data-fetching.js`** — TanStack Query `useQuery`/`useMutation`, infinite queries, optimistic updates, suspense
- **`react-server.js`** — Next.js App Router pages, layouts, server actions, route handlers, middleware, metadata
- **`node.js`** — Express/Fastify routes, env validation, CORS, graceful shutdown, streams, Web Crypto hashing
- Modern **CSS** (`:has()`, `oklch`, `color-mix`, nesting, auto-fit grid), **HTML** (popover API, JSON-LD, live regions), **JS/TS**, and **React 19** hook/pattern snippets

### Changed

- README snippet docs updated with new counts, prefixes, and full-stack coverage
- `MIN_SNIPPET_COUNT` raised to **450** to reflect the expanded catalog baseline
- Theme preview generator refactored into modular `src/generator/preview-svg/` (compose, scene, assets, gallery, rasterize)

## [0.2.8] - 2026-06-04

### Changed

- Theme palette updates (auto-release)

## [0.2.7] - 2026-06-04

### Changed

- Theme palette updates (auto-release)

## [0.2.6] - 2026-06-04

### Changed

- Theme palette updates (auto-release)

## [0.2.5] - 2026-06-04

### Changed

- Theme palette updates (auto-release)

## [0.2.4] - 2026-06-04

### Changed

- High-DPI PNG theme previews in README (VS Code–style mockup from `build.js`)
- Release workflow commits version bump before publish to avoid duplicate marketplace uploads

## [0.2.3] - 2026-05-29

### Added

- **17 new dark palettes** — Aurora, Clay, Coral, Dracula, Flame, Frost, Lichen, Mint, Mirage, Mocha, Noir, Opal, Prism, Sage, Sand, Slate, Tide, Velvet (25 themes total)
- Comment foreground derived at build time from the same mix as **active gutter line numbers** (`deriveCommentForeground`)

### Changed

- **Theme lineup expanded** from 8 to **25** anchor-first dark palettes; README and marketplace metadata updated
- Renamed **Ether Ink** → **Ether Clay**
- Gutter line numbers use shared `LINE_NUMBER_MIX_*` constants; inactive vs active blends unchanged in intent
- Palette `syntax.comment` values synced to derived comment color for accurate source documentation
- Relaxed comment contrast target to **2.5:1** (subdued comments, still readable)

### Fixed

- Comments no longer share the same visual weight as `fgMuted` / body-adjacent syntax on several palettes
- `fgMuted` vs `syntax.comment` separation on Slate (sidebar chrome vs editor comments)

### Removed

- Auto-generated light themes and `derive-light-palette.js`
- Redundant scripts: `check-palettes.mjs`, `sync-palette-comments.js`
- Stale local `.vsix` artifacts from `releases/` (still gitignored; recreated by `npm run package`)

## [0.2.2] - 2026-05-31

### Changed

- **Theme lineup rebuilt** — replaced the previous 20-palette collection with **8 anchor-first dark themes**: Graphite, Storm, Ember, Luna, Moss, Dusk, Ink, Stone
- Palettes now start from `surfacePanel` + `surfaceEditor`, then derive surfaces, foreground, accent, and syntax; light themes removed
- Expanded shared syntax highlighting from 36 to **58 rules** with `semanticHighlighting: true`
- WCAG contrast validation now covers all 11 syntax roles (7:1 default text, 4.5:1 for other roles and UI tokens)

### Fixed

- **Workbench interactive states** — status bar, sidebar lists, secondary buttons, suggest widget, activity bar, and panel tabs now use visible hover/selection backgrounds with matching foreground lifts (fixes muted-on-accent hover contrast)
- Added `derive-interactive.js` for shared neutral overlay pattern across interactive UI

### Removed

- 12 legacy palettes and generated themes (Abyss, Aurora, Brass, Carbon, Crimson, Eclipse, Forest, Haze, Jade, Linen, Nebula, Obsidian, Pearl, Plasma, Sangria, Slate, Terra, Vesper, Midnight, etc.)

## [0.2.1] - 2026-05-30

### Added

- **392 web development snippets** — integrates **175 ES7+ React/Redux/React-Native** patterns alongside the existing Ether catalog (components, hooks, imports, Redux, PropTypes, React Native, tests, console helpers, and more)
- Unified snippet catalog under `src/snippets/catalog/` with a single manifest (`index.js`), shared `SnippetDefinition` types in `validate.js`, and `npm run snippets:sync` to refresh extension-backed modules

### Changed

- Snippet build pipeline simplified: one loader, one validation path, flat catalog modules (removed `ether/` / `es7/` split, vendor JSON, and duplicate import tooling)
- Generated `.code-snippets` artifacts rebuilt from the merged catalog

## [0.2.0] - 2026-05-30

### Added

- **223 web development snippets** for JavaScript, TypeScript, JSX, TSX, HTML, and CSS
- Source-driven snippet build pipeline in `src/snippets/` with catalog modules, validation, and generated `.code-snippets` files
- Production-grade patterns: AbortController fetch, typed reducers, custom hooks (debounce, localStorage, media query), React 19 `useActionState`, compound components, accessible markup, modern CSS (container queries, cascade layers, reduced motion)
- Snippet contributions registered in `package.json` alongside existing themes
- Vitest coverage for snippet catalog validation and generated artifacts

### Changed

- Extension description, keywords, and marketplace categories now include Snippets alongside Themes
- README expanded with snippet prefix cheat sheet and catalog editing instructions

## [0.1.5] - 2026-05-30

### Fixed

- Editor gutter line numbers toned down across all 20 themes — derived from a subdued blend instead of `fgMuted`
- Added `editorLineNumber.activeForeground` for a slightly brighter current-line number

## [0.1.4] - 2026-05-30

### Fixed

- Cursor agent/composer prompt styling across all 20 themes — input now blends with the composer pane instead of appearing as a separate dark card
- Added `agentsChatInput.*`, `input.border`, and `input.foreground` tokens; ghost-style agent toolbar buttons; harmonized chat session list and request bubble colors

## [0.1.3] - 2026-05-30

### Changed

- Publisher aligned to `PRIYAANK2510` for verified Open VSX namespace (Cursor)
- VS Code Marketplace continues under `Priyaank` via publish script

## [0.1.2] - 2026-05-30

### Added

- **16 new themes** — collection expanded from 4 to 20 distinct palettes
- **Dark:** Ether Abyss, Brass, Carbon, Crimson, Eclipse, Forest, Haze, Jade, Midnight, Nebula, Plasma, Sangria, Slate, Terra
- **Light:** Ether Linen (warm cream), Ether Pearl (cool pearl white) — first light variants in the extension
- Build-time WCAG contrast validation for critical palette token pairs (`fgPrimary`, `fgMuted`, `syntax.default`, `syntax.comment`, `fgOnAccent`)
- Contrast test coverage in the Vitest suite

### Changed

- Extension icon updated to the Ether brand mark (wavy blue bands on charcoal)
- Rebuilt all palette base tokens for stronger, more readable contrast (AAA body text at 7:1, AA muted UI at 4.5:1)
- Brightened `fgMuted` and `syntax.comment` across every existing dark theme
- README theme table updated with type (Light/Dark), accent, and character for all 20 themes

## [0.1.1] - 2026-05-30

### Fixed

- Marketplace repository link now points at GitHub (`markdown: github`)
- Display name set to **Ether Themes**
- `.env` excluded from VSIX; simplified publish scripts
- Auto-release on push when themes change

## [0.1.0] - 2026-05-30

### Added

- **Ether Aurora** — deep space navy with electric teal accent and aurora-inspired syntax
- **Ether Ember** — charcoal workshop palette with molten amber-orange accent
- **Ether Obsidian** — monochrome obsidian surfaces with burnished-gold accent
- **Ether Vesper** — violet-black twilight palette with rose accent
- Token-driven build pipeline (JavaScript, chroma-js) — palette files → `.color-theme.json`
- Auto-discovered palettes in `src/palettes/` with orphan theme cleanup and `package.json` sync
- Two-layer workbench generation: 141 core keys + 68 extension keys (chat, menus, tabs, links)
- 36 shared `tokenColor` syntax rules across all themes
- Inline validation (deprecated keys, transparency rules, schema checks)
- Vitest test suite
- GitHub Actions CI; auto-release on push when themes change
- PAT-based publishing via `VSCE_PAT` / `OVSX_PAT` (local `.env` or GitHub Secrets)
- F5 Extension Development Host workflow for VS Code and Cursor

[1.0.0]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.0
[0.2.4]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.4
[0.2.3]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.3
[0.2.2]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.2
[0.2.1]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.1
[0.2.0]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.0
[0.1.5]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.1.5
[0.1.4]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.1.4
[0.1.3]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.1.3
[0.1.2]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.1.2
[0.1.1]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.1.1
[0.1.0]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.1.0
[0.2.5]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.5
[0.2.6]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.6
[0.2.7]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.7
[0.2.8]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.8
[0.2.10]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.10
[0.2.16]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.16
[0.2.15]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.15
[0.2.14]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.14
[0.2.13]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.13
[0.2.12]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.12
[0.2.11]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.11
[0.2.17]: https://github.com/PRIYAANK2510/ether-theme/tree/v0.2.17
[1.0.1]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.1
[1.0.2]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.2
[1.0.3]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.3
[1.0.4]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.4
[1.0.5]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.5
[1.0.6]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.6
[1.0.7]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.7
[1.0.8]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.8
[1.0.9]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.9
[1.0.11]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.11
[1.0.12]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.12
[1.0.14]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.14
[1.0.13]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.13
[1.0.10]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.10
[1.0.15]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.15
[1.0.16]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.16
[1.0.17]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.17
[1.0.18]: https://github.com/PRIYAANK2510/ether-theme/tree/v1.0.18
