import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeLightbox } from "@/store/uiSlice";

export function Lightbox() {
  const dispatch = useAppDispatch();
  const lightbox = useAppSelector((state) => state.ui.lightbox);
  if (!lightbox) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Theme preview"
      onClick={() => dispatch(closeLightbox())}
    >
      <button
        type="button"
        className="lightbox-close"
        aria-label="Close preview"
        onClick={() => dispatch(closeLightbox())}
      >
        &times;
      </button>
      <div className="lightbox-dialog" onClick={(event) => event.stopPropagation()}>
        <img src={lightbox.src} alt={`${lightbox.label} editor preview`} />
        <div className="lightbox-caption">
          <strong>{lightbox.label}</strong>
          <br />
          <span>{lightbox.character}</span>
        </div>
      </div>
    </div>
  );
}
