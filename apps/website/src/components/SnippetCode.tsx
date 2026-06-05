import { memo, useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/store/hooks";
import "@/styles/shiki-snippet.scss";
import styles from "@/styles/ui/snippet.module.scss";

type SnippetCodeProps = {
  code: string;
  language: string;
  defaultHtml?: string;
  className?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function SnippetCodeInner({
  code,
  language,
  defaultHtml,
  className,
}: SnippetCodeProps) {
  const themeId = useAppSelector((state) => state.theme.activeId);
  const defaultThemeId = useAppSelector((state) => state.theme.defaultId);
  const { ref, inView } = useInView<HTMLDivElement>();
  const onDefaultTheme = themeId === defaultThemeId;
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
        highlightSnippetCode(code, language, themeId),
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
    code,
    defaultHtml,
    defaultThemeId,
    inView,
    language,
    onDefaultTheme,
    themeId,
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
