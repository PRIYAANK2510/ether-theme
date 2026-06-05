import chroma from "chroma-js";
import { contrastRatio, deriveCommentForeground } from "../utils/color.js";

/** Target hues (degrees) for stylesheet tokens — tuned for perceptual separation. */
const SHEET_HUES = {
  property: 215,
  function: 205,
  selectorClass: 50,
  selectorTag: 12,
  selectorPseudo: 172,
  selectorId: 188,
  valueKeyword: 168,
  valueNumber: 22,
  valueIdentifier: 312,
  colorLiteral: 328,
  variable: 184,
  sassVariable: 196,
  atRule: 268,
  mixin: 228,
  delimiter: 302,
};

/** Roles that must stay visually distinct in every palette (min circular hue delta). */
const HUE_SEPARATION_PAIRS = [
  ["sheetProperty", "sheetSelectorClass", 48],
  ["sheetProperty", "sheetValueKeyword", 32],
  ["sheetProperty", "sheetValueNumber", 42],
  ["sheetSelectorClass", "sheetValueNumber", 24],
  ["sheetValueKeyword", "sheetValueNumber", 28],
];

const ROLE_HUE_KEYS = {
  sheetProperty: "property",
  sheetSelectorClass: "selectorClass",
  sheetValueKeyword: "valueKeyword",
  sheetValueNumber: "valueNumber",
};

/**
 * @param {number} from
 * @param {number} to
 * @param {number} weight
 */
function blendHue(from, to, weight) {
  const delta = ((to - from + 540) % 360) - 180;
  return (from + delta * weight + 360) % 360;
}

/**
 * @param {string} source
 * @param {number} targetHue
 * @param {string} background
 * @param {{ sat?: [number, number], light?: [number, number], hueWeight?: number }} [options]
 */
function tuneSyntaxToken(source, targetHue, background, options = {}) {
  const { sat = [0.42, 0.72], light = [0.6, 0.8], hueWeight = 0.62 } = options;
  const base = chroma(source);
  let [hue, saturation, lightness] = base.hsl();

  if (Number.isNaN(hue)) {
    hue = targetHue;
  }

  hue = blendHue(hue, targetHue, hueWeight);
  saturation = Math.min(sat[1], Math.max(sat[0], saturation));
  lightness = Math.min(light[1], Math.max(light[0], lightness));

  let color = chroma.hsl(hue, saturation, lightness);
  let attempts = 0;
  while (
    contrastRatio(color.hex(), background) < 4.5 &&
    lightness < 0.92 &&
    attempts < 12
  ) {
    lightness += 0.025;
    color = chroma.hsl(hue, saturation, lightness);
    attempts += 1;
  }

  return color.hex();
}

/**
 * @param {number} a
 * @param {number} b
 */
function hueDelta(a, b) {
  return Math.abs(((a - b + 540) % 360) - 180);
}

/**
 * @param {string} hex
 * @param {number} targetHue
 * @param {string} background
 */
function nudgeHue(hex, targetHue, background) {
  const [, saturation, lightness] = chroma(hex).hsl();
  let nextLightness = lightness;
  let color = chroma.hsl(targetHue, saturation, nextLightness);
  let attempts = 0;
  while (
    contrastRatio(color.hex(), background) < 4.5 &&
    nextLightness < 0.92 &&
    attempts < 12
  ) {
    nextLightness += 0.025;
    color = chroma.hsl(targetHue, saturation, nextLightness);
    attempts += 1;
  }
  return color.hex();
}

/**
 * @param {Record<string, string>} tokens
 * @param {string} background
 */
