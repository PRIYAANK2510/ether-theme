import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  buildHomePage,
  buildThemesPage,
  copyThemePreviews,
  loadPalettesForSite,
  writeSiteScript,
} from "./product-pages.js";
import {
  buildSnippetPages,
  loadSnippetCatalog,
} from "./snippet-pages.js";
import {
  siteRootDir,
  writeBrandAssets,
  writeSiteStyles,
} from "./site-layout.js";

const assetsDir = join(siteRootDir, "assets");
const snippetsDir = join(siteRootDir, "snippets");

export async function generateSite() {
  rmSync(siteRootDir, { recursive: true, force: true });
  mkdirSync(assetsDir, { recursive: true });
  mkdirSync(snippetsDir, { recursive: true });

  await writeBrandAssets(assetsDir);
  writeSiteStyles(assetsDir);
  writeSiteScript();
  const previewCount = copyThemePreviews();

  const [palettes, catalog] = await Promise.all([
    loadPalettesForSite(),
    loadSnippetCatalog(),
  ]);

  buildHomePage(palettes, catalog.length);
  buildThemesPage(palettes);
  const languageFiles = buildSnippetPages(catalog);

  writeFileSync(join(siteRootDir, ".nojekyll"), "", "utf8");

  return {
    outputDir: siteRootDir,
    paletteCount: palettes.length,
    previewCount,
    catalogCount: catalog.length,
    files: [
      "index.html",
      "themes/index.html",
      "snippets/index.html",
      ...languageFiles.map((file) => `snippets/${file}`),
      "assets/site.css",
      "assets/site.js",
      "assets/favicon-16.png",
      "assets/favicon-32.png",
      "assets/apple-touch-icon.png",
      "assets/logo.png",
      `assets/previews/ (${previewCount} images)`,
      "favicon.png",
      ".nojekyll",
    ],
  };
}

/** @deprecated Use generateSite */
export const generateSnippetDocs = generateSite;

const invokedDirectly =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const result = await generateSite();
  console.log(
    `Generated Ether site (${result.paletteCount} themes, ${result.catalogCount} snippets):`,
  );
  for (const file of result.files) {
    console.log(`  - ${join(result.outputDir, file)}`);
  }
}
