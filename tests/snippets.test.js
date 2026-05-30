import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { composeSnippetFiles } from "../src/snippets/generator.js";
import { loadSnippetCatalog } from "../src/snippets/catalog/index.js";
import {
  buildSnippetContributions,
  MIN_SNIPPET_COUNT,
  SNIPPET_LANGUAGES,
} from "../src/snippets/registry.js";
import {
  validateGeneratedSnippetFile,
  validateSnippetCatalog,
} from "../src/snippets/validate.js";

const rootDir = join(import.meta.dirname, "..");
const packageJsonPath = join(rootDir, "package.json");

describe("snippet catalog", () => {
  it("loads and validates the full catalog", async () => {
    const catalog = await loadSnippetCatalog();
    const count = validateSnippetCatalog(catalog);
    expect(count).toBeGreaterThanOrEqual(MIN_SNIPPET_COUNT);
  });

  it("composes language-specific snippet files without duplicate prefixes", async () => {
    const catalog = await loadSnippetCatalog();
    const byLanguage = composeSnippetFiles(catalog);

    for (const { language } of SNIPPET_LANGUAGES) {
      expect(Object.keys(byLanguage[language]).length).toBeGreaterThan(0);
      validateGeneratedSnippetFile(byLanguage[language], language);
    }
  });
});

describe("generated snippet artifacts", () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  it("registers snippet contributions for all supported languages", () => {
    const contributions = buildSnippetContributions();
    expect(packageJson.contributes.snippets).toEqual(contributions);
    expect(packageJson.contributes.snippets).toHaveLength(SNIPPET_LANGUAGES.length);
  });

  it("ships snippet files referenced by package.json", () => {
    for (const contribution of packageJson.contributes.snippets) {
      const filePath = join(rootDir, contribution.path.replace(/^\.\//, ""));
      expect(existsSync(filePath)).toBe(true);

      const snippets = JSON.parse(readFileSync(filePath, "utf8"));
      validateGeneratedSnippetFile(snippets, contribution.language);
    }
  });

  it("preserves theme contributions when snippets are registered", () => {
    expect(packageJson.contributes.themes?.length).toBeGreaterThan(0);
    expect(packageJson.contributes.snippets?.length).toBeGreaterThan(0);
  });
});

describe("snippet entry shape", () => {
  it("uses prefix, body, and description in every generated snippet", () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

    for (const contribution of packageJson.contributes.snippets) {
      const filePath = join(rootDir, contribution.path.replace(/^\.\//, ""));
      const snippets = JSON.parse(readFileSync(filePath, "utf8"));

      for (const [name, entry] of Object.entries(snippets)) {
        expect(entry.prefix, `${contribution.language}:${name}`).toBeTruthy();
        expect(entry.description, `${contribution.language}:${name}`).toBeTruthy();
        expect(entry.body, `${contribution.language}:${name}`).toBeTruthy();
      }
    }
  });
});