function enforceHueSeparation(tokens, background) {
  const result = { ...tokens };

  for (let pass = 0; pass < 4; pass += 1) {
    let adjusted = false;

    for (const [roleA, roleB, minDelta] of HUE_SEPARATION_PAIRS) {
      const hueA = chroma(result[roleA]).get("hsl.h");
      const hueB = chroma(result[roleB]).get("hsl.h");
      if (Number.isNaN(hueA) || Number.isNaN(hueB)) {
        continue;
      }

      if (hueDelta(hueA, hueB) >= minDelta) {
        continue;
      }

      result[roleB] = nudgeHue(
        result[roleB],
        SHEET_HUES[ROLE_HUE_KEYS[roleB]],
        background,
      );
      adjusted = true;

      const nextHueA = chroma(result[roleA]).get("hsl.h");
      const nextHueB = chroma(result[roleB]).get("hsl.h");
      if (
        !Number.isNaN(nextHueA) &&
        !Number.isNaN(nextHueB) &&
        hueDelta(nextHueA, nextHueB) < minDelta
      ) {
        result[roleA] = nudgeHue(
          result[roleA],
          SHEET_HUES[ROLE_HUE_KEYS[roleA]],
          background,
        );
      }
    }

    if (!adjusted) {
      break;
    }
  }

  return result;
}

/**
 * Stylesheet-specific syntax colors with enforced hue separation on every palette.
 * Keeps palette character via tuned blends; avoids accent-pink variable bleed in CSS.
 *
 * @param {import("../utils/color.js").PaletteSyntaxTokens} syntax
 * @param {import("../utils/color.js").PaletteUITokens} ui
 */
export function deriveStylesheetSyntaxTokens(syntax, ui) {
  const editor = ui.surfaceEditor;
  const punctuation = deriveCommentForeground(ui);

  const tokens = {
    sheetProperty: tuneSyntaxToken(
      syntax.function,
      SHEET_HUES.property,
      editor,
      {
        hueWeight: 0.95,
      },
    ),
    sheetFunction: tuneSyntaxToken(
      syntax.function,
      SHEET_HUES.function,
      editor,
      {
        hueWeight: 0.88,
        light: [0.64, 0.84],
      },
    ),
    sheetSelectorClass: tuneSyntaxToken(
      syntax.type,
      SHEET_HUES.selectorClass,
      editor,
      {
        hueWeight: 0.8,
        sat: [0.5, 0.78],
      },
    ),
    sheetSelectorTag: tuneSyntaxToken(
      syntax.red,
      SHEET_HUES.selectorTag,
      editor,
      {
        sat: [0.48, 0.72],
      },
    ),
    sheetSelectorPseudo: tuneSyntaxToken(
      syntax.cyan,
      SHEET_HUES.selectorPseudo,
      editor,
    ),
    sheetSelectorId: tuneSyntaxToken(
      syntax.cyan,
      SHEET_HUES.selectorId,
      editor,
      {
        sat: [0.38, 0.62],
      },
    ),
    sheetValueKeyword: tuneSyntaxToken(
      syntax.cyan,
      SHEET_HUES.valueKeyword,
      editor,
      {
        hueWeight: 0.86,
      },
    ),
    sheetValueNumber: tuneSyntaxToken(
      syntax.number,
      SHEET_HUES.valueNumber,
      editor,
      {
        hueWeight: 0.92,
        sat: [0.55, 0.82],
      },
    ),
    sheetValueIdentifier: tuneSyntaxToken(
      syntax.pink,
      SHEET_HUES.valueIdentifier,
      editor,
      {
        sat: [0.38, 0.65],
      },
    ),
    sheetColorLiteral: tuneSyntaxToken(
      syntax.pink,
      SHEET_HUES.colorLiteral,
      editor,
      {
        sat: [0.32, 0.58],
        light: [0.62, 0.78],
      },
    ),
    sheetVariable: tuneSyntaxToken(syntax.cyan, SHEET_HUES.variable, editor, {
      hueWeight: 0.84,
    }),
    sheetSassVariable: tuneSyntaxToken(
      syntax.cyan,
      SHEET_HUES.sassVariable,
      editor,
      {
        sat: [0.4, 0.68],
      },
    ),
    sheetAtRule: tuneSyntaxToken(syntax.keyword, SHEET_HUES.atRule, editor, {
      sat: [0.38, 0.65],
    }),
    sheetMixin: tuneSyntaxToken(syntax.function, SHEET_HUES.mixin, editor, {
      sat: [0.4, 0.66],
    }),
    sheetDelimiter: tuneSyntaxToken(syntax.pink, SHEET_HUES.delimiter, editor, {
      sat: [0.3, 0.55],
    }),
    sheetPunctuation: punctuation,
  };

  return enforceHueSeparation(tokens, editor);
}
