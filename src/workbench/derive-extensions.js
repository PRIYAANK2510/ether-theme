import { mixColors, withAlphaByte } from "../utils/color.js";
import { EXTENSION_WORKBENCH_COLOR_IDS } from "./extension-catalog.js";
import { deriveInteractiveOverlays } from "./derive-interactive.js";

/**
 * @param {import("../utils/color.js").PaletteUITokens} base
 * @param {ReturnType<import("./derive-core.js").deriveAccentVariants>} accent
 * @returns {{ background: string, border: string, foreground: string, placeholder: string, focusBorder: string }}
 */
export function deriveComposerInputColors(base, accent) {
  return {
    // Match editor.background so Cursor's composer pane does not look like a sunken card
    background: base.surfaceEditor,
    border: withAlphaByte(base.surfaceBorder, 0x35),
    foreground: base.fgPrimary,
    placeholder: base.fgMuted,
    focusBorder: accent.aBB,
  };
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} base
 * @returns {{ background: string, border: string, foreground: string, placeholder: string }}
 */
export function deriveFormInputColors(base) {
  return {
    background: base.surfaceInput,
    border: withAlphaByte(base.dropdownBorder, 0x72),
    foreground: base.fgPrimary,
    placeholder: base.fgMuted,
  };
}

/**
 * @param {import("../utils/color.js").PaletteUITokens} base
 * @param {ReturnType<import("./derive-core.js").deriveAccentVariants>} accent
 * @returns {Record<string, string>}
 * @throws {Error} When a required extension workbench key has no derivation
 */
export function deriveWorkbenchExtensionColors(base, accent) {
  const composerPane = base.surfaceEditor;
  const composerInput = deriveComposerInputColors(base, accent);
  const formInput = deriveFormInputColors(base);
  const interactive = deriveInteractiveOverlays(base);

  const colors = {
    // Composer pane follows editor.background in Cursor — keep chat chrome flush with the editor
    "chat.requestBackground": mixColors(composerPane, base.surfacePanel, 0.22),
    "chat.requestBorder": withAlphaByte(base.surfaceBorder, 0x40),
    "chat.slashCommandBackground": interactive.subtleBackground,
    "chat.slashCommandForeground": base.fgListFocus,
    "chat.avatarBackground": withAlphaByte(base.accent, 0x40),
    "chat.avatarForeground": base.fgOnAccent,
    "chat.editedFileForeground": base.findMatch,
    "inlineChat.background": composerPane,
    "inlineChat.border": withAlphaByte(base.surfaceBorder, 0x28),
    "inlineChat.foreground": base.fgPrimary,
    "inlineChat.shadow": withAlphaByte(base.shadow, 0x55),
    "inlineChatDiff.inserted": withAlphaByte(base.diffInserted, 0x20),
    "inlineChatDiff.removed": withAlphaByte(base.diffRemoved, 0x20),
    "inlineChatInput.background": composerInput.background,
    "inlineChatInput.border": composerInput.border,
    "inlineChatInput.focusBorder": composerInput.focusBorder,
    "inlineChatInput.placeholderForeground": composerInput.placeholder,

    "descriptionForeground": base.fgMuted,
    "textLink.foreground": base.accent,
    "textLink.activeForeground": base.accentHover,

    "quickInput.background": formInput.background,
    "quickInput.foreground": base.fgPrimary,
    "quickInputTitle.background": base.surfacePanel,
    "quickInputList.focusBackground": base.surfaceListFocus,
    "quickInputList.focusForeground": base.fgListFocus,

    "menu.background": base.surfaceWidget,
    "menu.foreground": base.fgPrimary,
    "menu.border": base.surfaceBorder,
    "menu.selectionBackground": base.surfaceListFocus,
    "menu.selectionForeground": base.fgListFocus,
    "menu.separatorBackground": base.surfaceBorder,

    "titleBar.activeForeground": base.fgPrimary,
    "titleBar.inactiveBackground": base.surfaceShell,
    "titleBar.inactiveForeground": base.fgMuted,
    "titleBar.border": base.surfaceBorder,

    "statusBar.foreground": base.fgMuted,
    "statusBar.border": base.surfaceBorder,
    "statusBar.debuggingForeground": base.fgOnAccent,
    "statusBarItem.hoverForeground": interactive.hoverForeground,
    "statusBarItem.prominentForeground": base.accent,
    "statusBarItem.prominentHoverForeground": interactive.activeForeground,

    "tab.border": base.surfaceBorder,
    "tab.activeBorderTop": base.accent,
    "tab.hoverBackground": base.surfaceListFocus,
    "tab.hoverForeground": base.fgListFocus,
    "tab.unfocusedActiveForeground": base.fgMuted,
    "tab.unfocusedInactiveForeground": base.fgMuted,

    "editorGroup.border": withAlphaByte(base.surfaceBorder, 0x77),
    "editorGroup.emptyBackground": base.surfacePanel,
    "editorGroup.focusedEmptyBorder": base.accent,
    "editorGroupHeader.tabsBorder": base.surfaceBorder,
    "editorGroupHeader.noTabsBackground": base.surfacePanel,

    "sideBarSectionHeader.foreground": base.fgPrimary,
    "sideBarSectionHeader.border": base.surfaceBorder,
    "sideBarTitle.background": base.surfacePanel,
    "sideBarStickyScroll.background": base.surfacePanel,

    "panelTitle.activeForeground": base.fgListFocus,
    "panelTitle.border": base.surfaceBorder,

    "notifications.border": base.surfaceBorder,
    "notificationCenterHeader.background": base.surfacePanel,
    "notificationCenterHeader.foreground": base.fgPrimary,
    "notificationLink.foreground": base.accent,
    "notificationToast.border": base.surfaceBorder,

    "button.secondaryBackground": interactive.subtleBackground,
    "button.secondaryForeground": base.fgPrimary,
    "button.secondaryHoverBackground": interactive.hoverBackground,
    "dropdown.foreground": base.fgPrimary,
    "dropdown.listBackground": base.surfaceShell,
    "checkbox.background": formInput.background,
    "checkbox.border": formInput.border,
    "checkbox.foreground": base.accent,
  };

  for (const key of EXTENSION_WORKBENCH_COLOR_IDS) {
    if (!(key in colors)) {
      throw new Error(`Missing extension workbench color derivation for "${key}"`);
    }
  }

  return colors;
}
