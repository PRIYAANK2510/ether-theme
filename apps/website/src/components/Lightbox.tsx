import { useEffect, useRef } from "react";
import { useSiteUi } from "@/context/SiteContext";
import styles from "./Lightbox.module.scss";

export function Lightbox() {
  const { lightbox, closeLightbox } = useSiteUi();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!lightbox) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeLightbox, lightbox]);

  if (!lightbox) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${lightbox.label} preview`}
      onClick={closeLightbox}
    >
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        aria-label="Close preview"
        onClick={closeLightbox}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M8 8L16 16M16 8L8 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <img src={lightbox.src} alt={`${lightbox.label} editor preview`} />
        <div className={styles.caption}>
          <strong>{lightbox.label}</strong>
        </div>
      </div>
    </div>
  );
}
