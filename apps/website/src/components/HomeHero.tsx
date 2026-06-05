import { ExternalLink } from "@/components/ExternalLink";
import { SyntaxPreview } from "@/components/SyntaxPreview";
import { OPEN_VSX, VS_MARKETPLACE } from "@/lib/config";
import { SITE_DATA } from "@/generated/site-data";
import styles from "./HomeHero.module.scss";

export function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.kicker}>VS Code &amp; Cursor extension</p>
        <h1 className={styles.title}>
          Dark themes built for
          <span> long coding sessions</span>
        </h1>
        <p className={styles.lead}>
          Production-ready snippets, bundled grammars, and palettes you can
          preview live on this site before installing.
        </p>

        <p className={styles.meta}>
          <span>
            <strong>{SITE_DATA.paletteCount}</strong> themes
          </span>
          <span>
            <strong>{SITE_DATA.catalogCount}</strong> snippets
          </span>
          <span>
            <strong>4</strong> grammars
          </span>
          <span>
            <strong>WCAG AA</strong>
          </span>
        </p>

        <div className={styles.actions}>
          <ExternalLink className={styles.primaryAction} href={VS_MARKETPLACE}>
            Install on VS Code
          </ExternalLink>
          <ExternalLink className={styles.secondaryAction} href={OPEN_VSX}>
            Install on Cursor
          </ExternalLink>
        </div>
      </div>

      <div className={styles.preview}>
        <SyntaxPreview />
      </div>
    </section>
  );
}
