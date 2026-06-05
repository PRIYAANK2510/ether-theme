import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  filterAndRankSnippets,
  matchesSnippetSearch,
  tokenizeSnippetQuery,
} from "../shared/snippet-search.js";
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
    expect(packageJson.contributes.snippets).toHaveLength(
      SNIPPET_LANGUAGES.length,
    );
  });

  it("ships snippet files referenced by package.json", () => {
    for (const contribution of packageJson.contributes.snippets) {
      const filePath = join(rootDir, contribution.path.replace(/^\.\//, ""));
      expect(existsSync(filePath)).toBe(true);

      const snippets = JSON.parse(readFileSync(filePath, "utf8"));
      validateGeneratedSnippetFile(snippets, contribution.language);
    }
  });
});

describe("snippet search", () => {
  it("matches multi-word queries with AND semantics", () => {
    expect(tokenizeSnippetQuery("  React   Hook  ")).toEqual(["react", "hook"]);
    expect(
      matchesSnippetSearch(
        "react prop",
        "rafcp react arrow function component prop",
      ),
    ).toBe(true);
    expect(
      matchesSnippetSearch(
        "vue prop",
        "rafcp react arrow function component prop",
      ),
    ).toBe(false);
  });

  it("ranks exact prefix matches first", () => {
    const ranked = filterAndRankSnippets(
      [
        {
          prefix: "usememo",
          description: "React useMemo memoization",
          category: "Hooks",
          search: "usememo react usememo memoization hooks",
        },
        {
          prefix: "rafcp",
          description: "Creates a React Arrow Function Component with PropTypes",
          category: "Components",
          search: "rafcp creates react arrow function component components",
        },
      ],
      "rafcp",
      (item) => ({
        prefix: item.prefix,
        description: item.description,
        category: item.category,
        haystack: item.search,
      }),
    );

    expect(ranked[0].prefix).toBe("rafcp");
  });
});
