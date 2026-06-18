import {
  colorAlphaByte,
  DEPRECATED_THEME_COLOR_IDS,
  isValidColor,
  TRANSPARENT_WORKBENCH_COLOR_IDS,
} from "../utils/color.js";
import {
  ALL_WORKBENCH_COLOR_IDS,
  EXPECTED_SYNTAX_RULE_COUNT,
  EXTENSION_WORKBENCH_COLOR_IDS,
  WORKBENCH_COLOR_IDS,
} from "./constants.js";

/**
 * @param {import("../utils/color.js").Theme} theme
 * @param {string} paletteId
 * @throws {Error} On schema violations, missing keys, deprecated colors, or invalid values
 */
export function validateGeneratedTheme(theme, paletteId) {
  for (const key of ["name", "type", "colors", "tokenColors"]) {
    if (!(key in theme)) {
      throw new Error(`Missing required key "${key}" in theme "${paletteId}"`);
    }
  }

  if ("semanticTokenColors" in theme) {
    throw new Error(`Unexpected semanticTokenColors in theme "${paletteId}"`);
  }

  for (const key of WORKBENCH_COLOR_IDS) {
    if (!(key in theme.colors)) {
      throw new Error(
        `Missing workbench color "${key}" in theme "${paletteId}"`,
      );
    }
  }

  for (const [key, value] of Object.entries(theme.colors)) {
    if (DEPRECATED_THEME_COLOR_IDS.includes(key)) {
      throw new Error(
        `Deprecated workbench color "${key}" in theme "${paletteId}"`,
      );
    }

    if (!isValidColor(value)) {
      throw new Error(
        `Invalid color "${value}" for workbench key "${key}" in theme "${paletteId}"`,
      );
    }

    if (
      TRANSPARENT_WORKBENCH_COLOR_IDS.includes(key) &&
      colorAlphaByte(value) >= 0xff
    ) {
      throw new Error(
        `Workbench color "${key}" must be transparent in theme "${paletteId}"`,
      );
    }
  }

  for (const rule of theme.tokenColors) {
    if (rule.settings?.background !== undefined) {
      throw new Error(
        `Token background colors are not supported in theme "${paletteId}"`,
      );
    }
  }

  if (theme.tokenColors.length !== EXPECTED_SYNTAX_RULE_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_SYNTAX_RULE_COUNT} tokenColor rules, got ${theme.tokenColors.length} in theme "${paletteId}"`,
    );
  }

  for (const key of EXTENSION_WORKBENCH_COLOR_IDS) {
    if (!(key in theme.colors)) {
      throw new Error(
        `Missing extension workbench color "${key}" in theme "${paletteId}"`,
      );
    }
  }

  const allowedWorkbenchKeys = new Set(ALL_WORKBENCH_COLOR_IDS);
  for (const key of Object.keys(theme.colors)) {
    if (!allowedWorkbenchKeys.has(key)) {
      throw new Error(
        `Unknown workbench color "${key}" in theme "${paletteId}" (not in Ether catalogs)`,
      );
    }
  }
}
