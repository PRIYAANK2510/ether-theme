import { withAlphaByte } from "../utils/color.js";
import { WORKBENCH_COLOR_IDS } from "./constants.js";
import { EXTENSION_WORKBENCH_COLOR_IDS } from "./extension-catalog.js";
import { deriveWorkbenchExtensionColors } from "./derive-extensions.js";

export const UI_ALPHA = {
  a15: 0x15,
  a20: 0x20,
  a28: 0x28,
  a30: 0x30,
  a40: 0x40,
  a48: 0x48,
  a55: 0x55,
  a60: 0x60,
  a77: 0x77,
  aAA: 0xaa,
  aBB: 0xbb,
  aB0: 0xb0,
  aCC: 0xcc,
  aD7: 0xd7,
};

export function deriveAccentVariants(accent) {
  return {
    a15: withAlphaByte(accent, UI_ALPHA.a15),
    a20: withAlphaByte(accent, UI_ALPHA.a20),
    a28: withAlphaByte(accent, UI_ALPHA.a28),
    a30: withAlphaByte(accent, UI_ALPHA.a30),
    a40: withAlphaByte(accent, UI_ALPHA.a40),
    a48: withAlphaByte(accent, UI_ALPHA.a48),
    aBB: withAlphaByte(accent, UI_ALPHA.aBB),
    aB0: withAlphaByte(accent, UI_ALPHA.aB0),
    aCC: withAlphaByte(accent, UI_ALPHA.aCC),
  };
}

function deriveScrollbarVariants(scrollbar) {
  return {
    base: withAlphaByte(scrollbar, UI_ALPHA.a77),
    hover: withAlphaByte(scrollbar, UI_ALPHA.aAA),
    active: withAlphaByte(scrollbar, UI_ALPHA.aCC),
  };
}

export function deriveUISemantics(base) {
  const accent = deriveAccentVariants(base.accent);
  const scrollbar = deriveScrollbarVariants(base.scrollbar);

  const colors = {
    focusBorder: base.accent,
    foreground: base.fgPrimary,
    "widget.shadow": base.shadow,
    "selection.background": accent.a40,
    errorForeground: base.error,
    "button.background": accent.aCC,
    "button.foreground": base.fgOnButton ?? base.surfaceShell,
    "button.hoverBackground": withAlphaByte(base.accentHover, UI_ALPHA.aCC),
    "dropdown.background": base.surfaceInput,
    "dropdown.border": base.dropdownBorder,
    "input.background": base.surfaceInput,
    "input.placeholderForeground": base.fgMuted,
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
    "list.activeSelectionBackground": base.surfacePanel,
    "list.activeSelectionForeground": base.accent,
    "list.dropBackground": base.dropTarget,
    "list.focusBackground": base.surfaceListFocus,
    "list.focusForeground": base.fgListFocus,
    "list.hoverBackground": base.surfacePanel,
    "list.hoverForeground": base.fgListFocus,
    "list.inactiveSelectionBackground": base.surfacePanel,
    "list.inactiveSelectionForeground": base.accent,
    "activityBar.background": base.surfaceShell,
    "activityBar.dropBorder": base.dropTarget,
    "activityBar.foreground": base.fgActivity,
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
    "editorLineNumber.foreground": base.fgMuted,
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
    "editor.hoverHighlightBackground": withAlphaByte(base.surfaceHover, UI_ALPHA.a40),
    "editor.lineHighlightBackground": base.surfaceLineHighlight,
    "editor.lineHighlightBorder": base.surfaceLineHighlight,
    "editorLink.activeForeground": base.accent,
    "editor.rangeHighlightBackground": accent.a15,
    "editorWhitespace.foreground": base.indentGuide,
    "editorIndentGuide.background1": base.indentGuide,
    "editorIndentGuide.activeBackground1": base.indentGuideActive,
    "editorRuler.foreground": base.ruler,
    "editorCodeLens.foreground": base.fgMuted,
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
    "editorSuggestWidget.selectedBackground": base.surfaceHover,
    "editorHoverWidget.background": base.surfaceHover,
    "editorHoverWidget.border": withAlphaByte(base.surfaceHover, 0),
    "editorHoverWidget.foreground": base.fgPrimary,
    "debugExceptionWidget.background": withAlphaByte(base.warning, UI_ALPHA.a60),
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
    "peekViewResult.selectionBackground": base.surfacePanel,
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
    "statusBarItem.activeBackground": accent.aCC,
    "statusBarItem.hoverBackground": accent.aB0,
    "statusBarItem.prominentBackground": accent.aB0,
    "statusBarItem.prominentHoverBackground": accent.aCC,
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
    "extensionButton.prominentHoverBackground": accent.aB0,
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
  for (const key of WORKBENCH_COLOR_IDS) {
    ordered[key] = colors[key];
  }

  const extensionColors = deriveWorkbenchExtensionColors(base, accent);
  for (const key of EXTENSION_WORKBENCH_COLOR_IDS) {
    ordered[key] = extensionColors[key];
  }

  return ordered;
}
