import { SearchInput } from "@/components/SearchInput";
import { TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { SITE_DATA } from "@/generated/site-data";
import styles from "./SnippetTabs.module.scss";

type SnippetTabsProps = {
  search: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  };
};

export function SnippetTabs({ search }: SnippetTabsProps) {
  return (
    <nav className={styles.tabs} aria-label="Snippet languages">
      <div className={styles.bar}>
        <div className={styles.row}>
          <TabsList className={styles.list}>
            <TabsTrigger value="all" className={styles.tab}>
              All snippets
            </TabsTrigger>
            {SITE_DATA.languages.map((language) => (
              <TabsTrigger
                key={language.slug}
                value={language.slug}
                className={styles.tab}
              >
                {language.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <SearchInput
            value={search.value}
            onChange={search.onChange}
            placeholder={search.placeholder}
            compact
            toolbar
            className={styles.search}
          />
        </div>
      </div>
    </nav>
  );
}
