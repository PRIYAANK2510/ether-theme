import chroma from "chroma-js";

function toHexByte(value) {
  return Math.round(value).toString(16).padStart(2, "0").toUpperCase();
}

function normalizeHex(hex) {
  return hex.toUpperCase();
}

/**
 * @param {string} color
 * @param {number} alpha - 0–1 opacity
 * @returns {string} Uppercase `#RRGGBB` or `#RRGGBBAA`
 */
export function withAlpha(color, alpha) {
  const c = chroma(color).alpha(alpha);
  const [r, g, b] = c.rgb();

  if (alpha >= 1) {
    return normalizeHex(c.hex());
  }

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}${toHexByte(alpha * 255)}`;
}

/**
 * @param {string} color
 * @param {number} alphaByte - 0–255 alpha channel
 * @returns {string} Uppercase `#RRGGBB` or `#RRGGBBAA`
 */
export function withAlphaByte(color, alphaByte) {
  const c = chroma(color);
  const [r, g, b] = c.rgb();

  if (alphaByte >= 0xff) {
    return normalizeHex(c.hex());
  }

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}${toHexByte(alphaByte)}`;
}

/**
 * @param {string} a
 * @param {string} b
 * @param {number} ratio - Blend weight toward `b` (0–1)
 * @returns {string}
 */
export function mixColors(a, b, ratio) {
  return normalizeHex(chroma.mix(a, b, ratio, "rgb").hex());
}

/**
 * @param {string} color
 * @param {number} amount - Chroma darken factor (scaled ×5 internally)
 * @returns {string}
 */
export function darken(color, amount) {
  return normalizeHex(
    chroma(color)
      .darken(amount * 5)
      .hex(),
  );
}

/** @param {string} color */
export function isValidColor(color) {
  return chroma.valid(color);
}

/**
 * @param {string} foreground
 * @param {string} background
 * @returns {number} WCAG contrast ratio
 */
export function contrastRatio(foreground, background) {
  return chroma.contrast(foreground, background);
}

/**
 * @param {string} hex
 * @returns {number} Alpha channel 0–255; opaque colors return 255
 */
export function colorAlphaByte(hex) {
  const normalized = hex.replace(/^#/, "");
  if (normalized.length === 8) {
    return parseInt(normalized.slice(6, 8), 16);
  }
  return 0xff;
}

/** @param {string} color @param {number} amount */
export function lighten(color, amount) {
  return normalizeHex(
    chroma(color)
      .brighten(amount * 5)
      .hex(),
  );
}
