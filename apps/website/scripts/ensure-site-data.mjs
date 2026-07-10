import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareWebsiteData } from "./prepare-data.mjs";

const websiteDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const rootDir = join(websiteDir, "../..");

const generatedSiteData = join(websiteDir, "src", "generated", "site-data.ts");
const snippetDataDir = join(websiteDir, "public", "data", "snippets");
const snippetIndexPath = join(websiteDir, "public", "data", "snippet-index.json");

/** @param {string} dir @param {(name: string) => boolean} accept */
function newestMtimeInDir(dir, accept) {
  if (!existsSync(dir)) {
    return 0;
  }

  let newest = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      newest = Math.max(newest, newestMtimeInDir(path, accept));
    } else if (accept(entry.name)) {
      newest = Math.max(newest, statSync(path).mtimeMs);
    }
  }
  return newest;
}

/** @param {string} path */
function mtimeOrZero(path) {
  return existsSync(path) ? statSync(path).mtimeMs : 0;
}

export function isSiteDataMissing() {
  return (
    !existsSync(generatedSiteData) ||
    !existsSync(snippetIndexPath) ||
    !existsSync(join(snippetDataDir, "react-jsx.json"))
  );
}

export function isSiteDataStale() {
  if (isSiteDataMissing()) {
    return true;
  }

  const preparedAt = statSync(generatedSiteData).mtimeMs;
  const jsOrMjs = (name) => name.endsWith(".js") || name.endsWith(".mjs");
  const inputNewest = Math.max(
    mtimeOrZero(join(rootDir, "icon.png")),
    newestMtimeInDir(join(rootDir, "themes"), (name) =>
      name.endsWith(".color-theme.json"),
    ),
    newestMtimeInDir(join(rootDir, "src", "palettes"), (name) =>
      name.endsWith(".js"),
    ),
    newestMtimeInDir(join(rootDir, "src", "syntax"), jsOrMjs),
    newestMtimeInDir(join(rootDir, "src", "workbench"), jsOrMjs),
    newestMtimeInDir(join(rootDir, "src", "generator"), jsOrMjs),
    newestMtimeInDir(join(rootDir, "src", "utils"), jsOrMjs),
    newestMtimeInDir(join(rootDir, "src", "snippets", "catalog"), (name) =>
      name.endsWith(".js"),
    ),
    newestMtimeInDir(join(rootDir, "shared"), jsOrMjs),
    mtimeOrZero(join(websiteDir, "scripts", "prepare-data.mjs")),
    mtimeOrZero(join(websiteDir, "scripts", "highlight-snippet.mjs")),
  );

  return inputNewest > preparedAt;
}

export function needsSitePrepare() {
  return isSiteDataMissing() || isSiteDataStale();
}

const invokedDirectly =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (invokedDirectly && needsSitePrepare()) {
  await prepareWebsiteData();
}
