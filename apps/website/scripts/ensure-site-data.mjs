import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareWebsiteData } from "./prepare-data.mjs";

const websiteDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const generatedSiteData = join(websiteDir, "src", "generated", "site-data.ts");
const snippetDataDir = join(websiteDir, "public", "data", "snippets");

const hasGeneratedData = existsSync(generatedSiteData);
const hasSnippetBundles =
  existsSync(snippetDataDir) &&
  existsSync(join(snippetDataDir, "react-jsx.json"));

if (!hasGeneratedData || !hasSnippetBundles) {
  await prepareWebsiteData();
}
