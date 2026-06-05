import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPalettes } from "../generator/index.js";
import { THEME_CHARACTER } from "../generator/preview-svg/theme-character.js";
import {
  ASSETS_BASE,
  GITHUB_REPO,
  OPEN_VSX,
  SITE_URL,
  SNIPPETS_BASE,
  THEMES_BASE,
  VS_MARKETPLACE,
} from "./site-config.js";
import { SITE_SCRIPT } from "./site-styles.js";
import {
  escapeHtml,
  renderPage,
  renderSearchInput,
  siteRootDir,
} from "./site-layout.js";
import { renderSyntaxPreview } from "./site-syntax-preview.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "../..");
const previewsSourceDir = join(rootDir, "docs", "previews");
const themesDir = join(siteRootDir, "themes");
const assetsDir = join(siteRootDir, "assets");

/**
 * @param {import("../utils/color.js").Palette} palette
 */
function renderThemeCard(palette, { compact = false } = {}) {
  const character = THEME_CHARACTER[palette.id] ?? "";
  const search = [palette.id, palette.label, character].join(" ").toLowerCase();
  const previewSrc = `${ASSETS_BASE}/previews/${palette.id}.png`;

  return `<article class="theme-card${compact ? " theme-card-compact" : ""}" data-search="${escapeHtml(search)}">
  <button
    type="button"
    class="theme-preview"
    data-theme-preview
    data-preview-src="${previewSrc}"
    data-preview-label="${escapeHtml(palette.label)}"
    data-preview-desc="${escapeHtml(character)}"
    aria-label="Preview ${escapeHtml(palette.label)}"
  >
    <img src="${previewSrc}" alt="${escapeHtml(palette.label)} editor preview" loading="lazy" width="420" height="272" />
  </button>
  <div class="theme-card-body">
    <h3>${escapeHtml(palette.label)}</h3>
    <p>${escapeHtml(character)}</p>
    <div class="theme-card-actions">
      <button type="button" class="try-theme" data-apply-theme="${escapeHtml(palette.id)}">Try on site</button>
    </div>
  </div>
</article>`;
}

export function copyThemePreviews() {
  const previewsDir = join(assetsDir, "previews");
  mkdirSync(previewsDir, { recursive: true });
  const files = readdirSync(previewsSourceDir).filter((file) => file.endsWith(".png"));
  for (const file of files) {
    copyFileSync(join(previewsSourceDir, file), join(previewsDir, file));
  }
  return files.length;
}

/**
 * @param {import("../utils/color.js").Palette[]} palettes
 * @param {number} snippetCount
 */
