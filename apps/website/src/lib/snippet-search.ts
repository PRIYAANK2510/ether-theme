import { filterAndRankSnippets } from "@shared/snippet-search.js";
import type { LanguageSnippet } from "@/lib/snippet-data";

export type SnippetIndexEntry = {
  key: string;
  category: string;
  language: string;
  languageLabel: string;
  languageSlug: string;
  prefix: string;
  description: string;
  search: string;
};

export function filterIndexSnippets<T extends SnippetIndexEntry>(
  items: readonly T[],
  query: string,
): T[] {
  return filterAndRankSnippets(items, query, (item: T) => ({
    prefix: item.prefix,
    description: item.description,
    category: item.category,
    haystack: item.search,
  }));
}

export function filterLanguageSnippets(
  snippets: readonly LanguageSnippet[],
  query: string,
): LanguageSnippet[] {
  return filterAndRankSnippets(snippets, query, (snippet: LanguageSnippet) => ({
    prefix: snippet.prefix,
    description: snippet.description,
    category: snippet.category,
    haystack: snippet.search,
    extraHaystacks: [snippet.body],
  }));
}
