import {
  contrastRatio,
  isValidColor,
  mixColors,
} from "./color-math.js";

/** Syntax role keys authored in palette source files (comment is derived at build). */
export const PALETTE_SYNTAX_TOKEN_KEYS = [
  "default",
  "string",
  "number",
  "cyan",
  "keyword",
  "variable",
  "function",
  "type",
  "red",
  "pink",
];

/** All syntax roles present on composed themes (includes derived comment). */
export const SYNTAX_TOKEN_KEYS = [...PALETTE_SYNTAX_TOKEN_KEYS, "comment"];

/** Blend of fgMuted toward editor — inactive gutter line numbers. */
export const LINE_NUMBER_MIX_INACTIVE = 0.68;

/** Blend for active gutter line numbers and syntax comments. */
export const LINE_NUMBER_MIX_ACTIVE = 0.42;

/**
 * Comment foreground — same mix as active editor line numbers.
 * @param {import("./color.js").PaletteUITokens} ui
 */
export function deriveCommentForeground(ui) {
  return mixColors(ui.fgMuted, ui.surfaceEditor, LINE_NUMBER_MIX_ACTIVE);
}

/** WCAG contrast targets for dark palette base tokens (checked at build time). */
export const PALETTE_CONTRAST_TARGETS = {
  fgPrimary: 7,
  fgMuted: 4.5,
  syntaxDefault: 7,
  /** All syntax tokens except comment (also used for bracket punctuation). */
  syntaxToken: 4.5,
  /** Matches gutter line numbers — subdued, not body-text strength. */
  syntaxComment: 2.5,
  fgOnAccent: 4.5,
};

/**
 * @param {import("./color.js").Palette} palette
 * @returns {import("./color.js").Palette}
 * @throws {Error} When any base token fails {@link PALETTE_CONTRAST_TARGETS}
 */
export function validatePaletteContrast(palette) {
  const editor = palette.ui.surfaceEditor;
  const targets = PALETTE_CONTRAST_TARGETS;
  const commentForeground = deriveCommentForeground(palette.ui);
  const checks = [
    ["ui.fgPrimary", palette.ui.fgPrimary, editor, targets.fgPrimary],
    ["ui.fgMuted", palette.ui.fgMuted, editor, targets.fgMuted],
    ["syntax.default", palette.syntax.default, editor, targets.syntaxDefault],
    [
      "ui.fgOnAccent",
      palette.ui.fgOnAccent,
      palette.ui.accent,
      targets.fgOnAccent,
    ],
    ...SYNTAX_TOKEN_KEYS.filter(
      (key) => key !== "default" && key !== "comment",
    ).map((key) => [
      `syntax.${key}`,
      palette.syntax[key],
      editor,
      targets.syntaxToken,
    ]),
    ["syntax.comment", commentForeground, editor, targets.syntaxComment],
  ];

  const failures = [];
  for (const [path, foreground, background, minimum] of checks) {
    const ratio = contrastRatio(foreground, background);
    if (Number(ratio.toFixed(2)) < minimum) {
      failures.push(`${path}: ${ratio.toFixed(2)}:1 (minimum ${minimum}:1)`);
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `Contrast failures in palette "${palette.id}":\n  ${failures.join("\n  ")}`,
    );
  }

  return palette;
}

/**
 * @param {import("./color.js").Palette} palette
 * @returns {import("./color.js").Palette}
 * @throws {Error} On invalid color values or contrast failures
 */
export function validatePalette(palette) {
  for (const [key, value] of Object.entries(palette.ui)) {
    if (!value || !isValidColor(value)) {
      throw new Error(`Invalid UI base token "${key}": ${value}`);
    }
  }

  for (const key of PALETTE_SYNTAX_TOKEN_KEYS) {
    const value = palette.syntax[key];
    if (!value || !isValidColor(value)) {
      throw new Error(`Invalid syntax base token "${key}": ${value}`);
    }
  }

  validatePaletteContrast(palette);

  return palette;
}

/** Workbench colors that must include transparency (alpha byte < 0xff). */
export const TRANSPARENT_WORKBENCH_COLOR_IDS = [
  "editor.hoverHighlightBackground",
  "merge.currentHeaderBackground",
  "merge.currentContentBackground",
];
