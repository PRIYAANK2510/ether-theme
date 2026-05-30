import chroma from "chroma-js";
import { WORKBENCH_COLOR_IDS, EXPECTED_SYNTAX_RULE_COUNT } from "../workbench/constants.js";
import { EXTENSION_WORKBENCH_COLOR_IDS } from "../workbench/extension-catalog.js";

function toHexByte(value) {
  return Math.round(value).toString(16).padStart(2, "0").toUpperCase();
}

function normalizeHex(hex) {
  return hex.toUpperCase();
}

export function withAlpha(color, alpha) {
  const c = chroma(color).alpha(alpha);
  const [r, g, b] = c.rgb();

  if (alpha >= 1) {
    return normalizeHex(c.hex());
  }

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}${toHexByte(alpha * 255)}`;
}

export function withAlphaByte(color, alphaByte) {
  const c = chroma(color);
  const [r, g, b] = c.rgb();

  if (alphaByte >= 0xff) {
    return normalizeHex(c.hex());
  }

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}${toHexByte(alphaByte)}`;
}

export function mixColors(a, b, ratio) {
  return normalizeHex(chroma.mix(a, b, ratio, "rgb").hex());
}

export function lighten(color, amount) {
  return normalizeHex(chroma(color).brighten(amount * 5).hex());
}

export function darken(color, amount) {
  return normalizeHex(chroma(color).darken(amount * 5).hex());
}

export function isValidColor(color) {
  return chroma.valid(color);
}

/** WCAG contrast targets for palette base tokens (checked at build time). */
export const PALETTE_CONTRAST_TARGETS = {
  fgPrimary: 7,
  fgMuted: 4.5,
  syntaxDefault: 7,
  syntaxComment: 3,
  fgOnAccent: 4.5,
};

export function contrastRatio(foreground, background) {
  return chroma.contrast(foreground, background);
}

export function validatePaletteContrast(palette) {
  const editor = palette.ui.surfaceEditor;
  const checks = [
    ["ui.fgPrimary", palette.ui.fgPrimary, editor, PALETTE_CONTRAST_TARGETS.fgPrimary],
    ["ui.fgMuted", palette.ui.fgMuted, editor, PALETTE_CONTRAST_TARGETS.fgMuted],
    ["syntax.default", palette.syntax.default, editor, PALETTE_CONTRAST_TARGETS.syntaxDefault],
    ["syntax.comment", palette.syntax.comment, editor, PALETTE_CONTRAST_TARGETS.syntaxComment],
    [
      "ui.fgOnAccent",
      palette.ui.fgOnAccent,
      palette.ui.accent,
      PALETTE_CONTRAST_TARGETS.fgOnAccent,
    ],
  ];

  const failures = [];
  for (const [path, foreground, background, minimum] of checks) {
    const ratio = contrastRatio(foreground, background);
    if (ratio < minimum) {
      failures.push(
        `${path}: ${ratio.toFixed(2)}:1 (minimum ${minimum}:1)`,
      );
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `Contrast failures in palette "${palette.id}":\n  ${failures.join("\n  ")}`,
    );
  }

  return palette;
}

export function validatePalette(palette) {
  for (const [key, value] of Object.entries(palette.ui)) {
    if (!value || !isValidColor(value)) {
      throw new Error(`Invalid UI base token "${key}": ${value}`);
    }
  }

  for (const [key, value] of Object.entries(palette.syntax)) {
    if (!value || !isValidColor(value)) {
      throw new Error(`Invalid syntax base token "${key}": ${value}`);
    }
  }

  validatePaletteContrast(palette);

  return palette;
}

/** VS Code removed or renamed these; emitting them triggers schema warnings. */
export const DEPRECATED_THEME_COLOR_IDS = [
  "activityBar.dropBackground",
  "editorGroup.background",
  "editorIndentGuide.background",
  "editorIndentGuide.activeBackground",
  "notification.background",
  "notification.buttonBackground",
  "notification.buttonHoverBackground",
  "notification.infoBackground",
  "notification.warningBackground",
  "notification.errorBackground",
  "chat.requestBubbleBackground",
  "chat.requestBubbleHoverBackground",
  "chat.requestCodeBorder",
];

/** Workbench colors that must include transparency (alpha byte < 0xff). */
export const TRANSPARENT_WORKBENCH_COLOR_IDS = [
  "editor.hoverHighlightBackground",
  "merge.currentHeaderBackground",
  "merge.currentContentBackground",
];

export function colorAlphaByte(hex) {
  const normalized = hex.replace(/^#/, "");
  if (normalized.length === 8) {
    return parseInt(normalized.slice(6, 8), 16);
  }
  return 0xff;
}

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
      throw new Error(`Missing workbench color "${key}" in theme "${paletteId}"`);
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
}
