export type SnippetSearchMeta = {
  label: string;
  extensions: string;
  slug: string;
  language: string;
};

export type SnippetSearchEntry = {
  category: string;
  key: string;
};

export type SnippetSearchResolved = {
  prefix: string;
  description: string;
};

export type SnippetSearchFields = {
  prefix: string;
  description: string;
  category: string;
  haystack: string;
  extraHaystacks?: string[];
};

export function snippetSearchAliases(meta: SnippetSearchMeta): string[];

export function buildSnippetSearchHaystack(
  resolved: SnippetSearchResolved,
  entry: SnippetSearchEntry,
  meta: SnippetSearchMeta,
): string;

export function tokenizeSnippetQuery(query: string): string[];

export function matchesSnippetSearch(
  query: string,
  haystack: string,
  extraHaystacks?: string[],
): boolean;

export function scoreSnippetSearch(
  query: string,
  fields: {
    prefix?: string;
    description?: string;
    category?: string;
    haystack?: string;
  },
): number;

export function filterAndRankSnippets<T>(
  items: readonly T[],
  query: string,
  getFields: (item: T) => SnippetSearchFields,
): T[];
