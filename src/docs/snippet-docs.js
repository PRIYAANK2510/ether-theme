import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadSnippetCatalogWithMeta } from "../snippets/catalog/index.js";
import { SNIPPET_LANGUAGES } from "../snippets/registry.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "../..");
const siteRootDir = join(rootDir, "site");
const siteDir = join(siteRootDir, "snippets");

/** @type {const} */
export const PAGES_BASE = "/ether-theme/snippets";
export const PAGES_URL = "https://PRIYAANK2510.github.io/ether-theme/snippets/";
const SITE_NAME = "Ether Snippet Catalog";
const BRAND_COLOR = "#101828";
const VS_MARKETPLACE =
  "https://marketplace.visualstudio.com/items?itemName=Priyaank.ether-theme";
const OPEN_VSX = "https://open-vsx.org/extension/Priyaank/ether-theme";
const GITHUB_REPO = "https://github.com/PRIYAANK2510/ether-theme";

/** @type {Record<string, { label: string, extensions: string, slug: string }>} */
export const LANGUAGE_META = {
  javascript: {
    label: "JavaScript",
    extensions: ".js, .mjs, .cjs",
    slug: "javascript",
  },
  typescript: {
    label: "TypeScript",
    extensions: ".ts, .mts, .cts",
    slug: "typescript",
  },
  javascriptreact: {
    label: "React (JSX)",
    extensions: ".jsx",
    slug: "react-jsx",
  },
  typescriptreact: {
    label: "React (TSX)",
    extensions: ".tsx",
    slug: "react-tsx",
  },
  html: {
    label: "HTML",
    extensions: ".html, .htm",
    slug: "html",
  },
  css: {
    label: "CSS",
    extensions: ".css, .scss",
    slug: "css",
  },
};

/**
 * @param {string} text
 */
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * @param {string | string[]} body
 */
function normalizeBody(body) {
  return Array.isArray(body) ? body.join("\n") : body;
}

/**
 * @param {string} body
 */
function formatBodyForDocs(body) {
  return body
    .replace(/\$\{(\d+)(?::([^}]*))?\}/g, (_, index, placeholder) => {
      if (placeholder) {
        return placeholder;
      }
      return index === "0" ? "█" : `⟨${index}⟩`;
    })
    .replace(/\$(\d+)/g, (_, index) => (index === "0" ? "█" : `⟨${index}⟩`));
}

/**
 * @param {import("../snippets/validate.js").SnippetDefinition} snippet
 * @param {string} language
 */
function resolveSnippetForLanguage(snippet, language) {
  const variant = snippet.variants?.[language] ?? {};
  return {
    prefix: variant.prefix ?? snippet.prefix,
    description: variant.description ?? snippet.description,
    body: normalizeBody(variant.body ?? snippet.body),
  };
}

