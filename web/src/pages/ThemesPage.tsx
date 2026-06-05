import { useMemo } from "react";
import { SearchInput } from "@/components/SearchInput";
import { SyntaxPreview } from "@/components/SyntaxPreview";
import { ThemeCard } from "@/components/ThemeCard";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SITE_DATA } from "@/generated/site-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setThemeQuery } from "@/store/searchSlice";

export function ThemesPage() {
  useDocumentTitle(`Ether Themes Gallery — ${SITE_DATA.paletteCount} Dark Color Themes`);
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.themeQuery);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SITE_DATA.palettes;
    return SITE_DATA.palettes.filter((palette) =>
      [palette.id, palette.label, palette.character].join(" ").toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <>
      <header className="page-header">
        <span className="hero-eyebrow">Theme gallery</span>
        <h1>{SITE_DATA.paletteCount} dark color themes</h1>
        <p>
          Every palette is WCAG-validated with tuned syntax and workbench colors. Click a preview
          to enlarge, or <strong>Try on site</strong> to preview the palette live. Install the
          extension, then press <code>Ctrl+K Ctrl+T</code> to switch themes.
        </p>
      </header>

      <SyntaxPreview />

      <SearchInput
        value={query}
        onChange={(value) => dispatch(setThemeQuery(value))}
        placeholder="Search themes by name or character…"
      />
      {filtered.length === 0 ? (
        <p className="empty-state">No themes match your search.</p>
      ) : null}
      <div className="theme-gallery">
        {filtered.map((palette) => (
          <ThemeCard key={palette.id} palette={palette} />
        ))}
      </div>
    </>
  );
}
