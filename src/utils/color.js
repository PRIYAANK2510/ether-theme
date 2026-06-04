import chroma from "chroma-js";
import { WORKBENCH_COLOR_IDS, EXPECTED_SYNTAX_RULE_COUNT } from "../workbench/constants.js";
import { EXTENSION_WORKBENCH_COLOR_IDS } from "../workbench/extension-catalog.js";

/**
 * @typedef {Object} PaletteSyntaxTokens
 * @property {string} default
 * @property {string} comment
 * @property {string} string
 * @property {string} number
 * @property {string} cyan
 * @property {string} keyword
 * @property {string} variable
 * @property {string} function
 * @property {string} type
 * @property {string} red
 * @property {string} pink
 */

/**
 * @typedef {Object} PaletteUITokens
 * @property {string} accent
 * @property {string} accentHover
 * @property {string} surfaceBorder
 * @property {string} surfaceShell
 * @property {string} surfacePanel
 * @property {string} surfaceEditor
 * @property {string} surfaceLineHighlight
 * @property {string} surfaceInput
 * @property {string} surfaceHover
 * @property {string} surfacePeek
 * @property {string} surfaceWidget
 * @property {string} surfaceNotification
 * @property {string} surfaceListFocus
 * @property {string} fgPrimary
 * @property {string} fgMuted
 * @property {string} fgActivity
 * @property {string} fgOnAccent
 * @property {string} [fgOnButton]
 * @property {string} fgListFocus
 * @property {string} shadow
 * @property {string} error
 * @property {string} warning
 * @property {string} findMatch
 * @property {string} gitAdded
 * @property {string} gitModified
 * @property {string} gitDeleted
 * @property {string} scrollbar
 * @property {string} indentGuide
 * @property {string} indentGuideActive
 * @property {string} ruler
 * @property {string} cursor
 * @property {string} dropdownBorder
 * @property {string} dropTarget
 * @property {string} editorGroupDrop
 * @property {string} inputValidationError
 * @property {string} inputValidationInfo
 * @property {string} inputValidationWarning
 * @property {string} diffInserted
 * @property {string} diffRemoved
 * @property {string} mergeCurrent
 * @property {string} terminalRed
 * @property {string} terminalGreen
 * @property {string} terminalYellow
 * @property {string} terminalBlue
 * @property {string} terminalMagenta
 * @property {string} terminalCyan
 * @property {string} terminalBrightRed
 * @property {string} terminalBrightGreen
 * @property {string} terminalBrightYellow
 * @property {string} terminalBrightBlue
 * @property {string} terminalBrightMagenta
 * @property {string} terminalBrightCyan
 */

/**
 * @typedef {Object} Palette
 * @property {string} id
 * @property {string} label
 * @property {"dark"} type
 * @property {"vs-dark"} uiTheme
 * @property {PaletteUITokens} ui
 * @property {PaletteSyntaxTokens} syntax
 */

/**
 * @typedef {Object} Theme
 * @property {string} name
 * @property {string} type
 * @property {Record<string, string>} colors
 * @property {Array<{ name?: string, scope?: string | string[], settings: { foreground?: string, fontStyle?: string } }>} tokenColors
 * @property {boolean} [semanticHighlighting]
 */

function toHexByte(value) {
  return Math.round(value).toString(16).padStart(2, "0").toUpperCase();
}

function normalizeHex(hex) {
  return hex.toUpperCase();
}

/**
 * @param {string} color
 * @param {number} alpha - 0–1 opacity
 * @returns {string} Uppercase `#RRGGBB` or `#RRGGBBAA`
 */
export function withAlpha(color, alpha) {
  const c = chroma(color).alpha(alpha);
  const [r, g, b] = c.rgb();

  if (alpha >= 1) {
    return normalizeHex(c.hex());
  }

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}${toHexByte(alpha * 255)}`;
}

/**
 * @param {string} color
 * @param {number} alphaByte - 0–255 alpha channel
 * @returns {string} Uppercase `#RRGGBB` or `#RRGGBBAA`
 */
