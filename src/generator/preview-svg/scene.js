import {
  darken,
  deriveCommentForeground,
  withAlpha,
} from "../../utils/color.js";
import { codeLine, trimTokensToWidth } from "./code-tokens.js";
import {
  BREADCRUMB_H,
  BREADCRUMB_SEGMENTS,
  CHROME_TOP,
  CODE_PAD_TOP,
  CODE_W,
  CODE_X,
  EDITOR_H,
  EDITOR_TOP,
  EDITOR_X,
  FONT_SIZE,
  GUTTER_W,
  H,
  LINE_H,
  SCROLLBAR_W,
  STATUS_H,
  TITLE_H,
  W,
  WIN_H,
  WIN_RX,
  WIN_W,
  WIN_X,
  WIN_Y,
  WINDOW_LIGHTS,
} from "./constants.js";
import { buildPreviewCodeLines } from "./sample-code.js";
import { escapeXml } from "./text.js";

/**
 * @param {import("../../utils/color.js").PaletteUITokens} ui
 * @returns {string}
 */
export function renderSceneFrame(ui) {
  return `<rect width="${W}" height="${H}" rx="${WIN_RX}" fill="${darken(ui.surfaceBorder, 0.2)}"/>
  <rect x="${WIN_X}" y="${WIN_Y + 1}" width="${WIN_W}" height="${WIN_H}" rx="${WIN_RX}" fill="#000" opacity="0.28" filter="url(#winShadow)"/>
  <rect x="${WIN_X}" y="${WIN_Y}" width="${WIN_W}" height="${WIN_H}" rx="${WIN_RX}" fill="${ui.surfaceShell}" stroke="${ui.surfaceBorder}" stroke-width="1"/>`;
}

/**
 * @param {import("../../utils/color.js").PaletteUITokens} ui
 * @returns {string}
 */
export function renderDefs(ui) {
  return `<filter id="winShadow" x="-15%" y="-10%" width="130%" height="125%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.5"/>
    </filter>
    <linearGradient id="titleFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${withAlpha(ui.surfaceShell, 0.6)}"/>
      <stop offset="100%" stop-color="${ui.surfaceShell}"/>
    </linearGradient>`;
}

/**
 * @param {import("../../utils/color.js").PaletteUITokens} ui
 * @returns {string}
 */
export function renderTitleBar(ui) {
  const y = WIN_Y;
  const dots = WINDOW_LIGHTS.map(
    ({ cxOffset, fill }) =>
      `<circle cx="${WIN_X + cxOffset}" cy="${y + 11}" r="3.5" fill="${fill}" opacity="0.88"/>`,
  ).join("");

  return `<rect x="${WIN_X}" y="${y}" width="${WIN_W}" height="${TITLE_H}" fill="url(#titleFade)"/>
  <rect x="${WIN_X}" y="${y + TITLE_H - 1}" width="${WIN_W}" height="1" fill="${ui.surfaceBorder}" opacity="0.65"/>
  ${dots}
  <text x="${WIN_X + WIN_W / 2}" y="${y + 12}" class="title" fill="${ui.fgMuted}" text-anchor="middle">Ether</text>`;
}

/**
 * @param {"folder" | "file" | "symbol"} kind
 * @param {import("../../utils/color.js").PaletteUITokens} ui
 * @param {string} accent
 * @returns {{ fill: string, weight: string }}
 */
function breadcrumbSegmentStyle(kind, ui, accent) {
  switch (kind) {
    case "file":
      return { fill: accent, weight: "600" };
    case "symbol":
      return { fill: ui.fgPrimary, weight: "500" };
    default:
      return { fill: ui.fgMuted, weight: "400" };
  }
}

/**
 * @param {import("../../utils/color.js").PaletteUITokens} ui
 * @param {string} accent
 * @returns {string}
 */
export function renderBreadcrumb(ui, accent) {
  const y = CHROME_TOP;
  const textX = EDITOR_X + 10;
  const textY = y + 11.5;

  const tspans = BREADCRUMB_SEGMENTS.flatMap((seg, index) => {
    const parts = [];
    if (index > 0) {
      parts.push(
        `<tspan fill="${ui.fgActivity}" opacity="0.28"> \u203a </tspan>`,
      );
    }
    const { fill, weight } = breadcrumbSegmentStyle(seg.kind, ui, accent);
    parts.push(
      `<tspan fill="${fill}" font-weight="${weight}">${escapeXml(seg.text)}</tspan>`,
    );
    return parts;
  }).join("");

  return `<rect x="${EDITOR_X}" y="${y}" width="${WIN_W}" height="${BREADCRUMB_H}" fill="${ui.surfacePanel}" opacity="0.45"/>
  <rect x="${EDITOR_X}" y="${y + BREADCRUMB_H - 1}" width="${WIN_W}" height="1" fill="${ui.surfaceBorder}" opacity="0.35"/>
  <text x="${textX}" y="${textY}" class="crumb">${tspans}</text>`;
}

