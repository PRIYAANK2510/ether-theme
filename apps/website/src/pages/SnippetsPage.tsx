import { useEffect, useRef, useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AllSnippetsPanel } from "@/components/snippets/AllSnippetsPanel";
import { LanguageSnippetsPanel } from "@/components/snippets/LanguageSnippetsPanel";
import {
  readSnippetsForSlug,
  seedBundlesFromCache,
} from "@/components/snippets/helpers";
import { PageIntro } from "@/components/PageIntro";
import { SnippetTabs } from "@/components/SnippetTabs";
import { Tabs, TabsContent } from "@/components/ui/Tabs";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useSnippetTabScroll } from "@/hooks/useSnippetTabScroll";
import { resetSnippetTabScroll } from "@/lib/snippet-tab-scroll";
import {
  getCachedLanguageBundle,
  getCachedSnippetIndex,
  loadLanguageSnippets,
  loadSnippetIndex,
  prefetchLanguageSnippets,
  type LanguageSnippet,
} from "@/lib/snippet-data";
import type { SnippetIndexEntry } from "@/lib/snippet-search";
import { SNIPPETS_SEO, snippetLanguageSeo } from "@shared/site-seo.js";
import { SITE_DATA } from "@/generated/site-data";
import pageStyles from "@/styles/ui/page.module.scss";

export function SnippetsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
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

  const setQuery = (value: string) => {
    const next = value.trim();
    const params = new URLSearchParams(searchParams);
    if (next) params.set("q", next);
    else params.delete("q");
    setSearchParams(params, { replace: true });
  };

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
    if (isAll || !language) return;
    if (bundleBySlug[language.slug] || getCachedLanguageBundle(language.slug)) {
      return;
    }

    let cancelled = false;

    loadLanguageSnippets(language.slug)
      .then((bundle) => {
        if (cancelled) return;
        setBundleBySlug((prev) =>
          prev[language.slug]
            ? prev
            : { ...prev, [language.slug]: bundle.snippets },
        );
      })
      .catch(() => {
        if (!cancelled) {
          setErrorSlugs((prev) => new Set(prev).add(language.slug));
        }
      });

    const tabIndex = SITE_DATA.languages.findIndex(
      (entry) => entry.slug === language.slug,
    );
    prefetchLanguageSnippets(
      [
        SITE_DATA.languages[tabIndex - 1]?.slug,
        SITE_DATA.languages[tabIndex + 1]?.slug,
      ].filter((entry) => entry !== undefined),
    );

    return () => {
      cancelled = true;
    };
  }, [isAll, language?.slug, bundleBySlug]);

  const prevSlug = useRef(slug);

  useEffect(() => {
    if (prevSlug.current === slug) return;
    prevSlug.current = slug;
    setQuery("");
  }, [slug]);

  useSnippetTabScroll(tabAnchorRef, activeTab);

  const handleTabChange = (nextTab: string) => {
    setQuery("");
    resetSnippetTabScroll(tabAnchorRef.current);
    navigate(nextTab === "all" ? "/snippets" : `/snippets/${nextTab}`);
  };

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
            <strong>{language.extensions}</strong> · {language.categoryCount}{" "}
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
            onChange: setQuery,
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
            onClearQuery={() => setQuery("")}
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
              onClearQuery={() => setQuery("")}
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
