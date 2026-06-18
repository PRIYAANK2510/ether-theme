import type { SnippetTableItem } from "@/components/SnippetsTable";
import { SITE_DATA } from "@/generated/site-data";
import type { LanguageSnippet } from "@/lib/snippet-data";
import {
  getCachedLanguageBundle,
  loadLanguageSnippets,
} from "@/lib/snippet-data";
import type { SnippetIndexEntry } from "@/lib/snippet-search";

export type LanguageMeta = (typeof SITE_DATA.languages)[number];

export function seedBundlesFromCache() {
  const seeded: Record<string, LanguageSnippet[]> = {};
  for (const lang of SITE_DATA.languages) {
    const cached = getCachedLanguageBundle(lang.slug);
    if (cached) seeded[lang.slug] = cached.snippets;
  }
  return seeded;
}

export function readSnippetsForSlug(
  slug: string,
  bundles: Record<string, LanguageSnippet[]>,
): LanguageSnippet[] | null {
  return bundles[slug] ?? getCachedLanguageBundle(slug)?.snippets ?? null;
}

export function snippetRowId(snippet: { key: string; language: string }) {
  return `${snippet.key}-${snippet.language}`;
}

export function resolveIndexSnippet(
  entry: SnippetIndexEntry,
  bundles: Record<string, LanguageSnippet[]>,
): LanguageSnippet | null {
  const snippets =
    bundles[entry.languageSlug] ??
    getCachedLanguageBundle(entry.languageSlug)?.snippets;
  return (
    snippets?.find(
      (snippet) =>
        snippet.key === entry.key && snippet.language === entry.language,
    ) ?? null
  );
}

export function toTableItems(snippets: LanguageSnippet[]): SnippetTableItem[] {
  return snippets.map((snippet) => ({
    id: snippetRowId(snippet),
    prefix: snippet.prefix,
    description: snippet.description,
    category: snippet.category,
    preview: snippet,
  }));
}

export function indexToTableItems(
  entries: SnippetIndexEntry[],
  bundles: Record<string, LanguageSnippet[]>,
): SnippetTableItem[] {
  return entries.map((entry) => ({
    id: snippetRowId(entry),
    prefix: entry.prefix,
    description: entry.description,
    category: entry.category,
    languageLabel: entry.languageLabel,
    languageSlug: entry.languageSlug,
    preview: resolveIndexSnippet(entry, bundles),
  }));
}

export async function loadBundleForPreview(
  entry: SnippetIndexEntry,
  bundles: Record<string, LanguageSnippet[]>,
) {
  if (resolveIndexSnippet(entry, bundles)) return null;
  const bundle = await loadLanguageSnippets(entry.languageSlug);
  return { slug: entry.languageSlug, snippets: bundle.snippets };
}
