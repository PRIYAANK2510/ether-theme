import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { PrefixPill } from "@/components/PrefixPill";
import { SearchEmptyState } from "@/components/SearchEmptyState";
import { SearchInput } from "@/components/SearchInput";
import { SnippetSubnav } from "@/components/SnippetSubnav";
import { usePageSeo } from "@/hooks/usePageSeo";
import { SNIPPETS_SEO, snippetLanguageSeo } from "../../../../shared/site-seo.js";
import { SITE_DATA } from "@/generated/site-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSnippetQuery } from "@/store/searchSlice";
import pageStyles from "@/styles/ui/page.module.scss";
import snippetStyles from "@/styles/ui/snippet.module.scss";

export function SnippetLanguagePage() {
  const { slug } = useParams<{ slug: string }>();
  const language = SITE_DATA.languages.find((entry) => entry.slug === slug);
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.snippetQuery);

  const snippets = useMemo(() => {
    if (!language) return [];
    const normalized = query.trim().toLowerCase();
    return SITE_DATA.snippets
      .filter((snippet) => snippet.languageSlug === language.slug)
      .filter((snippet) => !normalized || snippet.search.includes(normalized));
  }, [language, query]);

  const categories = useMemo(() => {
    const map = new Map<string, typeof snippets>();
    for (const snippet of snippets) {
      const list = map.get(snippet.category) ?? [];
      list.push(snippet);
      map.set(snippet.category, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [snippets]);

  usePageSeo(
    language
      ? snippetLanguageSeo(language.label, language.slug, language.count, language.extensions)
      : { title: "Ether Snippets", description: SNIPPETS_SEO.description, path: "/snippets/" },
  );

  if (!language) {
    return <Navigate to="/snippets" replace />;
  }

  return (
    <>
      <SnippetSubnav />
      <header className={pageStyles.pageHeader}>
        <h1>{language.label} snippets</h1>
        <p>
          <strong>{language.count}</strong> prefixes for <strong>{language.extensions}</strong> ·{" "}
          {categories.length} categories
        </p>
      </header>

      <SearchInput
        value={query}
        onChange={(value) => dispatch(setSnippetQuery(value))}
        placeholder={`Search ${language.label} snippets…`}
      />
      {snippets.length === 0 ? (
        <SearchEmptyState
          title={`No ${language.label} snippets match your search`}
          hint="Try a shorter prefix or clear the filter to browse all snippets."
          onClear={() => dispatch(setSnippetQuery(""))}
        />
      ) : (
        query.trim() ? (
          <p className={pageStyles.resultMeta}>
            Showing {snippets.length} of {language.count} snippets
          </p>
        ) : null
      )}

      {categories.map(([category, items]) => (
        <section className={snippetStyles.category} key={category}>
          <h3>
            {category}{" "}
            <span className={snippetStyles.categoryCount}>({items.length})</span>
          </h3>
          <div className={snippetStyles.snippetList}>
            {items.map((snippet) => (
              <article className={snippetStyles.snippet} key={`${snippet.key}-${snippet.language}`}>
                <div className={snippetStyles.snippetHead}>
                  <h4>{snippet.description}</h4>
                  <div className={snippetStyles.snippetMeta}>
                    <PrefixPill prefix={snippet.prefix} />
                    <span className={snippetStyles.tag}>{snippet.category}</span>
                  </div>
                </div>
                <pre>
                  <code>{snippet.body}</code>
                </pre>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
