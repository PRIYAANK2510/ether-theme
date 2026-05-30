import { withAlphaByte } from "../utils/color.js";
import { EXTENSION_WORKBENCH_COLOR_IDS } from "./extension-catalog.js";

/**
 * Derive modern VS Code / Cursor workbench keys from palette UI tokens.
 * @param {Record<string, string>} base - palette.ui
 * @param {ReturnType<import("./derive-core.js").deriveAccentVariants>} accent
 */
export function deriveWorkbenchExtensionColors(base, accent) {
  const agent = base.surfaceAgent ?? base.surfacePanel;

  const colors = {
    // Agent / chat — surfaceAgent; frame still follows editor.background (Cursor)
    "chat.requestBackground": withAlphaByte(agent, 0x9e),
    "chat.requestBorder": base.surfaceBorder,
    "chat.slashCommandBackground": accent.a48,
    "chat.slashCommandForeground": base.accent,
    "chat.avatarBackground": withAlphaByte(base.accent, 0x40),
    "chat.avatarForeground": base.fgOnAccent,
    "chat.editedFileForeground": base.findMatch,
    "inlineChat.background": agent,
    "inlineChat.border": withAlphaByte(base.surfaceBorder, 0x77),
    "inlineChat.foreground": base.fgPrimary,
    "inlineChat.shadow": base.shadow,
    "inlineChatDiff.inserted": withAlphaByte(base.diffInserted, 0x20),
    "inlineChatDiff.removed": withAlphaByte(base.diffRemoved, 0x20),
    "inlineChatInput.background": base.surfaceInput,
    "inlineChatInput.border": base.dropdownBorder,
    "inlineChatInput.focusBorder": base.accent,
    "inlineChatInput.placeholderForeground": base.fgMuted,

    "descriptionForeground": base.fgMuted,
    "textLink.foreground": base.accent,
    "textLink.activeForeground": base.accentHover,

    "quickInput.background": base.surfaceInput,
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

    "panelTitle.activeForeground": base.fgPrimary,
    "panelTitle.border": base.surfaceBorder,

    "notifications.border": base.surfaceBorder,
    "notificationCenterHeader.background": base.surfacePanel,
    "notificationCenterHeader.foreground": base.fgPrimary,
    "notificationLink.foreground": base.accent,
    "notificationToast.border": base.surfaceBorder,

    "button.secondaryBackground": base.surfaceInput,
    "button.secondaryForeground": base.fgPrimary,
    "button.secondaryHoverBackground": base.surfaceHover,
    "dropdown.foreground": base.fgPrimary,
    "dropdown.listBackground": base.surfaceShell,
    "checkbox.background": base.surfaceInput,
    "checkbox.border": base.dropdownBorder,
    "checkbox.foreground": base.accent,
  };

  for (const key of EXTENSION_WORKBENCH_COLOR_IDS) {
    if (!(key in colors)) {
      throw new Error(`Missing extension workbench color derivation for "${key}"`);
    }
  }

  return colors;
}
