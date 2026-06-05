import type { HighlighterCore, LanguageInput } from "shiki/core";
import { SITE_DATA } from "@/generated/site-data";
import {
  buildHighlightCacheKey,
  enqueueHighlight,
  getCachedHighlight,
} from "@/lib/highlight-cache";

const LANGUAGE_MAP = {
  javascript: "javascript",
  typescript: "typescript",
  javascriptreact: "jsx",
  typescriptreact: "tsx",
  html: "html",
  css: "css",
} as const;

type ShikiLanguage = (typeof LANGUAGE_MAP)[keyof typeof LANGUAGE_MAP];

import { splitSnippetForHighlight } from "../../../../shared/snippet-display.js";

const themeModules = import.meta.glob(
  "../../../../themes/ether-*.color-theme.json",
) as Record<string, () => Promise<{ default: { name: string } }>>;

let corePromise: Promise<{
  createHighlighterCore: typeof import("shiki/core").createHighlighterCore;
  createJavaScriptRegexEngine: typeof import("shiki/engine/javascript").createJavaScriptRegexEngine;
  langs: Record<ShikiLanguage, () => Promise<LanguageInput>>;
}> | null = null;

let highlighterPromise: Promise<HighlighterCore> | null = null;
let loadedThemeId: string | null = null;
let loadedThemeName: string | null = null;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function isPlaceholder(part: string) {
  return part.startsWith("${") && part.endsWith("}");
}

function renderSnippetToken(part: string) {
  if (isPlaceholder(part)) {
    return `<span class="snippet-placeholder">${escapeHtml(part)}</span>`;
  }
  return null;
}

function extractShikiCodeInner(html: string) {
  const match = html.match(/<code[^>]*>([\s\S]*)<\/code>/);
  return match?.[1] ?? escapeHtml(html);
}

async function loadShikiCore() {
  if (!corePromise) {
    corePromise = Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
      import("@shikijs/langs/javascript"),
      import("@shikijs/langs/typescript"),
      import("@shikijs/langs/jsx"),
      import("@shikijs/langs/tsx"),
      import("@shikijs/langs/html"),
      import("@shikijs/langs/css"),
    ]).then(([core, engine, javascript, typescript, jsx, tsx, html, css]) => ({
      createHighlighterCore: core.createHighlighterCore,
      createJavaScriptRegexEngine: engine.createJavaScriptRegexEngine,
      langs: {
        javascript: () => Promise.resolve(javascript.default as LanguageInput),
        typescript: () => Promise.resolve(typescript.default as LanguageInput),
        jsx: () => Promise.resolve(jsx.default as LanguageInput),
        tsx: () => Promise.resolve(tsx.default as LanguageInput),
        html: () => Promise.resolve(html.default as LanguageInput),
        css: () => Promise.resolve(css.default as LanguageInput),
      },
    }));
  }
  return corePromise;
}

async function loadThemeJson(themeId: string) {
  const path = `../../../../themes/${themeId}.color-theme.json`;
  const importer = themeModules[path];
  if (!importer) {
    throw new Error(`Missing Ether theme JSON for "${themeId}"`);
  }
  return (await importer()).default;
}

async function getHighlighter() {
  if (!highlighterPromise) {
    const [
      { createHighlighterCore, createJavaScriptRegexEngine, langs },
      defaultTheme,
    ] = await Promise.all([
      loadShikiCore(),
      loadThemeJson(SITE_DATA.defaultThemeId),
    ]);

    highlighterPromise = createHighlighterCore({
      themes: [defaultTheme],
      langs: [
        await langs.javascript(),
        await langs.typescript(),
        await langs.jsx(),
        await langs.tsx(),
        await langs.html(),
        await langs.css(),
      ],
      engine: createJavaScriptRegexEngine(),
    });
    loadedThemeId = SITE_DATA.defaultThemeId;
    loadedThemeName = defaultTheme.name;
  }
  return highlighterPromise;
}

async function ensureTheme(themeId: string) {
  const highlighter = await getHighlighter();
  if (loadedThemeId === themeId && loadedThemeName) {
    return { highlighter, themeName: loadedThemeName };
  }

  const theme = await loadThemeJson(themeId);
  if (!highlighter.getLoadedThemes().includes(theme.name)) {
    await highlighter.loadTheme(theme);
  }

  loadedThemeId = themeId;
  loadedThemeName = theme.name;
  return { highlighter, themeName: theme.name };
}

async function renderHighlightedCode(
  code: string,
  language: string,
  themeId: string,
) {
  const shikiLang =
    LANGUAGE_MAP[language as keyof typeof LANGUAGE_MAP] ?? "javascript";
  const { highlighter, themeName } = await ensureTheme(themeId);

  const highlighted = splitSnippetForHighlight(code).map((part: string) => {
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

/**
 * Highlight snippet source with the active Ether VS Code theme (TextMate scopes).
 */
export function highlightSnippetCode(
  code: string,
  language: string,
  themeId: string,
) {
  const cacheKey = buildHighlightCacheKey(themeId, language, code);
  const cached = getCachedHighlight(cacheKey);
  if (cached) return Promise.resolve(cached);

  return enqueueHighlight(cacheKey, () =>
    renderHighlightedCode(code, language, themeId),
  );
}

export function isDefaultHighlightTheme(themeId: string) {
  return themeId === SITE_DATA.defaultThemeId;
}
