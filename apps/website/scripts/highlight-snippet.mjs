import { readFileSync } from "node:fs";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import javascript from "@shikijs/langs/javascript";
import typescript from "@shikijs/langs/typescript";
import jsx from "@shikijs/langs/jsx";
import tsx from "@shikijs/langs/tsx";
import html from "@shikijs/langs/html";
import css from "@shikijs/langs/css";
import {
  highlightSnippetParts,
  wrapSnippetHighlightHtml,
} from "../../../shared/snippet-highlight.js";

/** @type {Promise<import('shiki').HighlighterCore> | null} */
let highlighterPromise = null;
/** @type {string | null} */
let themeName = null;

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
  const highlighter = await getHighlighter(themePath);
  const inner = highlightSnippetParts(
    code,
    language,
    highlighter,
    themeName,
  );
  return wrapSnippetHighlightHtml(inner);
}
