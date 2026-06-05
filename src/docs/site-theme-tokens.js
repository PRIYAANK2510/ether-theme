import { withAlpha } from "../utils/color.js";

/** @type {readonly string[]} */
export const SITE_THEME_CSS_VARS = [
  "--bg",
  "--surface",
  "--surface-2",
  "--surface-3",
  "--border",
  "--text",
  "--muted",
  "--accent",
  "--accent-2",
  "--accent-soft",
  "--accent-glow",
  "--accent-glow-2",
  "--code-bg",
  "--shadow",
  "--hover-row",
  "--topbar-bg",
  "--syn-default",
  "--syn-comment",
  "--syn-string",
  "--syn-keyword",
  "--syn-function",
  "--syn-type",
  "--syn-variable",
  "--syn-number",
  "--syn-cyan",
  "--pill-code",
];

/**
 * @param {import("../utils/color.js").Palette} palette
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
    "--pill-code": syntax.function,
  };
}

/**
 * @param {string} selector
 * @param {Record<string, string>} vars
 */
export function renderThemeCssBlock(selector, vars) {
  const rules = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
  return `${selector} {\n${rules}\n}`;
}

/**
 * @param {import("../utils/color.js").Palette[]} palettes
 * @param {string} [defaultId]
 */
export function buildThemesStylesheet(palettes, defaultId = "ether-dusk") {
  const defaultPalette =
    palettes.find((palette) => palette.id === defaultId) ?? palettes[0];
  const blocks = [
    renderThemeCssBlock(":root", paletteToSiteVars(defaultPalette)),
    ...palettes.map((palette) =>
      renderThemeCssBlock(
        `html[data-ether-theme="${palette.id}"]`,
        paletteToSiteVars(palette),
      ),
    ),
  ];
  return `${blocks.join("\n\n")}\n`;
}
