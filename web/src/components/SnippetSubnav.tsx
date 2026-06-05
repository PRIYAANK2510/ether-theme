import { NavLink } from "react-router-dom";
import { SITE_DATA } from "@/generated/site-data";

export function SnippetSubnav({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav className="subnav" aria-label="Snippet languages">
      <div className="subnav-inner">
        <NavLink to="/snippets" end className={!activeSlug ? "active" : undefined}>
          All snippets
        </NavLink>
        {SITE_DATA.languages.map((language) => (
          <NavLink
            key={language.slug}
            to={`/snippets/${language.slug}`}
            className={activeSlug === language.slug ? "active" : undefined}
          >
            {language.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
