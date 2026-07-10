import { cn } from "@/lib/cn";
import styles from "./SearchInput.module.scss";

const ICON_SIZE = 20;

function SearchGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L16.5 16.5" strokeLinecap="round" />
    </svg>
  );
}

function ClearGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      aria-hidden="true"
    >
      <path d="M8 8L16 16M16 8L8 16" strokeLinecap="round" />
    </svg>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
  compact = false,
  toolbar = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  compact?: boolean;
  /** Compact sizing tuned for the sticky snippet tab bar. */
  toolbar?: boolean;
}) {
  const hasValue = value.length > 0;

  return (
    <div
      className={cn(
        styles.wrap,
        compact && styles.wrapCompact,
        toolbar && styles.wrapToolbar,
        className,
      )}
    >
      <span className={styles.icon} aria-hidden="true">
        <SearchGlyph />
      </span>
      <input
        className={styles.input}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {hasValue ? (
        <button
          type="button"
          className={styles.clear}
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <ClearGlyph />
        </button>
      ) : null}
    </div>
  );
}
