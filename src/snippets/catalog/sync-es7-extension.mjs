/**
 * Regenerates extension-backed catalog modules (see SYNCED_MODULES in index.js).
 * Run: npm run snippets:sync
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SYNCED_MODULES } from "./index.js";

const JS_LANGUAGES = [
  "javascript",
  "typescript",
  "javascriptreact",
  "typescriptreact",
];

const catalogDir = dirname(fileURLToPath(import.meta.url));

/** Extension sourceSnippets category → catalog filename */
const CATEGORY_TO_MODULE = {
  typescript: "typescript-react.js",
  misc: "others.js",
};

const extensionRoot =
  process.env.ES7_EXTENSION_ROOT ??
  join(
    process.env.USERPROFILE ?? process.env.HOME ?? "",
    ".cursor/extensions/dsznajder.es7-react-js-snippets-4.4.3-universal",
  );

const generatedPath = join(extensionRoot, "lib/snippets/generated.json");
const sourceSnippetsDir = join(extensionRoot, "lib/sourceSnippets");

/** @param {string} value */
function quote(value) {
  return JSON.stringify(value);
}

/** @param {string[]} lines @param {number} indent */
function formatBody(lines, indent) {
  const pad = "  ".repeat(indent);

  if (lines.length === 1) {
    return quote(lines[0]);
  }

  return `[\n${lines.map((line) => `${pad}  ${quote(line)},`).join("\n")}\n${pad}]`;
}

/** @param {import('../validate.js').SnippetDefinition} snippet @param {number} indent */
function formatSnippet(snippet, indent = 1) {
  const pad = "  ".repeat(indent);
  const body =
    typeof snippet.body === "string"
      ? quote(snippet.body)
      : formatBody(snippet.body, indent + 1);

  return [
    `${pad}{`,
    `${pad}  key: ${quote(snippet.key)},`,
    `${pad}  prefix: ${quote(snippet.prefix)},`,
    `${pad}  description: ${quote(snippet.description)},`,
    `${pad}  languages: [${snippet.languages.map(quote).join(", ")}],`,
    `${pad}  body: ${body},`,
    `${pad}},`,
  ].join("\n");
}

/** @param {import('../validate.js').SnippetDefinition[]} snippets */
function formatModule(snippets) {
  const header = [
    "// Synced from ES7+ React/Redux/React-Native extension — npm run snippets:sync",
    "",
    `/** @type {import('../validate.js').SnippetDefinition[]} */`,
    "export default [",
  ].join("\n");

  return `${header}\n${snippets.map((snippet) => formatSnippet(snippet)).join("\n")}\n];\n`;
}

/** @param {string} category */
function moduleForCategory(category) {
  return CATEGORY_TO_MODULE[category] ?? `${category}.js`;
}

/** @param {string} id */
function toCatalogKey(id) {
  return id
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

/** @param {string} id */
function toLabel(id) {
  return id
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

/** @returns {Record<string, string>} */
function buildCategoryMap() {
  /** @type {Record<string, string>} */
  const map = {};

  if (!existsSync(sourceSnippetsDir)) {
    return map;
  }

  for (const file of readdirSync(sourceSnippetsDir)) {
    if (!file.endsWith(".js") || file === "sharedSnippets.js") {
      continue;
    }

    const category = file.replace(/\.js$/, "");
    const content = readFileSync(join(sourceSnippetsDir, file), "utf8");
    const keys = [...content.matchAll(/key:\s*['"]([^'"]+)['"]/g)].map(
      (match) => match[1],
    );

    for (const key of keys) {
      map[key] = category;
    }
  }

  return map;
}

/** @param {string} scope */
function parseLanguages(scope) {
  if (!scope?.trim()) {
    return [...JS_LANGUAGES];
  }

  return scope.split(",").map((language) => language.trim());
}

/**
 * @param {string} id
 * @param {{ key?: string; prefix: string; description?: string; body: string | string[]; scope?: string }} snippet
 * @param {Record<string, string>} categoryMap
 */
function toCatalogEntry(id, snippet, categoryMap) {
  const sourceKey = snippet.key ?? id;
  const category = categoryMap[sourceKey] ?? "misc";
  const label = toLabel(sourceKey);
  const base = snippet.description?.trim() || label;

  return {
    module: moduleForCategory(category),
    entry: {
      key: `${category}-${toCatalogKey(sourceKey)}`,
      prefix: snippet.prefix,
      description: `${base} · ${snippet.prefix}`,
      languages: parseLanguages(snippet.scope),
      body: snippet.body,
    },
  };
}

if (!existsSync(generatedPath)) {
  console.error(
    `ES7 generated.json not found:\n  ${generatedPath}\nSet ES7_EXTENSION_ROOT to the extension install folder.`,
  );
  process.exit(1);
}

const raw = JSON.parse(readFileSync(generatedPath, "utf8"));
const categoryMap = buildCategoryMap();
/** @type {Record<string, import('../validate.js').SnippetDefinition[]>} */
const byModule = {};

for (const [id, snippet] of Object.entries(raw)) {
  const { module, entry } = toCatalogEntry(id, snippet, categoryMap);
  (byModule[module] ??= []).push(entry);
}

const written = [];
for (const [moduleFile, snippets] of Object.entries(byModule).sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  if (!SYNCED_MODULES.has(moduleFile)) {
    throw new Error(
      `Sync produced unmanaged module "${moduleFile}" — add it to SYNCED_MODULES`,
    );
  }

  snippets.sort((left, right) => left.key.localeCompare(right.key));
  writeFileSync(join(catalogDir, moduleFile), formatModule(snippets), "utf8");
  written.push(moduleFile);
}

console.log(
  `Synced ${Object.keys(raw).length} extension snippets into ${written.length} catalog modules:`,
);
for (const file of written) {
  console.log(`  - ${file}`);
}
