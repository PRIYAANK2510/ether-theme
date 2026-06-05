import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  ASSETS_BASE,
  BRAND_COLOR,
  GITHUB_REPO,
  OPEN_VSX,
  SITE_BASE,
  SITE_NAME,
  SITE_URL,
  SNIPPETS_BASE,
  THEMES_BASE,
  VS_MARKETPLACE,
} from "./site-config.js";
import { SITE_STYLES } from "./site-styles.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "../..");
export const siteRootDir = join(rootDir, "site");
const THEME_ICON = join(rootDir, "icon.png");

/** @type {const} */
const BRAND_ASSETS = [
  { name: "favicon-16.png", size: 16 },
  { name: "favicon-32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "logo.png", size: 128 },
];

/**
 * @param {string} text
 */
export function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * @param {string} assetsDir
 */
export async function writeBrandAssets(assetsDir) {
  mkdirSync(assetsDir, { recursive: true });
  await Promise.all(
    BRAND_ASSETS.map(({ name, size }) =>
      sharp(THEME_ICON)
        .resize(size, size, { fit: "contain", background: "#000000" })
        .png()
        .toFile(join(assetsDir, name)),
    ),
  );
  copyFileSync(join(assetsDir, "favicon-32.png"), join(siteRootDir, "favicon.png"));
}

/**
 * @param {{
 *   pageTitle: string,
 *   description: string,
 *   canonicalPath: string,
 *   ogImage?: string,
 * }} options
 */
export function renderHead({ pageTitle, description, canonicalPath, ogImage }) {
  const canonical = `${SITE_URL}${canonicalPath.replace(/^\//, "")}`;
  const image = ogImage ?? `${SITE_URL}assets/apple-touch-icon.png`;
  return `<meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="${BRAND_COLOR}" />
  <meta name="author" content="Priyaank" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="${ASSETS_BASE}/favicon-32.png" type="image/png" sizes="32x32" />
  <link rel="icon" href="${ASSETS_BASE}/favicon-16.png" type="image/png" sizes="16x16" />
  <link rel="apple-touch-icon" href="${ASSETS_BASE}/apple-touch-icon.png" sizes="180x180" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${image}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${ASSETS_BASE}/site.css" />`;
}

/**
 * @param {"home" | "themes" | "snippets"} active
 */
export function renderTopbar(active) {
  const navItems = [
    { id: "home", href: `${SITE_BASE}/`, label: "Home" },
    { id: "themes", href: `${THEMES_BASE}/`, label: "Themes" },
    { id: "snippets", href: `${SNIPPETS_BASE}/`, label: "Snippets" },
  ];

  const nav = navItems
    .map(
      ({ id, href, label }) =>
        `<a href="${href}"${active === id ? ' class="active"' : ""}>${escapeHtml(label)}</a>`,
    )
    .join("");

  return `<header class="topbar">
  <div class="topbar-inner">
    <a class="brand" href="${SITE_BASE}/">
      <img src="${ASSETS_BASE}/logo.png" width="44" height="44" alt="Ether Themes logo" />
      <div class="brand-text">
        <strong>${SITE_NAME}</strong>
        <span>VS Code &amp; Cursor extension</span>
      </div>
    </a>
    <nav class="nav" aria-label="Primary">
      ${nav}
      <a class="nav-cta" href="${VS_MARKETPLACE}">Install</a>
    </nav>
  </div>
</header>`;
}

/**
 * @param {string} active
 * @param {Array<{ id: string, href: string, label: string }>} items
 */
export function renderSubnav(active, items) {
  const links = items
    .map(
      ({ id, href, label }) =>
        `<a href="${href}"${active === id ? ' class="active"' : ""}>${escapeHtml(label)}</a>`,
    )
    .join("");
  return `<nav class="subnav" aria-label="Section">
  <div class="subnav-inner">${links}</div>
</nav>`;
}

export function renderFooter() {
  return `<footer class="footer">
  <div><strong>${SITE_NAME}</strong> — 25 WCAG-validated dark themes, 496 snippets, and bundled language grammars.</div>
  <div class="footer-links">
    <a href="${VS_MARKETPLACE}">VS Marketplace</a>
    <a href="${OPEN_VSX}">Open VSX (Cursor)</a>
    <a href="${GITHUB_REPO}">GitHub</a>
    <a href="${SNIPPETS_BASE}/">Snippet docs</a>
    <a href="${THEMES_BASE}/">Theme gallery</a>
  </div>
</footer>`;
}

export function renderLightbox() {
  return `<div id="theme-lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Theme preview">
  <button type="button" class="lightbox-close" aria-label="Close preview">&times;</button>
  <div class="lightbox-dialog">
    <img src="" alt="" />
    <div class="lightbox-caption">
      <div><strong data-lightbox-title></strong><br /><span data-lightbox-character></span></div>
    </div>
  </div>
</div>`;
}

/**
 * @param {string} placeholder
 */
export function renderSearchInput(id, placeholder) {
  return `<div class="search-wrap">
  <span class="search-icon" aria-hidden="true">⌕</span>
  <input id="${id}" class="search" type="search" placeholder="${escapeHtml(placeholder)}" />
</div>`;
}

/**
 * @param {string} prefix
 */
export function renderPrefixPill(prefix) {
  return `<button type="button" class="prefix-pill" data-copy-prefix data-prefix="${escapeHtml(prefix)}" title="Copy prefix to clipboard">
  <code>${escapeHtml(prefix)}</code>
  <span data-copy-label>Copy</span>
</button>`;
}

/**
 * @param {{
 *   pageTitle: string,
 *   description: string,
 *   canonicalPath: string,
 *   active: "home" | "themes" | "snippets",
 *   content: string,
 *   subnav?: string,
 *   ogImage?: string,
 *   includeLightbox?: boolean,
 * }} options
 */
export function renderPage({
  pageTitle,
  description,
  canonicalPath,
  active,
  content,
  subnav = "",
  ogImage,
  includeLightbox = false,
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({ pageTitle, description, canonicalPath, ogImage })}
</head>
<body>
  ${renderTopbar(active)}
  ${subnav}
  <main class="container">
    ${content}
    ${renderFooter()}
  </main>
  ${includeLightbox ? renderLightbox() : ""}
  <script src="${ASSETS_BASE}/site.js" defer></script>
</body>
</html>`;
}

/**
 * @param {string} assetsDir
 */
export function writeSiteStyles(assetsDir) {
  mkdirSync(assetsDir, { recursive: true });
  writeFileSync(join(assetsDir, "site.css"), `${SITE_STYLES.trim()}\n`, "utf8");
}
