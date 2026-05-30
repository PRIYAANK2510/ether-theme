# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.1.3]: https://github.com/PRIYAANK2510/ether-theme/releases/tag/v0.1.3
[0.1.2]: https://github.com/PRIYAANK2510/ether-theme/releases/tag/v0.1.2
[0.1.1]: https://github.com/PRIYAANK2510/ether-theme/releases/tag/v0.1.1
[0.1.0]: https://github.com/PRIYAANK2510/ether-theme/releases/tag/v0.1.0
