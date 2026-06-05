import { readFileSync, mkdirSync } from "node:fs";
import { writeFileIfChanged } from "../utils/fs.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSnippetCatalog } from "./catalog/index.js";
import {
  buildSnippetContributions,
  MIN_SNIPPET_COUNT,
  SNIPPET_LANGUAGES,
} from "./registry.js";
import {
  validateGeneratedSnippetFile,
  validateSnippetCatalog,
} from "./validate.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "../..");
const snippetsDir = join(rootDir, "snippets");
const packageJsonPath = join(rootDir, "package.json");

function resolveSnippetForLanguage(snippet, language) {
  const variant = snippet.variants?.[language] ?? {};
  return {
    prefix: variant.prefix ?? snippet.prefix,
    description: variant.description ?? snippet.description,
    body: variant.body ?? snippet.body,
  };
}

/**
 * @param {import("./validate.js").SnippetDefinition[]} catalog
 * @returns {Record<string, Record<string, import("./validate.js").GeneratedSnippet>>}
 * @throws {Error} On unknown languages or validation failures
 */
export function composeSnippetFiles(catalog) {
  const byLanguage = Object.fromEntries(
    SNIPPET_LANGUAGES.map(({ language }) => [language, {}]),
  );

  for (const snippet of catalog) {
    for (const language of snippet.languages) {
      if (!byLanguage[language]) {
        throw new Error(
          `Snippet "${snippet.key}" references unknown language "${language}"`,
        );
      }

      const resolved = resolveSnippetForLanguage(snippet, language);
      const snippetName = resolved.description;
      byLanguage[language][snippetName] = {
        prefix: resolved.prefix,
        body: resolved.body,
        description: resolved.description,
      };
    }
  }

  for (const { language } of SNIPPET_LANGUAGES) {
    validateGeneratedSnippetFile(byLanguage[language], language);
  }

  return byLanguage;
}

/**
 * @param {string} language
 * @param {Record<string, import("./validate.js").GeneratedSnippet>} snippets
 * @param {string} [outputDir]
 * @returns {string} Absolute path to the written file
 * @throws {Error} When no output file is configured for the language
 */
export function writeSnippetFile(language, snippets, outputDir = snippetsDir) {
  const fileName = SNIPPET_LANGUAGES.find(
    (entry) => entry.language === language,
  )?.file;
  if (!fileName) {
    throw new Error(`No output file configured for language "${language}"`);
  }

  mkdirSync(outputDir, { recursive: true });
  const filePath = join(outputDir, fileName);
  writeFileIfChanged(
    filePath,
    `${JSON.stringify(snippets, null, 2)}\n`,
    "utf8",
  );
  return filePath;
}

/**
 * @param {Array<{ language: string, path: string }>} contributions
 */
export function syncSnippetContributions(contributions) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  packageJson.contributes = {
    ...packageJson.contributes,
    snippets: contributions,
  };
  writeFileIfChanged(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
}

/**
 * @returns {Promise<{ catalogCount: number, generatedFiles: string[], contributions: Array<{ language: string, path: string }> }>}
 * @throws {Error} When catalog is below {@link MIN_SNIPPET_COUNT} or validation fails
 */
export async function generateAllSnippets() {
  const catalog = await loadSnippetCatalog();
  const catalogCount = validateSnippetCatalog(catalog);

  if (catalogCount < MIN_SNIPPET_COUNT) {
    throw new Error(
      `Snippet catalog has ${catalogCount} definitions; expected at least ${MIN_SNIPPET_COUNT}`,
    );
  }

  const byLanguage = composeSnippetFiles(catalog);
  const generatedFiles = [];

  for (const { language } of SNIPPET_LANGUAGES) {
    generatedFiles.push(writeSnippetFile(language, byLanguage[language]));
  }

  const contributions = buildSnippetContributions();
  syncSnippetContributions(contributions);

  return { catalogCount, generatedFiles, contributions };
}
