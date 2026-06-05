import { readFileSync, writeFileSync } from "node:fs";
import {
  GALLERY_END,
  GALLERY_START,
  PREVIEW_CAPTION_GAP,
  PREVIEW_CARD_GAP,
  PREVIEW_CELL_GAP,
  PREVIEW_DISPLAY_WIDTH,
  PREVIEW_README_DIR,
  PREVIEW_README_EXT,
} from "./constants.js";
import { escapeXml } from "./text.js";

/**
 * @param {import("../../utils/color.js").Palette} palette
 * @returns {string}
 */
function renderGalleryCard(palette) {
  const src = `${PREVIEW_README_DIR}/${palette.id}.${PREVIEW_README_EXT}`;
  const w = PREVIEW_DISPLAY_WIDTH;

  return `<div style="flex:0 1 ${w}px;max-width:100%;box-sizing:border-box;margin:0 0 ${PREVIEW_CARD_GAP}px">
<p style="margin:0 0 ${PREVIEW_CAPTION_GAP}px;text-align:left;line-height:1.45">
<strong>${escapeXml(palette.label)}</strong>
</p>
<img src="${src}" alt="${escapeXml(palette.label)} dark VS Code and Cursor theme preview" style="display:block;width:100%;max-width:${w}px;height:auto;margin:0;border-radius:8px" />
</div>`;
}

/**
 * Responsive flex gallery: each preview + caption stay grouped; ~two per row on wide viewports.
 * @param {import("../../utils/color.js").Palette[]} palettes
 * @returns {string}
 */
export function renderReadmePreviewGallery(palettes) {
  const cards = palettes.map((palette) => renderGalleryCard(palette)).join("\n");

  return `<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-start;column-gap:${PREVIEW_CELL_GAP}px;row-gap:0;max-width:100%">
${cards}
</div>`;
}

/**
 * @param {string} readmePath
 * @param {import("../../utils/color.js").Palette[]} palettes
 */
export function syncReadmePreviewGallery(readmePath, palettes) {
  const readme = readFileSync(readmePath, "utf8");
  const gallery = renderReadmePreviewGallery(palettes);
  const block = `${GALLERY_START}\n${gallery}\n${GALLERY_END}`;

  if (!readme.includes(GALLERY_START) || !readme.includes(GALLERY_END)) {
    throw new Error(
      `README is missing ${GALLERY_START} / ${GALLERY_END} markers`,
    );
  }

  const pattern = new RegExp(
    `${GALLERY_START}[\\s\\S]*?${GALLERY_END}`,
    "m",
  );
  writeFileSync(readmePath, readme.replace(pattern, block), "utf8");
}
