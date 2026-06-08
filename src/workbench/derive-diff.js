import { mixColors, withAlphaByte } from "../utils/color.js";

/**
 * Diff editor chrome — panel-toned file headers sit above the editor surface,
 * with breadcrumbs matching the editor background and a visible border between
 * chrome and diff content.
 *
 * @param {import("../utils/color.js").PaletteUITokens} base
 * @returns {Record<string, string>}
 */
export function deriveDiffEditorColors(base) {
  const content = base.surfaceEditor;
  const panelMatchesEditor =
    base.surfacePanel.toLowerCase() === base.surfaceEditor.toLowerCase();
  const header = panelMatchesEditor
    ? mixColors(base.surfaceEditor, base.surfaceHover, 0.38)
    : base.surfacePanel;
  const folded = mixColors(header, content, 0.52);
  const border = withAlphaByte(
    mixColors(base.surfaceBorder, base.fgMuted, 0.24),
    0xc8,
  );

  return {
    "diffEditor.border": border,
    "diffEditor.diagonalFill": withAlphaByte(base.surfaceBorder, 0x40),
    "diffEditor.insertedLineBackground": withAlphaByte(base.diffInserted, 0x16),
    "diffEditor.removedLineBackground": withAlphaByte(base.diffRemoved, 0x16),
    "diffEditor.unchangedRegionBackground": folded,
    "diffEditor.unchangedRegionForeground": base.fgMuted,
    "diffEditor.unchangedRegionShadow": withAlphaByte(base.shadow, 0x30),
    "diffEditor.unchangedCodeBackground": content,
    "multiDiffEditor.headerBackground": header,
    "multiDiffEditor.background": content,
    "multiDiffEditor.border": border,
    "editorGroupHeader.border": border,
    "breadcrumb.foreground": base.fgMuted,
    "breadcrumb.background": content,
    "breadcrumb.focusForeground": base.fgPrimary,
    "breadcrumb.activeSelectionForeground": base.accent,
  };
}
