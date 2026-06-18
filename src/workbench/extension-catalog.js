/**
 * Curated VS Code / Cursor workbench color keys beyond the Ether core set.
 * Focused subset for command palette, menus, tabs, and links.
 *
 * Agent panel frame: Cursor sets --composer-pane-background from editor.background.
 * Composer input uses core input.* tokens (see derive-core.js).
 */
export const EXTENSION_WORKBENCH_COLOR_IDS = [
  // ── Global text / links ────────────────────────────────────────────────
  "descriptionForeground",
  "textLink.foreground",
  "textLink.activeForeground",

  // ── Command palette / quick pick ───────────────────────────────────────
  "quickInput.background",
  "quickInput.foreground",
  "quickInputTitle.background",
  "quickInputList.focusBackground",
  "quickInputList.focusForeground",

  // ── Menus ──────────────────────────────────────────────────────────────
  "menu.background",
  "menu.foreground",
  "menu.border",
  "menu.selectionBackground",
  "menu.selectionForeground",
  "menu.separatorBackground",

  // ── Title bar ──────────────────────────────────────────────────────────
  "titleBar.activeForeground",
  "titleBar.inactiveBackground",
  "titleBar.inactiveForeground",
  "titleBar.border",

  // ── Status bar ─────────────────────────────────────────────────────────
  "statusBar.foreground",
  "statusBar.border",
  "statusBar.debuggingForeground",
  "statusBarItem.hoverForeground",
  "statusBarItem.prominentForeground",
  "statusBarItem.prominentHoverForeground",

  // ── Tabs ───────────────────────────────────────────────────────────────
  "tab.border",
  "tab.activeBorderTop",
  "tab.hoverBackground",
  "tab.hoverForeground",
  "tab.unfocusedActiveForeground",
  "tab.unfocusedInactiveForeground",

  // ── Editor groups ──────────────────────────────────────────────────────
  "editorGroup.border",
  "editorGroup.emptyBackground",
  "editorGroup.focusedEmptyBorder",
  "editorGroupHeader.tabsBorder",
  "editorGroupHeader.noTabsBackground",

  // ── Diff editor ────────────────────────────────────────────────────────
  "diffEditor.border",
  "diffEditor.diagonalFill",
  "diffEditor.insertedLineBackground",
  "diffEditor.removedLineBackground",
  "diffEditor.unchangedRegionBackground",
  "diffEditor.unchangedRegionForeground",
  "diffEditor.unchangedRegionShadow",
  "diffEditor.unchangedCodeBackground",
  "multiDiffEditor.headerBackground",
  "multiDiffEditor.background",
  "multiDiffEditor.border",
  "editorGroupHeader.border",
  "breadcrumb.foreground",
  "breadcrumb.background",
  "breadcrumb.focusForeground",
  "breadcrumb.activeSelectionForeground",

  // ── Sidebar polish ─────────────────────────────────────────────────────
  "sideBarSectionHeader.foreground",
  "sideBarSectionHeader.border",
  "sideBarTitle.background",
  "sideBarStickyScroll.background",

  // ── Panel polish ───────────────────────────────────────────────────────
  "panelTitle.activeForeground",
  "panelTitle.border",

  // ── Notifications (modern API) ─────────────────────────────────────────
  "notifications.border",
  "notificationCenterHeader.background",
  "notificationCenterHeader.foreground",
  "notificationLink.foreground",
  "notificationToast.border",

  // ── Controls ───────────────────────────────────────────────────────────
  "button.secondaryBackground",
  "button.secondaryForeground",
  "button.secondaryHoverBackground",
  "dropdown.foreground",
  "dropdown.listBackground",
  "checkbox.background",
  "checkbox.border",
  "checkbox.foreground",
];
