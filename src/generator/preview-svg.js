import { Resvg } from "@resvg/resvg-js";
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
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

/** Space below each theme card before the next (px). */
const PREVIEW_CARD_GAP = 64;

/** Space between caption block and its preview image (px). */
const PREVIEW_CAPTION_GAP = 10;

/** README gallery uses PNG (markdown linters reject SVG img src). */
export const PREVIEW_README_EXT = "png";

/** Logical canvas (viewBox) — 420px wide in docs, exported at high DPI. */
const W = 420;
const H = 272;

/** Inset for drop shadow only — window fills the card. */
const WIN_X = 4;
const WIN_Y = 4;
const WIN_W = W - WIN_X * 2;
const WIN_H = H - WIN_Y * 2;
const WIN_RX = 10;
const TITLE_H = 18;
const BREADCRUMB_H = 17;
const STATUS_H = 16;
/** Editor-first layout (no sidebar) — matches full-width VS Code / Cursor. */
const EDITOR_X = WIN_X;
const GUTTER_W = 22;
const SCROLLBAR_W = 5;
const CODE_X = EDITOR_X + GUTTER_W;
const CHROME_TOP = WIN_Y + TITLE_H;
const EDITOR_TOP = CHROME_TOP + BREADCRUMB_H;
const EDITOR_BOTTOM = WIN_Y + WIN_H - STATUS_H;
const EDITOR_H = EDITOR_BOTTOM - EDITOR_TOP;
const CODE_PAD_TOP = EDITOR_TOP + 9;
const LINE_H = 10.5;
const FONT_SIZE = 7.5;
const CODE_RIGHT = WIN_X + WIN_W - SCROLLBAR_W - 3;
const CODE_W = CODE_RIGHT - CODE_X;

/** Approximate monospace advance (px) for layout without measuring fonts. */
const CHAR_W = { code: 4.6, ui: 4.2, crumb: 4.0 };

/**
 * @param {string} text
 * @param {keyof typeof CHAR_W} kind
 */
function textAdvance(text, kind) {
  return text.length * CHAR_W[kind];
}

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
    .map((token, index) => {
      const italic = token.role === "comment" ? ' font-style="italic"' : "";
      const weight =
        token.role === "function" || token.role === "type"
          ? ' font-weight="500"'
          : "";
      const pos = index === 0 ? ` x="${x}" y="${y}"` : "";
      return `<tspan${pos} fill="${syntaxColor(syntax, comment, token.role)}"${italic}${weight}>${escapeXml(token.text)}</tspan>`;
    })
    .join("");
  return `<text class="code" xml:space="preserve">${spans}</text>`;
}

/**
 * @param {Array<{ text: string, role: string }>} tokens
 * @param {number} maxWidth
 * @returns {Array<{ text: string, role: string }>}
 */
function trimTokensToWidth(tokens, maxWidth) {
  let used = 0;
  const out = [];
  for (const token of tokens) {
    const w = textAdvance(token.text, "code");
    if (used + w > maxWidth - textAdvance("…", "code")) {
      if (out.length === 0) {
        const slice = Math.max(
          4,
          Math.floor((maxWidth / CHAR_W.code) * 0.85),
        );
        out.push({
          text: `${token.text.slice(0, slice)}…`,
          role: token.role,
        });
      }
      break;
    }
    used += w;
    out.push(token);
  }
  return out.length > 0 ? out : tokens.slice(0, 1);
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
        `<circle cx="${cx}" cy="${y + 11}" r="3.5" fill="${fill}" opacity="0.88"/>`,
    )
    .join("");

  return `<rect x="${WIN_X}" y="${y}" width="${WIN_W}" height="${TITLE_H}" fill="url(#titleFade)"/>
  <rect x="${WIN_X}" y="${y + TITLE_H - 1}" width="${WIN_W}" height="1" fill="${ui.surfaceBorder}" opacity="0.65"/>
  ${dots}
  <text x="${WIN_X + WIN_W / 2}" y="${y + 12}" class="title" fill="${ui.fgMuted}" text-anchor="middle">Ether</text>`;
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @param {string} accent
 * @returns {string}
 */
