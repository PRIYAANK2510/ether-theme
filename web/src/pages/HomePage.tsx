import { Link } from "react-router-dom";
import { SyntaxPreview } from "@/components/SyntaxPreview";
import { ThemeCard } from "@/components/ThemeCard";
import { GITHUB_REPO, OPEN_VSX, VS_MARKETPLACE } from "@/lib/config";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SITE_DATA } from "@/generated/site-data";

export function HomePage() {
  useDocumentTitle("Ether Themes — Dark Themes & Snippets for VS Code and Cursor");
  const featured = SITE_DATA.palettes.slice(0, 8);

  return (
    <>
      <section className="landing-grid">
        <div className="landing-hero">
          <span className="hero-eyebrow">VS Code &amp; Cursor extension</span>
          <h1>Dark themes built for long coding sessions</h1>
          <p className="lead">
            Twenty-five WCAG-validated palettes, {SITE_DATA.catalogCount} production-ready
            snippets, and bundled grammars — one install, zero extra setup.
          </p>
          <p className="lead" style={{ marginTop: 12 }}>
            Use the theme picker in the nav to preview any Ether palette across the whole site.
          </p>
          <div className="cta-row">
            <a className="cta cta-primary" href={VS_MARKETPLACE}>
              Install on VS Code
            </a>
            <a className="cta" href={OPEN_VSX}>
              Install on Cursor
            </a>
            <Link className="cta" to="/themes">
              Browse themes
            </Link>
            <Link className="cta" to="/snippets">
              Browse snippets
            </Link>
          </div>
          <div className="stats">
            <div className="stat">
              <strong>{SITE_DATA.paletteCount}</strong>
              <span>dark themes</span>
            </div>
            <div className="stat">
              <strong>{SITE_DATA.catalogCount}</strong>
              <span>snippets</span>
            </div>
            <div className="stat">
              <strong>4</strong>
              <span>grammars</span>
            </div>
            <div className="stat">
              <strong>WCAG</strong>
              <span>validated palettes</span>
            </div>
          </div>
        </div>
        <SyntaxPreview />
      </section>

      <section className="feature-grid">
        <article className="feature-card">
          <h2>Theme gallery</h2>
          <p>
            From Aurora teal to Velvet plum — every palette ships with semantic highlighting tuned
            for readability.
          </p>
          <Link className="link" to="/themes">
            Explore all {SITE_DATA.paletteCount} themes →
          </Link>
        </article>
        <article className="feature-card">
          <h2>Snippet catalog</h2>
          <p>
            React 19, Next.js, TanStack Query, Zod, Vitest, HTML, and CSS prefixes across six
            editor scopes.
          </p>
          <Link className="link" to="/snippets">
            Search {SITE_DATA.catalogCount} snippets →
          </Link>
        </article>
        <article className="feature-card">
          <h2>Language support</h2>
          <p>Bundled TextMate grammars ship with the extension — no extra extensions required.</p>
          <div className="grammar-list">
            <span className="grammar-pill">Kotlin</span>
            <span className="grammar-pill">AIDL</span>
            <span className="grammar-pill">ProGuard</span>
            <span className="grammar-pill">Dotenv</span>
          </div>
        </article>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Featured themes</h2>
          <Link to="/themes">View full gallery</Link>
        </div>
        <div className="theme-strip">
          {featured.map((palette) => (
            <ThemeCard key={palette.id} palette={palette} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Get started in seconds</h2>
        <div className="grid">
          <article className="card">
            <h2>1. Install</h2>
            <p>
              Search <strong>Ether Themes</strong> in the Extensions panel or use the marketplace
              links above.
            </p>
          </article>
          <article className="card">
            <h2>2. Pick a theme</h2>
            <p>
              Press <code>Ctrl+K Ctrl+T</code> (or <code>Cmd+K Cmd+T</code>) and choose any Ether
              palette.
            </p>
          </article>
          <article className="card">
            <h2>3. Use snippets</h2>
            <p>
              Type a prefix like <code>rfc</code> or <code>usestate</code> in a matching file and
              press <strong>Tab</strong>.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="cta-row">
          <a className="cta cta-primary" href={VS_MARKETPLACE}>
            Install on VS Code
          </a>
          <a className="cta" href={OPEN_VSX}>
            Install on Cursor
          </a>
          <a className="cta" href={GITHUB_REPO}>
            View source on GitHub
          </a>
        </div>
      </section>
    </>
  );
}
