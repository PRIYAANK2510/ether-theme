import { SITE_DATA } from "@/generated/site-data";
import {
  buildHighlightCacheKey,
  enqueueHighlight,
  getCachedHighlight,
} from "@/lib/highlight-cache";
import {
  highlightSnippetParts,
  resolveShikiLanguage,
  wrapSnippetHighlightHtml,
} from "@shared/snippet-highlight.js";
import type { HighlighterCore, LanguageInput } from "shiki/core";

const LANG_IMPORTERS: Record<
  string,
  () => Promise<{ default: LanguageInput }>
> = {
  javascript: () => import("@shikijs/langs/javascript"),
  typescript: () => import("@shikijs/langs/typescript"),
  jsx: () => import("@shikijs/langs/jsx"),
  tsx: () => import("@shikijs/langs/tsx"),
  html: () => import("@shikijs/langs/html"),
  css: () => import("@shikijs/langs/css"),
};

const themeModules = import.meta.glob(
  "../../../../themes/ether-*.color-theme.json",
) as Record<string, () => Promise<{ default: { name: string } }>>;

let corePromise: Promise<{
  createHighlighterCore: typeof import("shiki/core").createHighlighterCore;
  createJavaScriptRegexEngine: typeof import("shiki/engine/javascript").createJavaScriptRegexEngine;
}> | null = null;

let highlighterPromise: Promise<HighlighterCore> | null = null;
let loadedThemeId: string | null = null;
let loadedThemeName: string | null = null;
const loadedLangs = new Set<string>();

async function loadShikiCore() {
  if (!corePromise) {
    corePromise = Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
    ]).then(([core, engine]) => ({
      createHighlighterCore: core.createHighlighterCore,
      createJavaScriptRegexEngine: engine.createJavaScriptRegexEngine,
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

async function ensureLanguage(
  highlighter: HighlighterCore,
  shikiLang: string,
) {
  if (loadedLangs.has(shikiLang)) return;

  const importer = LANG_IMPORTERS[shikiLang];
  if (!importer) return;

  const mod = await importer();
  await highlighter.loadLanguage(mod.default);
  loadedLangs.add(shikiLang);
}

async function getHighlighter() {
  if (!highlighterPromise) {
    const [
      { createHighlighterCore, createJavaScriptRegexEngine },
      defaultTheme,
    ] = await Promise.all([
      loadShikiCore(),
      loadThemeJson(SITE_DATA.defaultThemeId),
    ]);

    highlighterPromise = createHighlighterCore({
      themes: [defaultTheme],
      langs: [],
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
  const shikiLang = resolveShikiLanguage(language);
  const { highlighter, themeName } = await ensureTheme(themeId);
  await ensureLanguage(highlighter, shikiLang);

  const inner = highlightSnippetParts(
    code,
    language,
    highlighter,
    themeName,
  );
  return wrapSnippetHighlightHtml(inner);
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
