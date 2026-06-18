import { memo } from "react";
import { SITE_BASE } from "@/lib/config";
import { useTheme, useSiteUi } from "@/context/SiteContext";
import styles from "./ThemeCard.module.scss";

type PaletteSummary = {
  id: string;
  label: string;
  preview: string;
};

function ThemeCardInner({ palette }: { palette: PaletteSummary }) {
  const { setActiveTheme } = useTheme();
  const { openLightbox } = useSiteUi();
  const previewSrc = `${SITE_BASE}${palette.preview}`;

  function openPreview() {
    openLightbox({
      src: previewSrc,
      label: palette.label,
    });
  }

  function tryTheme() {
    setActiveTheme(palette.id);
  }

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.preview}
        aria-label={`Preview ${palette.label}`}
        onClick={openPreview}
      >
        <img
          className={styles.previewImage}
          src={previewSrc}
          alt={`${palette.label} editor preview`}
          loading="lazy"
          width={420}
          height={272}
        />
        <span className={styles.previewOverlay} aria-hidden="true" />
      </button>
      <div className={styles.footer}>
        <h3 className={styles.title}>{palette.label}</h3>
        <div className={styles.actions}>
          <button type="button" className={styles.tryPill} onClick={tryTheme}>
            Try
          </button>
          <button
            type="button"
            className={styles.previewPill}
            onClick={openPreview}
          >
            Preview
          </button>
        </div>
      </div>
    </article>
  );
}

export const ThemeCard = memo(ThemeCardInner);
