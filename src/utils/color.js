/**
 * Color utilities + palette validation (barrel).
 * Implementation split: `color-math.js` (ops) · `palette-validate.js` (WCAG / schema).
 */

/**
 * @typedef {Object} PaletteSyntaxTokens
 * @property {string} default
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

export {
  withAlpha,
  withAlphaByte,
  mixColors,
  darken,
  isValidColor,
  contrastRatio,
  colorAlphaByte,
} from "./color-math.js";

export {
  PALETTE_SYNTAX_TOKEN_KEYS,
  LINE_NUMBER_MIX_INACTIVE,
  deriveCommentForeground,
  PALETTE_CONTRAST_TARGETS,
  validatePaletteContrast,
  validatePalette,
  TRANSPARENT_WORKBENCH_COLOR_IDS,
} from "./palette-validate.js";
