import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadSnippetCatalogWithMeta } from "../snippets/catalog/index.js";
import { SNIPPET_LANGUAGES } from "../snippets/registry.js";
import { SNIPPETS_BASE } from "./site-config.js";
import {
  escapeHtml,
  renderPage,
  renderPrefixPill,
  renderSearchInput,
  renderSubnav,
  siteRootDir,
} from "./site-layout.js";

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

const snippetsDir = join(siteRootDir, "snippets");

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

function snippetSubnav(active) {
  const items = [
    { id: "home", href: `${SNIPPETS_BASE}/`, label: "All snippets" },
    ...SNIPPET_LANGUAGES.map(({ language }) => ({
      id: language,
      href: `${SNIPPETS_BASE}/${LANGUAGE_META[language].slug}.html`,
      label: LANGUAGE_META[language].label,
    })),
  ];
  return renderSubnav(active, items);
}

/**
 * @param {import("../snippets/catalog/index.js").SnippetCatalogEntry[]} catalog
 * @param {import("../utils/color.js").Palette[]} palettes
 */
function buildLanguagePages(catalog, palettes) {
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
      description: `Browse ${entries.length} ${meta.label} snippets for ${meta.extensions}. React, Next.js, TypeScript, testing, and more.`,
      canonicalPath: `snippets/${meta.slug}.html`,
      active: "snippets",
      palettes,
      subnav: snippetSubnav(language),
      content: `<header class="page-header">
  <h1>${escapeHtml(meta.label)} snippets</h1>
  <p><strong>${entries.length}</strong> prefixes for <strong>${escapeHtml(meta.extensions)}</strong> · ${byCategory.size} categories</p>
</header>
${renderSearchInput("snippet-search", `Search ${meta.label} snippets…`)}
<p id="search-empty" class="empty-state hidden">No snippets match your search.</p>
${categorySections}`,
    });

    const fileName = `${meta.slug}.html`;
    writeFileSync(join(snippetsDir, fileName), html, "utf8");
    files.push(fileName);
  }

  return files;
}

/**
 * @param {import("../snippets/catalog/index.js").SnippetCatalogEntry[]} catalog
 */
/**
 * @param {import("../snippets/catalog/index.js").SnippetCatalogEntry[]} catalog
 * @param {import("../utils/color.js").Palette[]} palettes
 */
function buildSnippetIndex(catalog, palettes) {
  const total = catalog.length;
  const categories = new Set(catalog.map((entry) => entry.category)).size;

  const languageCards = SNIPPET_LANGUAGES.map(({ language }) => {
    const meta = LANGUAGE_META[language];
    const count = catalog.filter((entry) => entry.languages.includes(language)).length;
    return `<article class="card">
  <h2>${escapeHtml(meta.label)}</h2>
  <p>${count} snippets · ${escapeHtml(meta.extensions)}</p>
  <a class="button" href="${SNIPPETS_BASE}/${meta.slug}.html">Browse ${escapeHtml(meta.label)}</a>
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
  <td><a href="${SNIPPETS_BASE}/${LANGUAGE_META[language].slug}.html">${escapeHtml(LANGUAGE_META[language].label)}</a></td>
</tr>`;
      }),
    )
    .join("\n");

  const html = renderPage({
    pageTitle: `Ether Snippets — ${total} VS Code & Cursor Prefixes`,
    description: `Searchable reference for all ${total} Ether Themes snippets — React, Next.js, TypeScript, HTML, CSS, and more.`,
    canonicalPath: "snippets/",
    active: "snippets",
    palettes,
    subnav: snippetSubnav("home"),
    content: `<header class="page-header">
  <h1>Snippet catalog</h1>
  <p><strong>${total}</strong> snippets across <strong>${categories}</strong> categories and six editor scopes.</p>
</header>

<section class="section" style="margin-top:0">
  <h2>Browse by language</h2>
  <div class="grid">${languageCards}</div>
</section>

<section class="section">
  <h2>Search all snippets</h2>
  ${renderSearchInput("snippet-search", "Search by prefix, description, category, or language…")}
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

  writeFileSync(join(snippetsDir, "index.html"), html, "utf8");
}

/**
 * @param {import("../snippets/catalog/index.js").SnippetCatalogEntry[]} catalog
 */
/**
 * @param {import("../snippets/catalog/index.js").SnippetCatalogEntry[]} catalog
 * @param {import("../utils/color.js").Palette[]} palettes
 */
export function buildSnippetPages(catalog, palettes) {
  buildSnippetIndex(catalog, palettes);
  return buildLanguagePages(catalog, palettes);
}

export async function loadSnippetCatalog() {
  return loadSnippetCatalogWithMeta();
}
