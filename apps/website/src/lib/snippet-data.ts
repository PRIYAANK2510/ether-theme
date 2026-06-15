import { SITE_BASE } from "@/lib/config";
import type { SnippetIndexEntry } from "@/lib/snippet-search";

export type LanguageSnippet = {
  key: string;
  category: string;
  language: string;
  prefix: string;
  description: string;
  body: string;
  search: string;
  defaultHtml: string;
};

export type LanguageSnippetBundle = {
  slug: string;
  language: string;
  snippets: LanguageSnippet[];
};

const bundleCache = new Map<string, Promise<LanguageSnippetBundle>>();
const resolvedCache = new Map<string, LanguageSnippetBundle>();
let snippetIndexPromise: Promise<SnippetIndexEntry[]> | null = null;
let snippetIndexCache: SnippetIndexEntry[] | null = null;

export function getCachedSnippetIndex() {
  return snippetIndexCache;
}

export function loadSnippetIndex() {
  if (snippetIndexCache) {
    return Promise.resolve(snippetIndexCache);
  }

  if (!snippetIndexPromise) {
    snippetIndexPromise = fetch(`${SITE_BASE}/data/snippet-index.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load snippet index");
        }
        return response.json() as Promise<SnippetIndexEntry[]>;
      })
      .then((entries) => {
        snippetIndexCache = entries;
        return entries;
      })
      .catch((error) => {
        snippetIndexPromise = null;
        throw error;
      });
  }

  return snippetIndexPromise;
}

export function getCachedLanguageBundle(slug: string) {
  return resolvedCache.get(slug) ?? null;
}

export function prefetchLanguageSnippets(slugs: string[]) {
  for (const slug of slugs) {
    void loadLanguageSnippets(slug).catch(() => {});
  }
}

export function loadLanguageSnippets(slug: string) {
  const cached = bundleCache.get(slug);
  if (cached) return cached;

  const request = fetch(`${SITE_BASE}/data/snippets/${slug}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load snippets for "${slug}"`);
      }
      return response.json() as Promise<LanguageSnippetBundle>;
    })
    .then((bundle) => {
      resolvedCache.set(slug, bundle);
      bundleCache.set(slug, Promise.resolve(bundle));
      return bundle;
    })
    .catch((error) => {
      bundleCache.delete(slug);
      throw error;
    });

  bundleCache.set(slug, request);
  return request;
}