function renderBreadcrumb(ui, accent) {
  const y = CHROME_TOP;
  const textX = EDITOR_X + 10;
  const textY = y + 11.5;

  /** @type {Array<{ text: string, kind: "folder" | "file" | "symbol" }>} */
  const segments = [
    { text: "src", kind: "folder" },
    { text: "lib", kind: "folder" },
    { text: "store", kind: "file" },
    { text: "normalizeId", kind: "symbol" },
  ];

  const tspans = segments
    .flatMap((seg, index) => {
      const parts = [];
      if (index > 0) {
        parts.push(
          `<tspan fill="${ui.fgActivity}" opacity="0.28"> \u203a </tspan>`,
        );
      }
      const fill =
        seg.kind === "file"
          ? accent
          : seg.kind === "symbol"
            ? ui.fgPrimary
            : ui.fgMuted;
      const weight =
        seg.kind === "file" ? "600" : seg.kind === "symbol" ? "500" : "400";
      parts.push(
        `<tspan fill="${fill}" font-weight="${weight}">${escapeXml(seg.text)}</tspan>`,
      );
      return parts;
    })
    .join("");

  return `<rect x="${EDITOR_X}" y="${y}" width="${WIN_W}" height="${BREADCRUMB_H}" fill="${ui.surfacePanel}" opacity="0.45"/>
  <rect x="${EDITOR_X}" y="${y + BREADCRUMB_H - 1}" width="${WIN_W}" height="1" fill="${ui.surfaceBorder}" opacity="0.35"/>
  <text x="${textX}" y="${textY}" class="crumb">${tspans}</text>`;
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @returns {string}
 */
function renderScrollbar(ui) {
  const x = WIN_X + WIN_W - SCROLLBAR_W - 1;
  const thumbY = EDITOR_TOP + EDITOR_H * 0.08;
  const thumbH = EDITOR_H * 0.55;

  return `<rect x="${x + 1}" y="${thumbY}" width="${SCROLLBAR_W - 2}" height="${thumbH}" rx="${SCROLLBAR_W / 2}" fill="${withAlpha(ui.scrollbar, 0.4)}"/>`;
}

/**
 * @param {import("../utils/color.js").PaletteSyntaxTokens} syntax
 * @param {import("../utils/color.js").PaletteUITokens} ui
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
 * @param {import("../utils/color.js").PaletteUITokens} ui
 * @param {string} accent
 * @returns {string}
 */
function renderStatusBar(ui, _accent, syntax) {
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
 * @returns {Array<{ line: number, highlight?: boolean, tokens: Array<{ text: string, role: string }> }>}
 */
function buildPreviewCodeLines() {
  return [
    {
      line: 1,
      tokens: [{ text: "// Warm up the client cache", role: "comment" }],
    },
    {
      line: 2,
      tokens: [
        { text: "import", role: "keyword" },
        { text: " { createStore } ", role: "default" },
        { text: "from", role: "keyword" },
        { text: ' "valtio";', role: "string" },
      ],
    },
    {
      line: 3,
      tokens: [
        { text: "const", role: "keyword" },
        { text: " BASE_URL ", role: "default" },
        { text: "=", role: "default" },
        { text: ' "https://cdn.example.net";', role: "string" },
      ],
    },
    {
      line: 4,
      tokens: [
        { text: "function", role: "keyword" },
        { text: " ", role: "default" },
        { text: "normalizeId", role: "function" },
        { text: "(raw) {", role: "default" },
      ],
    },
    {
      line: 5,
      tokens: [
        { text: "  ", role: "default" },
        { text: "return", role: "keyword" },
        { text: " ", role: "default" },
        { text: "raw", role: "variable" },
        { text: ".trim().toLowerCase().replace(", role: "default" },
        { text: "/\\s+/g", role: "string" },
        { text: ', "-");', role: "default" },
      ],
    },
    {
      line: 6,
      tokens: [{ text: "}", role: "default" }],
    },
    {
      line: 7,
      tokens: [
        { text: "async", role: "keyword" },
        { text: " ", role: "default" },
        { text: "function", role: "keyword" },
        { text: " ", role: "default" },
        { text: "syncRecords", role: "function" },
        { text: "(items) {", role: "default" },
      ],
    },
    {
      line: 8,
      tokens: [
        { text: "  ", role: "default" },
        { text: "for", role: "keyword" },
        { text: " (", role: "default" },
        { text: "const", role: "keyword" },
        { text: " ", role: "default" },
        { text: "item", role: "variable" },
        { text: " of items) {", role: "default" },
      ],
    },
    {
      line: 9,
      tokens: [
        { text: "    ", role: "default" },
        { text: "await", role: "keyword" },
        { text: " ", role: "default" },
        { text: "fetch", role: "function" },
        { text: "(`${", role: "default" },
        { text: "BASE_URL", role: "variable" },
        { text: "}/sync`, {", role: "default" },
      ],
    },
    {
      line: 10,
      tokens: [
        { text: "      method: ", role: "default" },
        { text: '"POST"', role: "string" },
        { text: ",", role: "default" },
      ],
    },
    {
      line: 11,
      tokens: [
        { text: "      body: ", role: "default" },
        { text: "JSON", role: "type" },
        { text: ".stringify(item),", role: "default" },
      ],
    },
    {
      line: 12,
      tokens: [{ text: "    });", role: "default" }],
    },
    {
      line: 13,
      tokens: [{ text: "  }", role: "default" }],
    },
    {
      line: 14,
      tokens: [{ text: "}", role: "default" }],
    },
    {
      line: 15,
      tokens: [
        { text: "export", role: "keyword" },
        { text: " { normalizeId, syncRecords };", role: "default" },
      ],
    },
  ];
}

/**
 * @param {import("../utils/color.js").Palette} palette
 * @returns {string}
 */
function renderEditorSpace(palette) {
  const { ui, syntax } = palette;
  const comment = deriveCommentForeground(ui);
  const gutterX = EDITOR_X;
  const codeLines = buildPreviewCodeLines();

  const codeLayer = codeLines
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

export function renderThemePreviewSvg(palette) {
  const { ui } = palette;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${PREVIEW_SVG_WIDTH}" height="${PREVIEW_SVG_HEIGHT}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXml(palette.label)} theme preview" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
  <title>${escapeXml(palette.label)}</title>
  <defs>
    ${renderDefs(ui)}
    <style>
      .code, .gutter, .ui, .crumb, .title {
        font-family: "JetBrains Mono", "Cascadia Code", "SF Mono", Consolas, Menlo, monospace;
      }
      .code, .gutter { font-size: ${FONT_SIZE}px; }
      .gutter { opacity: 0.9; }
      .ui { font-size: 7.5px; }
      .crumb { font-size: 7px; letter-spacing: 0.015em; }
      .title { font-size: 7px; letter-spacing: 0.04em; }
    </style>
    <clipPath id="winClip"><rect x="${WIN_X}" y="${WIN_Y}" width="${WIN_W}" height="${WIN_H}" rx="${WIN_RX}"/></clipPath>
    <clipPath id="codeClip"><rect x="${EDITOR_X}" y="${EDITOR_TOP}" width="${WIN_W}" height="${EDITOR_H}"/></clipPath>
  </defs>
  ${renderSceneFrame(ui)}
  <g clip-path="url(#winClip)">
    ${renderTitleBar(ui)}
    ${renderBreadcrumb(ui, ui.accent)}
    ${renderEditorSpace(palette)}
    ${renderStatusBar(ui, ui.accent, palette.syntax)}
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

  return `<div style="flex:0 1 ${w}px;max-width:100%;box-sizing:border-box;margin:0 0 ${PREVIEW_CARD_GAP}px">
<p style="margin:0 0 ${PREVIEW_CAPTION_GAP}px;text-align:left;line-height:1.45">
<strong>${escapeXml(palette.label)}</strong><br />
<em>${escapeXml(character)}</em>
</p>
<img src="${src}" alt="${escapeXml(palette.label)}" style="display:block;width:100%;max-width:${w}px;height:auto;margin:0;border-radius:8px" />
</div>`;
}

/**
 * Responsive flex gallery: each preview + caption stay grouped; ~two per row on wide viewports.
 * @param {import("../utils/color.js").Palette[]} palettes
 * @returns {string}
 */
export function renderReadmePreviewGallery(palettes) {
  const cards = palettes.map((palette) => renderGalleryCard(palette)).join("\n");

  return `<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-start;column-gap:${PREVIEW_CELL_GAP}px;row-gap:0;max-width:100%">
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