const STYLES = `
:root {
  color-scheme: dark;
  --bg: #070d18;
  --surface: #101828;
  --surface-2: #152238;
  --surface-3: #1a2a42;
  --border: #2a3a52;
  --text: #eef2f9;
  --muted: #94a3b8;
  --accent: #38bdf8;
  --accent-2: #22d3ee;
  --accent-soft: rgba(56, 189, 248, 0.14);
  --code-bg: #0a1220;
  --shadow: 0 18px 50px rgba(0, 0, 0, 0.38);
  --radius: 14px;
  --mono: "Cascadia Code", "Fira Code", "JetBrains Mono", Consolas, monospace;
  --sans: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--sans);
  background:
    radial-gradient(900px 480px at 0% -5%, rgba(56, 189, 248, 0.16), transparent 60%),
    radial-gradient(700px 400px at 100% 0%, rgba(34, 211, 238, 0.08), transparent 55%),
    var(--bg);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
}
a { color: var(--accent); text-decoration: none; transition: color 0.15s ease; }
a:hover { color: var(--accent-2); }
.container { max-width: 1140px; margin: 0 auto; padding: 0 20px 88px; }
.topbar {
  position: sticky; top: 0; z-index: 20;
  backdrop-filter: blur(14px); background: rgba(7, 13, 24, 0.82);
  border-bottom: 1px solid var(--border);
  margin-bottom: 28px;
}
.topbar-inner {
  max-width: 1140px; margin: 0 auto; padding: 14px 20px;
  display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between;
}
.brand {
  display: flex; align-items: center; gap: 14px; text-decoration: none; color: inherit;
}
.brand:hover { color: inherit; text-decoration: none; }
.brand img {
  width: 44px; height: 44px; border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}
.brand-text { display: flex; flex-direction: column; gap: 2px; }
.brand-text strong { font-size: 1.12rem; letter-spacing: 0.01em; }
.brand-text span { color: var(--muted); font-size: 0.84rem; }
.nav { display: flex; flex-wrap: wrap; gap: 8px; }
.nav a {
  padding: 7px 12px; border-radius: 999px; border: 1px solid transparent;
  background: transparent; color: var(--muted); font-size: 0.86rem; font-weight: 500;
}
.nav a:hover { color: var(--text); background: var(--surface-2); text-decoration: none; }
.nav a.active {
  border-color: rgba(56, 189, 248, 0.45); color: var(--accent);
  background: var(--accent-soft);
}
.hero {
  background: linear-gradient(145deg, rgba(56, 189, 248, 0.1), rgba(16, 24, 40, 0.9));
  border: 1px solid var(--border); border-radius: calc(var(--radius) + 2px);
  padding: 32px 30px; box-shadow: var(--shadow); margin-bottom: 28px;
}
.hero-eyebrow {
  display: inline-block; margin-bottom: 10px; padding: 4px 10px; border-radius: 999px;
  background: var(--accent-soft); border: 1px solid rgba(56, 189, 248, 0.28);
  color: var(--accent); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em;
  text-transform: uppercase;
}
.hero h1 {
  margin: 0 0 12px; font-size: clamp(1.75rem, 4vw, 2.35rem); line-height: 1.15;
  letter-spacing: -0.02em;
}
.hero p { margin: 0; color: var(--muted); max-width: 68ch; font-size: 1.02rem; }
.cta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
.cta {
  display: inline-flex; align-items: center; gap: 6px; padding: 10px 14px;
  border-radius: 10px; font-size: 0.9rem; font-weight: 600; border: 1px solid var(--border);
  background: var(--surface-2); color: var(--text);
}
.cta:hover { border-color: rgba(56, 189, 248, 0.45); color: var(--accent); text-decoration: none; }
.cta-primary {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(34, 211, 238, 0.12));
  border-color: rgba(56, 189, 248, 0.4);
}
.stats { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
.stat {
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px;
  padding: 12px 16px; min-width: 128px;
}
.stat strong { display: block; font-size: 1.35rem; font-weight: 700; color: var(--text); }
.stat span { color: var(--muted); font-size: 0.82rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
.card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 20px; box-shadow: var(--shadow); transition: border-color 0.15s ease, transform 0.15s ease;
}
.card:hover { border-color: rgba(56, 189, 248, 0.35); transform: translateY(-2px); }
.card h2 { margin: 0 0 6px; font-size: 1.08rem; }
.card p { margin: 0 0 16px; color: var(--muted); font-size: 0.9rem; }
.card a.button {
  display: inline-block; padding: 8px 12px; border-radius: 8px; font-weight: 600; font-size: 0.88rem;
  background: var(--accent-soft); border: 1px solid rgba(56, 189, 248, 0.35); color: var(--accent);
}
.card a.button:hover { text-decoration: none; color: var(--accent-2); }
.search-wrap { position: relative; margin-bottom: 20px; }
.search {
  width: 100%; padding: 14px 16px 14px 42px; border-radius: var(--radius);
  border: 1px solid var(--border); background: var(--surface); color: var(--text);
  font-size: 1rem; font-family: var(--sans);
}
.search:focus { outline: 2px solid rgba(56, 189, 248, 0.4); outline-offset: 2px; border-color: rgba(56, 189, 248, 0.45); }
.search-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--muted); pointer-events: none; font-size: 1rem;
}
.section { margin-top: 40px; }
.section h2 { margin: 0 0 16px; font-size: 1.3rem; letter-spacing: -0.01em; }
.howto {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 22px 24px;
}
.howto ol { margin: 0; padding-left: 22px; color: var(--muted); }
.howto li { margin-bottom: 10px; }
.howto li:last-child { margin-bottom: 0; }
.howto code, .snippet-prefix, .prefix-pill code {
  font-family: var(--mono); background: var(--code-bg); border: 1px solid var(--border);
  border-radius: 6px; padding: 2px 7px; color: #bfe7ff; font-size: 0.88em;
}
.category { margin-top: 32px; }
.category h3 {
  margin: 0 0 14px; font-size: 1.02rem; color: var(--accent); font-weight: 600;
  padding-bottom: 10px; border-bottom: 1px solid var(--border);
}
.snippet-list { display: grid; gap: 14px; }
.snippet {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  overflow: hidden; transition: border-color 0.15s ease;
}
.snippet:hover { border-color: rgba(56, 189, 248, 0.28); }
.snippet-head {
  display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-bottom: 1px solid var(--border); background: var(--surface-2);
}
.snippet-head h4 { margin: 0; font-size: 0.98rem; font-weight: 600; flex: 1 1 220px; }
.snippet-meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.snippet-meta .tag {
  border: 1px solid var(--border); border-radius: 999px; padding: 3px 9px;
  background: var(--surface-3); color: var(--muted); font-size: 0.78rem;
}
.prefix-pill {
  display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 999px; padding: 4px 10px;
  background: var(--accent-soft); color: var(--accent); font-size: 0.8rem; font-weight: 600;
  font-family: var(--sans);
}
.prefix-pill:hover { border-color: var(--accent); }
.prefix-pill.copied { border-color: #34d399; color: #34d399; background: rgba(52, 211, 153, 0.12); }
pre {
  margin: 0; padding: 16px 18px; overflow-x: auto; background: var(--code-bg);
  font-family: var(--mono); font-size: 0.84rem; line-height: 1.55; color: #d8e4f4;
}
.table-wrap {
  overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius);
  background: var(--surface);
}
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
th, td { padding: 11px 14px; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }
th {
  background: var(--surface-2); color: var(--muted); font-weight: 600; font-size: 0.8rem;
  text-transform: uppercase; letter-spacing: 0.04em;
}
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: rgba(56, 189, 248, 0.05); }
.footer {
  margin-top: 56px; padding-top: 24px; border-top: 1px solid var(--border);
  color: var(--muted); font-size: 0.88rem;
}
.footer-links { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 10px; }
.empty-state { color: var(--muted); padding: 8px 0 16px; }
.hidden { display: none !important; }
.redirect-page {
  min-height: 100vh; display: grid; place-items: center; padding: 24px;
  background: radial-gradient(circle at top, rgba(56, 189, 248, 0.08), transparent 55%), var(--bg);
}
.redirect-card {
  width: min(100%, 420px); padding: 32px 28px; text-align: center;
  background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);
}
.redirect-card h1 { margin: 16px 0 8px; font-size: 1.5rem; }
.redirect-card p { color: var(--muted); margin: 0 0 16px; }
.redirect-hint { font-size: 0.85rem; margin-bottom: 0 !important; }
@media (max-width: 720px) {
  .topbar-inner { padding: 12px 16px; }
  .hero { padding: 22px 18px; }
  .container { padding: 0 16px 72px; }
}
`;

