/**
 * @param {{ label: string, extensions: string, slug: string, language: string }} meta
 */
export function snippetSearchAliases(meta) {
  const aliases = [meta.slug, meta.language];
  const extTokens = meta.extensions
    .split(/[,\s]+/)
    .map((part) => part.trim().replace(/^\./, ""))
    .filter(Boolean);
  aliases.push(...extTokens);

  const bySlug = {
    javascript: ["js", "es6", "node", "npm", "vanilla"],
    typescript: ["ts", "types", "interface"],
    "react-jsx": ["jsx", "react", "component", "hook"],
    "react-tsx": ["tsx", "react", "component", "hook"],
    html: ["markup", "dom", "semantic", "form"],
    css: ["scss", "sass", "style", "stylesheet", "flex", "grid"],
  };
  aliases.push(...(bySlug[meta.slug] ?? []));

  return [...new Set(aliases.map((alias) => alias.toLowerCase()))];
}

/**
 * @param {{ prefix: string, description: string }} resolved
 * @param {{ category: string, key: string }} entry
 * @param {{ label: string, extensions: string, slug: string, language: string }} meta
 */
export function buildSnippetSearchHaystack(resolved, entry, meta) {
  return [
    resolved.prefix,
    resolved.description,
    entry.category,
    meta.label,
    entry.key,
    ...snippetSearchAliases(meta),
  ]
    .join(" ")
    .toLowerCase();
}

/** @param {string} query */
export function tokenizeSnippetQuery(query) {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * @param {string} query
 * @param {string} haystack
 * @param {string[]} [extraHaystacks]
 */
export function matchesSnippetSearch(query, haystack, extraHaystacks = []) {
  const tokens = tokenizeSnippetQuery(query);
  if (tokens.length === 0) return true;

  const corpus = [haystack, ...extraHaystacks]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return tokens.every((token) => corpus.includes(token));
}

/**
 * @param {string} query
 * @param {{ prefix?: string, description?: string, category?: string, haystack?: string }} fields
 */
export function scoreSnippetSearch(query, fields) {
  const tokens = tokenizeSnippetQuery(query);
  if (tokens.length === 0) return 0;

  const prefix = (fields.prefix ?? "").toLowerCase();
  const description = (fields.description ?? "").toLowerCase();
  const category = (fields.category ?? "").toLowerCase();
  const haystack = (fields.haystack ?? "").toLowerCase();
  const joined = tokens.join(" ");

  let score = 0;
  if (prefix === joined) score += 320;
  if (prefix.startsWith(tokens[0] ?? "")) score += 120;

  for (const token of tokens) {
    if (prefix === token) score += 220;
    else if (prefix.startsWith(token)) score += 110;
    else if (prefix.includes(token)) score += 75;

    if (description.includes(token)) score += 42;
    if (category.includes(token)) score += 28;
    if (haystack.includes(token)) score += 12;
  }

  return score;
}

/**
 * @template T
 * @param {readonly T[]} items
 * @param {string} query
 * @param {(item: T) => { prefix: string, description: string, category: string, haystack: string, extraHaystacks?: string[] }} getFields
 * @returns {T[]}
 */
export function filterAndRankSnippets(items, query, getFields) {
  const trimmed = query.trim();
  if (!trimmed) return items;

  return items
    .filter((item) => {
      const fields = getFields(item);
      return matchesSnippetSearch(
        trimmed,
        fields.haystack,
        fields.extraHaystacks ?? [],
      );
    })
    .sort((left, right) => {
      const leftScore = scoreSnippetSearch(trimmed, getFields(left));
      const rightScore = scoreSnippetSearch(trimmed, getFields(right));
      if (rightScore !== leftScore) return rightScore - leftScore;
      return getFields(left).prefix.localeCompare(getFields(right).prefix);
    });
}
