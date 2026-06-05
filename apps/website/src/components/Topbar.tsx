import { NavLink } from "react-router-dom";
import { ASSET_BASE, SITE_NAME, VS_MARKETPLACE } from "@/lib/config";
import { cn } from "@/lib/cn";
import { ThemeSwitcher } from "./ThemeSwitcher";
import styles from "./Topbar.module.scss";

export function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        <NavLink className={styles.brand} to="/">
          <img src={`${ASSET_BASE}/logo.png`} width={44} height={44} alt="Ether Themes logo" />
          <div className={styles.brandText}>
            <strong>{SITE_NAME}</strong>
            <span>VS Code &amp; Cursor extension</span>
          </div>
        </NavLink>
        <div className={styles.actions}>
          <nav className={styles.nav} aria-label="Primary">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(styles.navLink, { [styles.navLinkActive]: isActive })
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/themes"
              className={({ isActive }) =>
                cn(styles.navLink, { [styles.navLinkActive]: isActive })
              }
            >
              Themes
            </NavLink>
            <NavLink
              to="/snippets"
              className={({ isActive }) =>
                cn(styles.navLink, { [styles.navLinkActive]: isActive })
              }
            >
              Snippets
            </NavLink>
          </nav>
          <ThemeSwitcher />
          <a className={styles.navCta} href={VS_MARKETPLACE}>
            Install
          </a>
        </div>
      </div>
    </header>
  );
}
