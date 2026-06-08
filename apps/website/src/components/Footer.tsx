import { Link } from "react-router-dom";
import { ExternalLink } from "@/components/ExternalLink";
import { GITHUB_REPO, OPEN_VSX, SITE_NAME, VS_MARKETPLACE } from "@/lib/config";
import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <strong>{SITE_NAME}</strong> — 35 WCAG-validated dark themes, 496
        snippets, and bundled Astro, Vue, Svelte, MDX, and Android grammars.
      </div>
      <div className={styles.links}>
        <ExternalLink href={VS_MARKETPLACE}>VS Marketplace</ExternalLink>
        <ExternalLink href={OPEN_VSX}>Open VSX (Cursor)</ExternalLink>
        <ExternalLink href={GITHUB_REPO}>GitHub</ExternalLink>
        <Link to="/snippets">Snippet docs</Link>
        <Link to="/themes">Theme gallery</Link>
      </div>
    </footer>
  );
}
