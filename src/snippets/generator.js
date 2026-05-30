import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
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

export function writeSnippetFile(language, snippets, outputDir = snippetsDir) {
  const fileName = SNIPPET_LANGUAGES.find((entry) => entry.language === language)?.file;
  if (!fileName) {
    throw new Error(`No output file configured for language "${language}"`);
  }

  mkdirSync(outputDir, { recursive: true });
  const filePath = join(outputDir, fileName);
  writeFileSync(filePath, `${JSON.stringify(snippets, null, 2)}\n`, "utf8");
  return filePath;
}

export function syncSnippetContributions(contributions) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  packageJson.contributes = {
    ...packageJson.contributes,
    snippets: contributions,
  };
  writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
}

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
