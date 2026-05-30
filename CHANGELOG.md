# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- GitHub Actions CI on push/PR; automated publish to Open VSX and VS Code Marketplace on version tags
- PAT-based publishing via `VSCE_PAT` / `OVSX_PAT` (local `.env` or GitHub Secrets)
- F5 Extension Development Host workflow for VS Code and Cursor

[0.1.0]: https://github.com/Priyaank/ether-theme/releases/tag/v0.1.0
