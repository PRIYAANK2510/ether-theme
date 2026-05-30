const REQUIRED_FIELDS = ["key", "prefix", "description", "body", "languages"];

function assertBody(body, key) {
  if (typeof body === "string") {
    return;
  }
  if (Array.isArray(body) && body.every((line) => typeof line === "string")) {
    return;
  }
  throw new Error(`Snippet "${key}" has invalid body — must be a string or string array`);
}

export function validateSnippetDefinition(snippet) {
  for (const field of REQUIRED_FIELDS) {
    if (snippet[field] === undefined || snippet[field] === null || snippet[field] === "") {
      throw new Error(`Snippet "${snippet.key ?? "unknown"}" is missing required field "${field}"`);
    }
  }

  if (!Array.isArray(snippet.languages) || snippet.languages.length === 0) {
    throw new Error(`Snippet "${snippet.key}" must declare at least one language`);
  }

  assertBody(snippet.body, snippet.key);

  if (snippet.variants) {
    for (const [language, variant] of Object.entries(snippet.variants)) {
      if (variant.body !== undefined) {
        assertBody(variant.body, `${snippet.key}:${language}`);
      }
    }
  }
}

export function validateSnippetCatalog(catalog) {
  const keys = new Set();

  for (const snippet of catalog) {
    validateSnippetDefinition(snippet);

    if (keys.has(snippet.key)) {
      throw new Error(`Duplicate snippet key in catalog: "${snippet.key}"`);
    }
    keys.add(snippet.key);
  }

  return catalog.length;
}

export function validateGeneratedSnippetFile(snippets, language) {
  const prefixes = new Set();
  const names = new Set();

  for (const [name, entry] of Object.entries(snippets)) {
    if (names.has(name)) {
      throw new Error(`Duplicate snippet name "${name}" in ${language}`);
    }
    names.add(name);

    if (!entry.prefix || !entry.description) {
      throw new Error(`Snippet "${name}" in ${language} is missing prefix or description`);
    }

    assertBody(entry.body, `${language}:${name}`);

    const prefixList = Array.isArray(entry.prefix) ? entry.prefix : [entry.prefix];
    for (const prefix of prefixList) {
      if (prefixes.has(prefix)) {
        throw new Error(`Duplicate prefix "${prefix}" in ${language}`);
      }
      prefixes.add(prefix);
    }
  }
}
