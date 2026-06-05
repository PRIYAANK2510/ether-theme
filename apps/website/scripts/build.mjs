import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { prepareWebsiteData } from "./prepare-data.mjs";
import { writeSeoArtifacts } from "./seo-build.mjs";

const websiteDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const rootDir = join(websiteDir, "../..");
const siteDir = join(rootDir, "site");

export async function buildWebsite() {
  const data = await prepareWebsiteData();
  execSync("npx vite build --config apps/website/vite.config.ts", {
    cwd: rootDir,
    stdio: "inherit",
  });

  writeFileSync(join(siteDir, ".nojekyll"), "", "utf8");
  writeSeoArtifacts(siteDir, {
    languages: data.languages,
    paletteCount: data.paletteCount,
    catalogCount: data.catalogCount,
  });

  return {
    paletteCount: data.paletteCount,
    catalogCount: data.catalogCount,
    outputDir: siteDir,
  };
}

const invokedDirectly =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (invokedDirectly) {
  const result = await buildWebsite();
  console.log(
    `Built website (${result.paletteCount} themes, ${result.catalogCount} snippets) → ${result.outputDir}`,
  );
}
