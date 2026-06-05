import { CHAR_W } from "./constants.js";

/**
 * @param {string} text
 * @param {keyof typeof CHAR_W} kind
 */
export function textAdvance(text, kind) {
  return text.length * CHAR_W[kind];
}

/**
 * @param {string} value
 * @returns {string}
 */
export function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
