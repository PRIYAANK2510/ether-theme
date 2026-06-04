import {
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import {
  darken,
  deriveCommentForeground,
  withAlpha,
} from "../utils/color.js";

/** README gallery links raster previews under this directory. */
export const PREVIEW_README_DIR = "docs/previews";

/** Fixed display width for README PNG previews (matches viewBox W). */
export const PREVIEW_DISPLAY_WIDTH = 420;

/** Horizontal gap between previews on the same row (px). */
const PREVIEW_CELL_GAP = 48;

/** Space below a caption before the next theme preview (px). */
const PREVIEW_CARD_GAP = 48;

/** Space between preview image and its caption (px). */
const PREVIEW_CAPTION_GAP = 6;

/** README gallery uses PNG (markdown linters reject SVG img src). */
export const PREVIEW_README_EXT = "png";

/** Logical canvas (viewBox) — 420px wide in docs, exported at high DPI. */
const W = 420;
const H = 264;

/** Inset for drop shadow only — window fills the card. */
const WIN_X = 3;
const WIN_Y = 3;
const WIN_W = W - WIN_X * 2;
const WIN_H = H - WIN_Y * 2;
const WIN_RX = 10;
const TITLE_H = 22;
const TAB_H = 26;
const BREADCRUMB_H = 16;
const STATUS_H = 18;
const ACTIVITY_W = 32;
const SIDEBAR_W = 96;
const EDITOR_X = WIN_X + ACTIVITY_W + SIDEBAR_W;
const GUTTER_W = 34;
const MINIMAP_W = 10;
const CODE_X = EDITOR_X + GUTTER_W;
const CHROME_TOP = WIN_Y + TITLE_H;
const EDITOR_TOP = CHROME_TOP + TAB_H + BREADCRUMB_H;
const EDITOR_BOTTOM = WIN_Y + WIN_H - STATUS_H;
const EDITOR_H = EDITOR_BOTTOM - EDITOR_TOP;
const CODE_PAD_TOP = EDITOR_TOP + 10;
const LINE_H = 14;
const FONT_SIZE = 10;
const INDENT_STEP = 12;
const CODE_RIGHT = WIN_X + WIN_W - MINIMAP_W - 6;

/** 2× SVG attributes; PNG rasterized at 5× display width for crisp README images. */
const PREVIEW_VECTOR_SCALE = 2;
const PREVIEW_SVG_WIDTH = W * PREVIEW_VECTOR_SCALE;
const PREVIEW_SVG_HEIGHT = H * PREVIEW_VECTOR_SCALE;

/** PNG export width (5× logical width → 2100px). */
export const PNG_RENDER_WIDTH = PREVIEW_DISPLAY_WIDTH * 5;

/** @type {Record<string, string>} */
export const THEME_CHARACTER = {
  "ether-aurora": "Deep navy, electric teal",
  "ether-clay": "Warm sumi ink, cinnabar",
  "ether-coral": "Dusty rose, soft magenta",
  "ether-dracula": "Charcoal, candy Dracula syntax",
  "ether-dusk": "Plum twilight, rose accent",
  "ether-ember": "Warm charcoal, copper",
  "ether-flame": "Ember red-orange glow",
  "ether-frost": "Arctic blue-gray frost",
  "ether-graphite": "Pure neutral gray, steel blue",
  "ether-lichen": "Forest floor, moss green",
  "ether-luna": "Moonlit night, silver",
  "ether-mint": "Cool mint-teal developer",
  "ether-mirage": "Desert dusk, mirage cyan",
  "ether-mocha": "Catppuccin-style cozy pastel",
  "ether-moss": "Sage forest gray-green",
  "ether-noir": "Near-monochrome noir",
  "ether-opal": "Opalescent violet-gray",
  "ether-prism": "Prism refraction, vivid syntax",
  "ether-sage": "Muted sage green",
  "ether-sand": "Warm parchment sand",
  "ether-slate": "Atom-style gunmetal slate",
  "ether-stone": "Terracotta warm stone",
  "ether-storm": "Cool blue-gray slate",
  "ether-tide": "Ocean tide teal",
  "ether-velvet": "Velvet plum wine",
};

/**
 * @param {string} value
 * @returns {string}
 */
function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * @param {import("../utils/color.js").PaletteSyntaxTokens} syntax
 * @param {string} comment
 * @param {string} role
 * @returns {string}
 */
function syntaxColor(syntax, comment, role) {
  switch (role) {
    case "keyword":
      return syntax.keyword;
    case "string":
      return syntax.string;
    case "number":
      return syntax.number;
    case "type":
      return syntax.type;
    case "function":
      return syntax.function;
    case "variable":
      return syntax.variable;
    case "tag":
      return syntax.cyan;
    case "attribute":
      return syntax.pink;
    case "comment":
      return comment;
    default:
      return syntax.default;
  }
}

/**
 * @param {Array<{ text: string, role: string }>} tokens
 * @param {import("../utils/color.js").PaletteSyntaxTokens} syntax
 * @param {string} comment
 * @param {number} x
 * @param {number} y
 * @returns {string}
 */
function codeLine(tokens, syntax, comment, x, y) {
  const spans = tokens
    .map((token) => {
      const italic = token.role === "comment" ? ' font-style="italic"' : "";
      const weight =
        token.role === "function" || token.role === "type"
          ? ' font-weight="500"'
          : "";
      return `<tspan fill="${syntaxColor(syntax, comment, token.role)}"${italic}${weight}>${escapeXml(token.text)}</tspan>`;
    })
    .join("");
  return `<text x="${x}" y="${y}" class="code">${spans}</text>`;
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @param {string} accent
 * @returns {string}
 */
function renderSceneFrame(ui) {
  return `<rect width="${W}" height="${H}" rx="${WIN_RX}" fill="${darken(ui.surfaceBorder, 0.2)}"/>
  <rect x="${WIN_X}" y="${WIN_Y + 1}" width="${WIN_W}" height="${WIN_H}" rx="${WIN_RX}" fill="#000" opacity="0.28" filter="url(#winShadow)"/>
  <rect x="${WIN_X}" y="${WIN_Y}" width="${WIN_W}" height="${WIN_H}" rx="${WIN_RX}" fill="${ui.surfaceShell}" stroke="${ui.surfaceBorder}" stroke-width="1"/>`;
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @param {string} accent
 * @returns {string}
 */
function renderDefs(ui) {
  return `<filter id="winShadow" x="-15%" y="-10%" width="130%" height="125%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.5"/>
    </filter>
    <linearGradient id="titleFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${withAlpha(ui.surfaceShell, 0.6)}"/>
      <stop offset="100%" stop-color="${ui.surfaceShell}"/>
    </linearGradient>`;
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @returns {string}
 */
function renderTitleBar(ui) {
  const y = WIN_Y;
  const lights = [
    { cx: WIN_X + 14, fill: "#ff5f57" },
    { cx: WIN_X + 26, fill: "#febc2e" },
    { cx: WIN_X + 38, fill: "#28c840" },
  ];
  const dots = lights
    .map(
      ({ cx, fill }) =>
        `<circle cx="${cx}" cy="${y + 12}" r="4.5" fill="${fill}" opacity="0.9"/>`,
    )
    .join("");

  return `<rect x="${WIN_X}" y="${y}" width="${WIN_W}" height="${TITLE_H}" fill="url(#titleFade)"/>
  <rect x="${WIN_X}" y="${y + TITLE_H - 1}" width="${WIN_W}" height="1" fill="${ui.surfaceBorder}" opacity="0.8"/>
  ${dots}
  <text x="${WIN_X + WIN_W / 2}" y="${y + 14}" class="title" fill="${ui.fgMuted}" text-anchor="middle">Ether — build.js</text>`;
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @param {string} accent
 * @returns {string}
 */
function renderActivityBar(ui, accent) {
  const icons = [
    {
      y: CHROME_TOP + 24,
      active: true,
      path: "M1.5 2.5h4.2l1.6 2.2H11v8.5H1.5V2.5zm1.8 2.3v5.9h6.9V6.2H5.2L4 4.8H3.3z",
    },
    {
      y: CHROME_TOP + 50,
      active: false,
      path: "M6 1.2a4.8 4.8 0 110 9.6 4.8 4.8 0 010-9.6zm0 1.6a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zM2.8 11.8h6.4v1H2.8v-1z",
    },
    {
      y: CHROME_TOP + 76,
      active: false,
      path: "M1.8 3.2h2.1v7.2H1.8V3.2zm3.2 1.1h2.1v6.1H5V4.3zm3.1-1.1h2.1v7.2H8.1V3.2zm3.2 2h2.1v5.2h-2.1V5.2z",
    },
    {
      y: CHROME_TOP + 102,
      active: false,
      path: "M1 2h3v1.5H4v5H1V2zm4 0h3v6.5H5V2zm4 1.5h3v5H9V3.5z",
    },
  ];

  const iconMarkup = icons
    .map(({ y, active, path }) => {
      const fill = active ? accent : ui.fgActivity;
      const rail = active
        ? `<rect x="${WIN_X}" y="${y - 11}" width="2.5" height="22" rx="1" fill="${accent}"/>`
        : "";
      return `${rail}<g transform="translate(${WIN_X + 11} ${y - 8})" fill="${fill}" opacity="${active ? 1 : 0.55}">
        <path d="${path}" transform="scale(1)"/>
      </g>`;
    })
    .join("");

  return `<rect x="${WIN_X}" y="${CHROME_TOP}" width="${ACTIVITY_W}" height="${WIN_Y + WIN_H - CHROME_TOP}" fill="${ui.surfaceShell}"/>
  <rect x="${WIN_X + ACTIVITY_W - 1}" y="${CHROME_TOP}" width="1" height="${WIN_Y + WIN_H - CHROME_TOP}" fill="${ui.surfaceBorder}"/>
  ${iconMarkup}`;
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @param {string} accent
 * @returns {string}
 */
function renderSidebar(ui, accent) {
  const x = WIN_X + ACTIVITY_W;
  const rows = [
    { y: CHROME_TOP + 32, label: "EXPLORER", section: true },
    { y: CHROME_TOP + 48, label: "src", folder: true, open: true },
    { y: CHROME_TOP + 64, label: "generator", folder: true, open: true, indent: 1 },
    { y: CHROME_TOP + 80, label: "build.js", active: true, indent: 2 },
    { y: CHROME_TOP + 96, label: "preview.js", indent: 2 },
    { y: CHROME_TOP + 112, label: "README.md", indent: 1 },
  ];

  const fileRows = rows
    .map((row) => {
      if (row.section) {
        return `<text x="${x + 12}" y="${row.y}" class="section" fill="${ui.fgActivity}">${escapeXml(row.label)}</text>`;
      }

      const indent = (row.indent ?? 0) * 10;
      const textFill = row.active
        ? ui.fgListFocus
        : row.folder
          ? ui.fgPrimary
          : ui.fgMuted;
      const bg = row.active
        ? `<rect x="${x + 3}" y="${row.y - 10}" width="${SIDEBAR_W - 6}" height="16" rx="4" fill="${ui.surfaceListFocus}"/>`
        : "";
      const chevron = row.folder
        ? `<path d="${row.open ? "M3 1.5L6 4.5L3 7.5" : "M1.5 3L4.5 6L7.5 3"}" fill="none" stroke="${ui.fgActivity}" stroke-width="1.2" stroke-linecap="round" transform="translate(${x + 10 + indent} ${row.y - 5}) scale(0.75)"/>`
        : "";
      const iconColor = row.active
        ? accent
        : row.folder
          ? ui.fgMuted
          : row.label.endsWith(".json")
            ? ui.warning
            : ui.fgActivity;
      const icon = row.folder
        ? `<path d="M0 1.2h3.2l1 1.4H9v5.8H0V1.2z" fill="${iconColor}" transform="translate(${x + 22 + indent} ${row.y - 6}) scale(0.85)"/>`
        : `<rect x="${x + 22 + indent}" y="${row.y - 7}" width="8" height="10" rx="1.5" fill="${iconColor}" opacity="0.95"/>`;

      return `${bg}
      ${chevron}
      ${icon}
      <text x="${x + 32 + indent}" y="${row.y}" class="ui" fill="${textFill}" font-weight="${row.active ? "600" : "400"}">${escapeXml(row.label)}</text>`;
    })
    .join("");

  return `<rect x="${x}" y="${CHROME_TOP}" width="${SIDEBAR_W}" height="${WIN_Y + WIN_H - CHROME_TOP}" fill="${darken(ui.surfacePanel, 0.06)}"/>
  <rect x="${EDITOR_X - 1}" y="${CHROME_TOP}" width="1" height="${WIN_Y + WIN_H - CHROME_TOP}" fill="${ui.surfaceBorder}"/>
  ${fileRows}`;
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @param {string} accent
 * @returns {string}
 */
function renderTabBar(ui, accent) {
  const y = CHROME_TOP;
  const activeW = 108;
  const inactiveW = 76;
  const activeX = EDITOR_X + 6;
  const editorW = WIN_X + WIN_W - EDITOR_X;

  return `<rect x="${EDITOR_X}" y="${y}" width="${editorW}" height="${TAB_H}" fill="${ui.surfacePanel}"/>
  <rect x="${EDITOR_X}" y="${y + TAB_H - 1}" width="${editorW}" height="1" fill="${ui.surfaceBorder}" opacity="0.85"/>
  <rect x="${activeX}" y="${y + 4}" width="${activeW}" height="${TAB_H - 5}" rx="5" fill="${ui.surfaceEditor}"/>
  <rect x="${activeX}" y="${y + TAB_H - 2}" width="${activeW}" height="2" rx="1" fill="${accent}"/>
  <text x="${activeX + 10}" y="${y + 17}" class="ui" fill="${ui.fgPrimary}" font-weight="500">build.js</text>
  <circle cx="${activeX + 62}" cy="${y + 12}" r="2.5" fill="${ui.warning}" opacity="0.85"/>
  <text x="${activeX + activeW - 10}" y="${y + 17}" class="ui" fill="${ui.fgMuted}" font-size="8px" text-anchor="middle">×</text>
  <rect x="${activeX + activeW + 4}" y="${y + 4}" width="${inactiveW}" height="${TAB_H - 5}" rx="5" fill="${withAlpha(ui.surfacePanel, 0.8)}"/>
  <text x="${activeX + activeW + 14}" y="${y + 17}" class="ui" fill="${ui.fgMuted}">README.md</text>`;
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @param {string} accent
 * @returns {string}
 */
function renderBreadcrumb(ui, accent) {
  const y = CHROME_TOP + TAB_H;
  const crumbY = y + 12;
  const crumbs = `<text x="${EDITOR_X + 10}" y="${crumbY}" class="crumb" fill="${ui.fgMuted}">src</text>
  <text x="${EDITOR_X + 30}" y="${crumbY}" class="crumb" fill="${ui.fgActivity}"> › </text>
  <text x="${EDITOR_X + 42}" y="${crumbY}" class="crumb" fill="${accent}" font-weight="500">build.js</text>`;

  const editorW = WIN_X + WIN_W - EDITOR_X;

  return `<rect x="${EDITOR_X}" y="${y}" width="${editorW}" height="${BREADCRUMB_H}" fill="${ui.surfaceEditor}"/>
  <rect x="${EDITOR_X}" y="${y + BREADCRUMB_H - 1}" width="${editorW}" height="1" fill="${ui.surfaceBorder}" opacity="0.65"/>
  ${crumbs}`;
}

/**
 * @param {import("../utils/color.js").PaletteSyntaxTokens} syntax
 * @param {string} comment
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @returns {string}
 */
function renderMinimap(syntax, ui) {
  const x = CODE_RIGHT + 2;
  const colors = [
    syntax.keyword,
    syntax.function,
    syntax.default,
    syntax.keyword,
    syntax.function,
    syntax.function,
  ];
  const barH = 2;
  const gap = 1;
  const startY = EDITOR_TOP + 8;
  const thumbY = EDITOR_TOP + EDITOR_H * 0.42;
  const thumbH = EDITOR_H * 0.22;

  return `<rect x="${x - 1}" y="${EDITOR_TOP}" width="${MINIMAP_W + 2}" height="${EDITOR_H}" fill="${withAlpha(ui.surfacePanel, 0.35)}"/>
  <rect x="${x - 1}" y="${EDITOR_TOP}" width="1" height="${EDITOR_H}" fill="${ui.surfaceBorder}" opacity="0.35"/>
  ${colors
    .map((fill, index) => {
      const barY = startY + index * (barH + gap);
      return `<rect x="${x}" y="${barY}" width="${MINIMAP_W - 1}" height="${barH}" rx="0.5" fill="${fill}" opacity="0.65"/>`;
    })
    .join("")}
  <rect x="${x}" y="${thumbY}" width="${MINIMAP_W}" height="${thumbH}" rx="1.5" fill="${withAlpha(ui.fgMuted, 0.25)}"/>`;
}

/**
 * @param {import("../utils/color.js").PaletteSyntaxTokens} syntax
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @returns {string}
 */
function renderStatusBarPalette(syntax) {
  const colors = [
    syntax.keyword,
    syntax.variable,
    syntax.string,
    syntax.function,
    syntax.type,
  ];
  const baseX = WIN_X + WIN_W - 88;

  return colors
    .map(
      (fill, index) =>
        `<rect x="${baseX + index * 9}" y="${WIN_Y + WIN_H - STATUS_H + 6}" width="5" height="5" rx="1" fill="${fill}" opacity="0.9"/>`,
    )
    .join("");
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @param {string} accent
 * @returns {string}
 */
function renderStatusBar(ui, accent, syntax) {
  const y = WIN_Y + WIN_H - STATUS_H;

  return `<rect x="${WIN_X}" y="${y}" width="${WIN_W}" height="${STATUS_H}" fill="${ui.surfacePanel}"/>
  <rect x="${WIN_X}" y="${y}" width="${WIN_W}" height="1" fill="${ui.surfaceBorder}" opacity="0.9"/>
  <rect x="${WIN_X + ACTIVITY_W}" y="${y}" width="1" height="${STATUS_H}" fill="${ui.surfaceBorder}" opacity="0.5"/>
  <g transform="translate(${EDITOR_X + 8} ${y + 4})" fill="none" stroke="${accent}" stroke-width="1" stroke-linecap="round">
    <path d="M0 3.5a3.5 3.5 0 110 0 3.5 3.5 0 010 0zm1-1.2l.9.9 1.8-2"/>
  </g>
  <text x="${EDITOR_X + 18}" y="${y + 13}" class="ui" fill="${ui.fgPrimary}">main</text>
  <text x="${EDITOR_X + 48}" y="${y + 13}" class="ui" fill="${ui.fgMuted}">○ 0 △ 0</text>
  <text x="${WIN_X + WIN_W - 100}" y="${y + 13}" class="ui" fill="${ui.fgMuted}">Spaces: 2</text>
  ${renderStatusBarPalette(syntax)}
  <text x="${WIN_X + WIN_W - 8}" y="${y + 13}" class="ui" fill="${ui.fgPrimary}" text-anchor="end">JavaScript</text>`;
}

/**
 * @param {import("../utils/color.js").Palette} palette
 * @returns {string}
 */
export function renderThemePreviewSvg(palette) {
  const { ui, syntax } = palette;
  const comment = deriveCommentForeground(ui);
  const gutterX = EDITOR_X;

  const codeLines = [
    {
      line: 39,
      highlight: false,
      tokens: [
        { text: "const ", role: "keyword" },
        { text: "previews", role: "variable" },
        { text: " = ", role: "default" },
        { text: "generateAllPreviews", role: "function" },
        { text: "(...)", role: "default" },
        { text: ";", role: "default" },
      ],
    },
    {
      line: 40,
      highlight: false,
      tokens: [{ text: "", role: "default" }],
    },
    {
      line: 41,
      highlight: false,
      tokens: [
        { text: "for ", role: "keyword" },
        { text: "(const f of previews)", role: "default" },
        { text: " {", role: "default" },
      ],
    },
    {
      line: 42,
      highlight: false,
      tokens: [
        { text: "  ", role: "default" },
        { text: "console", role: "variable" },
        { text: ".", role: "default" },
        { text: "log", role: "function" },
        { text: "(f)", role: "default" },
        { text: ";", role: "default" },
      ],
    },
    {
      line: 43,
      highlight: false,
      tokens: [{ text: "}", role: "default" }],
    },
    {
      line: 44,
      highlight: true,
      tokens: [
        { text: "syncReadmePreviewGallery", role: "function" },
        { text: "(readme, palettes)", role: "default" },
        { text: ";", role: "default" },
      ],
    },
    {
      line: 45,
      highlight: false,
      tokens: [
        { text: "console", role: "variable" },
        { text: ".", role: "default" },
        { text: "log", role: "function" },
        { text: "(`Synced gallery`)", role: "string" },
        { text: ";", role: "default" },
      ],
    },
  ];

  const codeLayer = codeLines
    .map((entry, index) => {
      const y = CODE_PAD_TOP + index * LINE_H;
      const highlight = entry.highlight
        ? `<rect x="${gutterX}" y="${y - 10}" width="${CODE_RIGHT - gutterX}" height="${LINE_H}" fill="${withAlpha(ui.surfaceLineHighlight, 0.85)}"/>
        <rect x="${gutterX}" y="${y - 10}" width="2" height="${LINE_H}" fill="${ui.accent}"/>`
        : "";
      const nums = `<text x="${gutterX + GUTTER_W - 6}" y="${y}" class="gutter" fill="${entry.highlight ? ui.fgPrimary : ui.fgActivity}" text-anchor="end">${entry.line}</text>`;
      const code = entry.tokens.some((t) => t.text.length > 0)
        ? codeLine(entry.tokens, syntax, comment, CODE_X, y)
        : "";
      return `${highlight}${nums}${code}`;
    })
    .join("");

  const indentGuides = [0, 1]
    .map(
      (col) =>
        `<line x1="${CODE_X + col * INDENT_STEP}" y1="${EDITOR_TOP}" x2="${CODE_X + col * INDENT_STEP}" y2="${EDITOR_BOTTOM}" stroke="${ui.indentGuide}" stroke-width="1"/>`,
    )
    .join("");

  const activeGuide = `<line x1="${CODE_X + INDENT_STEP}" y1="${EDITOR_TOP}" x2="${CODE_X + INDENT_STEP}" y2="${EDITOR_BOTTOM}" stroke="${ui.indentGuideActive}" stroke-width="1"/>`;
  const editorW = WIN_X + WIN_W - EDITOR_X;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${PREVIEW_SVG_WIDTH}" height="${PREVIEW_SVG_HEIGHT}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXml(palette.label)} theme preview" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
  <title>${escapeXml(palette.label)}</title>
  <defs>
    ${renderDefs(ui)}
    <style>
      .code, .gutter, .ui, .section, .crumb, .title {
        font-family: "JetBrains Mono", "Cascadia Code", "SF Mono", Consolas, Menlo, monospace;
      }
      .code, .gutter { font-size: ${FONT_SIZE}px; }
      .ui { font-size: 9px; }
      .crumb { font-size: 8.5px; }
      .section { font-size: 7px; letter-spacing: 0.12em; font-weight: 600; }
      .title { font-size: 8.5px; }
    </style>
    <clipPath id="winClip"><rect x="${WIN_X}" y="${WIN_Y}" width="${WIN_W}" height="${WIN_H}" rx="${WIN_RX}"/></clipPath>
  </defs>
  ${renderSceneFrame(ui)}
  <g clip-path="url(#winClip)">
    ${renderTitleBar(ui)}
    ${renderActivityBar(ui, ui.accent)}
    ${renderSidebar(ui, ui.accent)}
    ${renderTabBar(ui, ui.accent)}
    ${renderBreadcrumb(ui, ui.accent)}
    <rect x="${EDITOR_X}" y="${EDITOR_TOP}" width="${editorW}" height="${EDITOR_H}" fill="${ui.surfaceEditor}"/>
    <rect x="${gutterX}" y="${EDITOR_TOP}" width="${GUTTER_W}" height="${EDITOR_H}" fill="${withAlpha(ui.surfacePanel, 0.35)}"/>
    <rect x="${gutterX + GUTTER_W - 1}" y="${EDITOR_TOP}" width="1" height="${EDITOR_H}" fill="${ui.surfaceBorder}" opacity="0.4"/>
    ${indentGuides}
    ${activeGuide}
    ${codeLayer}
    ${renderMinimap(syntax, ui)}
    ${renderStatusBar(ui, ui.accent, syntax)}
  </g>
</svg>
`;
}

/**
 * @param {string} svg
 * @returns {Buffer}
 */
export function renderSvgToPng(svg) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: PNG_RENDER_WIDTH },
    font: {
      loadSystemFonts: true,
      defaultFontFamily: "JetBrains Mono",
    },
  });
  return resvg.render().asPng();
}

/**
 * @param {import("../utils/color.js").Palette} palette
 * @param {string} outputDir
 * @returns {{ pngPath: string }}
 */
export function writePreviewAssets(palette, outputDir) {
  mkdirSync(outputDir, { recursive: true });
  const pngPath = join(outputDir, `${palette.id}.png`);
  writeFileSync(pngPath, renderSvgToPng(renderThemePreviewSvg(palette)));
  return { pngPath };
}

/**
 * @param {string[]} activeIds
 * @param {string} previewsDirectory
 * @returns {string[]}
 */
export function removeOrphanedPreviewFiles(
  activeIds,
  previewsDirectory,
) {
  mkdirSync(previewsDirectory, { recursive: true });
  const activeBaseNames = new Set(activeIds);
  const removedFiles = [];

  for (const file of readdirSync(previewsDirectory)) {
    if (file.match(/^gallery-row-\d+\.png$/)) {
      const filePath = join(previewsDirectory, file);
      unlinkSync(filePath);
      removedFiles.push(filePath);
      continue;
    }

    const themeMatch = file.match(/^(ether-.+)\.(png|svg)$/);
    if (!themeMatch) {
      continue;
    }

    const keep =
      themeMatch[2] === "png" && activeBaseNames.has(themeMatch[1]);
    if (keep) {
      continue;
    }

    const filePath = join(previewsDirectory, file);
    unlinkSync(filePath);
    removedFiles.push(filePath);
  }

  return removedFiles;
}

/**
 * @param {import("../utils/color.js").Palette[]} palettes
 * @param {string} [previewsDirectory]
 * @returns {{ generatedFiles: string[], removedFiles: string[] }}
 */
export function generateAllPreviews(
  palettes,
  previewsDirectory = "docs/previews",
) {
  const activeIds = palettes.map((palette) => palette.id);
  const removedFiles = removeOrphanedPreviewFiles(activeIds, previewsDirectory);
  const generatedFiles = [];

  for (const palette of palettes) {
    const { pngPath } = writePreviewAssets(palette, previewsDirectory);
    generatedFiles.push(pngPath);
  }

  return { generatedFiles, removedFiles };
}

/**
 * @param {import("../utils/color.js").Palette} palette
 * @returns {string}
 */
function renderGalleryCard(palette) {
  const character =
    THEME_CHARACTER[palette.id] ?? "Token-driven dark theme";
  const src = `${PREVIEW_README_DIR}/${palette.id}.${PREVIEW_README_EXT}`;
  const w = PREVIEW_DISPLAY_WIDTH;

  return `<div style="flex:0 1 ${w}px;max-width:100%;box-sizing:border-box;text-align:center">
<img src="${src}" alt="${escapeXml(palette.label)}" style="display:block;width:100%;max-width:${w}px;height:auto;margin:0 auto;border-radius:8px" />
<p style="margin:${PREVIEW_CAPTION_GAP}px 0 0;text-align:center;line-height:1.45">
<strong>${escapeXml(palette.label)}</strong><br />
<em>${escapeXml(character)}</em>
</p>
</div>`;
}

/**
 * Responsive flex gallery: each preview + caption stay grouped; ~two per row on wide viewports.
 * @param {import("../utils/color.js").Palette[]} palettes
 * @returns {string}
 */
export function renderReadmePreviewGallery(palettes) {
  const cards = palettes.map((palette) => renderGalleryCard(palette)).join("\n");

  return `<div style="display:flex;flex-wrap:wrap;justify-content:center;column-gap:${PREVIEW_CELL_GAP}px;row-gap:${PREVIEW_CARD_GAP}px;max-width:100%">
${cards}
</div>`;
}

const GALLERY_START = "<!-- PREVIEW_GALLERY_START -->";
const GALLERY_END = "<!-- PREVIEW_GALLERY_END -->";

/**
 * @param {string} readmePath
 * @param {import("../utils/color.js").Palette[]} palettes
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
