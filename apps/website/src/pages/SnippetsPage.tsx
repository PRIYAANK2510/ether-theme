import { useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { SearchEmptyState } from "@/components/SearchEmptyState";
import { PageIntro } from "@/components/PageIntro";
import { SnippetTabs } from "@/components/SnippetTabs";
import {
  SnippetsTable,
  type SnippetTableItem,
} from "@/components/SnippetsTable";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useSnippetTabScroll } from "@/hooks/useSnippetTabScroll";
import { resetSnippetTabScroll } from "@/lib/snippet-tab-scroll";
import {
  getCachedLanguageBundle,
  getCachedSnippetIndex,
  loadLanguageSnippets,
  loadSnippetIndex,
  type LanguageSnippet,
} from "@/lib/snippet-data";
import {
  filterIndexSnippets,
  filterLanguageSnippets,
  type SnippetIndexEntry,
} from "@/lib/snippet-search";
import {
  SNIPPETS_SEO,
  snippetLanguageSeo,
} from "../../../../shared/site-seo.js";
import { SITE_DATA } from "@/generated/site-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSnippetQuery } from "@/store/searchSlice";
import pageStyles from "@/styles/ui/page.module.scss";

type LanguageMeta = (typeof SITE_DATA.languages)[number];

function seedBundlesFromCache() {
  const seeded: Record<string, LanguageSnippet[]> = {};
  for (const lang of SITE_DATA.languages) {
    const cached = getCachedLanguageBundle(lang.slug);
    if (cached) seeded[lang.slug] = cached.snippets;
  }
  return seeded;
}

function readSnippetsForSlug(
  slug: string,
  bundles: Record<string, LanguageSnippet[]>,
): LanguageSnippet[] | null {
  return bundles[slug] ?? getCachedLanguageBundle(slug)?.snippets ?? null;
}

function categoryCountForLanguage(language: LanguageMeta) {
  return language.categoryCount;
}

function snippetRowId(snippet: { key: string; language: string }) {
  return `${snippet.key}-${snippet.language}`;
}

