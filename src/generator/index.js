import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { deriveUISemantics } from "../workbench/derive-core.js";
import { buildTokenColors } from "../syntax/rules.js";
import { validatePalette, validateGeneratedTheme } from "../utils/color.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "../..");
const themesDir = join(rootDir, "themes");
const palettesDir = join(dirname(fileURLToPath(import.meta.url)), "../palettes");
const packageJsonPath = join(rootDir, "package.json");

export async function loadPalettes() {
  const files = readdirSync(palettesDir)
    .filter((file) => file.endsWith(".js"))
    .sort();

  const palettes = [];
  for (const file of files) {
    const module = await import(pathToFileURL(join(palettesDir, file)).href);
    palettes.push(module.default);
  }

  return palettes;
}

export function composeTheme(palette) {
  validatePalette(palette);
  const colors = deriveUISemantics(palette.ui);

  return {
    name: palette.label,
    type: palette.type,
    colors,
    tokenColors: buildTokenColors(palette.syntax),
  };
}

export function writeThemeFile(id, theme) {
  mkdirSync(themesDir, { recursive: true });
  const filePath = join(themesDir, `${id}.color-theme.json`);
  writeFileSync(filePath, `${JSON.stringify(theme, null, 2)}\n`, "utf8");
  return filePath;
}

export function syncPackageContributions(contributions) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  packageJson.contributes.themes = contributions;
  writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
}

/** Delete generated theme JSON whose palette no longer exists. */
export function removeOrphanedThemeFiles(activeIds, themesDirectory = themesDir) {
  mkdirSync(themesDirectory, { recursive: true });
  const activeFileNames = new Set(
    activeIds.map((id) => `${id}.color-theme.json`),
  );
  const removedFiles = [];

  for (const file of readdirSync(themesDirectory)) {
    if (!file.endsWith(".color-theme.json")) {
      continue;
    }
    if (activeFileNames.has(file)) {
      continue;
    }
    const filePath = join(themesDirectory, file);
    unlinkSync(filePath);
    removedFiles.push(filePath);
  }

  return removedFiles;
}

export function generateAllThemes(palettes) {
  const contributions = [];
  const generatedFiles = [];
  const activeIds = palettes.map((palette) => palette.id);

  for (const palette of palettes) {
    const theme = composeTheme(palette);
    validateGeneratedTheme(theme, palette.id);
    const filePath = writeThemeFile(palette.id, theme);
    generatedFiles.push(filePath);
    contributions.push({
      label: palette.label,
      uiTheme: palette.uiTheme,
      path: `./themes/${palette.id}.color-theme.json`,
    });
  }

  const removedFiles = removeOrphanedThemeFiles(activeIds);
  syncPackageContributions(contributions);

  return { contributions, generatedFiles, removedFiles };
}
