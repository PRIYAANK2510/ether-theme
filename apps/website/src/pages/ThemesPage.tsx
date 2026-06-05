import { useMemo } from "react";
import { SearchEmptyState } from "@/components/SearchEmptyState";
import { SearchInput } from "@/components/SearchInput";
import { SyntaxPreview } from "@/components/SyntaxPreview";
import { ThemeCard } from "@/components/ThemeCard";
import { usePageSeo } from "@/hooks/usePageSeo";
import { THEMES_SEO } from "../../../../shared/site-seo.js";
import { SITE_DATA } from "@/generated/site-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setThemeQuery } from "@/store/searchSlice";
import gridStyles from "@/styles/ui/grid.module.scss";
import pageStyles from "@/styles/ui/page.module.scss";
import styles from "./ThemesPage.module.scss";

export function ThemesPage() {
  usePageSeo({
    ...THEMES_SEO,
    title: `Ether Themes Gallery — ${SITE_DATA.paletteCount} Dark Color Themes`,
  });
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.themeQuery);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SITE_DATA.palettes;
    return SITE_DATA.palettes.filter((palette) =>
      [palette.id, palette.label].join(" ").toLowerCase().includes(normalized),
    );
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <>
      <header className={pageStyles.pageHeader}>
        <span className={pageStyles.heroEyebrow}>Theme gallery</span>
        <h1>{SITE_DATA.paletteCount} dark color themes</h1>
        <p>
          Every palette is WCAG-validated with tuned syntax and workbench colors. Use{" "}
          <strong>Preview</strong> to enlarge a screenshot or <strong>Try</strong> to apply the
          palette across the site. Install the extension, then press <code>Ctrl+K Ctrl+T</code> to
          switch themes in your editor.
        </p>
      </header>

      <div className={styles.toolbar}>
        <SyntaxPreview />
        <SearchInput
          className={styles.searchCompact}
          value={query}
          onChange={(value) => dispatch(setThemeQuery(value))}
          placeholder="Search themes by name…"
        />
      </div>

      {filtered.length === 0 ? (
        <SearchEmptyState
          title="No themes match your search"
          hint='Try another name like "Ether Dusk" or "Aurora".'
          onClear={() => dispatch(setThemeQuery(""))}
        />
      ) : (
        <>
          {hasQuery ? (
            <p className={pageStyles.resultMeta}>
              Showing {filtered.length} of {SITE_DATA.paletteCount} themes
            </p>
          ) : null}
          <div className={gridStyles.themeGallery}>
            {filtered.map((palette) => (
              <ThemeCard key={palette.id} palette={palette} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
