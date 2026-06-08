import { Link } from "react-router-dom";
import { ExternalLink } from "@/components/ExternalLink";
import { HomeHero } from "@/components/HomeHero";
import { ThemeCard } from "@/components/ThemeCard";
import { GITHUB_REPO, OPEN_VSX, VS_MARKETPLACE } from "@/lib/config";
import { usePageSeo } from "@/hooks/usePageSeo";
import { HOME_SEO } from "../../../../shared/site-seo.js";
import { SITE_DATA } from "@/generated/site-data";
import gridStyles from "@/styles/ui/grid.module.scss";
import styles from "./HomePage.module.scss";

const GRAMMARS = [
  "Astro",
  "Vue",
  "Svelte",
  "MDX",
  "Angular",
  "Kotlin",
  "AIDL",
  "ProGuard",
] as const;

export function HomePage() {
  usePageSeo(HOME_SEO);
  const featured = SITE_DATA.palettes.slice(0, 6);

  return (
    <>
      <HomeHero />

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2>Try any palette live</h2>
            <p>Apply a theme to this site instantly — no install required.</p>
          </div>
          <Link to="/themes">All {SITE_DATA.paletteCount} themes</Link>
        </div>
        <div className={gridStyles.themeStrip}>
          {featured.map((palette) => (
            <ThemeCard key={palette.id} palette={palette} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2>One extension, three pillars</h2>
            <p>
              Everything ships together — themes, snippets, and grammars in a
              single install.
            </p>
          </div>
        </div>
        <div className={styles.capabilities}>
          <Link className={styles.capability} to="/themes">
            <span className={styles.capValue}>{SITE_DATA.paletteCount}</span>
            <span className={styles.capTitle}>Dark themes</span>
            <span className={styles.capDesc}>
              WCAG-validated palettes with tuned syntax highlighting.
            </span>
          </Link>
          <Link className={styles.capability} to="/snippets">
            <span className={styles.capValue}>{SITE_DATA.catalogCount}</span>
            <span className={styles.capTitle}>Snippets</span>
            <span className={styles.capDesc}>
              React, Next.js, TypeScript, HTML, and CSS across six editor
              scopes.
            </span>
          </Link>
          <div className={styles.capabilityStatic}>
            <span className={styles.capValue}>8</span>
            <span className={styles.capTitle}>Bundled grammars</span>
            <span className={styles.capDesc}>
              Astro, Vue, Svelte, MDX, Angular, and Android — no extra
              extensions required.
            </span>
            <div className={styles.capTags}>
              {GRAMMARS.map((grammar) => (
                <span className={styles.capTag} key={grammar}>
                  {grammar}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2>Quick start</h2>
            <p>Install once, pick a palette, and start typing prefixes.</p>
          </div>
          <ExternalLink className={styles.workflowLink} href={GITHUB_REPO}>
            GitHub →
          </ExternalLink>
        </div>
        <div className={styles.workflow}>
          <article className={styles.workflowStep}>
            <span className={styles.workflowIndex}>01</span>
            <h3>Install</h3>
            <p>
              Search <strong>Ether Themes</strong> in Extensions, or use{" "}
              <ExternalLink href={VS_MARKETPLACE}>VS Marketplace</ExternalLink>{" "}
              / <ExternalLink href={OPEN_VSX}>Open VSX</ExternalLink>.
            </p>
          </article>
          <article className={styles.workflowStep}>
            <span className={styles.workflowIndex}>02</span>
            <h3>Choose a theme</h3>
            <p>
              Press <code>Ctrl+K Ctrl+T</code> and pick any Ether palette in
              your editor.
            </p>
          </article>
          <article className={styles.workflowStep}>
            <span className={styles.workflowIndex}>03</span>
            <h3>Expand with snippets</h3>
            <p>
              Type a prefix like <code>usestate</code> or <code>rfc</code>, then
              press <strong>Tab</strong>.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
