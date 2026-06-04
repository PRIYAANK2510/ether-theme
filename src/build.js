import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateAllThemes, loadPalettes } from "./generator/index.js";
import {
  generateAllPreviews,
  syncReadmePreviewGallery,
} from "./generator/preview-svg.js";
import { generateAllSnippets } from "./snippets/generator.js";

const skipPreviews = process.argv.includes("--skip-previews");

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = join(rootDir, "docs");
const previewsDir = join(docsDir, "previews");
const readmePath = join(rootDir, "README.md");

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

if (!skipPreviews) {
  const { generatedFiles: previewFiles, removedFiles: removedPreviews } =
    generateAllPreviews(palettes, previewsDir);

  console.log(`Generated ${previewFiles.length} theme preview(s):`);
  for (const file of previewFiles) {
    console.log(`  - ${file}`);
  }

  if (removedPreviews.length > 0) {
    console.log(`Removed ${removedPreviews.length} orphaned preview(s):`);
    for (const file of removedPreviews) {
      console.log(`  - ${file}`);
    }
  }

  syncReadmePreviewGallery(readmePath, palettes);
  console.log(`Synced theme preview gallery in README.md`);
}

const {
  catalogCount,
  generatedFiles: snippetFiles,
  contributions: snippetContributions,
} = await generateAllSnippets();

console.log(`Generated ${snippetFiles.length} snippet file(s) from ${catalogCount} definitions:`);
for (const file of snippetFiles) {
  console.log(`  - ${file}`);
}

console.log(`Synced ${snippetContributions.length} snippet contribution(s) to package.json`);
console.log("Build complete.");
