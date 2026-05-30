import { withAlphaByte } from "../utils/color.js";

/** Fixed alpha-byte values reused across workbench derivations. */
export const UI_ALPHA = {
  a15: 0x15,
  a20: 0x20,
  a28: 0x28,
  a30: 0x30,
  a40: 0x40,
  a48: 0x48,
  a55: 0x55,
  a60: 0x60,
  a77: 0x77,
  aAA: 0xaa,
  aBB: 0xbb,
  aCC: 0xcc,
  aD7: 0xd7,
};

/**
 * Neutral hover/active overlays that stay readable on panel, editor, and tinted bars.
 * Use surfaceListFocus for list rows on surfacePanel parents instead of these overlays.
 * @param {import("../utils/color.js").PaletteUITokens} base
 */
export function deriveInteractiveOverlays(base) {
  return {
    hoverBackground: withAlphaByte(base.fgPrimary, UI_ALPHA.a20),
    activeBackground: withAlphaByte(base.fgPrimary, UI_ALPHA.a30),
    subtleBackground: withAlphaByte(base.fgPrimary, UI_ALPHA.a15),
    hoverForeground: base.fgPrimary,
    activeForeground: base.fgListFocus,
  };
}

/**
 * @param {string} accent
 * @returns {Record<"a15" | "a20" | "a28" | "a30" | "a40" | "a48" | "aBB" | "aCC", string>}
 */
export function deriveAccentVariants(accent) {
  return {
    a15: withAlphaByte(accent, UI_ALPHA.a15),
    a20: withAlphaByte(accent, UI_ALPHA.a20),
    a28: withAlphaByte(accent, UI_ALPHA.a28),
    a30: withAlphaByte(accent, UI_ALPHA.a30),
    a40: withAlphaByte(accent, UI_ALPHA.a40),
    a48: withAlphaByte(accent, UI_ALPHA.a48),
    aBB: withAlphaByte(accent, UI_ALPHA.aBB),
    aCC: withAlphaByte(accent, UI_ALPHA.aCC),
  };
}
