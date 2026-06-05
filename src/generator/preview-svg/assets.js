import { mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { writeFileIfChanged } from "../../utils/fs.js";
import { join } from "node:path";
import { renderThemePreviewSvg } from "./compose.js";
import { renderSvgToPng } from "./rasterize.js";

/**
 * @param {import("../../utils/color.js").Palette} palette
 * @param {string} outputDir
 * @returns {{ pngPath: string }}
 */
export function writePreviewAssets(palette, outputDir) {
  mkdirSync(outputDir, { recursive: true });
  const pngPath = join(outputDir, `${palette.id}.png`);
  writeFileIfChanged(pngPath, renderSvgToPng(renderThemePreviewSvg(palette)));
  return { pngPath };
}

/**
 * @param {string[]} activeIds
 * @param {string} previewsDirectory
 * @returns {string[]}
 */
export function removeOrphanedPreviewFiles(activeIds, previewsDirectory) {
  mkdirSync(previewsDirectory, { recursive: true });
  const activeBaseNames = new Set(activeIds);
  const removedFiles = [];

  for (const file of readdirSync(previewsDirectory)) {
    if (file.match(/^gallery-row-\d+\.png$/)) {
      const filePath = join(previewsDirectory, file);
      unlinkSync(filePath);
      removedFiles.push(filePath);
      continue;
    }

    const themeMatch = file.match(/^(ether-.+)\.(png|svg)$/);
    if (!themeMatch) {
      continue;
    }

    const keep = themeMatch[2] === "png" && activeBaseNames.has(themeMatch[1]);
    if (keep) {
      continue;
    }

    const filePath = join(previewsDirectory, file);
    unlinkSync(filePath);
    removedFiles.push(filePath);
  }

  return removedFiles;
}

/**
 * @param {import("../../utils/color.js").Palette[]} palettes
 * @param {string} [previewsDirectory]
 * @returns {{ generatedFiles: string[], removedFiles: string[] }}
 */
export function generateAllPreviews(
  palettes,
  previewsDirectory = "docs/previews",
) {
  const activeIds = palettes.map((palette) => palette.id);
  const removedFiles = removeOrphanedPreviewFiles(activeIds, previewsDirectory);
  const generatedFiles = [];

  for (const palette of palettes) {
    const { pngPath } = writePreviewAssets(palette, previewsDirectory);
    generatedFiles.push(pngPath);
  }

  return { generatedFiles, removedFiles };
}
