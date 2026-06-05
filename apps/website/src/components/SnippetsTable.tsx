import { useEffect, useMemo, useState } from "react";
import { PrefixPill } from "@/components/PrefixPill";
import { SnippetCode } from "@/components/SnippetCode";
import type { LanguageSnippet } from "@/lib/snippet-data";
import snippetStyles from "@/styles/ui/snippet.module.scss";
import styles from "./SnippetsTable.module.scss";

export type SnippetTableItem = {
  id: string;
  prefix: string;
  description: string;
  category: string;
  languageLabel?: string;
  languageSlug?: string;
  preview: LanguageSnippet | null;
};

type SnippetsTableProps = {
  items: SnippetTableItem[];
  searchQuery?: string;
  showLanguage?: boolean;
  onRequestPreview?: (id: string) => void;
};

function isRedundantCategory(category: string, languageLabel?: string) {
  const normalized = category.trim().toLowerCase();
  if (!languageLabel) return false;

  const lang = languageLabel.trim().toLowerCase();
  if (normalized === lang) return true;

  const short = languageLabel.match(/\(([^)]+)\)/)?.[1]?.trim().toLowerCase();
  return short ? normalized === short : false;
}

function buildMetaLine(
  row: SnippetTableItem,
  showLanguage: boolean,
): string | null {
  const parts: string[] = [];
  const showCategory = !isRedundantCategory(row.category, row.languageLabel);

  if (showCategory) parts.push(row.category);
  if (showLanguage && row.languageLabel) parts.push(row.languageLabel);

  return parts.length > 0 ? parts.join(" · ") : null;
}

function ChevronIcon() {
  return (
    <svg
      className={styles.expandIcon}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden="true"
    >
      <path
        d="M3.5 5.25 7 8.75l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SnippetsTable({
  items,
  searchQuery = "",
  showLanguage = false,
  onRequestPreview,
}: SnippetsTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const rows = useMemo(
    () => [...items].sort((a, b) => a.prefix.localeCompare(b.prefix)),
    [items],
  );
  const rowIds = useMemo(() => rows.map((row) => row.id).join("|"), [rows]);

  useEffect(() => {
    if (selectedId && !rows.some((row) => row.id === selectedId)) {
      setSelectedId(null);
    }
  }, [rows, selectedId]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSelectedId(null);
      return;
    }
    const first = rows[0];
    if (first) setSelectedId(first.id);
  }, [searchQuery, rowIds, rows]);

  function togglePreview(id: string) {
    const next = selectedId === id ? null : id;
    setSelectedId(next);
    if (next) {
      const row = rows.find((item) => item.id === id);
      if (row && !row.preview) {
        onRequestPreview?.(id);
      }
    }
  }

  return (
    <div className={styles.list}>
      <ul className={styles.items}>
        {rows.map((row) => {
          const isOpen = selectedId === row.id;
          const metaLine = buildMetaLine(row, showLanguage);

          return (
            <li
              key={row.id}
              className={isOpen ? `${styles.item} ${styles.itemOpen}` : styles.item}
            >
              <div className={styles.row}>
                <button
                  type="button"
                  className={styles.prefixBtn}
                  aria-expanded={isOpen}
                  onClick={() => togglePreview(row.id)}
                >
                  <span className={styles.prefix}>{row.prefix}</span>
                </button>

                <button
                  type="button"
                  className={styles.content}
                  aria-expanded={isOpen}
                  onClick={() => togglePreview(row.id)}
                >
                  <p className={styles.description}>{row.description}</p>
                  {metaLine ? (
                    <p className={styles.meta}>{metaLine}</p>
                  ) : null}
                </button>

                <div className={styles.actions}>
                  <div
                    className={styles.copyWrap}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <PrefixPill prefix={row.prefix} showPrefix={false} />
                  </div>
                  <button
                    type="button"
                    className={styles.expandBtn}
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen
                        ? `Hide preview for ${row.prefix}`
                        : `Show preview for ${row.prefix}`
                    }
                    onClick={() => togglePreview(row.id)}
                  >
                    <ChevronIcon />
                  </button>
                </div>
              </div>

              {isOpen ? (
                <div className={styles.itemBody}>
                  {row.preview ? (
                    <div className={styles.itemCode}>
                      <SnippetCode
                        code={row.preview.body}
                        language={row.preview.language}
                        defaultHtml={row.preview.defaultHtml}
                        className={snippetStyles.snippetCodeEmbedded}
                      />
                    </div>
                  ) : (
                    <p className={styles.itemLoading}>Loading preview…</p>
                  )}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
