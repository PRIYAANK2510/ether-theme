import { useMemo } from "react";
import { SearchEmptyState } from "@/components/SearchEmptyState";
import { SnippetsTable } from "@/components/SnippetsTable";
import { filterLanguageSnippets } from "@/lib/snippet-search";
import type { LanguageSnippet } from "@/lib/snippet-data";
import pageStyles from "@/styles/ui/page.module.scss";
import { toTableItems, type LanguageMeta } from "./helpers";

type LanguageSnippetsPanelProps = {
  language: LanguageMeta;
  query: string;
  snippets: LanguageSnippet[] | null;
  hasError: boolean;
  onClearQuery: () => void;
};

export function LanguageSnippetsPanel({
  language,
  query,
  snippets,
  hasError,
  onClearQuery,
}: LanguageSnippetsPanelProps) {
  const filtered = useMemo(
    () => (snippets ? filterLanguageSnippets(snippets, query) : []),
    [snippets, query],
  );
  const items = useMemo(() => toTableItems(filtered), [filtered]);

  if (snippets === null && !hasError) {
    return (
      <p className={pageStyles.resultMeta}>
        Loading {language.label} snippets…
      </p>
    );
  }

  if (hasError) {
    return (
      <SearchEmptyState
        title={`Could not load ${language.label} snippets`}
        hint="Refresh the page or try again in a moment."
      />
    );
  }

  if (filtered.length === 0) {
    return (
      <SearchEmptyState
        title={`No ${language.label} snippets match your search`}
        hint="Try fewer words, a shorter prefix, or clear the filter to browse all snippets."
        onClear={onClearQuery}
      />
    );
  }

  return (
    <>
      {query.trim() ? (
        <p className={pageStyles.resultMeta}>
          Showing {filtered.length} of {language.count} snippets
        </p>
      ) : null}

      <SnippetsTable items={items} searchQuery={query} />
    </>
  );
}
