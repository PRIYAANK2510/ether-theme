import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const catalogDir = dirname(fileURLToPath(import.meta.url));

/** @type {readonly { file: string, label: string, synced?: boolean }[]} */
const CATALOG = [
  { file: "css.js", label: "CSS" },
  { file: "html.js", label: "HTML" },
  { file: "javascript.js", label: "JavaScript" },
  { file: "typescript.js", label: "TypeScript" },
  { file: "react-components.js", label: "React Components" },
  { file: "react-hooks.js", label: "React Hooks" },
  { file: "react-patterns.js", label: "React Patterns" },
  { file: "react-server.js", label: "React Server & Next.js" },
  { file: "testing-modern.js", label: "Testing" },
  { file: "validation.js", label: "Validation" },
  { file: "data-fetching.js", label: "Data Fetching" },
  { file: "node.js", label: "Node.js" },
  { file: "components.js", label: "Components", synced: true },
  { file: "console.js", label: "Console", synced: true },
  { file: "hooks.js", label: "Hooks", synced: true },
  { file: "imports.js", label: "Imports", synced: true },
  { file: "others.js", label: "Utilities", synced: true },
  { file: "propTypes.js", label: "PropTypes", synced: true },
  { file: "reactNative.js", label: "React Native", synced: true },
  { file: "redux.js", label: "Redux", synced: true },
  { file: "tests.js", label: "Test Templates", synced: true },
  { file: "typescript-react.js", label: "TypeScript React", synced: true },
];

/** Modules regenerated from the ES7+ extension via `npm run snippets:sync`. */
export const SYNCED_MODULES = new Set(
  CATALOG.filter((entry) => entry.synced).map((entry) => entry.file),
);

/**
 * @returns {Promise<import('../validate.js').SnippetDefinition[]>}
 * @throws {Error} When a catalog module does not default-export an array
 */
export async function loadSnippetCatalog() {
  /** @type {import('../validate.js').SnippetDefinition[]} */
  const catalog = [];

  for (const { file } of CATALOG) {
    const loaded = await import(pathToFileURL(join(catalogDir, file)).href);
    const entries = loaded.default;

    if (!Array.isArray(entries)) {
      throw new Error(`Catalog module "${file}" must default-export an array`);
    }

    catalog.push(...entries);
  }

  return catalog;
}

/**
 * @typedef {import('../validate.js').SnippetDefinition & {
 *   category: string,
 *   synced: boolean,
 * }} SnippetCatalogEntry
 */

/**
 * @returns {Promise<SnippetCatalogEntry[]>}
 */
export async function loadSnippetCatalogWithMeta() {
  /** @type {SnippetCatalogEntry[]} */
  const catalog = [];

  for (const { file, label, synced } of CATALOG) {
    const loaded = await import(pathToFileURL(join(catalogDir, file)).href);
    const entries = loaded.default;

    if (!Array.isArray(entries)) {
      throw new Error(`Catalog module "${file}" must default-export an array`);
    }

    for (const entry of entries) {
      catalog.push({
        ...entry,
        category: label,
        synced: Boolean(synced),
      });
    }
  }

  return catalog;
}
