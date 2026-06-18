import { escapeHtml } from "./html.js";
import { splitSnippetForHighlight } from "./snippet-display.js";

/** @type {Record<string, string>} */
export const SNIPPET_LANGUAGE_MAP = {
  javascript: "javascript",
  typescript: "typescript",
  javascriptreact: "jsx",
  typescriptreact: "tsx",
  html: "html",
  css: "css",
};

/**
 * @param {string} language VS Code snippet language id
 * @returns {string} Shiki language id
 */
export function resolveShikiLanguage(language) {
  return SNIPPET_LANGUAGE_MAP[language] ?? "javascript";
}

/** @param {string} part */
export function isSnippetPlaceholder(part) {
  return part.startsWith("${") && part.endsWith("}");
}

/** @param {string} part */
export function renderSnippetPlaceholderToken(part) {
  if (!isSnippetPlaceholder(part)) return null;
  return `<span class="snippet-placeholder">${escapeHtml(part)}</span>`;
}

/** @param {string} html */
export function extractShikiCodeInner(html) {
  const match = html.match(/<code[^>]*>([\s\S]*)<\/code>/);
  return match?.[1] ?? escapeHtml(html);
}

/**
 * Highlight snippet body segments with Shiki, preserving `${tab}` placeholders.
 *
 * @param {string} code
 * @param {string} language VS Code snippet language id
 * @param {{
 *   codeToHtml: (code: string, options: { lang: string, theme: string }) => string,
 * }} highlighter
 * @param {string} themeName
 * @returns {string} Inner HTML for `<code>` (without wrapper)
 */
export function highlightSnippetParts(code, language, highlighter, themeName) {
  const shikiLang = resolveShikiLanguage(language);

  return splitSnippetForHighlight(code)
    .map((part) => {
      if (!part) return "";
      const placeholder = renderSnippetPlaceholderToken(part);
      if (placeholder) return placeholder;

      const inner = highlighter.codeToHtml(part, {
        lang: shikiLang,
        theme: themeName,
      });
      return extractShikiCodeInner(inner);
    })
    .join("");
}

/**
 * @param {string} codeInner
 * @returns {string}
 */
export function wrapSnippetHighlightHtml(codeInner) {
  return `<pre class="shiki ether-snippet-shiki"><code>${codeInner}</code></pre>`;
}
