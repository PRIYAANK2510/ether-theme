import { mixColors, withAlphaByte } from "../utils/color.js";
import { EXTENSION_WORKBENCH_COLOR_IDS } from "./extension-catalog.js";

/**
 * Embedded agent/composer prompt — flush with editor.background.
 * Cursor paints the composer pane from editor.background; the prompt should not
 * read as a separate sunken card.
 */
export function deriveComposerInputColors(base, accent) {
  return {
    background: base.surfaceEditor,
    border: withAlphaByte(base.surfaceBorder, 0x35),
    foreground: base.fgPrimary,
    placeholder: base.fgMuted,
    focusBorder: accent.aBB,
  };
}

/**
 * Standard form fields on panels, dialogs, and quick pick.
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
 * Derive modern VS Code / Cursor workbench keys from palette UI tokens.
 * @param {Record<string, string>} base - palette.ui
 * @param {ReturnType<import("./derive-core.js").deriveAccentVariants>} accent
 */
export function deriveWorkbenchExtensionColors(base, accent) {
  const composerPane = base.surfaceEditor;
  const composerInput = deriveComposerInputColors(base, accent);
  const formInput = deriveFormInputColors(base);

  const colors = {
    // Agent / chat — composer pane follows editor.background in Cursor
    "chat.requestBackground": mixColors(composerPane, base.surfacePanel, 0.22),
    "chat.requestBorder": withAlphaByte(base.surfaceBorder, 0x40),
    "chat.slashCommandBackground": accent.a28,
    "chat.slashCommandForeground": base.accent,
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

    "agentsChatInput.background": composerInput.background,
    "agentsChatInput.border": composerInput.border,
    "agentsChatInput.foreground": composerInput.foreground,
    "agentsChatInput.placeholderForeground": composerInput.placeholder,
    "agentsChatInput.focusBorder": composerInput.focusBorder,
    "agentSessionsList.background": composerPane,

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

    "button.secondaryBackground": withAlphaByte(base.fgPrimary, 0x0c),
    "button.secondaryForeground": base.fgMuted,
    "button.secondaryHoverBackground": withAlphaByte(base.fgPrimary, 0x18),
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
