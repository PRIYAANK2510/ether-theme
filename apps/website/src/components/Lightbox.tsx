import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeLightbox } from "@/store/uiSlice";
import styles from "./Lightbox.module.scss";

export function Lightbox() {
  const dispatch = useAppDispatch();
  const lightbox = useAppSelector((state) => state.ui.lightbox);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!lightbox) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        dispatch(closeLightbox());
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [dispatch, lightbox]);

  if (!lightbox) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${lightbox.label} preview`}
      onClick={() => dispatch(closeLightbox())}
    >
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        aria-label="Close preview"
        onClick={() => dispatch(closeLightbox())}
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
      <div className={styles.dialog} onClick={(event) => event.stopPropagation()}>
        <img src={lightbox.src} alt={`${lightbox.label} editor preview`} />
        <div className={styles.caption}>
          <strong>{lightbox.label}</strong>
        </div>
      </div>
    </div>
  );
}
