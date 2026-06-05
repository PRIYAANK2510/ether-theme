import styles from "./SearchEmptyState.module.scss";

export function SearchEmptyState({
  title,
  hint,
  onClear,
}: {
  title: string;
  hint?: string;
  onClear?: () => void;
}) {
  return (
    <div className={styles.root} role="status">
      <div className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20L16.5 16.5" strokeLinecap="round" />
          <path d="M8.5 11H13.5" strokeLinecap="round" opacity="0.55" />
        </svg>
      </div>
      <p className={styles.title}>{title}</p>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
      {onClear ? (
        <button type="button" className={styles.clearButton} onClick={onClear}>
          Clear search
        </button>
      ) : null}
    </div>
  );
}
