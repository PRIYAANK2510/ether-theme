import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { PrefixPill } from "@/components/PrefixPill";
import { SearchInput } from "@/components/SearchInput";
import { SnippetSubnav } from "@/components/SnippetSubnav";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SITE_DATA } from "@/generated/site-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSnippetQuery } from "@/store/searchSlice";

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

  useDocumentTitle(
    language
      ? `${language.label} Snippets · Ether Themes — ${language.count} Prefixes`
      : "Ether Snippets",
  );

  if (!language) {
    return <Navigate to="/snippets" replace />;
  }

  return (
    <>
      <SnippetSubnav activeSlug={language.slug} />
      <header className="page-header">
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
        <p className="empty-state">No snippets match your search.</p>
      ) : null}

      {categories.map(([category, items]) => (
        <section className="category" key={category}>
          <h3>
            {category}{" "}
            <span style={{ color: "var(--muted)", fontWeight: 400 }}>({items.length})</span>
          </h3>
          <div className="snippet-list">
            {items.map((snippet) => (
              <article className="snippet" key={`${snippet.key}-${snippet.language}`}>
                <div className="snippet-head">
                  <h4>{snippet.description}</h4>
                  <div className="snippet-meta">
                    <PrefixPill prefix={snippet.prefix} />
                    <span className="tag">{snippet.category}</span>
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
