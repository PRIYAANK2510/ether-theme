import { loadPalettes, generateAllThemes } from "./generator/index.js";

const palettes = await loadPalettes();

if (palettes.length === 0) {
  console.error("No palettes found in src/palettes/");
  process.exit(1);
}

const { generatedFiles, contributions, removedFiles } =
  generateAllThemes(palettes);

console.log(`Generated ${generatedFiles.length} theme(s):`);
for (const file of generatedFiles) {
  console.log(`  - ${file}`);
}

if (removedFiles.length > 0) {
  console.log(`Removed ${removedFiles.length} orphaned theme(s):`);
  for (const file of removedFiles) {
    console.log(`  - ${file}`);
  }
}

console.log(`Synced ${contributions.length} theme contribution(s) to package.json`);