/**
 * @param {import("../../utils/color.js").PaletteUITokens} ui
 * @returns {string}
 */
function renderScrollbar(ui) {
  const x = WIN_X + WIN_W - SCROLLBAR_W - 1;
  const thumbY = EDITOR_TOP + EDITOR_H * 0.08;
  const thumbH = EDITOR_H * 0.55;

  return `<rect x="${x + 1}" y="${thumbY}" width="${SCROLLBAR_W - 2}" height="${thumbH}" rx="${SCROLLBAR_W / 2}" fill="${withAlpha(ui.scrollbar, 0.4)}"/>`;
}

/**
 * @param {import("../../utils/color.js").PaletteUITokens} ui
 * @param {import("../../utils/color.js").PaletteSyntaxTokens} syntax
 * @param {number} startX
 * @param {number} cy
 * @returns {string}
 */
function renderStatusBarPalette(ui, syntax, startX, cy) {
  const colors = [
    ui.accent,
    syntax.keyword,
    syntax.string,
    syntax.function,
    syntax.type,
    syntax.variable,
  ];
  const spacing = 8;

  return colors
    .map(
      (fill, index) =>
        `<circle cx="${startX + index * spacing}" cy="${cy}" r="2.5" fill="${fill}" stroke="${withAlpha(ui.surfaceBorder, 0.45)}" stroke-width="0.4"/>`,
    )
    .join("");
}

/**
 * @param {import("../../utils/color.js").PaletteUITokens} ui
 * @param {import("../../utils/color.js").PaletteSyntaxTokens} syntax
 * @returns {string}
 */
export function renderStatusBar(ui, syntax) {
  const y = WIN_Y + WIN_H - STATUS_H;
  const dotCy = y + STATUS_H / 2;
  const paletteSpacing = 8;
  const paletteCount = 6;
  const paletteBlockW = (paletteCount - 1) * paletteSpacing;
  const paletteX = WIN_X + (WIN_W - paletteBlockW) / 2;
  const barFill = darken(ui.surfacePanel, 0.04);

  return `<rect x="${WIN_X}" y="${y}" width="${WIN_W}" height="${STATUS_H}" fill="${barFill}"/>
  <rect x="${WIN_X}" y="${y}" width="${WIN_W}" height="1" fill="${ui.surfaceBorder}" opacity="0.5"/>
  ${renderStatusBarPalette(ui, syntax, paletteX, dotCy)}`;
}

/**
 * @param {import("../../utils/color.js").Palette} palette
 * @returns {string}
 */
export function renderEditorSpace(palette) {
  const { ui, syntax } = palette;
  const comment = deriveCommentForeground(ui);
  const gutterX = EDITOR_X;

  const codeLayer = buildPreviewCodeLines()
    .map((entry, index) => {
      const y = CODE_PAD_TOP + index * LINE_H;
      const nums = `<text x="${gutterX + GUTTER_W - 5}" y="${y}" class="gutter" fill="${ui.fgActivity}" opacity="0.45" text-anchor="end">${entry.line}</text>`;
      const trimmed = trimTokensToWidth(entry.tokens, CODE_W);
      const code = trimmed.some((t) => t.text.length > 0)
        ? codeLine(trimmed, syntax, comment, CODE_X, y)
        : "";
      return `${nums}${code}`;
    })
    .join("");

  return `<rect x="${EDITOR_X}" y="${EDITOR_TOP}" width="${WIN_W}" height="${EDITOR_H}" fill="${ui.surfaceEditor}"/>
    <g clip-path="url(#codeClip)">${codeLayer}</g>
    ${renderScrollbar(ui)}`;
}

/**
 * Shared monospace font stack for preview text.
 * @returns {string}
 */
export function renderPreviewStyles() {
  return `.code, .gutter, .ui, .crumb, .title {
        font-family: "JetBrains Mono", "Cascadia Code", "SF Mono", Consolas, Menlo, monospace;
      }
      .code, .gutter { font-size: ${FONT_SIZE}px; }
      .gutter { opacity: 0.9; }
      .ui { font-size: 7.5px; }
      .crumb { font-size: 7px; letter-spacing: 0.015em; }
      .title { font-size: 7px; letter-spacing: 0.04em; }`;
}

/**
 * @returns {string}
 */
export function renderClipPaths() {
  return `<clipPath id="winClip"><rect x="${WIN_X}" y="${WIN_Y}" width="${WIN_W}" height="${WIN_H}" rx="${WIN_RX}"/></clipPath>
    <clipPath id="codeClip"><rect x="${EDITOR_X}" y="${EDITOR_TOP}" width="${WIN_W}" height="${EDITOR_H}"/></clipPath>`;
}
