import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { generateSite } from "../src/docs/generate-site.js";
import { LANGUAGE_META, loadSnippetCatalog } from "../src/docs/snippet-pages.js";
import {
  ASSETS_BASE,
  SITE_BASE,
  SNIPPETS_BASE,
} from "../src/docs/site-config.js";
import { SNIPPET_LANGUAGES } from "../src/snippets/registry.js";

const rootDir = join(import.meta.dirname, "..");
const siteDir = join(rootDir, "site");
const snippetsDir = join(siteDir, "snippets");

describe("product site", () => {
  afterAll(() => {
    // site/ is gitignored; tests leave artifacts for local preview
  });

  it("generates home, themes, and snippet pages", async () => {
    const catalog = await loadSnippetCatalog();
    const result = await generateSite();

    expect(result.catalogCount).toBe(catalog.length);
    expect(result.paletteCount).toBe(25);
    expect(existsSync(join(siteDir, "index.html"))).toBe(true);
    expect(existsSync(join(siteDir, "themes", "index.html"))).toBe(true);
    expect(existsSync(join(snippetsDir, "index.html"))).toBe(true);
    expect(existsSync(join(siteDir, ".nojekyll"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "site.css"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "site.js"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "favicon-16.png"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "favicon-32.png"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "apple-touch-icon.png"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "logo.png"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "previews", "ether-dusk.png"))).toBe(true);
    expect(existsSync(join(siteDir, "favicon.png"))).toBe(true);

    for (const { language } of SNIPPET_LANGUAGES) {
      const slug = LANGUAGE_META[language].slug;
      expect(existsSync(join(snippetsDir, `${slug}.html`))).toBe(true);
    }
  });

  it("uses the GitHub Pages base paths in generated HTML", async () => {
    await generateSite();
    const home = readFileSync(join(siteDir, "index.html"), "utf8");
    const themes = readFileSync(join(siteDir, "themes", "index.html"), "utf8");
    const snippets = readFileSync(join(snippetsDir, "index.html"), "utf8");

    expect(home).toContain(`${ASSETS_BASE}/site.css`);
    expect(home).toContain("<title>Ether Themes — Dark Themes &amp; Snippets for VS Code and Cursor</title>");
    expect(home).toContain('href="' + SITE_BASE + '/"');
    expect(home).toContain('href="' + SNIPPETS_BASE + '/"');
    expect(home).toContain("theme-lightbox");

    expect(themes).toContain("theme-gallery");
    expect(themes).toContain(`${ASSETS_BASE}/previews/ether-dusk.png`);

    expect(snippets).toContain(`${ASSETS_BASE}/site.css`);
    expect(snippets).toContain("<h1>Snippet catalog</h1>");
    expect(snippets).toContain('id="snippet-search"');
    expect(snippets).not.toContain("Complete snippet catalog");
    expect(snippets).not.toContain("How to use snippets");
  });

  it("includes every catalog prefix on at least one language page", async () => {
    const catalog = await loadSnippetCatalog();
    await generateSite();

    for (const entry of catalog.slice(0, 20)) {
      const language = entry.languages[0];
      const slug = LANGUAGE_META[language].slug;
      const page = readFileSync(join(snippetsDir, `${slug}.html`), "utf8");
      expect(page).toContain(entry.prefix);
    }
  });
});
