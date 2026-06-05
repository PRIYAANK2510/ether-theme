import { mkdirSync, rmSync, writeFileSync } from "node:fs";
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
  --bg: #0b1220;
  --surface: #101828;
  --surface-2: #162033;
  --border: #243044;
  --text: #e8edf7;
  --muted: #9aa8be;
  --accent: #38bdf8;
  --accent-2: #22d3ee;
  --code-bg: #0a101c;
  --shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  --radius: 12px;
  --mono: "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace;
  --sans: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--sans);
  background: radial-gradient(1200px 600px at 10% -10%, #12203a 0%, var(--bg) 55%);
  color: var(--text);
  line-height: 1.55;
}
a { color: var(--accent); text-decoration: none; }
a:hover { color: var(--accent-2); text-decoration: underline; }
.container { max-width: 1120px; margin: 0 auto; padding: 32px 20px 80px; }
.site-header {
  display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between;
  margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border);
}
.brand { display: flex; flex-direction: column; gap: 4px; }
.brand strong { font-size: 1.35rem; letter-spacing: 0.02em; }
.brand span { color: var(--muted); font-size: 0.95rem; }
.nav { display: flex; flex-wrap: wrap; gap: 10px; }
.nav a {
  padding: 8px 12px; border-radius: 999px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text); font-size: 0.9rem;
}
.nav a.active { border-color: var(--accent); color: var(--accent); }
.hero {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(34, 211, 238, 0.05));
  border: 1px solid var(--border); border-radius: var(--radius); padding: 28px;
  box-shadow: var(--shadow); margin-bottom: 28px;
}
.hero h1 { margin: 0 0 10px; font-size: 2rem; }
.hero p { margin: 0; color: var(--muted); max-width: 70ch; }
.stats { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 18px; }
.stat {
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px;
  padding: 10px 14px; min-width: 120px;
}
.stat strong { display: block; font-size: 1.2rem; }
.stat span { color: var(--muted); font-size: 0.85rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 18px; box-shadow: var(--shadow);
}
.card h2 { margin: 0 0 8px; font-size: 1.1rem; }
.card p { margin: 0 0 14px; color: var(--muted); font-size: 0.92rem; }
.card a.button {
  display: inline-block; padding: 8px 12px; border-radius: 8px;
  background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.35);
}
.search {
  width: 100%; padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--border);
  background: var(--surface); color: var(--text); font-size: 1rem; margin-bottom: 20px;
}
.search:focus { outline: 2px solid rgba(56, 189, 248, 0.45); outline-offset: 2px; }
.section { margin-top: 36px; }
.section h2 { margin: 0 0 14px; font-size: 1.35rem; }
.howto ol { margin: 0; padding-left: 20px; color: var(--muted); }
.howto li { margin-bottom: 8px; }
.howto code, .snippet-prefix {
  font-family: var(--mono); background: var(--code-bg); border: 1px solid var(--border);
  border-radius: 6px; padding: 2px 6px; color: #c7e6ff;
}
.category { margin-top: 28px; }
.category h3 {
  margin: 0 0 12px; font-size: 1.05rem; color: var(--accent);
  padding-bottom: 8px; border-bottom: 1px solid var(--border);
}
.snippet-list { display: grid; gap: 14px; }
.snippet {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  overflow: hidden;
}
.snippet-head {
  display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; justify-content: space-between;
  padding: 14px 16px 10px; border-bottom: 1px solid var(--border);
}
.snippet-head h4 { margin: 0; font-size: 1rem; }
.snippet-meta { display: flex; flex-wrap: wrap; gap: 8px; color: var(--muted); font-size: 0.82rem; }
.snippet-meta .tag {
  border: 1px solid var(--border); border-radius: 999px; padding: 2px 8px;
  background: var(--surface-2);
}
pre {
  margin: 0; padding: 14px 16px; overflow-x: auto; background: var(--code-bg);
  font-family: var(--mono); font-size: 0.86rem; line-height: 1.5; color: #d7e3f4;
}
.table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius); }
table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
th, td { padding: 10px 12px; border-bottom: 1px solid var(--border); text-align: left; }
th { background: var(--surface-2); color: var(--muted); font-weight: 600; }
tr:hover td { background: rgba(56, 189, 248, 0.04); }
.footer { margin-top: 48px; color: var(--muted); font-size: 0.88rem; }
.hidden { display: none !important; }
@media (max-width: 640px) {
  .hero h1 { font-size: 1.55rem; }
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
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("snippet-search");
  if (!input) return;
  input.addEventListener("input", () => filterSnippets(input.value));
});
`;

/**
 * @param {{
 *   title: string,
 *   description?: string,
 *   active?: string,
 *   content: string,
 * }} options
 */
function renderPage({ title, description = "", active = "home", content }) {
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} · Ether Snippet Catalog</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="stylesheet" href="${PAGES_BASE}/assets/snippets.css" />
</head>
<body>
  <div class="container">
    <header class="site-header">
      <div class="brand">
        <strong>Ether Snippet Catalog</strong>
        <span>496 snippets for VS Code &amp; Cursor · type a prefix, press Tab</span>
      </div>
      <nav class="nav" aria-label="Snippet languages">${nav}</nav>
    </header>
    ${content}
    <footer class="footer">
      Generated from the Ether Themes extension catalog.
      <a href="https://github.com/PRIYAANK2510/ether-theme">Source on GitHub</a>
    </footer>
  </div>
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
      <span class="tag">prefix: <code class="snippet-prefix">${escapeHtml(resolved.prefix)}</code></span>
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
      title: meta.label,
      description: `${entries.length} Ether snippets for ${meta.label} (${meta.extensions})`,
      active: language,
      content: `<section class="hero">
  <h1>${escapeHtml(meta.label)}</h1>
  <p>${entries.length} snippets for <strong>${escapeHtml(meta.extensions)}</strong> files. Search by prefix or description, then type the prefix in your editor and press <strong>Tab</strong>.</p>
  <div class="stats">
    <div class="stat"><strong>${entries.length}</strong><span>snippets</span></div>
    <div class="stat"><strong>${byCategory.size}</strong><span>categories</span></div>
  </div>
