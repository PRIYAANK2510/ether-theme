import { useMemo } from "react";
import { Link } from "react-router-dom";
import { SearchEmptyState } from "@/components/SearchEmptyState";
import { SearchInput } from "@/components/SearchInput";
import { SnippetSubnav } from "@/components/SnippetSubnav";
import { usePageSeo } from "@/hooks/usePageSeo";
import { SNIPPETS_SEO } from "../../../../shared/site-seo.js";
import { SITE_DATA } from "@/generated/site-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSnippetQuery } from "@/store/searchSlice";
import buttonStyles from "@/styles/ui/button.module.scss";
import cardStyles from "@/styles/ui/card.module.scss";
import gridStyles from "@/styles/ui/grid.module.scss";
import pageStyles from "@/styles/ui/page.module.scss";
import tableStyles from "@/styles/ui/table.module.scss";

export function SnippetsIndexPage() {
  usePageSeo({
    ...SNIPPETS_SEO,
    title: `Ether Snippets — ${SITE_DATA.catalogCount} VS Code & Cursor Prefixes`,
  });
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.snippetQuery);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SITE_DATA.snippets;
    return SITE_DATA.snippets.filter((snippet) => snippet.search.includes(normalized));
  }, [query]);

  return (
    <>
      <SnippetSubnav />
      <header className={pageStyles.pageHeader}>
        <h1>Snippet catalog</h1>
        <p>
          <strong>{SITE_DATA.catalogCount}</strong> snippets across{" "}
          <strong>{SITE_DATA.categoryCount}</strong> categories and six editor scopes.
        </p>
      </header>

      <section className={pageStyles.sectionFlush}>
        <h2>Browse by language</h2>
        <div className={gridStyles.grid}>
          {SITE_DATA.languages.map((language) => (
            <article className={cardStyles.card} key={language.slug}>
              <h2>{language.label}</h2>
              <p>
                {language.count} snippets · {language.extensions}
              </p>
              <Link className={buttonStyles.button} to={`/snippets/${language.slug}`}>
                Browse {language.label}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={pageStyles.section}>
        <h2>Search all snippets</h2>
        <SearchInput
          value={query}
          onChange={(value) => dispatch(setSnippetQuery(value))}
          placeholder="Search by prefix, description, category, or language…"
        />
        {filtered.length === 0 ? (
          <SearchEmptyState
            title="No snippets match your search"
            hint="Search by prefix, description, category, or language."
            onClear={() => dispatch(setSnippetQuery(""))}
          />
        ) : (
          <>
            {query.trim() ? (
              <p className={pageStyles.resultMeta}>
                Showing {filtered.length} of {SITE_DATA.catalogCount} snippets
              </p>
            ) : null}
            <div className={tableStyles.tableWrap}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Prefix</th>
                <th>Description</th>
                <th>Category</th>
                <th>Language</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((snippet) => (
                <tr key={`${snippet.key}-${snippet.language}`}>
                  <td>
                    <code className={tableStyles.snippetPrefix}>{snippet.prefix}</code>
                  </td>
                  <td>{snippet.description}</td>
                  <td>{snippet.category}</td>
                  <td>
                    <Link to={`/snippets/${snippet.languageSlug}`}>{snippet.languageLabel}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </>
        )}
      </section>
    </>
  );
}
