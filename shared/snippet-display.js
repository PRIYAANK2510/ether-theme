/**
 * @param {string} body
 */
export function formatSnippetBodyForDocs(body) {
  let result = body;

  result = result.replace(/\$\{TM_FILENAME_BASE\}/g, "ComponentName");
  result = result.replace(/\$\{TM_FILENAME\}/g, "file.ts");
  result = result.replace(/\$\{TM_SELECTED_TEXT\}/g, "");
  result = result.replace(/\$\{TM_([A-Z_]+)\}/g, (_, name) =>
    name.toLowerCase().replace(/^tm_/, "").replace(/_/g, ""),
  );

  result = result.replace(/\$\{(\d+)\|([^}]+)\|\}/g, (_, _index, choices) => {
    return choices.split(",")[0].trim();
  });

  result = result.replace(/\$\{(\d+):([^}]*)\}/g, (_, index, placeholder) => {
    if (index === "0" && !placeholder) return "";
    return placeholder;
  });

  result = result.replace(/\$\{(\d+)\}/g, () => "");

  // Final tab stop ($0) — omit on the site; a fake caret cannot match the editor.
  result = result.replace(/^[ \t]*\$(?:\{0\}|0)(?!\d)[ \t]*$/gm, "");
  result = result.replace(/\$\{0\}/g, "");
  result = result.replace(/\$0(?!\d)/g, "");

  // Legacy display glyphs from older builds.
  result = result.replace(/█|\uE000/g, "");

  // Drop indent-only lines left behind after removing $0.
  result = result.replace(/^[ \t]+$/gm, "");

  return result;
}

/**
 * @param {string} code
 */
export function splitSnippetForHighlight(code) {
  const normalized = code.replace(/█|\uE000/g, "");
  return normalized.split(/(\$\{[^}]+\})/g);
}
