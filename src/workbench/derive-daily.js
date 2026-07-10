import { withAlphaByte } from "../utils/color.js";
import { UI_ALPHA } from "./derive-interactive.js";

/**
 * Derive daily-driver workbench colors from palette UI tokens.
 * @param {import("../utils/color.js").PaletteUITokens} base
 * @returns {Record<string, string>}
 */
export function deriveDailyDriverColors(base) {
  const accentSoft = withAlphaByte(base.accent, UI_ALPHA.a28);
  const selectionSoft = withAlphaByte(base.accent, UI_ALPHA.a30);

  return {
    disabledForeground: withAlphaByte(base.fgMuted, UI_ALPHA.a77),
    "icon.foreground": base.fgMuted,
    "sash.hoverBorder": base.accent,
    "widget.border": base.surfaceBorder,

    "gitDecoration.addedResourceForeground": base.gitAdded,
    "gitDecoration.modifiedResourceForeground": base.gitModified,
    "gitDecoration.deletedResourceForeground": base.gitDeleted,
    "gitDecoration.untrackedResourceForeground": base.gitAdded,
    "gitDecoration.ignoredResourceForeground": withAlphaByte(
      base.fgMuted,
      UI_ALPHA.aAA,
    ),
    "gitDecoration.conflictingResourceForeground": base.error,
    "gitDecoration.renamedResourceForeground": base.terminalCyan,
    "gitDecoration.stageModifiedResourceForeground": base.gitModified,
    "gitDecoration.stageDeletedResourceForeground": base.gitDeleted,
    "gitDecoration.submoduleResourceForeground": base.terminalBlue,

    "minimap.background": base.surfaceEditor,
    "minimap.findMatchHighlight": withAlphaByte(base.findMatch, UI_ALPHA.aCC),
    "minimap.selectionHighlight": selectionSoft,
    "minimap.errorHighlight": base.error,
    "minimap.warningHighlight": base.warning,
    "minimapGutter.addedBackground": base.gitAdded,
    "minimapGutter.modifiedBackground": base.gitModified,
    "minimapGutter.deletedBackground": base.gitDeleted,
    "minimapSlider.background": withAlphaByte(base.scrollbar, UI_ALPHA.a77),
    "minimapSlider.hoverBackground": withAlphaByte(base.scrollbar, UI_ALPHA.aAA),
    "minimapSlider.activeBackground": withAlphaByte(base.scrollbar, UI_ALPHA.aCC),

    "editorBracketHighlight.foreground1": base.terminalCyan,
    "editorBracketHighlight.foreground2": base.terminalMagenta,
    "editorBracketHighlight.foreground3": base.terminalGreen,
    "editorBracketHighlight.foreground4": base.terminalYellow,
    "editorBracketHighlight.foreground5": base.terminalBlue,
    "editorBracketHighlight.foreground6": base.terminalBrightMagenta,
    "editorBracketHighlight.unexpectedBracket.foreground": base.error,

    "editorStickyScroll.background": base.surfaceEditor,
    "editorStickyScroll.border": base.surfaceBorder,
    "editorStickyScroll.shadow": base.shadow,
    "editorStickyScrollHover.background": base.surfaceLineHighlight,

    "terminal.background": base.surfaceEditor,
    "terminal.foreground": base.fgPrimary,
    "terminal.border": base.surfaceBorder,
    "terminal.selectionBackground": selectionSoft,
    "terminal.ansiBlack": base.surfaceBorder,
    "terminal.ansiWhite": base.fgPrimary,
    "terminal.ansiBrightBlack": base.fgMuted,
    "terminal.ansiBrightWhite": base.fgListFocus,

    "list.errorForeground": base.error,
    "list.warningForeground": base.warning,
    "list.highlightForeground": base.accent,
    "list.focusHighlightForeground": base.accentHover,
    "list.inactiveFocusBackground": base.surfaceHover,
    "list.filterMatchBackground": withAlphaByte(base.findMatch, UI_ALPHA.a55),
    "list.activeSelectionIconForeground": base.fgListFocus,
    "list.invalidItemForeground": base.error,
    "tree.indentGuidesStroke": base.indentGuide,

    "editorOverviewRuler.addedForeground": base.gitAdded,
    "editorOverviewRuler.modifiedForeground": base.gitModified,
    "editorOverviewRuler.deletedForeground": base.gitDeleted,
    "editorOverviewRuler.errorForeground": base.error,
    "editorOverviewRuler.warningForeground": base.warning,
    "editorOverviewRuler.findMatchForeground": base.findMatch,
    "editorOverviewRuler.selectionHighlightForeground": base.accent,

    "editor.foldBackground": withAlphaByte(
      base.surfaceLineHighlight,
      UI_ALPHA.a77,
    ),
    "editor.inactiveSelectionBackground": withAlphaByte(
      base.accent,
      UI_ALPHA.a20,
    ),
    "editorGutter.background": base.surfaceEditor,
    "editorGutter.foldingControlForeground": base.fgMuted,
    "editorWidget.border": base.surfaceBorder,
    "editorWidget.foreground": base.fgPrimary,
    "editorHoverWidget.statusBarBackground": base.surfaceWidget,
    "editorSuggestWidget.focusHighlightForeground": base.accent,

    "tab.activeBorder": base.surfaceEditor,
    "tab.hoverBorder": base.accent,
    "tab.unfocusedActiveBackground": base.surfaceEditor,
    "tab.unfocusedInactiveBackground": base.surfacePanel,
    "sideBar.dropBackground": base.dropTarget,
    "panel.dropBorder": base.accent,

    "statusBar.noFolderForeground": base.fgMuted,
    "statusBar.focusBorder": base.accent,
    "banner.background": base.surfaceNotification,
    "banner.foreground": base.fgPrimary,
    "banner.iconForeground": base.accent,

    "toolbar.hoverBackground": base.surfaceHover,
    "toolbar.activeBackground": base.surfaceListFocus,
    "textCodeBlock.background": base.surfaceInput,
    "textBlockQuote.background": base.surfaceWidget,
    "textBlockQuote.border": base.accent,
    "textPreformat.foreground": base.fgPrimary,
    "textPreformat.background": base.surfaceInput,

    "peekViewTitleLabel.foreground": base.fgPrimary,
    "peekViewResult.fileForeground": base.fgPrimary,
    "peekViewResult.lineForeground": base.fgMuted,
    "peekViewResult.selectionForeground": base.fgListFocus,
    "problemsErrorIcon.foreground": base.error,
    "problemsWarningIcon.foreground": base.warning,
    "problemsInfoIcon.foreground": base.accent,

    "inputOption.activeBackground": accentSoft,
    "inputOption.activeForeground": base.fgPrimary,
  };
}