function resolveIndexSnippet(
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

function toTableItems(snippets: LanguageSnippet[]): SnippetTableItem[] {
  return snippets.map((snippet) => ({
    id: snippetRowId(snippet),
    prefix: snippet.prefix,
    description: snippet.description,
    category: snippet.category,
    preview: snippet,
  }));
}

function indexToTableItems(
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

type AllSnippetsPanelProps = {
  query: string;
  snippetIndex: SnippetIndexEntry[] | null;
  indexError: boolean;
  bundles: Record<string, LanguageSnippet[]>;
  onBundleLoaded: (slug: string, snippets: LanguageSnippet[]) => void;
  onClearQuery: () => void;
};

function AllSnippetsPanel({
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
    if (!entry || resolveIndexSnippet(entry, bundles)) return;

    void loadLanguageSnippets(entry.languageSlug)
      .then((bundle) => onBundleLoaded(entry.languageSlug, bundle.snippets))
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

type LanguageSnippetsPanelProps = {
  language: LanguageMeta;
  query: string;
  snippets: LanguageSnippet[] | null;
  hasError: boolean;
  onClearQuery: () => void;
};

function LanguageSnippetsPanel({
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

export function SnippetsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.snippetQuery);
  const language = slug
    ? SITE_DATA.languages.find((entry) => entry.slug === slug)
    : undefined;
  const activeTab = slug ?? "all";
  const isAll = !language;
  const tabAnchorRef = useRef<HTMLDivElement>(null);
  const [bundleBySlug, setBundleBySlug] = useState(seedBundlesFromCache);
  const [errorSlugs, setErrorSlugs] = useState<Set<string>>(() => new Set());
  const [snippetIndex, setSnippetIndex] = useState<SnippetIndexEntry[] | null>(
    () => getCachedSnippetIndex(),
  );
  const [indexError, setIndexError] = useState(false);

  const languageCategoryCount = language
    ? categoryCountForLanguage(language)
    : 0;

  useEffect(() => {
    if (snippetIndex) return;

    let cancelled = false;

    loadSnippetIndex()
      .then((entries) => {
        if (!cancelled) setSnippetIndex(entries);
      })
      .catch(() => {
        if (!cancelled) setIndexError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [snippetIndex]);

  useEffect(() => {
    let cancelled = false;

    for (const lang of SITE_DATA.languages) {
      loadLanguageSnippets(lang.slug)
        .then((bundle) => {
          if (cancelled) return;
          setBundleBySlug((prev) =>
            prev[lang.slug] ? prev : { ...prev, [lang.slug]: bundle.snippets },
          );
        })
        .catch(() => {
          if (cancelled) return;
          setErrorSlugs((prev) => new Set(prev).add(lang.slug));
        });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const urlQuery = searchParams.get("q") ?? "";
    if (urlQuery && urlQuery !== query) {
      dispatch(setSnippetQuery(urlQuery));
    }
  }, []);

  useEffect(() => {
    const next = query.trim();
    const current = searchParams.get("q") ?? "";
    if (next === current) return;

    const params = new URLSearchParams(searchParams);
    if (next) params.set("q", next);
    else params.delete("q");
    setSearchParams(params, { replace: true });
  }, [query, searchParams, setSearchParams]);

  const prevSlug = useRef(slug);

  useEffect(() => {
    if (prevSlug.current === slug) return;
    prevSlug.current = slug;
    dispatch(setSnippetQuery(""));
  }, [slug, dispatch]);

  useSnippetTabScroll(tabAnchorRef, activeTab);

  const handleTabChange = (nextTab: string) => {
    dispatch(setSnippetQuery(""));
    resetSnippetTabScroll(tabAnchorRef.current);
    navigate(nextTab === "all" ? "/snippets" : `/snippets/${nextTab}`);
  };

  const clearQuery = () => dispatch(setSnippetQuery(""));

  const mergeBundle = (languageSlug: string, snippets: LanguageSnippet[]) => {
    setBundleBySlug((prev) =>
      prev[languageSlug] ? prev : { ...prev, [languageSlug]: snippets },
    );
  };

  usePageSeo(
    language
      ? snippetLanguageSeo(
          language.label,
          language.slug,
          language.count,
          language.extensions,
        )
      : {
          ...SNIPPETS_SEO,
          title: `Ether Snippets — ${SITE_DATA.catalogCount} VS Code & Cursor Prefixes`,
        },
  );

  if (slug && !language) {
    return <Navigate to="/snippets" replace />;
  }

  return (
    <>
      <PageIntro
        kicker="Snippet catalog"
        title={
          isAll
            ? `${SITE_DATA.catalogCount} production-ready prefixes`
            : `${language.label} snippets`
        }
      >
        {isAll ? (
          <p>
            Search the full catalog or switch tabs to browse by language —{" "}
            <strong>{SITE_DATA.catalogCount}</strong> prefixes across six
            editor scopes.
          </p>
        ) : (
          <p>
            <strong>{language.count}</strong> prefixes for{" "}
            <strong>{language.extensions}</strong> · {languageCategoryCount}{" "}
            categories in this scope.
          </p>
        )}
      </PageIntro>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div
          ref={tabAnchorRef}
          className={pageStyles.snippetTabAnchor}
          aria-hidden="true"
        />
        <SnippetTabs
          search={{
            value: query,
            onChange: (value) => dispatch(setSnippetQuery(value)),
            placeholder: isAll
              ? "Prefix, description, language…"
              : "Prefix, description, code…",
          }}
        />

        <TabsContent value="all" className={pageStyles.snippetsPanel}>
          <AllSnippetsPanel
            query={query}
            snippetIndex={snippetIndex}
            indexError={indexError}
            bundles={bundleBySlug}
            onBundleLoaded={mergeBundle}
            onClearQuery={clearQuery}
          />
        </TabsContent>

        {SITE_DATA.languages.map((lang) => (
          <TabsContent
            key={lang.slug}
            value={lang.slug}
            className={pageStyles.snippetsPanel}
          >
            <LanguageSnippetsPanel
              language={lang}
              query={query}
              snippets={readSnippetsForSlug(lang.slug, bundleBySlug)}
              hasError={errorSlugs.has(lang.slug)}
              onClearQuery={clearQuery}
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
