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
import { PageIntro } from "@/components/PageIntro";
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
      <PageIntro
        kicker="Theme gallery"
        title={`${SITE_DATA.paletteCount} dark color themes`}
      >
        <p>
          WCAG-validated palettes with tuned syntax and workbench colors.{" "}
          <strong>Try</strong> applies a theme to this site;{" "}
          <strong>Preview</strong> opens the editor screenshot. Use{" "}
          <code>Ctrl+K Ctrl+T</code> in VS Code or Cursor after install.
        </p>
      </PageIntro>

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
