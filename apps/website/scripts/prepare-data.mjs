import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { writeFileIfChanged } from "../../../src/utils/fs.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeBrandAssets } from "../../../shared/brand-assets.mjs";
import { buildThemesData } from "../../../shared/site-theme-tokens.js";
import {
  LANGUAGE_META,
  resolveSnippetForLanguage,
} from "../../../shared/site-snippets.js";
import { buildSnippetSearchHaystack } from "../../../shared/snippet-search.js";
import { loadPalettes } from "../../../src/generator/index.js";
import { loadSnippetCatalogWithMeta } from "../../../src/snippets/catalog/index.js";
import { SNIPPET_LANGUAGES } from "../../../src/snippets/registry.js";
import { highlightSnippetForBuild } from "./highlight-snippet.mjs";

const websiteDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const rootDir = join(websiteDir, "../..");
const generatedDir = join(websiteDir, "src", "generated");
const publicDir = join(websiteDir, "public");
const previewsSource = join(rootDir, "docs", "previews");
const iconSource = join(rootDir, "icon.png");

export async function prepareWebsiteData() {
  const palettes = await loadPalettes();
  const catalog = await loadSnippetCatalogWithMeta();
  const themes = buildThemesData(palettes);
  const defaultTheme = themes["ether-dusk"];

  const paletteSummaries = palettes.map((palette) => ({
    id: palette.id,
    label: palette.label,
    preview: `/previews/${palette.id}.png`,
    accent: palette.ui.accent,
    shell: palette.ui.surfaceShell,
  }));

  const languages = SNIPPET_LANGUAGES.map(({ language }) => {
    const meta = LANGUAGE_META[language];
    const entries = catalog.filter((entry) =>
      entry.languages.includes(language),
    );
    const count = entries.length;
    const categoryCount = new Set(entries.map((entry) => entry.category)).size;
    return { ...meta, count, categoryCount };
  });

  const defaultThemePath = join(
    rootDir,
    "themes",
    "ether-dusk.color-theme.json",
  );

  const snippetIndex = catalog.flatMap((entry) =>
    entry.languages.map((language) => {
      const resolved = resolveSnippetForLanguage(entry, language);
      const meta = LANGUAGE_META[language];
      return {
        key: entry.key,
        category: entry.category,
        language,
        languageLabel: meta.label,
        languageSlug: meta.slug,
        prefix: resolved.prefix,
        description: resolved.description,
        search: buildSnippetSearchHaystack(resolved, entry, meta),
      };
    }),
  );

  const snippetsBySlug = new Map();
  for (const { language } of SNIPPET_LANGUAGES) {
    const meta = LANGUAGE_META[language];
    const entries = catalog.filter((entry) =>
      entry.languages.includes(language),
    );
    const snippets = [];

    for (const entry of entries) {
      const resolved = resolveSnippetForLanguage(entry, language);
      const defaultHtml = await highlightSnippetForBuild(
        resolved.body,
        language,
        defaultThemePath,
      );
      snippets.push({
        key: entry.key,
        category: entry.category,
        language,
        prefix: resolved.prefix,
        description: resolved.description,
        body: resolved.body,
        search: buildSnippetSearchHaystack(resolved, entry, meta),
        defaultHtml,
      });
    }

    snippetsBySlug.set(meta.slug, {
      slug: meta.slug,
      language,
      snippets,
    });
  }

  const categories = [
    ...new Set(catalog.map((entry) => entry.category)),
  ].sort();

  rmSync(publicDir, { recursive: true, force: true });
  mkdirSync(join(publicDir, "previews"), { recursive: true });
  const assetsDir = join(publicDir, "assets");
  mkdirSync(assetsDir, { recursive: true });
  const snippetDataDir = join(publicDir, "data", "snippets");
  mkdirSync(snippetDataDir, { recursive: true });
  const themeDataDir = join(publicDir, "data", "themes");
  mkdirSync(themeDataDir, { recursive: true });

  const snippetIndexPath = join(publicDir, "data", "snippet-index.json");
  writeFileSync(
    snippetIndexPath,
    `${JSON.stringify(snippetIndex)}\n`,
    "utf8",
  );

  for (const [themeId, theme] of Object.entries(themes)) {
    writeFileSync(
      join(themeDataDir, `${themeId}.json`),
      `${JSON.stringify(theme)}\n`,
      "utf8",
    );
  }

  for (const bundle of snippetsBySlug.values()) {
    writeFileSync(
      join(snippetDataDir, `${bundle.slug}.json`),
      `${JSON.stringify(bundle)}\n`,
      "utf8",
    );
  }

  for (const file of readdirSync(previewsSource).filter((name) =>
    name.endsWith(".png"),
  )) {
    copyFileSync(join(previewsSource, file), join(publicDir, "previews", file));
  }
  await writeBrandAssets(iconSource, assetsDir);

  mkdirSync(generatedDir, { recursive: true });
  const payload = {
    paletteCount: palettes.length,
    catalogCount: catalog.length,
    categoryCount: categories.length,
    palettes: paletteSummaries,
    themes,
    defaultTheme,
    languages,
    categories,
    defaultThemeId: "ether-dusk",
  };

  writeFileIfChanged(
    join(generatedDir, "site-data.ts"),
    `/* eslint-disable */\n/** Generated by apps/website/scripts/prepare-data.mjs — do not edit */\nexport const SITE_DATA = ${JSON.stringify(payload, null, 2)} as const;\nexport type SiteData = typeof SITE_DATA;\n`,
    "utf8",
  );

  return payload;
}

const invokedDirectly =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (invokedDirectly) {
  const result = await prepareWebsiteData();
  console.log(
    `Prepared website data (${result.paletteCount} themes, ${result.catalogCount} snippets)`,
  );
}
