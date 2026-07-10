import { useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./PrefixPill.module.scss";

type PrefixPillProps = {
  prefix: string;
  showPrefix?: boolean;
};

export function PrefixPill({ prefix, showPrefix = true }: PrefixPillProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prefix);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      className={cn(styles.pill, {
        [styles.copied]: copied,
        [styles.pillCompact]: !showPrefix,
      })}
      onClick={copy}
      title={`Copy ${prefix} to clipboard`}
      aria-label={`Copy prefix ${prefix} to clipboard`}
    >
      {showPrefix ? (
        <>
          <span className={styles.prefix}>
            <code className={styles.code}>{prefix}</code>
          </span>
          <span className={styles.divider} aria-hidden="true" />
        </>
      ) : null}
      <span className={styles.action}>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
