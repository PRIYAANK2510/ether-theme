import { NavLink } from "react-router-dom";
import { ASSET_BASE, SITE_NAME, VS_MARKETPLACE } from "@/lib/config";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <NavLink className="brand" to="/">
          <img src={`${ASSET_BASE}/logo.png`} width={44} height={44} alt="Ether Themes logo" />
          <div className="brand-text">
            <strong>{SITE_NAME}</strong>
            <span>VS Code &amp; Cursor extension</span>
          </div>
        </NavLink>
        <div className="topbar-actions">
          <nav className="nav" aria-label="Primary">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/themes">Themes</NavLink>
            <NavLink to="/snippets">Snippets</NavLink>
          </nav>
          <ThemeSwitcher />
          <a className="nav-cta" href={VS_MARKETPLACE}>
            Install
          </a>
        </div>
      </div>
    </header>
  );
}
