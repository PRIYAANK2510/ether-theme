import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { prepareWebsiteData } from "./prepare-data.mjs";

const webDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = join(webDir, "..", "site");

export async function buildWebsite() {
  const data = await prepareWebsiteData();
  execSync("npx vite build --config web/vite.config.ts", {
    cwd: join(webDir, ".."),
    stdio: "inherit",
  });

  writeFileSync(join(siteDir, ".nojekyll"), "", "utf8");
  const indexHtml = readFileSync(join(siteDir, "index.html"), "utf8");
  writeFileSync(join(siteDir, "404.html"), indexHtml, "utf8");

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