export function withAlphaByte(color, alphaByte) {
  const c = chroma(color);
  const [r, g, b] = c.rgb();

  if (alphaByte >= 0xff) {
    return normalizeHex(c.hex());
  }

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}${toHexByte(alphaByte)}`;
}

/**
 * @param {string} a
 * @param {string} b
 * @param {number} ratio - Blend weight toward `b` (0–1)
 * @returns {string}
 */
export function mixColors(a, b, ratio) {
  return normalizeHex(chroma.mix(a, b, ratio, "rgb").hex());
}

/**
 * @param {string} color
 * @param {number} amount - Chroma brighten factor (scaled ×5 internally)
 * @returns {string}
 */
export function lighten(color, amount) {
  return normalizeHex(chroma(color).brighten(amount * 5).hex());
}

/**
 * @param {string} color
 * @param {number} amount - Chroma darken factor (scaled ×5 internally)
 * @returns {string}
 */
export function darken(color, amount) {
  return normalizeHex(chroma(color).darken(amount * 5).hex());
}

/** @param {string} color */
export function isValidColor(color) {
  return chroma.valid(color);
}

/** Syntax role keys validated for editor contrast. */
export const SYNTAX_TOKEN_KEYS = [
  "default",
  "comment",
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
 * @param {string} foreground
 * @param {string} background
 * @returns {number} WCAG contrast ratio
 */
export function contrastRatio(foreground, background) {
  return chroma.contrast(foreground, background);
}

/**
 * @param {Palette} palette
 * @returns {Palette}
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
    ...SYNTAX_TOKEN_KEYS.filter((key) => key !== "default" && key !== "comment").map(
      (key) => [`syntax.${key}`, palette.syntax[key], editor, targets.syntaxToken],
    ),
    ["syntax.comment", commentForeground, editor, targets.syntaxComment],
  ];

  const failures = [];
  for (const [path, foreground, background, minimum] of checks) {
    const ratio = contrastRatio(foreground, background);
    if (Number(ratio.toFixed(2)) < minimum) {
      failures.push(
        `${path}: ${ratio.toFixed(2)}:1 (minimum ${minimum}:1)`,
      );
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
 * @param {Palette} palette
 * @returns {Palette}
 * @throws {Error} On invalid color values or contrast failures
 */
export function validatePalette(palette) {
  for (const [key, value] of Object.entries(palette.ui)) {
    if (!value || !isValidColor(value)) {
      throw new Error(`Invalid UI base token "${key}": ${value}`);
    }
  }

  for (const [key, value] of Object.entries(palette.syntax)) {
    if (!value || !isValidColor(value)) {
      throw new Error(`Invalid syntax base token "${key}": ${value}`);
    }
  }

  validatePaletteContrast(palette);

  return palette;
}

/** VS Code removed, renamed, or non-schema keys — never emit in generated themes. */
export const DEPRECATED_THEME_COLOR_IDS = [
  "activityBar.dropBackground",
  "activityBar.activeForeground",
  "editorGroup.background",
  "editorIndentGuide.background",
  "editorIndentGuide.activeBackground",
  "notification.background",
  "notification.buttonBackground",
  "notification.buttonHoverBackground",
  "notification.infoBackground",
  "notification.warningBackground",
  "notification.errorBackground",
  "chat.requestBubbleBackground",
  "chat.requestBubbleHoverBackground",
  "chat.requestCodeBorder",
  "agentsChatInput.background",
  "agentsChatInput.border",
  "agentsChatInput.foreground",
  "agentsChatInput.placeholderForeground",
  "agentsChatInput.focusBorder",
  "agentSessionsList.background",
  "statusBarItem.activeForeground",
  "panelTitle.hoverForeground",
  "button.secondaryHoverForeground",
];

/** Workbench colors that must include transparency (alpha byte < 0xff). */
export const TRANSPARENT_WORKBENCH_COLOR_IDS = [
  "editor.hoverHighlightBackground",
  "merge.currentHeaderBackground",
  "merge.currentContentBackground",
];

/**
 * @param {string} hex
 * @returns {number} Alpha channel 0–255; opaque colors return 255
 */
export function colorAlphaByte(hex) {
  const normalized = hex.replace(/^#/, "");
  if (normalized.length === 8) {
    return parseInt(normalized.slice(6, 8), 16);
  }
  return 0xff;
}

/**
 * @param {Theme} theme
 * @param {string} paletteId
 * @throws {Error} On schema violations, missing keys, deprecated colors, or invalid values
 */
export function validateGeneratedTheme(theme, paletteId) {
  for (const key of ["name", "type", "colors", "tokenColors"]) {
    if (!(key in theme)) {
      throw new Error(`Missing required key "${key}" in theme "${paletteId}"`);
    }
  }

  if ("semanticTokenColors" in theme) {
    throw new Error(`Unexpected semanticTokenColors in theme "${paletteId}"`);
  }

  for (const key of WORKBENCH_COLOR_IDS) {
    if (!(key in theme.colors)) {
      throw new Error(`Missing workbench color "${key}" in theme "${paletteId}"`);
    }
  }

  for (const [key, value] of Object.entries(theme.colors)) {
    if (DEPRECATED_THEME_COLOR_IDS.includes(key)) {
      throw new Error(
        `Deprecated workbench color "${key}" in theme "${paletteId}"`,
      );
    }

    if (!isValidColor(value)) {
      throw new Error(
        `Invalid color "${value}" for workbench key "${key}" in theme "${paletteId}"`,
      );
    }

    if (
      TRANSPARENT_WORKBENCH_COLOR_IDS.includes(key) &&
      colorAlphaByte(value) >= 0xff
    ) {
      throw new Error(
        `Workbench color "${key}" must be transparent in theme "${paletteId}"`,
      );
    }
  }

  for (const rule of theme.tokenColors) {
    if (rule.settings?.background !== undefined) {
      throw new Error(
        `Token background colors are not supported in theme "${paletteId}"`,
      );
    }
  }

  if (theme.tokenColors.length !== EXPECTED_SYNTAX_RULE_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_SYNTAX_RULE_COUNT} tokenColor rules, got ${theme.tokenColors.length} in theme "${paletteId}"`,
    );
  }

  for (const key of EXTENSION_WORKBENCH_COLOR_IDS) {
    if (!(key in theme.colors)) {
      throw new Error(
        `Missing extension workbench color "${key}" in theme "${paletteId}"`,
      );
    }
  }

  const allowedWorkbenchKeys = new Set([
    ...WORKBENCH_COLOR_IDS,
    ...EXTENSION_WORKBENCH_COLOR_IDS,
  ]);
  for (const key of Object.keys(theme.colors)) {
    if (!allowedWorkbenchKeys.has(key)) {
      throw new Error(
        `Unknown workbench color "${key}" in theme "${paletteId}" (not in Ether catalogs)`,
      );
    }
  }
}
