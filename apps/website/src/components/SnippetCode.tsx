import { escapeHtml } from "@shared/html.js";
import { memo, useDeferredValue, useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";
import { useTheme } from "@/context/SiteContext";
import { SITE_DATA } from "@/generated/site-data";
import "@/styles/shiki-snippet.scss";
import styles from "@/styles/ui/snippet.module.scss";

type SnippetCodeProps = {
  code: string;
  language: string;
  defaultHtml?: string;
  className?: string;
};

function SnippetCodeInner({
  code,
  language,
  defaultHtml,
  className,
}: SnippetCodeProps) {
  const { activeThemeId } = useTheme();
  const highlightThemeId = useDeferredValue(activeThemeId);
  const defaultThemeId = SITE_DATA.defaultThemeId;
  const { ref, inView } = useInView<HTMLDivElement>();
  const onDefaultTheme = highlightThemeId === defaultThemeId;
  const [html, setHtml] = useState<string | null>(defaultHtml ?? null);

  useEffect(() => {
    if (onDefaultTheme) {
      setHtml(defaultHtml ?? null);
      return;
    }

    if (!inView) return;

    let cancelled = false;

    import("@/lib/shiki")
      .then(({ highlightSnippetCode }) =>
        highlightSnippetCode(code, language, highlightThemeId),
      )
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        if (!cancelled && !defaultHtml) {
          setHtml(
            `<pre class="shiki ether-snippet-shiki"><code>${escapeHtml(code)}</code></pre>`,
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    highlightThemeId,
    code,
    defaultHtml,
    defaultThemeId,
    inView,
    language,
    onDefaultTheme,
  ]);

  const displayHtml = html ?? defaultHtml ?? null;

  if (!displayHtml) {
    return (
      <div
        ref={ref}
        className={cn("snippetCode", styles.snippetCode, className)}
      >
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("snippetCode", styles.snippetCode, className)}
      dangerouslySetInnerHTML={{ __html: displayHtml }}
    />
  );
}

export const SnippetCode = memo(SnippetCodeInner);