</section>
<input id="snippet-search" class="search" type="search" placeholder="Search ${escapeHtml(meta.label)} snippets…" aria-label="Search snippets" />
<p id="search-empty" class="hidden" style="color:var(--muted)">No snippets match your search.</p>
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
    title: "Snippet Reference",
    description: `${total} production-ready VS Code snippets for React, Next.js, TypeScript, HTML, and CSS.`,
    active: "home",
    content: `<section class="hero">
  <h1>Snippet reference</h1>
  <p>Ether ships <strong>${total}</strong> production-ready templates across six editor language scopes. Install the extension, type a <em>prefix</em> in a matching file, and press <strong>Tab</strong> to expand.</p>
  <div class="stats">
    <div class="stat"><strong>${total}</strong><span>catalog definitions</span></div>
    <div class="stat"><strong>${categories}</strong><span>categories</span></div>
    <div class="stat"><strong>6</strong><span>language scopes</span></div>
  </div>
</section>

<section class="section howto">
  <h2>How to use</h2>
  <ol>
    <li>Install <strong>Ether Themes</strong> from VS Code Marketplace or Open VSX (Cursor).</li>
    <li>Open a supported file (for example <code>.tsx</code> for React TSX snippets).</li>
    <li>Type a prefix such as <code>rfc</code> or <code>usestate</code>.</li>
    <li>Pick the snippet from IntelliSense or press <strong>Tab</strong> when it is the top suggestion.</li>
    <li>Jump between placeholders with <strong>Tab</strong>; <code>█</code> in previews marks the final cursor stop.</li>
  </ol>
</section>

<section class="section">
  <h2>Browse by language</h2>
  <div class="grid">${languageCards}</div>
</section>

<section class="section">
  <h2>Full catalog</h2>
  <input id="snippet-search" class="search" type="search" placeholder="Search all snippets by prefix, description, or category…" aria-label="Search all snippets" />
  <p id="search-empty" class="hidden" style="color:var(--muted)">No snippets match your search.</p>
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
  const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=${PAGES_BASE}/" />
  <link rel="canonical" href="${PAGES_URL}" />
  <title>Ether Snippet Catalog</title>
</head>
<body>
  <p><a href="${PAGES_BASE}/">Ether Snippet Catalog</a> — all 496 snippets for VS Code &amp; Cursor.</p>
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
