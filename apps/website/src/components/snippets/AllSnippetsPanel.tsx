import { useMemo } from "react";
import { SearchEmptyState } from "@/components/SearchEmptyState";
import { SnippetsTable } from "@/components/SnippetsTable";
import {
  filterIndexSnippets,
  type SnippetIndexEntry,
} from "@/lib/snippet-search";
import type { LanguageSnippet } from "@/lib/snippet-data";
import { SITE_DATA } from "@/generated/site-data";
import pageStyles from "@/styles/ui/page.module.scss";
import {
  indexToTableItems,
  loadBundleForPreview,
  snippetRowId,
} from "./helpers";

type AllSnippetsPanelProps = {
  query: string;
  snippetIndex: SnippetIndexEntry[] | null;
  indexError: boolean;
  bundles: Record<string, LanguageSnippet[]>;
  onBundleLoaded: (slug: string, snippets: LanguageSnippet[]) => void;
  onClearQuery: () => void;
};

export function AllSnippetsPanel({
  query,
  snippetIndex,
  indexError,
  bundles,
  onBundleLoaded,
  onClearQuery,
}: AllSnippetsPanelProps) {
  const filtered = useMemo(
    () => (snippetIndex ? filterIndexSnippets(snippetIndex, query) : []),
    [snippetIndex, query],
  );
  const items = useMemo(
    () => indexToTableItems(filtered, bundles),
    [filtered, bundles],
  );

  function requestPreview(id: string) {
    const entry = filtered.find((snippet) => snippetRowId(snippet) === id);
    if (!entry) return;

    void loadBundleForPreview(entry, bundles)
      .then((result) => {
        if (result) onBundleLoaded(result.slug, result.snippets);
      })
      .catch(() => {});
  }

  if (snippetIndex === null && !indexError) {
    return <p className={pageStyles.resultMeta}>Loading snippet catalog…</p>;
  }

  if (indexError) {
    return (
      <SearchEmptyState
        title="Could not load snippet catalog"
        hint="Refresh the page or try again in a moment."
      />
    );
  }

  if (filtered.length === 0) {
    return (
      <SearchEmptyState
        title="No snippets match your search"
        hint="Try multiple words (e.g. react hook), a prefix (rafcp), category, or language (tsx)."
        onClear={onClearQuery}
      />
    );
  }

  return (
    <>
      {query.trim() ? (
        <p className={pageStyles.resultMeta}>
          Showing {filtered.length} of {SITE_DATA.catalogCount} snippets
        </p>
      ) : null}

      <SnippetsTable
        items={items}
        searchQuery={query}
        showLanguage
        onRequestPreview={requestPreview}
      />
    </>
  );
}
