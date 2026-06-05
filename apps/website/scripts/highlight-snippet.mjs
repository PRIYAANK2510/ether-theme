import { readFileSync } from "node:fs";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import javascript from "@shikijs/langs/javascript";
import typescript from "@shikijs/langs/typescript";
import jsx from "@shikijs/langs/jsx";
import tsx from "@shikijs/langs/tsx";
import html from "@shikijs/langs/html";
import css from "@shikijs/langs/css";

const LANGUAGE_MAP = {
  javascript: "javascript",
  typescript: "typescript",
  javascriptreact: "jsx",
  typescriptreact: "tsx",
  html: "html",
  css: "css",
};

import { splitSnippetForHighlight } from "../../../shared/snippet-display.js";

/** @type {Promise<import('shiki').HighlighterCore> | null} */
let highlighterPromise = null;
/** @type {string | null} */
let themeName = null;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function isPlaceholder(part) {
  return part.startsWith("${") && part.endsWith("}");
}

function renderSnippetToken(part) {
  if (isPlaceholder(part)) {
    return `<span class="snippet-placeholder">${escapeHtml(part)}</span>`;
  }
  return null;
}

function extractShikiCodeInner(html) {
  const match = html.match(/<code[^>]*>([\s\S]*)<\/code>/);
  return match?.[1] ?? escapeHtml(html);
}

/**
 * @param {string} themePath
 */
async function getHighlighter(themePath) {
  if (!highlighterPromise) {
    const themeJson = JSON.parse(readFileSync(themePath, "utf8"));
    themeName = themeJson.name;
    highlighterPromise = createHighlighterCore({
      themes: [themeJson],
      langs: [javascript, typescript, jsx, tsx, html, css],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

/**
 * @param {string} code
 * @param {string} language
 * @param {string} themePath
 */
export async function highlightSnippetForBuild(code, language, themePath) {
  const shikiLang = LANGUAGE_MAP[language] ?? "javascript";
  const highlighter = await getHighlighter(themePath);

  const highlighted = splitSnippetForHighlight(code).map((part) => {
    if (!part) return "";
    const token = renderSnippetToken(part);
    if (token) return token;
    const inner = highlighter.codeToHtml(part, {
      lang: shikiLang,
      theme: themeName,
    });
    return extractShikiCodeInner(inner);
  });

  return `<pre class="shiki ether-snippet-shiki"><code>${highlighted.join("")}</code></pre>`;
}