const SEARCH_SCRIPT = `
function filterSnippets(query) {
  const q = query.trim().toLowerCase();
  const rows = document.querySelectorAll("[data-search]");
  let visible = 0;
  for (const row of rows) {
    const haystack = row.getAttribute("data-search") || "";
    const show = !q || haystack.includes(q);
    row.classList.toggle("hidden", !show);
    if (show) visible += 1;
  }
  const empty = document.getElementById("search-empty");
  if (empty) empty.classList.toggle("hidden", visible > 0 || !q);
}

async function copyPrefix(button) {
  const prefix = button.getAttribute("data-prefix");
  if (!prefix) return;
  try {
    await navigator.clipboard.writeText(prefix);
    button.classList.add("copied");
    const label = button.querySelector("[data-copy-label]");
    if (label) label.textContent = "Copied!";
    setTimeout(() => {
      button.classList.remove("copied");
      if (label) label.textContent = "Copy prefix";
    }, 1400);
  } catch {
    /* clipboard unavailable */
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("snippet-search");
  if (input) input.addEventListener("input", () => filterSnippets(input.value));

  document.querySelectorAll("[data-copy-prefix]").forEach((button) => {
    button.addEventListener("click", () => copyPrefix(button));
  });
});
`;

/**
 * @param {string} canonicalPath
 * @param {string} pageTitle
 * @param {string} description
 */
