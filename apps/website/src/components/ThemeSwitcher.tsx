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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme } from "@/store/themeSlice";
import { setThemeMenuOpen } from "@/store/uiSlice";
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
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((state) => state.theme.activeId);
  const open = useAppSelector((state) => state.ui.themeMenuOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const isBlock = layout === "block";
  const [blockListStyle, setBlockListStyle] = useState<CSSProperties>();

  const active =
    themes.find((theme) => theme.id === activeId) ??
    themes.find((theme) => theme.id === SITE_DATA.defaultThemeId)!;

  useLayoutEffect(() => {
    if (!open || !isBlock) {
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
  }, [open, isBlock]);

  useEffect(() => {
    if (!open) return;

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
      dispatch(setThemeMenuOpen(false));
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
  }, [dispatch, open]);

  const list =
    open && (!isBlock || blockListStyle) ? (
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
              aria-selected={theme.id === activeId}
              onClick={() => {
                dispatch(setTheme(theme.id));
                dispatch(setThemeMenuOpen(false));
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
        [styles.rootOpen]: open,
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
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => dispatch(setThemeMenuOpen(!open))}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span
          className={styles.swatch}
          style={{ background: active.accent }}
          aria-hidden="true"
        />
        <span className={styles.label}>{active.label}</span>
        <span
          className={cn(styles.chevron, { [styles.chevronOpen]: open })}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {isBlock && list ? createPortal(list, document.body) : list}
    </div>
  );
}
