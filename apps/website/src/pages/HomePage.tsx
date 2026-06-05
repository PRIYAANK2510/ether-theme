import { Link } from "react-router-dom";
import { SyntaxPreview } from "@/components/SyntaxPreview";
import { ThemeCard } from "@/components/ThemeCard";
import { GITHUB_REPO, OPEN_VSX, VS_MARKETPLACE } from "@/lib/config";
import { cn } from "@/lib/cn";
import { usePageSeo } from "@/hooks/usePageSeo";
import { HOME_SEO } from "../../../../shared/site-seo.js";
import { SITE_DATA } from "@/generated/site-data";
import buttonStyles from "@/styles/ui/button.module.scss";
import cardStyles from "@/styles/ui/card.module.scss";
import gridStyles from "@/styles/ui/grid.module.scss";
import pageStyles from "@/styles/ui/page.module.scss";

export function HomePage() {
  usePageSeo(HOME_SEO);
  const featured = SITE_DATA.palettes.slice(0, 8);

  return (
    <>
      <section className={gridStyles.landingGrid}>
        <div className={gridStyles.landingHero}>
          <span className={pageStyles.heroEyebrow}>VS Code &amp; Cursor extension</span>
          <h1>Dark themes built for long coding sessions</h1>
          <p className={pageStyles.lead}>
            Twenty-five WCAG-validated palettes, {SITE_DATA.catalogCount} production-ready
            snippets, and bundled grammars — one install, zero extra setup.
          </p>
          <p className={cn(pageStyles.lead, pageStyles.leadSpaced)}>
            Use the theme picker in the nav to preview any Ether palette across the whole site.
          </p>
          <div className={buttonStyles.ctaRow}>
            <a className={cn(buttonStyles.cta, buttonStyles.ctaPrimary)} href={VS_MARKETPLACE}>
              Install on VS Code
            </a>
            <a className={buttonStyles.cta} href={OPEN_VSX}>
              Install on Cursor
            </a>
            <Link className={buttonStyles.cta} to="/themes">
              Browse themes
            </Link>
            <Link className={buttonStyles.cta} to="/snippets">
              Browse snippets
            </Link>
          </div>
          <div className={cardStyles.stats}>
            <div className={cardStyles.stat}>
              <strong>{SITE_DATA.paletteCount}</strong>
              <span>dark themes</span>
            </div>
            <div className={cardStyles.stat}>
              <strong>{SITE_DATA.catalogCount}</strong>
              <span>snippets</span>
            </div>
            <div className={cardStyles.stat}>
              <strong>4</strong>
              <span>grammars</span>
            </div>
            <div className={cardStyles.stat}>
              <strong>WCAG</strong>
              <span>validated palettes</span>
            </div>
          </div>
        </div>
        <SyntaxPreview />
      </section>

      <section className={gridStyles.featureGrid}>
        <article className={cardStyles.featureCard}>
          <h2>Theme gallery</h2>
          <p>
            From Aurora teal to Velvet plum — every palette ships with semantic highlighting tuned
            for readability.
          </p>
          <Link className={buttonStyles.link} to="/themes">
            Explore all {SITE_DATA.paletteCount} themes →
          </Link>
        </article>
        <article className={cardStyles.featureCard}>
          <h2>Snippet catalog</h2>
          <p>
            React 19, Next.js, TanStack Query, Zod, Vitest, HTML, and CSS prefixes across six
            editor scopes.
          </p>
          <Link className={buttonStyles.link} to="/snippets">
            Search {SITE_DATA.catalogCount} snippets →
          </Link>
        </article>
        <article className={cardStyles.featureCard}>
          <h2>Language support</h2>
          <p>Bundled TextMate grammars ship with the extension — no extra extensions required.</p>
          <div className={cardStyles.grammarList}>
            <span className={cardStyles.grammarPill}>Kotlin</span>
            <span className={cardStyles.grammarPill}>AIDL</span>
            <span className={cardStyles.grammarPill}>ProGuard</span>
            <span className={cardStyles.grammarPill}>Dotenv</span>
          </div>
        </article>
      </section>

      <section className={pageStyles.section}>
        <div className={pageStyles.sectionHead}>
          <h2>Featured themes</h2>
          <Link to="/themes">View full gallery</Link>
        </div>
        <div className={gridStyles.themeStrip}>
          {featured.map((palette) => (
            <ThemeCard key={palette.id} palette={palette} />
          ))}
        </div>
      </section>

      <section className={pageStyles.section}>
        <h2>Get started in seconds</h2>
        <div className={gridStyles.grid}>
          <article className={cardStyles.card}>
            <h2>1. Install</h2>
            <p>
              Search <strong>Ether Themes</strong> in the Extensions panel or use the marketplace
              links above.
            </p>
          </article>
          <article className={cardStyles.card}>
            <h2>2. Pick a theme</h2>
            <p>
              Press <code>Ctrl+K Ctrl+T</code> (or <code>Cmd+K Cmd+T</code>) and choose any Ether
              palette.
            </p>
          </article>
          <article className={cardStyles.card}>
            <h2>3. Use snippets</h2>
            <p>
              Type a prefix like <code>rfc</code> or <code>usestate</code> in a matching file and
              press <strong>Tab</strong>.
            </p>
          </article>
        </div>
      </section>

      <section className={pageStyles.section}>
        <div className={buttonStyles.ctaRow}>
          <a className={cn(buttonStyles.cta, buttonStyles.ctaPrimary)} href={VS_MARKETPLACE}>
            Install on VS Code
          </a>
          <a className={buttonStyles.cta} href={OPEN_VSX}>
            Install on Cursor
          </a>
          <a className={buttonStyles.cta} href={GITHUB_REPO}>
            View source on GitHub
          </a>
        </div>
      </section>
    </>
  );
}
