/** @type {Record<string, { label: string, extensions: string, slug: string, language: string }>} */
export const LANGUAGE_META = {
  javascript: {
    label: "JavaScript",
    extensions: ".js, .mjs, .cjs",
    slug: "javascript",
    language: "javascript",
  },
  typescript: {
    label: "TypeScript",
    extensions: ".ts, .mts, .cts",
    slug: "typescript",
    language: "typescript",
  },
  javascriptreact: {
    label: "React (JSX)",
    extensions: ".jsx",
    slug: "react-jsx",
    language: "javascriptreact",
  },
  typescriptreact: {
    label: "React (TSX)",
    extensions: ".tsx",
    slug: "react-tsx",
    language: "typescriptreact",
  },
  html: {
    label: "HTML",
    extensions: ".html, .htm",
    slug: "html",
    language: "html",
  },
  css: {
    label: "CSS",
    extensions: ".css, .scss",
    slug: "css",
    language: "css",
  },
};

/**
 * @param {string | string[]} body
 */
export function normalizeSnippetBody(body) {
  return Array.isArray(body) ? body.join("\n") : body;
}

/**
 * @param {string} body
 */
export function formatSnippetBodyForDocs(body) {
  return body
    .replace(/\$\{(\d+)(?::([^}]*))?\}/g, (_, index, placeholder) => {
      if (placeholder) return placeholder;
      return index === "0" ? "█" : `⟨${index}⟩`;
    })
    .replace(/\$(\d+)/g, (_, index) => (index === "0" ? "█" : `⟨${index}⟩`));
}

/**
 * @param {import("../src/snippets/validate.js").SnippetDefinition} snippet
 * @param {string} language
 */
export function resolveSnippetForLanguage(snippet, language) {
  const variant = snippet.variants?.[language] ?? {};
  return {
    prefix: variant.prefix ?? snippet.prefix,
    description: variant.description ?? snippet.description,
    body: formatSnippetBodyForDocs(normalizeSnippetBody(variant.body ?? snippet.body)),
  };
}
