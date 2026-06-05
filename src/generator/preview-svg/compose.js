import { H, PREVIEW_SVG_HEIGHT, PREVIEW_SVG_WIDTH, W } from "./constants.js";
import {
  renderBreadcrumb,
  renderClipPaths,
  renderDefs,
  renderEditorSpace,
  renderPreviewStyles,
  renderSceneFrame,
  renderStatusBar,
  renderTitleBar,
} from "./scene.js";
import { escapeXml } from "./text.js";

/**
 * @param {import("../../utils/color.js").Palette} palette
 * @returns {string}
 */
export function renderThemePreviewSvg(palette) {
  const { ui, syntax } = palette;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${PREVIEW_SVG_WIDTH}" height="${PREVIEW_SVG_HEIGHT}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXml(palette.label)} theme preview" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
  <title>${escapeXml(palette.label)}</title>
  <defs>
    ${renderDefs(ui)}
    <style>
      ${renderPreviewStyles()}
    </style>
    ${renderClipPaths()}
  </defs>
  ${renderSceneFrame(ui)}
  <g clip-path="url(#winClip)">
    ${renderTitleBar(ui)}
    ${renderBreadcrumb(ui, ui.accent)}
    ${renderEditorSpace(palette)}
    ${renderStatusBar(ui, syntax)}
  </g>
</svg>
`;
}
