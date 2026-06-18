import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { getThemeList } from "@/lib/theme";
import { cn } from "@/lib/cn";
import { useTheme, useSiteUi } from "@/context/SiteContext";
import { SITE_DATA } from "@/generated/site-data";
import styles from "./ThemeSwitcher.module.scss";

const themes = getThemeList();
const LIST_GAP = 8;
const BLOCK_LIST_MAX_HEIGHT = 280;
const THEME_SWITCHER_SELECTOR = "[data-theme-switcher]";

type ThemeSwitcherProps = {
  layout?: "inline" | "block";
};

export function ThemeSwitcher({ layout = "inline" }: ThemeSwitcherProps) {
  const { activeThemeId, setActiveTheme } = useTheme();
  const { themeMenuOpen, setThemeMenuOpen } = useSiteUi();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const isBlock = layout === "block";
  const [blockListStyle, setBlockListStyle] = useState<CSSProperties>();

  const active =
    themes.find((theme) => theme.id === activeThemeId) ??
    themes.find((theme) => theme.id === SITE_DATA.defaultThemeId)!;

  useLayoutEffect(() => {
    if (!themeMenuOpen || !isBlock) {
      setBlockListStyle(undefined);
      return;
    }

    function updatePosition() {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - LIST_GAP;
      const maxHeight = Math.min(
        BLOCK_LIST_MAX_HEIGHT,
        Math.max(spaceBelow, 120),
      );

      setBlockListStyle({
        position: "fixed",
        top: rect.bottom + LIST_GAP,
        left: rect.left,
        width: rect.width,
        maxHeight,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [themeMenuOpen, isBlock]);

  useEffect(() => {
    if (!themeMenuOpen) return;

    function onPointerDown(event: MouseEvent) {
      const root = rootRef.current;
      if (!root || root.getClientRects().length === 0) return;

      const target = event.target;
      if (
        target instanceof Element &&
        target.closest(THEME_SWITCHER_SELECTOR)
      ) {
        return;
      }
      setThemeMenuOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setThemeMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [setThemeMenuOpen, themeMenuOpen]);

  const list =
    themeMenuOpen && (!isBlock || blockListStyle) ? (
      <ul
        className={cn(styles.list, {
          [styles.listBlock]: isBlock,
        })}
        id={listId}
        role="listbox"
        data-theme-switcher=""
        style={isBlock ? blockListStyle : undefined}
      >
        {themes.map((theme) => (
          <li key={theme.id} role="presentation">
            <button
              type="button"
              className={styles.option}
              role="option"
              aria-selected={theme.id === activeThemeId}
              onClick={() => {
                setActiveTheme(theme.id);
                setThemeMenuOpen(false);
              }}
            >
              <span
                className={styles.swatch}
                style={{ background: theme.accent }}
                aria-hidden="true"
              />
              <span>{theme.label}</span>
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div
      className={cn(styles.root, {
        [styles.rootBlock]: isBlock,
        [styles.rootOpen]: themeMenuOpen,
      })}
      ref={rootRef}
      data-theme-switcher=""
    >
      <button
        type="button"
        ref={buttonRef}
        className={cn(styles.button, {
          [styles.buttonBlock]: isBlock,
        })}
        aria-haspopup="listbox"
        aria-expanded={themeMenuOpen}
        aria-controls={listId}
        onClick={() => setThemeMenuOpen(!themeMenuOpen)}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span
          className={styles.swatch}
          style={{ background: active.accent }}
          aria-hidden="true"
        />
        <span className={styles.label}>{active.label}</span>
        <span
          className={cn(styles.chevron, { [styles.chevronOpen]: themeMenuOpen })}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {isBlock && list ? createPortal(list, document.body) : list}
    </div>
  );
}