export function buildHomePage(palettes, snippetCount) {
  const featured = palettes.slice(0, 8);
  const themeStrip = featured.map((palette) => renderThemeCard(palette, { compact: true })).join("\n");
  const ogImage = `${SITE_URL}assets/previews/${palettes[0]?.id ?? "ether-dusk"}.png`;

  const html = renderPage({
    pageTitle: "Ether Themes — Dark Themes & Snippets for VS Code and Cursor",
    description:
      "Ether Themes is a VS Code and Cursor extension with 25 WCAG-validated dark color themes, 496 React/Next.js/TypeScript snippets, and Kotlin, AIDL, ProGuard, and Dotenv syntax highlighting.",
    canonicalPath: "/",
    active: "home",
    ogImage,
    includeLightbox: true,
    palettes,
    content: `<section class="landing-grid">
  <div class="landing-hero">
    <span class="hero-eyebrow">VS Code &amp; Cursor extension</span>
    <h1>Dark themes built for long coding sessions</h1>
    <p class="lead">Twenty-five WCAG-validated palettes, ${snippetCount} production-ready snippets, and bundled grammars — one install, zero extra setup.</p>
    <p class="lead" style="margin-top:12px">Use the theme picker in the nav to preview any Ether palette across the whole site.</p>
    <div class="cta-row">
      <a class="cta cta-primary" href="${VS_MARKETPLACE}">Install on VS Code</a>
      <a class="cta" href="${OPEN_VSX}">Install on Cursor</a>
      <a class="cta" href="${THEMES_BASE}/">Browse themes</a>
      <a class="cta" href="${SNIPPETS_BASE}/">Browse snippets</a>
    </div>
    <div class="stats">
      <div class="stat"><strong>${palettes.length}</strong><span>dark themes</span></div>
      <div class="stat"><strong>${snippetCount}</strong><span>snippets</span></div>
      <div class="stat"><strong>4</strong><span>grammars</span></div>
      <div class="stat"><strong>WCAG</strong><span>validated palettes</span></div>
    </div>
  </div>
  ${renderSyntaxPreview()}
</section>

<section class="feature-grid">
  <article class="feature-card">
    <h2>Theme gallery</h2>
    <p>From Aurora teal to Velvet plum — every palette ships with semantic highlighting tuned for readability.</p>
    <a class="link" href="${THEMES_BASE}/">Explore all ${palettes.length} themes →</a>
  </article>
  <article class="feature-card">
    <h2>Snippet catalog</h2>
    <p>React 19, Next.js, TanStack Query, Zod, Vitest, HTML, and CSS prefixes across six editor scopes.</p>
    <a class="link" href="${SNIPPETS_BASE}/">Search ${snippetCount} snippets →</a>
  </article>
  <article class="feature-card">
    <h2>Language support</h2>
    <p>Bundled TextMate grammars ship with the extension — no extra extensions required.</p>
    <div class="grammar-list">
      <span class="grammar-pill">Kotlin</span>
      <span class="grammar-pill">AIDL</span>
      <span class="grammar-pill">ProGuard</span>
      <span class="grammar-pill">Dotenv</span>
    </div>
  </article>
</section>

<section class="section">
  <div class="section-head">
    <h2>Featured themes</h2>
    <a href="${THEMES_BASE}/">View full gallery</a>
  </div>
  <div class="theme-strip">${themeStrip}</div>
</section>

<section class="section">
  <h2>Get started in seconds</h2>
  <div class="grid">
    <article class="card">
      <h2>1. Install</h2>
      <p>Search <strong>Ether Themes</strong> in the Extensions panel or use the marketplace links above.</p>
    </article>
    <article class="card">
      <h2>2. Pick a theme</h2>
      <p>Press <code>Ctrl+K Ctrl+T</code> (or <code>Cmd+K Cmd+T</code>) and choose any Ether palette.</p>
    </article>
    <article class="card">
      <h2>3. Use snippets</h2>
      <p>Type a prefix like <code>rfc</code> or <code>usestate</code> in a matching file and press <strong>Tab</strong>.</p>
    </article>
  </div>
</section>

<section class="section">
  <div class="cta-row">
    <a class="cta cta-primary" href="${VS_MARKETPLACE}">Install on VS Code</a>
    <a class="cta" href="${OPEN_VSX}">Install on Cursor</a>
    <a class="cta" href="${GITHUB_REPO}">View source on GitHub</a>
  </div>
</section>`,
  });

  writeFileSync(join(siteRootDir, "index.html"), html, "utf8");
}

/**
 * @param {import("../utils/color.js").Palette[]} palettes
 */
export function buildThemesPage(palettes) {
  mkdirSync(themesDir, { recursive: true });
  const cards = palettes.map((palette) => renderThemeCard(palette)).join("\n");
  const ogImage = `${SITE_URL}assets/previews/${palettes[0]?.id ?? "ether-dusk"}.png`;

  const html = renderPage({
    pageTitle: `Ether Themes Gallery — ${palettes.length} Dark Color Themes`,
    description: `Browse all ${palettes.length} Ether dark themes with live editor previews. WCAG-validated palettes for VS Code and Cursor.`,
    canonicalPath: "themes/",
    active: "themes",
    ogImage,
    includeLightbox: true,
    palettes,
    content: `<header class="page-header">
  <span class="hero-eyebrow">Theme gallery</span>
  <h1>${palettes.length} dark color themes</h1>
  <p>Every palette is WCAG-validated with tuned syntax and workbench colors. Click a preview to enlarge, or <strong>Try on site</strong> to preview the palette live. Install the extension, then press <code>Ctrl+K Ctrl+T</code> to switch themes.</p>
</header>

${renderSyntaxPreview()}

${renderSearchInput("theme-search", "Search themes by name or character…")}
<p id="search-empty" class="empty-state hidden">No themes match your search.</p>
<div class="theme-gallery">${cards}</div>`,
  });

  writeFileSync(join(themesDir, "index.html"), html, "utf8");
}

export function writeSiteScript() {
  writeFileSync(join(assetsDir, "site.js"), `${SITE_SCRIPT.trim()}\n`, "utf8");
}

export async function loadPalettesForSite() {
  return loadPalettes();
}