function renderHead(canonicalPath, pageTitle, description) {
  const canonical = `${PAGES_URL}${canonicalPath === "/" ? "" : canonicalPath.replace(/^\//, "")}`;
  const icon = `${PAGES_BASE}/assets/icon.png`;
  return `<meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="${BRAND_COLOR}" />
  <meta name="author" content="Priyaank" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="${icon}" type="image/png" sizes="32x32" />
  <link rel="apple-touch-icon" href="${icon}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${icon}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${PAGES_BASE}/assets/snippets.css" />`;
}

/**
 * @param {string} active
 */
function renderTopbar(active) {
  const navItems = [
    { id: "home", href: `${PAGES_BASE}/`, label: "Overview" },
    ...SNIPPET_LANGUAGES.map(({ language }) => ({
      id: language,
      href: `${PAGES_BASE}/${LANGUAGE_META[language].slug}.html`,
      label: LANGUAGE_META[language].label,
    })),
  ];

  const nav = navItems
    .map(
      ({ id, href, label }) =>
        `<a href="${href}"${active === id ? ' class="active"' : ""}>${escapeHtml(label)}</a>`,
    )
    .join("");

  return `<header class="topbar">
  <div class="topbar-inner">
    <a class="brand" href="${PAGES_BASE}/">
      <img src="${PAGES_BASE}/assets/icon.png" width="44" height="44" alt="Ether Themes icon" />
      <div class="brand-text">
        <strong>${SITE_NAME}</strong>
        <span>496 snippets · VS Code &amp; Cursor</span>
      </div>
    </a>
    <nav class="nav" aria-label="Snippet languages">${nav}</nav>
  </div>
</header>`;
}

function renderFooter() {
  return `<footer class="footer">
  <div>Part of <strong>Ether Themes</strong> — 25 dark palettes + 496 production-ready snippets.</div>
  <div class="footer-links">
    <a href="${VS_MARKETPLACE}">Install on VS Code</a>
    <a href="${OPEN_VSX}">Install on Cursor</a>
    <a href="${GITHUB_REPO}">GitHub</a>
    <a href="${GITHUB_REPO}/blob/main/README.md#snippets">README</a>
  </div>
</footer>`;
}

function renderSearchInput(placeholder) {
  return `<div class="search-wrap">
  <span class="search-icon" aria-hidden="true">⌕</span>
  <input id="snippet-search" class="search" type="search" placeholder="${escapeHtml(placeholder)}" aria-label="Search snippets" />
</div>`;
}

function renderPrefixPill(prefix) {
  return `<button type="button" class="prefix-pill" data-copy-prefix data-prefix="${escapeHtml(prefix)}" title="Copy prefix to clipboard">
  <code>${escapeHtml(prefix)}</code>
  <span data-copy-label>Copy</span>
</button>`;
}

/**
 * @param {{
 *   pageTitle: string,
 *   description?: string,
 *   canonicalPath?: string,
 *   active?: string,
 *   content: string,
 * }} options
 */
