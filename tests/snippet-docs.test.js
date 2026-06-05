import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  LANGUAGE_META,
  PAGES_BASE,
  generateSnippetDocs,
} from "../src/docs/snippet-docs.js";
import { loadSnippetCatalogWithMeta } from "../src/snippets/catalog/index.js";
import { SNIPPET_LANGUAGES } from "../src/snippets/registry.js";

const rootDir = join(import.meta.dirname, "..");
const siteDir = join(rootDir, "site", "snippets");

describe("snippet docs site", () => {
  afterAll(() => {
    // site/ is gitignored; tests leave artifacts for local preview
  });

  it("generates index and language pages from the catalog", async () => {
    const catalog = await loadSnippetCatalogWithMeta();
    const result = await generateSnippetDocs(siteDir);

    expect(result.catalogCount).toBe(catalog.length);
    expect(existsSync(join(siteDir, "index.html"))).toBe(true);
    expect(existsSync(join(rootDir, "site", "index.html"))).toBe(true);
    expect(existsSync(join(rootDir, "site", ".nojekyll"))).toBe(true);
    expect(existsSync(join(siteDir, "assets", "snippets.css"))).toBe(true);

    for (const { language } of SNIPPET_LANGUAGES) {
      const slug = LANGUAGE_META[language].slug;
      expect(existsSync(join(siteDir, `${slug}.html`))).toBe(true);
    }
  });

  it("uses the GitHub Pages base path in generated HTML", async () => {
    await generateSnippetDocs(siteDir);
    const index = readFileSync(join(siteDir, "index.html"), "utf8");
    expect(index).toContain(`${PAGES_BASE}/assets/snippets.css`);
    expect(index).toContain("Snippet reference");
    expect(index).toContain('id="snippet-search"');
  });

  it("includes every catalog prefix on at least one language page", async () => {
    const catalog = await loadSnippetCatalogWithMeta();
    await generateSnippetDocs(siteDir);

    for (const entry of catalog.slice(0, 20)) {
      const language = entry.languages[0];
      const slug = LANGUAGE_META[language].slug;
      const page = readFileSync(join(siteDir, `${slug}.html`), "utf8");
      expect(page).toContain(entry.prefix);
    }
  });
});
