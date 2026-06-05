import { GITHUB_REPO, OPEN_VSX, SITE_NAME, VS_MARKETPLACE } from "@/lib/config";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>{SITE_NAME}</strong> — 25 WCAG-validated dark themes, 496 snippets, and
        bundled language grammars.
      </div>
      <div className="footer-links">
        <a href={VS_MARKETPLACE}>VS Marketplace</a>
        <a href={OPEN_VSX}>Open VSX (Cursor)</a>
        <a href={GITHUB_REPO}>GitHub</a>
        <Link to="/snippets">Snippet docs</Link>
        <Link to="/themes">Theme gallery</Link>
      </div>
    </footer>
  );
}
