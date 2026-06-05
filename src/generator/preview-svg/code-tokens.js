import { CHAR_W } from "./constants.js";
import { escapeXml, textAdvance } from "./text.js";

/** Maps token roles to palette syntax keys (or special handling). */
const SYNTAX_ROLE_KEY = {
  keyword: "keyword",
  string: "string",
  number: "number",
  type: "type",
  function: "function",
  variable: "variable",
  tag: "cyan",
  attribute: "pink",
};

/**
 * @param {import("../../utils/color.js").PaletteSyntaxTokens} syntax
 * @param {string} comment
 * @param {string} role
 * @returns {string}
 */
export function syntaxColor(syntax, comment, role) {
  if (role === "comment") {
    return comment;
  }
  const key = SYNTAX_ROLE_KEY[role];
  return key ? syntax[key] : syntax.default;
}

/**
 * @param {string} role
 * @returns {string}
 */
function tokenStyleAttrs(role) {
  const attrs = [];
  if (role === "comment") {
    attrs.push('font-style="italic"');
  }
  if (role === "function" || role === "type") {
    attrs.push('font-weight="500"');
  }
  return attrs.length > 0 ? ` ${attrs.join(" ")}` : "";
}

/**
 * @param {Array<{ text: string, role: string }>} tokens
 * @param {import("../../utils/color.js").PaletteSyntaxTokens} syntax
 * @param {string} comment
 * @param {number} x
 * @param {number} y
 * @returns {string}
 */
export function codeLine(tokens, syntax, comment, x, y) {
  const spans = tokens
    .map((token, index) => {
      const pos = index === 0 ? ` x="${x}" y="${y}"` : "";
      return `<tspan${pos} fill="${syntaxColor(syntax, comment, token.role)}"${tokenStyleAttrs(token.role)}>${escapeXml(token.text)}</tspan>`;
    })
    .join("");
  return `<text class="code" xml:space="preserve">${spans}</text>`;
}

/**
 * @param {Array<{ text: string, role: string }>} tokens
 * @param {number} maxWidth
 * @returns {Array<{ text: string, role: string }>}
 */
export function trimTokensToWidth(tokens, maxWidth) {
  const ellipsisWidth = textAdvance("…", "code");
  let used = 0;
  const out = [];

  for (const token of tokens) {
    const w = textAdvance(token.text, "code");
    if (used + w > maxWidth - ellipsisWidth) {
      if (out.length === 0) {
        const slice = Math.max(
          4,
          Math.floor((maxWidth / CHAR_W.code) * 0.85),
        );
        out.push({
          text: `${token.text.slice(0, slice)}…`,
          role: token.role,
        });
      }
      break;
    }
    used += w;
    out.push(token);
  }

  return out.length > 0 ? out : tokens.slice(0, 1);
}
