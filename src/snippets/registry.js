/** @type {readonly { language: string, file: string }[]} */
export const SNIPPET_LANGUAGES = [
  { language: "javascript", file: "javascript.code-snippets" },
  { language: "typescript", file: "typescript.code-snippets" },
  { language: "javascriptreact", file: "javascriptreact.code-snippets" },
  { language: "typescriptreact", file: "typescriptreact.code-snippets" },
  { language: "html", file: "html.code-snippets" },
  { language: "css", file: "css.code-snippets" },
];

/** Minimum catalog size enforced at build time. */
export const MIN_SNIPPET_COUNT = 100;

/** @returns {Array<{ language: string, path: string }>} */
export function buildSnippetContributions() {
  return SNIPPET_LANGUAGES.map(({ language, file }) => ({
    language,
    path: `./snippets/${file}`,
  }));
}
