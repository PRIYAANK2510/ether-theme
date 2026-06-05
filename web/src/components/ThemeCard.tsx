import { SITE_BASE } from "@/lib/config";
import { useAppDispatch } from "@/store/hooks";
import { setTheme } from "@/store/themeSlice";
import { openLightbox } from "@/store/uiSlice";

type PaletteSummary = {
  id: string;
  label: string;
  character: string;
  preview: string;
};

export function ThemeCard({ palette }: { palette: PaletteSummary }) {
  const dispatch = useAppDispatch();
  const previewSrc = `${SITE_BASE}${palette.preview}`;

  return (
    <article className="theme-card">
      <button
        type="button"
        className="theme-preview"
        aria-label={`Preview ${palette.label}`}
        onClick={() =>
          dispatch(
            openLightbox({
              src: previewSrc,
              label: palette.label,
              character: palette.character,
            }),
          )
        }
      >
        <img
          src={previewSrc}
          alt={`${palette.label} editor preview`}
          loading="lazy"
          width={420}
          height={272}
        />
      </button>
      <div className="theme-card-body">
        <h3>{palette.label}</h3>
        <p>{palette.character}</p>
        <button
          type="button"
          className="try-theme"
          onClick={() => {
            dispatch(setTheme(palette.id));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Try on site
        </button>
      </div>
    </article>
  );
}