function renderPage({
  pageTitle,
  description = "",
  canonicalPath = "/",
  active = "home",
  content,
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead(canonicalPath, pageTitle, description)}
</head>
<body>
  ${renderTopbar(active)}
  <main class="container">
    ${content}
    ${renderFooter()}
  </main>
  <script src="${PAGES_BASE}/assets/snippets.js" defer></script>
</body>
</html>`;
}

/**
 * @param {import("../snippets/catalog/index.js").SnippetCatalogEntry[]} catalog
 */
function buildLanguagePages(catalog) {
  /** @type {Record<string, import("../snippets/catalog/index.js").SnippetCatalogEntry[]>} */
  const byLanguage = Object.fromEntries(
    SNIPPET_LANGUAGES.map(({ language }) => [language, []]),
  );

  for (const entry of catalog) {
    for (const language of entry.languages) {
      byLanguage[language]?.push(entry);
    }
  }

  /** @type {string[]} */
  const files = [];

  for (const { language } of SNIPPET_LANGUAGES) {
    const meta = LANGUAGE_META[language];
    const entries = byLanguage[language].sort((a, b) => {
      const category = a.category.localeCompare(b.category);
      if (category !== 0) {
        return category;
      }
      return a.description.localeCompare(b.description);
    });

    /** @type {Map<string, typeof entries>} */
    const byCategory = new Map();
    for (const entry of entries) {
      const list = byCategory.get(entry.category) ?? [];
      list.push(entry);
      byCategory.set(entry.category, list);
    }

    const categorySections = [...byCategory.entries()]
      .map(([category, items]) => {
        const snippets = items
          .map((entry) => {
            const resolved = resolveSnippetForLanguage(entry, language);
            const code = formatBodyForDocs(resolved.body);
            const search = [
              resolved.prefix,
              resolved.description,
              entry.category,
              entry.key,
            ]
              .join(" ")
              .toLowerCase();

            return `<article class="snippet" data-search="${escapeHtml(search)}">
  <div class="snippet-head">
    <h4>${escapeHtml(resolved.description)}</h4>
    <div class="snippet-meta">
      ${renderPrefixPill(resolved.prefix)}
      <span class="tag">${escapeHtml(entry.category)}</span>
    </div>
  </div>
  <pre><code>${escapeHtml(code)}</code></pre>
</article>`;
          })
          .join("\n");

        return `<section class="category">
  <h3>${escapeHtml(category)} <span style="color:var(--muted);font-weight:400">(${items.length})</span></h3>
  <div class="snippet-list">${snippets}</div>
</section>`;
      })
      .join("\n");

    const html = renderPage({
      pageTitle: `${meta.label} Snippets · Ether Themes — ${entries.length} Prefixes`,
      description: `Browse ${entries.length} ${meta.label} snippets for ${meta.extensions}. React, Next.js, TypeScript, testing, and more — type a prefix and press Tab in VS Code or Cursor.`,
      canonicalPath: `/${meta.slug}.html`,
      active: language,
      content: `<section class="hero">
  <span class="hero-eyebrow">${escapeHtml(meta.label)}</span>
  <h1>${escapeHtml(meta.label)} snippet catalog</h1>
  <p><strong>${entries.length}</strong> snippets for <strong>${escapeHtml(meta.extensions)}</strong> files. Search below, copy a prefix, type it in your editor, and press <strong>Tab</strong> to expand.</p>
  <div class="stats">
    <div class="stat"><strong>${entries.length}</strong><span>snippets</span></div>
    <div class="stat"><strong>${byCategory.size}</strong><span>categories</span></div>
  </div>
</section>
${renderSearchInput(`Search ${meta.label} snippets by prefix or description…`)}
<p id="search-empty" class="empty-state hidden">No snippets match your search.</p>
${categorySections}`,
    });

    const fileName = `${meta.slug}.html`;
    writeFileSync(join(siteDir, fileName), html, "utf8");
    files.push(fileName);
  }

  return files;
}

/**
 * @param {import("../snippets/catalog/index.js").SnippetCatalogEntry[]} catalog
 */
function buildIndexPage(catalog) {
  const total = catalog.length;
  const categories = new Set(catalog.map((entry) => entry.category)).size;

  const languageCards = SNIPPET_LANGUAGES.map(({ language }) => {
    const meta = LANGUAGE_META[language];
    const count = catalog.filter((entry) => entry.languages.includes(language)).length;
    return `<article class="card">
  <h2>${escapeHtml(meta.label)}</h2>
  <p>${count} snippets · ${escapeHtml(meta.extensions)}</p>
  <a class="button" href="${PAGES_BASE}/${meta.slug}.html">Browse ${escapeHtml(meta.label)}</a>
</article>`;
  }).join("\n");

  const tableRows = catalog
    .flatMap((entry) =>
      entry.languages.map((language) => {
        const resolved = resolveSnippetForLanguage(entry, language);
        const search = [
          resolved.prefix,
          resolved.description,
          entry.category,
          LANGUAGE_META[language].label,
          entry.key,
        ]
          .join(" ")
          .toLowerCase();

        return `<tr data-search="${escapeHtml(search)}">
  <td><code class="snippet-prefix">${escapeHtml(resolved.prefix)}</code></td>
  <td>${escapeHtml(resolved.description)}</td>
  <td>${escapeHtml(entry.category)}</td>
  <td><a href="${PAGES_BASE}/${LANGUAGE_META[language].slug}.html">${escapeHtml(LANGUAGE_META[language].label)}</a></td>
</tr>`;
      }),
    )
    .join("\n");

  const html = renderPage({
    pageTitle: "Ether Snippet Catalog — 496 VS Code & Cursor Snippets",
    description: `Searchable reference for all ${total} Ether Themes snippets — React 19, Next.js, TypeScript, TanStack Query, Zod, Vitest, HTML, and CSS prefixes for VS Code and Cursor.`,
    canonicalPath: "/",
    active: "home",
    content: `<section class="hero">
  <span class="hero-eyebrow">Ether Themes</span>
  <h1>Complete snippet catalog</h1>
  <p><strong>${total}</strong> production-ready templates across six editor scopes. Install the extension, type a <em>prefix</em> in a matching file, and press <strong>Tab</strong> to expand.</p>
  <div class="cta-row">
    <a class="cta cta-primary" href="${VS_MARKETPLACE}">Install on VS Code</a>
    <a class="cta" href="${OPEN_VSX}">Install on Cursor</a>
    <a class="cta" href="${GITHUB_REPO}">View on GitHub</a>
  </div>
  <div class="stats">
    <div class="stat"><strong>${total}</strong><span>snippets</span></div>
    <div class="stat"><strong>${categories}</strong><span>categories</span></div>
    <div class="stat"><strong>6</strong><span>languages</span></div>
  </div>
</section>

<section class="section howto">
  <h2>How to use snippets</h2>
  <ol>
    <li>Install <strong>Ether Themes</strong> from the VS Code Marketplace or Open VSX (Cursor).</li>
    <li>Open a supported file — for example <code>.tsx</code> for React TSX snippets.</li>
    <li>Type a prefix such as <code>rfc</code> or <code>usestate</code>.</li>
    <li>Select the snippet from IntelliSense or press <strong>Tab</strong>.</li>
    <li>Tab through placeholders; <code>█</code> in previews marks the final cursor position.</li>
  </ol>
</section>

<section class="section">
  <h2>Browse by language</h2>
  <div class="grid">${languageCards}</div>
</section>

<section class="section">
  <h2>Search all snippets</h2>
  ${renderSearchInput("Search by prefix, description, category, or language…")}
  <p id="search-empty" class="empty-state hidden">No snippets match your search.</p>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Prefix</th><th>Description</th><th>Category</th><th>Language</th></tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  </div>
</section>`,
  });

  writeFileSync(join(siteDir, "index.html"), html, "utf8");
}

/**
 * @param {string} [outputDir]
 */
function writeSiteRedirect() {
  const pageTitle = "Ether Snippet Catalog — 496 VS Code & Cursor Snippets";
  const description =
    "Redirecting to the Ether Themes snippet reference — 496 searchable prefixes for VS Code and Cursor.";
  const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead("/", pageTitle, description)}
  <meta http-equiv="refresh" content="0; url=${PAGES_BASE}/" />
</head>
<body class="redirect-page">
  <main class="redirect-card">
    <img src="${PAGES_BASE}/assets/icon.png" width="64" height="64" alt="" />
    <h1>Snippet Documentation</h1>
    <p>496 searchable snippets for VS Code and Cursor.</p>
    <p><a class="cta cta-primary" href="${PAGES_BASE}/">Open snippet catalog</a></p>
    <p class="redirect-hint">Redirecting… <a href="${PAGES_BASE}/">Continue</a></p>
  </main>
</body>
</html>`;
  writeFileSync(join(siteRootDir, "index.html"), redirectHtml, "utf8");
  writeFileSync(join(siteRootDir, ".nojekyll"), "", "utf8");
}

