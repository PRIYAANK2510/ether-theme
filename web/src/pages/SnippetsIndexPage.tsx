import { useMemo } from "react";
import { Link } from "react-router-dom";
import { SearchInput } from "@/components/SearchInput";
import { SnippetSubnav } from "@/components/SnippetSubnav";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SITE_DATA } from "@/generated/site-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSnippetQuery } from "@/store/searchSlice";

export function SnippetsIndexPage() {
  useDocumentTitle(`Ether Snippets — ${SITE_DATA.catalogCount} VS Code & Cursor Prefixes`);
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
      <header className="page-header">
        <h1>Snippet catalog</h1>
        <p>
          <strong>{SITE_DATA.catalogCount}</strong> snippets across{" "}
          <strong>{SITE_DATA.categoryCount}</strong> categories and six editor scopes.
        </p>
      </header>

      <section className="section" style={{ marginTop: 0 }}>
        <h2>Browse by language</h2>
        <div className="grid">
          {SITE_DATA.languages.map((language) => (
            <article className="card" key={language.slug}>
              <h2>{language.label}</h2>
              <p>
                {language.count} snippets · {language.extensions}
              </p>
              <Link className="button" to={`/snippets/${language.slug}`}>
                Browse {language.label}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Search all snippets</h2>
        <SearchInput
          value={query}
          onChange={(value) => dispatch(setSnippetQuery(value))}
          placeholder="Search by prefix, description, category, or language…"
        />
        {filtered.length === 0 ? (
          <p className="empty-state">No snippets match your search.</p>
        ) : null}
        <div className="table-wrap">
          <table>
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
                    <code className="snippet-prefix">{snippet.prefix}</code>
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
      </section>
    </>
  );
}
