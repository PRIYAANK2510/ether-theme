import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const catalogDir = dirname(fileURLToPath(import.meta.url));

/** @type {readonly { file: string, synced?: boolean }[]} */
const CATALOG = [
  { file: "css.js" },
  { file: "html.js" },
  { file: "javascript.js" },
  { file: "typescript.js" },
  { file: "react-components.js" },
  { file: "react-hooks.js" },
  { file: "react-patterns.js" },
  { file: "react-server.js" },
  { file: "testing-modern.js" },
  { file: "validation.js" },
  { file: "data-fetching.js" },
  { file: "node.js" },
  { file: "components.js", synced: true },
  { file: "console.js", synced: true },
  { file: "hooks.js", synced: true },
  { file: "imports.js", synced: true },
  { file: "others.js", synced: true },
  { file: "propTypes.js", synced: true },
  { file: "reactNative.js", synced: true },
  { file: "redux.js", synced: true },
  { file: "tests.js", synced: true },
  { file: "typescript-react.js", synced: true },
];

/** Catalog module filenames loaded by {@link loadSnippetCatalog}. */
export const CATALOG_MODULES = CATALOG.map((entry) => entry.file);

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
