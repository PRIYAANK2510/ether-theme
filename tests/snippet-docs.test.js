import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { loadSnippetCatalogWithMeta } from "../src/snippets/catalog/index.js";
import { buildWebsite } from "../web/scripts/build.mjs";

const rootDir = join(import.meta.dirname, "..");
const siteDir = join(rootDir, "site");

function findMainBundle() {
  const assetsDir = join(siteDir, "assets");
  return readdirSync(assetsDir).find((file) => file.endsWith(".js") && file.startsWith("index-"));
}

describe("product site (React)", () => {
  afterAll(() => {
    // site/ is gitignored; tests leave artifacts for local preview
  });

  it("builds the SPA with theme assets and GitHub Pages fallbacks", async () => {
    const catalog = await loadSnippetCatalogWithMeta();
    const result = await buildWebsite();

    expect(result.catalogCount).toBe(catalog.length);
    expect(result.paletteCount).toBe(25);
    expect(existsSync(join(siteDir, "index.html"))).toBe(true);
    expect(existsSync(join(siteDir, "404.html"))).toBe(true);
    expect(existsSync(join(siteDir, ".nojekyll"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "favicon-16.png"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "favicon-32.png"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "apple-touch-icon.png"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "logo.png"))).toBe(true);
    expect(existsSync(join(siteDir, "previews", "ether-dusk.png"))).toBe(true);

    const indexHtml = readFileSync(join(siteDir, "index.html"), "utf8");
    expect(indexHtml).toContain("/ether-theme/");
    expect(indexHtml).toContain('id="root"');
    expect(indexHtml).toContain("/ether-theme/assets/favicon-32.png");

    const jsBundle = findMainBundle();
    expect(jsBundle).toBeTruthy();

    const bundle = readFileSync(join(siteDir, "assets", jsBundle), "utf8");
    expect(bundle).toContain("Snippet catalog");
    expect(bundle).toContain("theme-switcher");
    expect(bundle).toContain("ether-dusk");
    expect(bundle).toContain("ether-sand");
  });

  it("includes catalog prefixes in the built bundle", async () => {
    const catalog = await loadSnippetCatalogWithMeta();
    await buildWebsite();

    const jsBundle = findMainBundle();
    const bundle = readFileSync(join(siteDir, "assets", jsBundle), "utf8");

    for (const entry of catalog.slice(0, 20)) {
      expect(bundle).toContain(entry.prefix);
    }
  });
});
