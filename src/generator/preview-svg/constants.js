/** README gallery links raster previews under this directory. */
export const PREVIEW_README_DIR = "docs/previews";

/** Fixed display width for README PNG previews (matches viewBox W). */
export const PREVIEW_DISPLAY_WIDTH = 420;

/** Horizontal gap between previews on the same row (px). */
export const PREVIEW_CELL_GAP = 48;

/** Space below each theme card before the next (px). */
export const PREVIEW_CARD_GAP = 64;

/** Space between caption block and its preview image (px). */
export const PREVIEW_CAPTION_GAP = 10;

/** README gallery uses PNG (markdown linters reject SVG img src). */
export const PREVIEW_README_EXT = "png";

/** Logical canvas (viewBox) — 420px wide in docs, exported at high DPI. */
export const W = 420;
export const H = 272;

/** Inset for drop shadow only — window fills the card. */
export const WIN_X = 4;
export const WIN_Y = 4;
export const WIN_W = W - WIN_X * 2;
export const WIN_H = H - WIN_Y * 2;
export const WIN_RX = 10;
export const TITLE_H = 18;
export const BREADCRUMB_H = 17;
export const STATUS_H = 16;

/** Editor-first layout (no sidebar) — matches full-width VS Code / Cursor. */
export const EDITOR_X = WIN_X;
export const GUTTER_W = 22;
export const SCROLLBAR_W = 5;
export const CODE_X = EDITOR_X + GUTTER_W;
export const CHROME_TOP = WIN_Y + TITLE_H;
export const EDITOR_TOP = CHROME_TOP + BREADCRUMB_H;
export const EDITOR_BOTTOM = WIN_Y + WIN_H - STATUS_H;
export const EDITOR_H = EDITOR_BOTTOM - EDITOR_TOP;
export const CODE_PAD_TOP = EDITOR_TOP + 9;
export const LINE_H = 10.5;
export const FONT_SIZE = 7.5;
export const CODE_RIGHT = WIN_X + WIN_W - SCROLLBAR_W - 3;
export const CODE_W = CODE_RIGHT - CODE_X;

/** 2× SVG attributes; PNG rasterized at 5× display width for crisp README images. */
export const PREVIEW_VECTOR_SCALE = 2;
export const PREVIEW_SVG_WIDTH = W * PREVIEW_VECTOR_SCALE;
export const PREVIEW_SVG_HEIGHT = H * PREVIEW_VECTOR_SCALE;

/** PNG export width (5× logical width → 2100px). */
export const PNG_RENDER_WIDTH = PREVIEW_DISPLAY_WIDTH * 5;

/** Approximate monospace advance (px) for layout without measuring fonts. */
export const CHAR_W = { code: 4.6, ui: 4.2, crumb: 4.0 };

/** macOS-style window control colors. */
export const WINDOW_LIGHTS = [
  { cxOffset: 14, fill: "#ff5f57" },
  { cxOffset: 26, fill: "#febc2e" },
  { cxOffset: 38, fill: "#28c840" },
];

/** Breadcrumb path shown in every preview. */
export const BREADCRUMB_SEGMENTS = [
  { text: "src", kind: "folder" },
  { text: "lib", kind: "folder" },
  { text: "store", kind: "file" },
  { text: "normalizeId", kind: "symbol" },
];

export const GALLERY_START = "<!-- PREVIEW_GALLERY_START -->";
export const GALLERY_END = "<!-- PREVIEW_GALLERY_END -->";
