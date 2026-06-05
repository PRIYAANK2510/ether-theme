import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";
import { SITE_DATA } from "@/generated/site-data";
import styles from "./SnippetSubnav.module.scss";

export function SnippetSubnav() {
  return (
    <nav className={styles.subnav} aria-label="Snippet languages">
      <div className={styles.inner}>
        <NavLink
          to="/snippets"
          end
          className={({ isActive }) => cn(styles.link, { [styles.linkActive]: isActive })}
        >
          All snippets
        </NavLink>
        {SITE_DATA.languages.map((language) => (
          <NavLink
            key={language.slug}
            to={`/snippets/${language.slug}`}
            className={({ isActive }) => cn(styles.link, { [styles.linkActive]: isActive })}
          >
            {language.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
