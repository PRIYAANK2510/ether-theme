import { useEffect, useRef } from "react";
import { getThemeList } from "@/lib/theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme } from "@/store/themeSlice";
import { setThemeMenuOpen } from "@/store/uiSlice";
import { SITE_DATA } from "@/generated/site-data";

const themes = getThemeList();

export function ThemeSwitcher() {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((state) => state.theme.activeId);
  const open = useAppSelector((state) => state.ui.themeMenuOpen);
  const rootRef = useRef<HTMLDivElement>(null);

  const active =
    themes.find((theme) => theme.id === activeId) ??
    themes.find((theme) => theme.id === SITE_DATA.defaultThemeId)!;

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        dispatch(setThemeMenuOpen(false));
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dispatch(setThemeMenuOpen(false));
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [dispatch]);

  return (
    <div className="theme-switcher" ref={rootRef}>
      <button
        type="button"
        className="theme-switcher-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="theme-switcher-list"
        onClick={() => dispatch(setThemeMenuOpen(!open))}
      >
        <span
          className="theme-swatch"
          style={{ background: active.accent }}
          aria-hidden="true"
        />
        <span>{active.label}</span>
        <span aria-hidden="true">▾</span>
      </button>
      {open ? (
        <ul className="theme-switcher-list" id="theme-switcher-list" role="listbox">
          {themes.map((theme) => (
            <li key={theme.id} role="presentation">
              <button
                type="button"
                className="theme-switcher-option"
                role="option"
                aria-selected={theme.id === activeId}
                onClick={() => {
                  dispatch(setTheme(theme.id));
                  dispatch(setThemeMenuOpen(false));
                }}
              >
                <span
                  className="theme-swatch"
                  style={{ background: theme.accent }}
                  aria-hidden="true"
                />
                <span>{theme.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
