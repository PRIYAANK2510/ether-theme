import { copyFileSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { loadPalettes } from "../../src/generator/index.js";
import { THEME_CHARACTER } from "../../src/generator/preview-svg/theme-character.js";
import { buildThemesData } from "../../src/docs/site-theme-tokens.js";
import { loadSnippetCatalogWithMeta } from "../../src/snippets/catalog/index.js";
import { SNIPPET_LANGUAGES } from "../../src/snippets/registry.js";

const webDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const rootDir = join(webDir, "..");
const generatedDir = join(webDir, "src", "generated");
const publicDir = join(webDir, "public");
const previewsSource = join(rootDir, "docs", "previews");
const iconSource = join(rootDir, "icon.png");

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
function normalizeBody(body) {
  return Array.isArray(body) ? body.join("\n") : body;
}

/**
 * @param {string} body
 */
function formatBodyForDocs(body) {
  return body
    .replace(/\$\{(\d+)(?::([^}]*))?\}/g, (_, index, placeholder) => {
      if (placeholder) return placeholder;
      return index === "0" ? "█" : `⟨${index}⟩`;
    })
    .replace(/\$(\d+)/g, (_, index) => (index === "0" ? "█" : `⟨${index}⟩`));
}

/**
 * @param {import("../../src/snippets/validate.js").SnippetDefinition} snippet
 * @param {string} language
 */
function resolveSnippetForLanguage(snippet, language) {
  const variant = snippet.variants?.[language] ?? {};
  return {
    prefix: variant.prefix ?? snippet.prefix,
    description: variant.description ?? snippet.description,
    body: formatBodyForDocs(normalizeBody(variant.body ?? snippet.body)),
  };
}

async function writeBrandAssets(assetsDir) {
  const sizes = [
    { name: "favicon-16.png", size: 16 },
    { name: "favicon-32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "logo.png", size: 128 },
  ];
  await Promise.all(
    sizes.map(({ name, size }) =>
      sharp(iconSource)
        .resize(size, size, { fit: "contain", background: "#000000" })
        .png()
        .toFile(join(assetsDir, name)),
    ),
  );
  copyFileSync(join(assetsDir, "favicon-32.png"), join(assetsDir, "favicon.png"));
}

export async function prepareWebsiteData() {
  const palettes = await loadPalettes();
  const catalog = await loadSnippetCatalogWithMeta();
  const themes = buildThemesData(palettes);

  const paletteSummaries = palettes.map((palette) => ({
    id: palette.id,
    label: palette.label,
    character: THEME_CHARACTER[palette.id] ?? "",
    preview: `/previews/${palette.id}.png`,
    accent: palette.ui.accent,
    shell: palette.ui.surfaceShell,
  }));

  const languages = SNIPPET_LANGUAGES.map(({ language }) => {
    const meta = LANGUAGE_META[language];
    const count = catalog.filter((entry) => entry.languages.includes(language)).length;
    return { ...meta, count };
  });

  const snippets = catalog.flatMap((entry) =>
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
        body: resolved.body,
        search: [
          resolved.prefix,
          resolved.description,
          entry.category,
          meta.label,
          entry.key,
        ]
          .join(" ")
          .toLowerCase(),
      };
    }),
  );

  const categories = [...new Set(catalog.map((entry) => entry.category))].sort();

  rmSync(publicDir, { recursive: true, force: true });
  mkdirSync(join(publicDir, "previews"), { recursive: true });
  const assetsDir = join(publicDir, "assets");
  mkdirSync(assetsDir, { recursive: true });

  for (const file of readdirSync(previewsSource).filter((name) => name.endsWith(".png"))) {
    copyFileSync(join(previewsSource, file), join(publicDir, "previews", file));
  }
  await writeBrandAssets(assetsDir);

  mkdirSync(generatedDir, { recursive: true });
  const payload = {
    paletteCount: palettes.length,
    catalogCount: catalog.length,
    categoryCount: categories.length,
    palettes: paletteSummaries,
    themes,
    languages,
    snippets,
    categories,
    defaultThemeId: "ether-dusk",
  };

  writeFileSync(
    join(generatedDir, "site-data.ts"),
    `/* eslint-disable */\n/** Generated by web/scripts/prepare-data.mjs — do not edit */\nexport const SITE_DATA = ${JSON.stringify(payload, null, 2)} as const;\nexport type SiteData = typeof SITE_DATA;\n`,
    "utf8",
  );

  return payload;
}

const invokedDirectly =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (invokedDirectly) {
  const result = await prepareWebsiteData();
  console.log(
    `Prepared website data (${result.paletteCount} themes, ${result.catalogCount} snippets)`,
  );
}
