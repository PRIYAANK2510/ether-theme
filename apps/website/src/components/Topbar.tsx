import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ExternalLink } from "@/components/ExternalLink";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME, VS_MARKETPLACE } from "@/lib/config";
import { cn } from "@/lib/cn";
import { useChrome } from "@/context/SiteContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import styles from "./Topbar.module.scss";

const NAV_ITEMS: Array<{
  to: string;
  label: string;
  end?: boolean;
}> = [
  { to: "/", end: true, label: "Home" },
  { to: "/themes", label: "Themes" },
  { to: "/snippets", label: "Snippets" },
];

function getFocusable(root: HTMLElement) {
  return [
    ...root.querySelectorAll<HTMLElement>(
      'a[href], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={styles.menuIcon}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      {open ? (
        <path
          d="M5 5l10 10M15 5 5 15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M3.5 6h13M3.5 10h13M3.5 14h13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function NavLinks({
  className,
  linkClassName,
  activeClassName,
  onNavigate,
}: {
  className?: string;
  linkClassName?: string;
  activeClassName?: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className={className} aria-label="Primary">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(linkClassName, {
              [activeClassName ?? styles.navLinkActive]: isActive,
            })
          }
          onClick={onNavigate}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function Topbar() {
  const {
    mobileNavOpen,
    setMobileNavOpen,
    themeMenuOpen,
    setThemeMenuOpen,
  } = useChrome();
  const location = useLocation();
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname, setMobileNavOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;

    const panel = panelRef.current;
    const firstLink = panel?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileNavOpen(false);
        setThemeMenuOpen(false);
        menuBtnRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panel) return;
      const focusable = getFocusable(panel);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen, setMobileNavOpen, setThemeMenuOpen]);

  function closeMenu() {
    setMobileNavOpen(false);
    setThemeMenuOpen(false);
  }

  function toggleMenu() {
    setMobileNavOpen(!mobileNavOpen);
  }

  return (
    <header
      className={cn(styles.topbar, {
        [styles.topbarMenuOpen]: mobileNavOpen,
        [styles.topbarThemeOpen]: themeMenuOpen,
      })}
    >
      <div className={styles.inner}>
        <NavLink className={styles.brand} to="/">
          <Logo className={styles.brandLogo} width={44} />
          <div className={styles.brandText}>
            <strong>{SITE_NAME}</strong>
            <span>VS Code &amp; Cursor extension</span>
          </div>
        </NavLink>

        <button
          type="button"
          ref={menuBtnRef}
          className={styles.menuBtn}
          aria-expanded={mobileNavOpen}
          aria-controls="topbar-mobile-panel"
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        >
          <MenuIcon open={mobileNavOpen} />
        </button>

        <div className={styles.desktopActions}>
          <NavLinks className={styles.nav} linkClassName={styles.navLink} />
          {!mobileNavOpen ? <ThemeSwitcher /> : null}
          <ExternalLink className={styles.navCta} href={VS_MARKETPLACE}>
            Install
          </ExternalLink>
        </div>
      </div>

      {mobileNavOpen ? (
        <>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div
            ref={panelRef}
            id="topbar-mobile-panel"
            className={styles.mobilePanel}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <NavLinks
              className={styles.mobileNav}
              linkClassName={styles.mobileNavLink}
              activeClassName={styles.mobileNavLinkActive}
              onNavigate={closeMenu}
            />
            <div
              className={cn(styles.mobileTools, {
                [styles.mobileToolsThemeOpen]: themeMenuOpen,
              })}
            >
              <ThemeSwitcher layout="block" />
              <ExternalLink
                className={styles.mobileCta}
                href={VS_MARKETPLACE}
                onClick={closeMenu}
              >
                Install extension
              </ExternalLink>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
