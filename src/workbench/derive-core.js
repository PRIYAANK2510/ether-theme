import {
  deriveCommentForeground,
  mixColors,
  withAlphaByte,
  LINE_NUMBER_MIX_INACTIVE,
} from "../utils/color.js";
import { EXTENSION_WORKBENCH_COLOR_IDS, WORKBENCH_COLOR_IDS } from "./constants.js";
import {
  deriveComposerInputColors,
  deriveWorkbenchExtensionColors,
} from "./derive-extensions.js";
import {
  UI_ALPHA,
  deriveAccentVariants,
  deriveInteractiveOverlays,
} from "./derive-interactive.js";

function deriveScrollbarVariants(scrollbar) {
  return {
    base: withAlphaByte(scrollbar, UI_ALPHA.a77),
    hover: withAlphaByte(scrollbar, UI_ALPHA.aAA),
    active: withAlphaByte(scrollbar, UI_ALPHA.aCC),
  };
}

/**
 * Maps palette UI tokens to the full VS Code workbench color table.
 * @param {import("../utils/color.js").PaletteUITokens} base
 * @returns {Record<string, string>}
 * @throws {Error} When a required workbench key has no derivation
 */
export function deriveUISemantics(base) {
  const accent = deriveAccentVariants(base.accent);
  const interactive = deriveInteractiveOverlays(base);
  const scrollbar = deriveScrollbarVariants(base.scrollbar);
  const composerInput = deriveComposerInputColors(base, accent);
  const inlayHintForeground = deriveCommentForeground(base);
  const inlayHintBackground = withAlphaByte(
    base.surfaceLineHighlight,
    UI_ALPHA.a77,
  );

  const colors = {
    focusBorder: accent.aBB,
    foreground: base.fgPrimary,
    "widget.shadow": base.shadow,
    "selection.background": accent.a40,
    errorForeground: base.error,
    "button.background": accent.aCC,
    "button.foreground": base.fgOnButton ?? base.surfaceShell,
    "button.hoverBackground": withAlphaByte(base.accentHover, UI_ALPHA.aCC),
    "dropdown.background": base.surfaceInput,
    "dropdown.border": base.dropdownBorder,
    "input.background": composerInput.background,
    "input.border": composerInput.border,
    "input.foreground": composerInput.foreground,
    "input.placeholderForeground": composerInput.placeholder,
    "inputOption.activeBorder": base.accent,
    "inputValidation.errorBackground": base.inputValidationError,
    "inputValidation.errorBorder": base.inputValidationError,
    "inputValidation.infoBackground": base.inputValidationInfo,
    "inputValidation.infoBorder": base.inputValidationInfo,
    "inputValidation.warningBackground": base.inputValidationWarning,
    "inputValidation.warningBorder": base.inputValidationWarning,
    "scrollbar.shadow": base.surfacePanel,
    "scrollbarSlider.activeBackground": scrollbar.active,
    "scrollbarSlider.background": scrollbar.base,
    "scrollbarSlider.hoverBackground": scrollbar.hover,
    "badge.background": base.accent,
    "badge.foreground": base.fgOnAccent,
    "progressBar.background": base.accent,
    "list.activeSelectionBackground": base.surfaceListFocus,
    "list.activeSelectionForeground": base.accent,
    "list.dropBackground": base.dropTarget,
    "list.focusBackground": base.surfaceListFocus,
    "list.focusForeground": base.fgListFocus,
    "list.hoverBackground": base.surfaceListFocus,
    "list.hoverForeground": base.fgListFocus,
    "list.inactiveSelectionBackground": base.surfaceHover,
    "list.inactiveSelectionForeground": base.accent,
    "activityBar.background": base.surfaceShell,
    "activityBar.dropBorder": base.dropTarget,
    "activityBar.foreground": base.fgPrimary,
    "activityBar.inactiveForeground": base.fgActivity,
    "activityBar.activeBackground": withAlphaByte(base.accent, UI_ALPHA.a28),
    "activityBar.activeBorder": base.accent,
    "activityBarBadge.background": base.accent,
    "activityBarBadge.foreground": base.fgOnAccent,
    "activityBar.border": base.surfaceBorder,
    "sideBar.background": base.surfacePanel,
    "sideBarSectionHeader.background": base.surfacePanel,
    "sideBarTitle.foreground": base.accent,
    "sideBar.foreground": base.fgMuted,
    "sideBar.border": base.surfaceBorder,
    "editorGroup.dropBackground": withAlphaByte(
      base.editorGroupDrop,
      UI_ALPHA.aD7,
    ),
    "editorGroupHeader.tabsBackground": base.surfacePanel,
    "tab.activeBackground": base.surfaceEditor,
    "tab.inactiveBackground": base.surfacePanel,
    "tab.activeForeground": base.accent,
    "tab.inactiveForeground": base.fgMuted,
    "editor.background": base.surfaceEditor,
    "editor.foreground": base.fgPrimary,
    "editorLineNumber.foreground": mixColors(
      base.fgMuted,
      base.surfaceEditor,
      LINE_NUMBER_MIX_INACTIVE,
    ),
    "editorLineNumber.activeForeground": deriveCommentForeground(base),
    "editorCursor.foreground": base.cursor,
    "editor.selectionBackground": accent.a30,
    "editor.selectionHighlightBackground": accent.a20,
    "editor.wordHighlightBackground": accent.a28,
    "editor.wordHighlightStrongBackground": accent.a48,
    "editor.findMatchBackground": withAlphaByte(base.findMatch, UI_ALPHA.aD7),
    "editor.findMatchHighlightBackground": withAlphaByte(
      base.findMatch,
      UI_ALPHA.a55,
    ),
    "editor.hoverHighlightBackground": withAlphaByte(
      base.surfaceHover,
      UI_ALPHA.a40,
    ),
    "editor.lineHighlightBackground": base.surfaceLineHighlight,
    "editor.lineHighlightBorder": base.surfaceLineHighlight,
    "editorLink.activeForeground": base.accent,
    "editor.rangeHighlightBackground": accent.a15,
    "editorWhitespace.foreground": base.indentGuide,
    "editorIndentGuide.background1": base.indentGuide,
    "editorIndentGuide.activeBackground1": base.indentGuideActive,
    "editorRuler.foreground": base.ruler,
    "editorCodeLens.foreground": base.fgMuted,
    "editorInlayHint.background": inlayHintBackground,
    "editorInlayHint.foreground": inlayHintForeground,
    "editorInlayHint.parameterBackground": inlayHintBackground,
    "editorInlayHint.parameterForeground": inlayHintForeground,
    "editorInlayHint.typeBackground": inlayHintBackground,
    "editorInlayHint.typeForeground": mixColors(
      inlayHintForeground,
      base.accent,
      0.28,
    ),
    "editorBracketMatch.background": accent.a30,
    "editorBracketMatch.border": base.accent,
    "editorOverviewRuler.border": base.surfaceBorder,
    "editorError.foreground": base.error,
    "editorWarning.foreground": base.warning,
    "editorGutter.modifiedBackground": withAlphaByte(
      base.gitModified,
      UI_ALPHA.aBB,
    ),
    "editorGutter.addedBackground": withAlphaByte(base.gitAdded, UI_ALPHA.aBB),
    "editorGutter.deletedBackground": withAlphaByte(
      base.gitDeleted,
      UI_ALPHA.aBB,
    ),
    "diffEditor.insertedTextBackground": withAlphaByte(
      base.diffInserted,
      UI_ALPHA.a20,
    ),
    "diffEditor.removedTextBackground": withAlphaByte(
      base.diffRemoved,
      UI_ALPHA.a20,
    ),
    "editorWidget.background": base.surfaceWidget,
    "editorSuggestWidget.background": base.surfaceWidget,
    "editorSuggestWidget.border": accent.a40,
    "editorSuggestWidget.foreground": base.fgPrimary,
    "editorSuggestWidget.highlightForeground": base.accent,
    "editorSuggestWidget.selectedBackground": base.surfaceListFocus,
    "editorSuggestWidget.selectedForeground": base.fgListFocus,
    "editorHoverWidget.background": base.surfaceHover,
    "editorHoverWidget.border": withAlphaByte(base.surfaceHover, 0),
    "editorHoverWidget.foreground": base.fgPrimary,
    "debugExceptionWidget.background": withAlphaByte(
      base.warning,
      UI_ALPHA.a60,
    ),
    "debugExceptionWidget.border": withAlphaByte(base.warning, UI_ALPHA.a60),
    "peekView.border": base.surfacePanel,
    "peekViewEditor.background": base.surfacePeek,
    "peekViewEditor.matchHighlightBackground": withAlphaByte(
      base.warning,
      UI_ALPHA.a60,
    ),
    "peekViewResult.background": base.surfacePeek,
    "peekViewResult.matchHighlightBackground": withAlphaByte(
      base.warning,
      UI_ALPHA.a60,
    ),
    "peekViewResult.selectionBackground": base.surfaceListFocus,
    "peekViewTitle.background": base.surfacePeek,
    "peekViewTitleDescription.foreground": base.fgMuted,
    "merge.currentHeaderBackground": withAlphaByte(
      base.mergeCurrent,
      UI_ALPHA.a40,
    ),
    "merge.currentContentBackground": withAlphaByte(
      base.mergeCurrent,
      UI_ALPHA.a40,
    ),
    "merge.incomingHeaderBackground": accent.aBB,
    "merge.incomingContentBackground": accent.a40,
    "panel.background": base.surfacePanel,
    "panel.border": base.surfaceBorder,
    "panelTitle.activeBorder": base.surfacePanel,
    "panelTitle.inactiveForeground": base.fgMuted,
    "statusBar.background": base.surfacePanel,
    "statusBar.debuggingBackground": base.error,
    "statusBar.noFolderBackground": base.surfacePanel,
    "statusBarItem.activeBackground": interactive.activeBackground,
    "statusBarItem.hoverBackground": interactive.hoverBackground,
    "statusBarItem.prominentBackground": accent.a28,
    "statusBarItem.prominentHoverBackground": interactive.subtleBackground,
    "terminal.ansiRed": base.terminalRed,
    "terminal.ansiGreen": base.terminalGreen,
    "terminal.ansiYellow": base.terminalYellow,
    "terminal.ansiBlue": base.terminalBlue,
    "terminal.ansiMagenta": base.terminalMagenta,
    "terminal.ansiCyan": base.terminalCyan,
    "terminal.ansiBrightRed": base.terminalBrightRed,
    "terminal.ansiBrightGreen": base.terminalBrightGreen,
    "terminal.ansiBrightYellow": base.terminalBrightYellow,
    "terminal.ansiBrightBlue": base.terminalBrightBlue,
    "terminal.ansiBrightMagenta": base.terminalBrightMagenta,
    "terminal.ansiBrightCyan": base.terminalBrightCyan,
    "terminalCursor.background": base.surfacePanel,
    "terminalCursor.foreground": base.terminalYellow,
    "titleBar.activeBackground": base.surfacePanel,
    "notifications.background": base.surfaceNotification,
    "notifications.foreground": base.fgPrimary,
    "notificationsInfoIcon.foreground": base.accent,
    "notificationsWarningIcon.foreground": base.warning,
    "notificationsErrorIcon.foreground": base.error,
    "extensionButton.prominentBackground": accent.aCC,
    "extensionButton.prominentForeground": base.fgOnButton ?? base.surfaceShell,
    "extensionButton.prominentHoverBackground": withAlphaByte(
      base.accentHover,
      UI_ALPHA.aCC,
    ),
    "pickerGroup.border": base.ruler,
    "pickerGroup.foreground": base.fgMuted,
    "debugToolBar.background": base.surfaceWidget,
    "walkThrough.embeddedEditorBackground": base.surfacePanel,
  };

  for (const key of WORKBENCH_COLOR_IDS) {
    if (!(key in colors)) {
      throw new Error(`Missing derived UI semantic color for "${key}"`);
    }
  }

  const ordered = {};
  // Emit in catalog order so generated themes diff predictably
  for (const key of WORKBENCH_COLOR_IDS) {
    ordered[key] = colors[key];
  }

  const extensionColors = deriveWorkbenchExtensionColors(base);
  for (const key of EXTENSION_WORKBENCH_COLOR_IDS) {
    ordered[key] = extensionColors[key];
  }

  return ordered;
}
