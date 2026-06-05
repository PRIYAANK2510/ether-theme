import { withAlpha } from "../src/utils/color.js";

/**
 * @param {import("../src/utils/color.js").Palette} palette
 */
export function paletteToSiteVars(palette) {
  const { ui, syntax } = palette;

  return {
    "--bg": ui.surfaceShell,
    "--surface": ui.surfacePanel,
    "--surface-2": ui.surfaceWidget,
    "--surface-3": ui.surfaceListFocus,
    "--border": ui.indentGuide,
    "--text": ui.fgPrimary,
    "--muted": ui.fgMuted,
    "--accent": ui.accent,
    "--accent-2": ui.accentHover,
    "--accent-soft": withAlpha(ui.accent, 0.14),
    "--accent-glow": withAlpha(ui.accent, 0.16),
    "--accent-glow-2": withAlpha(ui.accentHover, 0.08),
    "--code-bg": ui.surfaceEditor,
    "--shadow": ui.shadow,
    "--hover-row": withAlpha(ui.accent, 0.06),
    "--topbar-bg": withAlpha(ui.surfaceShell, 0.88),
    "--syn-default": syntax.default,
    "--syn-comment": syntax.comment,
    "--syn-string": syntax.string,
    "--syn-keyword": syntax.keyword,
    "--syn-function": syntax.function,
    "--syn-type": syntax.type,
    "--syn-variable": syntax.variable,
    "--syn-number": syntax.number,
    "--syn-cyan": syntax.cyan,
    "--syn-red": syntax.red,
    "--syn-pink": syntax.pink,
    "--pill-code": syntax.function,
    "--overlay-bg": withAlpha(ui.surfaceShell, 0.9),
    "--success": ui.gitAdded,
  };
}

/**
 * @param {import("../src/utils/color.js").Palette[]} palettes
 */
export function buildThemesData(palettes) {
  /** @type {Record<string, { label: string, accent: string, color: string, vars: Record<string, string> }>} */
  const data = {};
  for (const palette of palettes) {
    data[palette.id] = {
      label: palette.label,
      accent: palette.ui.accent,
      color: palette.ui.surfaceShell,
      vars: paletteToSiteVars(palette),
    };
  }
  return data;
}
