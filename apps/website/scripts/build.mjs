import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { prepareWebsiteData } from "./prepare-data.mjs";
import { writeSeoArtifacts } from "./seo-build.mjs";

const websiteDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const rootDir = join(websiteDir, "../..");
const siteDir = join(rootDir, "site");
const viteBin = join(rootDir, "node_modules", "vite", "bin", "vite.js");

/** @typedef {{ skipPrepare?: boolean }} BuildWebsiteOptions */

/** @returns {Awaited<ReturnType<typeof prepareWebsiteData>>} */
function loadPreparedSiteData() {
  const siteDataPath = join(websiteDir, "src/generated/site-data.ts");
  const raw = readFileSync(siteDataPath, "utf8");
  const match = raw.match(/export const SITE_DATA = ([\s\S]+) as const;/);
  if (!match) {
    throw new Error(`Could not parse SITE_DATA from ${siteDataPath}`);
  }
  return JSON.parse(match[1]);
}

/** @param {BuildWebsiteOptions} [options] */
export async function buildWebsite(options = {}) {
  const skipPrepare =
    options.skipPrepare ?? process.argv.includes("--skip-prepare");
  const data = skipPrepare
    ? loadPreparedSiteData()
    : await prepareWebsiteData();
  execSync(`node "${viteBin}" build --config apps/website/vite.config.ts`, {
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
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (invokedDirectly) {
  const result = await buildWebsite();
  console.log(
    `Built website (${result.paletteCount} themes, ${result.catalogCount} snippets) → ${result.outputDir}`,
  );
}
