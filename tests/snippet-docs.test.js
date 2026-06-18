import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadPalettes } from "../src/generator/index.js";
import { loadSnippetCatalogWithMeta } from "../src/snippets/catalog/index.js";
import { buildWebsite } from "../apps/website/scripts/build.mjs";

const rootDir = join(import.meta.dirname, "..");
const siteDir = join(rootDir, "site");
const siteIndex = join(siteDir, "index.html");

describe("product site (React)", () => {
  it("builds deployable SPA artifacts with SEO fallbacks", async () => {
    const catalog = await loadSnippetCatalogWithMeta();
    const palettes = await loadPalettes();

    if (!existsSync(siteIndex)) {
      await buildWebsite();
    }

    expect(catalog.length).toBeGreaterThan(0);
    expect(palettes.length).toBe(25);

    for (const relativePath of [
      "index.html",
      "404.html",
      ".nojekyll",
      "robots.txt",
      "sitemap.xml",
      "themes/index.html",
      "snippets/javascript/index.html",
      "assets/favicon-32.png",
      "assets/og-image.png",
      "previews/ether-dusk.png",
    ]) {
      expect(existsSync(join(siteDir, relativePath)), relativePath).toBe(true);
    }

    const indexHtml = readFileSync(siteIndex, "utf8");
    expect(indexHtml).toContain("/ether-theme/");
    expect(indexHtml).toContain('id="root"');
    expect(indexHtml).toContain('meta name="description"');
    expect(indexHtml).toContain("application/ld+json");

    const sitemap = readFileSync(join(siteDir, "sitemap.xml"), "utf8");
    expect(sitemap).toContain("/ether-theme/snippets/javascript/");
    expect(sitemap).toContain("/ether-theme/themes/");
  }, 120_000);
});