/**
 * @param {string} [outputDir]
 */
export async function generateSnippetDocs(outputDir = siteDir) {
  rmSync(siteRootDir, { recursive: true, force: true });
  mkdirSync(join(outputDir, "assets"), { recursive: true });
  writeSiteRedirect();

  writeFileSync(join(outputDir, "assets", "snippets.css"), `${STYLES.trim()}\n`, "utf8");
  writeFileSync(join(outputDir, "assets", "snippets.js"), `${SEARCH_SCRIPT.trim()}\n`, "utf8");
  copyFileSync(join(rootDir, "icon.png"), join(outputDir, "assets", "icon.png"));

  const catalog = await loadSnippetCatalogWithMeta();
  buildIndexPage(catalog);
  const languageFiles = buildLanguagePages(catalog);

  return {
    outputDir: siteRootDir,
    catalogCount: catalog.length,
    files: [
      "index.html",
      "snippets/index.html",
      ...languageFiles.map((file) => `snippets/${file}`),
      "snippets/assets/snippets.css",
      "snippets/assets/snippets.js",
      "snippets/assets/icon.png",
    ],
  };
}

const invokedDirectly =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const result = await generateSnippetDocs();
  console.log(`Generated snippet docs (${result.catalogCount} definitions):`);
  for (const file of result.files) {
    console.log(`  - ${join(result.outputDir, file)}`);
  }
}
