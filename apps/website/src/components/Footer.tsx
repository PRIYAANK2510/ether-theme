import { Link } from "react-router-dom";
import { GITHUB_REPO, OPEN_VSX, SITE_NAME, VS_MARKETPLACE } from "@/lib/config";
import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <strong>{SITE_NAME}</strong> — 25 WCAG-validated dark themes, 496 snippets, and
        bundled language grammars.
      </div>
      <div className={styles.links}>
        <a href={VS_MARKETPLACE}>VS Marketplace</a>
        <a href={OPEN_VSX}>Open VSX (Cursor)</a>
        <a href={GITHUB_REPO}>GitHub</a>
        <Link to="/snippets">Snippet docs</Link>
        <Link to="/themes">Theme gallery</Link>
      </div>
    </footer>
  );
}
