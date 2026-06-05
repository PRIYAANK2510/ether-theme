import { describe, expect, it } from "vitest";
import {
  buildSnippetSearchHaystack,
  filterAndRankSnippets,
  matchesSnippetSearch,
  scoreSnippetSearch,
  tokenizeSnippetQuery,
} from "../shared/snippet-search.js";

const sampleMeta = {
  label: "React (TSX)",
  extensions: ".tsx",
  slug: "react-tsx",
  language: "typescriptreact",
};

const sampleEntry = {
  key: "react-arrow-component",
  category: "Components",
};

const sampleResolved = {
  prefix: "rafcp",
  description: "Creates a React Arrow Function Component with PropTypes",
};

describe("snippet-search", () => {
  it("tokenizes queries into lowercase terms", () => {
    expect(tokenizeSnippetQuery("  React   Hook  ")).toEqual(["react", "hook"]);
  });

  it("matches when every token appears in the haystack", () => {
    const haystack = buildSnippetSearchHaystack(
      sampleResolved,
      sampleEntry,
      sampleMeta,
    );
    expect(matchesSnippetSearch("react prop", haystack)).toBe(true);
    expect(matchesSnippetSearch("vue prop", haystack)).toBe(false);
  });

  it("ranks prefix matches ahead of description-only matches", () => {
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

  it("scores exact prefix matches highest", () => {
    const exact = scoreSnippetSearch("rafcp", {
      prefix: "rafcp",
      description: "Creates a React Arrow Function Component",
      category: "Components",
      haystack: "rafcp react components",
    });
    const partial = scoreSnippetSearch("raf", {
      prefix: "rafcp",
      description: "Creates a React Arrow Function Component",
      category: "Components",
      haystack: "rafcp react components",
    });

    expect(exact).toBeGreaterThan(partial);
  });
});
