import { Resvg } from "@resvg/resvg-js";
import { PNG_RENDER_WIDTH } from "./constants.js";

/**
 * @param {string} svg
 * @returns {Buffer}
 */
export function renderSvgToPng(svg) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: PNG_RENDER_WIDTH },
    font: {
      loadSystemFonts: true,
      defaultFontFamily: "JetBrains Mono",
    },
  });
  return resvg.render().asPng();
}
