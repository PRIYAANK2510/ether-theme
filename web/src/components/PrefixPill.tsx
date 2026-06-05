import { useState } from "react";

export function PrefixPill({ prefix }: { prefix: string }) {
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
      className={`prefix-pill${copied ? " copied" : ""}`}
      onClick={copy}
      title="Copy prefix to clipboard"
    >
      <code>{prefix}</code>
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
