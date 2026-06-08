import {
  FRAMEWORK_UNBALANCED_BRACKET_SCOPES,
  MDX_EMBEDDED_LANGUAGES,
  SVELTE_EMBEDDED_LANGUAGES,
  SVELTE_TOKEN_TYPES,
  VUE_EMBEDDED_LANGUAGES,
} from "./web-framework-meta.js";

/** @typedef {{ scopeName: string, path: string, embeddedLanguages?: Record<string, string>, injectTo?: string[], unbalancedBracketScopes?: string[], tokenTypes?: Record<string, string> }} GrammarDefinition */

/** @typedef {{ id: string, aliases: string[], extensions?: string[], filenames?: string[], filenamePatterns?: string[], configuration?: string, grammar?: GrammarDefinition }} LanguageDefinition */

/**
 * Languages with bundled TextMate grammars plus file associations for common formats.
 * Associations for built-in VS Code languages enrich extension/filename mapping only.
 *
 * @type {LanguageDefinition[]}
 */
export const LANGUAGE_CATALOG = [
  {
    id: "kotlin",
    aliases: ["Kotlin", "Kotlin DSL", "Gradle Kotlin DSL"],
    extensions: [".kt", ".kts"],
    filenamePatterns: [
      "*.gradle.kts",
      "build.gradle.kts",
      "settings.gradle.kts",
      "init.gradle.kts",
    ],
    configuration:
      "./src/grammars/language-configs/kotlin-language-configuration.json",
    grammar: {
      scopeName: "source.kotlin",
      path: "./src/grammars/syntaxes/kotlin.tmLanguage.json",
    },
  },
  {
    id: "aidl",
    aliases: ["AIDL", "Android Interface Definition Language"],
    extensions: [".aidl"],
    configuration:
      "./src/grammars/language-configs/aidl-language-configuration.json",
    grammar: {
      scopeName: "source.aidl",
      path: "./src/grammars/syntaxes/aidl.tmLanguage.json",
    },
  },
  {
    id: "proguard",
    aliases: ["ProGuard", "R8", "Shrinker Rules"],
    extensions: [".pro", ".keep"],
    filenamePatterns: [
      "proguard-rules.pro",
      "**/proguard-rules.pro",
      "consumer-rules.pro",
      "**/consumer-rules.pro",
      "proguard-android-optimize.pro",
      "**/proguard-android-optimize.pro",
    ],
    configuration:
      "./src/grammars/language-configs/proguard-language-configuration.json",
    grammar: {
      scopeName: "source.proguard",
      path: "./src/grammars/syntaxes/proguard.tmLanguage.json",
    },
  },
  {
    id: "dotenv",
    aliases: ["Dotenv", "Environment"],
    extensions: [".env"],
    filenamePatterns: [
      ".env.*",
      "*.env.local",
      "*.env.development",
      "*.env.production",
      "*.env.test",
    ],
    grammar: {
      scopeName: "source.dotenv",
      path: "./src/grammars/syntaxes/dotenv.tmLanguage.json",
    },
  },
  {
    id: "astro",
    aliases: ["Astro"],
    extensions: [".astro"],
    configuration:
      "./src/grammars/language-configs/astro-language-configuration.json",
    grammar: {
      scopeName: "source.astro",
      path: "./src/grammars/syntaxes/astro.tmLanguage.json",
      embeddedLanguages: {
        "text.html": "html",
        "text.html.markdown": "markdown",
        "source.css": "css",
        "source.css.less": "less",
        "source.css.scss": "scss",
        "source.sass": "sass",
        "source.stylus": "stylus",
        "source.js": "javascript",
        "source.ts": "typescript",
        "source.json": "json",
        "source.tsx": "typescriptreact",
        "meta.tag.tsx": "jsx-tags",
        "meta.tag.without-attributes.tsx": "jsx-tags",
        "meta.tag.attributes.tsx": "typescriptreact",
        "meta.embedded.expression.tsx": "typescriptreact",
      },
      unbalancedBracketScopes: FRAMEWORK_UNBALANCED_BRACKET_SCOPES,
    },
  },
  {
    id: "vue",
    aliases: ["Vue"],
    extensions: [".vue"],
    configuration:
      "./src/grammars/language-configs/vue-language-configuration.json",
    grammar: {
      scopeName: "text.html.vue",
      path: "./src/grammars/syntaxes/vue.tmLanguage.json",
      embeddedLanguages: VUE_EMBEDDED_LANGUAGES,
      unbalancedBracketScopes: FRAMEWORK_UNBALANCED_BRACKET_SCOPES,
    },
  },
  {
    id: "svelte",
    aliases: ["Svelte"],
    extensions: [".svelte"],
    configuration:
      "./src/grammars/language-configs/svelte-language-configuration.json",
    grammar: {
      scopeName: "source.svelte",
      path: "./src/grammars/syntaxes/svelte.tmLanguage.json",
      embeddedLanguages: SVELTE_EMBEDDED_LANGUAGES,
      unbalancedBracketScopes: FRAMEWORK_UNBALANCED_BRACKET_SCOPES,
      tokenTypes: SVELTE_TOKEN_TYPES,
    },
  },
  {
    id: "mdx",
    aliases: ["MDX"],
    extensions: [".mdx"],
    configuration:
      "./src/grammars/language-configs/mdx-language-configuration.json",
    grammar: {
      scopeName: "source.mdx",
      path: "./src/grammars/syntaxes/source.mdx.tmLanguage",
      embeddedLanguages: MDX_EMBEDDED_LANGUAGES,
    },
  },

  // Android / JVM — built-in grammars + file associations
  {
    id: "groovy",
    aliases: ["Groovy", "Gradle"],
    filenamePatterns: [
      "build.gradle",
      "settings.gradle",
      "gradle.gradle",
      "*.gradle",
    ],
  },
  {
    id: "java",
    aliases: ["Java"],
    extensions: [".java"],
  },
  {
    id: "properties",
    aliases: ["Properties", "Gradle Properties"],
    extensions: [".properties"],
    filenames: [
      "gradle.properties",
      "local.properties",
      "gradle-wrapper.properties",
    ],
    filenamePatterns: ["**/gradle/wrapper/gradle-wrapper.properties"],
  },

  // Config & markup — built-in grammars
  {
    id: "ini",
    aliases: ["Ini", "EditorConfig"],
    extensions: [".editorconfig", ".cfg", ".conf", ".ini"],
  },
  {
    id: "toml",
    aliases: ["TOML", "Version Catalog"],
    extensions: [".toml"],
    filenames: ["Cargo.toml", "pyproject.toml", "libs.versions.toml"],
    filenamePatterns: ["**/gradle/libs.versions.toml"],
  },
  {
    id: "yaml",
    aliases: ["YAML"],
    extensions: [".yaml", ".yml"],
    filenames: [".yarnrc.yml"],
  },
  {
    id: "xml",
    aliases: ["XML", "Android Resources"],
    extensions: [
      ".svg",
      ".plist",
      ".xaml",
      ".csproj",
      ".vbproj",
      ".proj",
      ".wxs",
      ".wxi",
    ],
    filenames: [
      "AndroidManifest.xml",
      "lint.xml",
      "network_security_config.xml",
      "backup_rules.xml",
      "data_extraction_rules.xml",
      "file_paths.xml",
      "shortcuts.xml",
    ],
    filenamePatterns: [
      "**/AndroidManifest.xml",
      "**/res/layout/**/*.xml",
      "**/res/layout-*/**/*.xml",
      "**/res/values/**/*.xml",
      "**/res/values-*/**/*.xml",
      "**/res/drawable/**/*.xml",
      "**/res/drawable-*/**/*.xml",
      "**/res/navigation/**/*.xml",
      "**/res/xml/**/*.xml",
      "**/res/menu/**/*.xml",
      "**/res/color/**/*.xml",
      "**/res/anim/**/*.xml",
      "**/res/raw/**/*.xml",
      "**/res/mipmap/**/*.xml",
    ],
  },
  {
    id: "json",
    aliases: ["JSON"],
    extensions: [".jsonc", ".json5", ".webmanifest", ".code-workspace"],
    filenames: [
      "package-lock.json",
      "composer.lock",
      "google-services.json",
      "google-services-plugin.json",
    ],
  },
  {
    id: "markdown",
    aliases: ["Markdown"],
    extensions: [".mdown", ".mkd", ".markdown"],
  },

  // React / Preact — built-in JSX grammars + file associations
  {
    id: "javascriptreact",
    aliases: ["JavaScript React", "JSX", "Preact"],
    extensions: [".jsx"],
  },
  {
    id: "typescriptreact",
    aliases: ["TypeScript React", "TSX"],
    extensions: [".tsx"],
  },

  // Systems & build — built-in grammars
  {
    id: "dockerfile",
    aliases: ["Dockerfile"],
    filenames: ["Dockerfile", "Containerfile"],
    filenamePatterns: ["Dockerfile.*", "Containerfile.*"],
  },
  {
    id: "makefile",
    aliases: ["Makefile"],
    filenames: ["Makefile", "GNUmakefile", "makefile", "GNUMakefile"],
  },
  {
    id: "cmake",
    aliases: ["CMake"],
    extensions: [".cmake"],
    filenames: ["CMakeLists.txt"],
  },
  {
    id: "shellscript",
    aliases: ["Shell Script"],
    extensions: [".sh", ".bash", ".zsh"],
    filenames: ["gradlew"],
  },
  {
    id: "bat",
    aliases: ["Batch"],
    extensions: [".bat", ".cmd"],
    filenames: ["gradlew.bat"],
  },
  {
    id: "ignore",
    aliases: ["Ignore"],
    extensions: [
      ".gitignore",
      ".dockerignore",
      ".npmignore",
      ".prettierignore",
      ".eslintignore",
    ],
    filenames: [".gitignore", ".dockerignore", ".npmignore"],
  },

  // Languages with built-in grammars — common extra extensions
  {
    id: "cpp",
    aliases: ["C++"],
    extensions: [".hpp", ".hxx", ".cc", ".cxx", ".hh", ".ino"],
  },
  {
    id: "c",
    aliases: ["C"],
    extensions: [".h"],
  },
  {
    id: "csharp",
    aliases: ["C#"],
    extensions: [".csx"],
  },
  {
    id: "ruby",
    aliases: ["Ruby"],
    filenames: ["Gemfile", "Rakefile", "Vagrantfile", "Podfile", "Brewfile"],
    extensions: [".gemspec", ".rake"],
  },
  {
    id: "python",
    aliases: ["Python"],
    extensions: [".pyi", ".pyw"],
    filenames: ["Pipfile", "Snakefile"],
  },
  {
    id: "sql",
    aliases: ["SQL"],
    extensions: [".ddl", ".dml", ".mysql", ".pgsql"],
  },
  {
    id: "log",
    aliases: ["Log"],
    extensions: [".log"],
  },
  {
    id: "swift",
    aliases: ["Swift"],
    extensions: [".swift"],
  },
  {
    id: "go",
    aliases: ["Go"],
    filenames: ["go.mod", "go.sum"],
  },
  {
    id: "rust",
    aliases: ["Rust"],
    extensions: [".rs"],
  },
  {
    id: "lua",
    aliases: ["Lua"],
    extensions: [".lua"],
  },
  {
    id: "perl",
    aliases: ["Perl"],
    extensions: [".pl", ".pm"],
  },
  {
    id: "php",
    aliases: ["PHP"],
    extensions: [".phtml", ".php3", ".php4", ".php5"],
  },
  {
    id: "scss",
    aliases: ["SCSS"],
    extensions: [".scss", ".sass"],
  },
  {
    id: "less",
    aliases: ["Less"],
    extensions: [".less"],
  },
  {
    id: "css",
    aliases: ["CSS"],
    extensions: [".pcss", ".postcss"],
  },
  {
    id: "html",
    aliases: ["HTML"],
    extensions: [".htm", ".xhtml", ".ejs", ".erb"],
  },
  {
    id: "javascript",
    aliases: ["JavaScript"],
    extensions: [".mjs", ".cjs", ".js"],
  },
  {
    id: "typescript",
    aliases: ["TypeScript"],
    extensions: [".mts", ".cts", ".ts"],
  },
];

/**
 * TextMate injections that patch built-in VS Code grammars (no standalone language).
 *
 * @type {GrammarDefinition[]}
 */
export const GRAMMAR_INJECTIONS = [
  // Astro
  {
    scopeName: "text.html.markdown.astro",
    path: "./src/grammars/syntaxes/markdown.astro.tmLanguage.json",
    injectTo: ["text.html.markdown", "source.astro"],
  },
  {
    scopeName: "source.mdx.astro",
    path: "./src/grammars/syntaxes/mdx.astro.tmLanguage.json",
    injectTo: ["source.mdx"],
  },

  // Vue (Official)
  {
    scopeName: "markdown.vue.codeblock",
    path: "./src/grammars/syntaxes/markdown-vue.json",
    injectTo: ["text.html.markdown"],
    embeddedLanguages: {
      "meta.embedded.block.vue": "vue",
      ...VUE_EMBEDDED_LANGUAGES,
    },
  },
  {
    scopeName: "mdx.vue.codeblock",
    path: "./src/grammars/syntaxes/mdx-vue.json",
    injectTo: ["source.mdx"],
    embeddedLanguages: {
      "mdx.embedded.vue": "vue",
      ...VUE_EMBEDDED_LANGUAGES,
    },
  },
  {
    scopeName: "vue.directives",
    path: "./src/grammars/syntaxes/vue-directives.json",
    injectTo: [
      "text.html.vue",
      "text.html.markdown",
      "text.html.derivative",
      "text.pug",
    ],
  },
  {
    scopeName: "vue.interpolations",
    path: "./src/grammars/syntaxes/vue-interpolations.json",
    injectTo: [
      "text.html.vue",
      "text.html.markdown",
      "text.html.derivative",
      "text.pug",
    ],
  },
  {
    scopeName: "vue.sfc.script.leading-operator-fix",
    path: "./src/grammars/syntaxes/vue-sfc-script-leading-operator-fix.json",
    injectTo: ["text.html.vue"],
  },
  {
    scopeName: "vue.sfc.style.variable.injection",
    path: "./src/grammars/syntaxes/vue-sfc-style-variable-injection.json",
    injectTo: ["text.html.vue"],
  },

  // Svelte
  {
    scopeName: "svelte.pug",
    path: "./src/grammars/syntaxes/pug-svelte.json",
    injectTo: ["source.svelte"],
    embeddedLanguages: {
      "source.ts": "typescript",
      "text.pug": "jade",
    },
  },
  {
    scopeName: "svelte.pug.tags",
    path: "./src/grammars/syntaxes/pug-svelte-tags.json",
    injectTo: ["source.svelte"],
    embeddedLanguages: {
      "source.ts": "typescript",
      "text.pug": "jade",
    },
  },
  {
    scopeName: "svelte.pug.dotblock",
    path: "./src/grammars/syntaxes/pug-svelte-dotblock.json",
    injectTo: ["source.svelte"],
    embeddedLanguages: { "source.ts": "typescript" },
  },
  {
    scopeName: "markdown.svelte.codeblock",
    path: "./src/grammars/syntaxes/markdown-svelte.json",
    injectTo: ["text.html.markdown", "source.mdx"],
    embeddedLanguages: { "meta.embedded.block.svelte": "svelte" },
  },
  {
    scopeName: "markdown.svelte.codeblock.script",
    path: "./src/grammars/syntaxes/markdown-svelte-js.json",
    injectTo: ["text.html.markdown", "source.mdx"],
  },
  {
    scopeName: "markdown.svelte.codeblock.style",
    path: "./src/grammars/syntaxes/markdown-svelte-css.json",
    injectTo: ["text.html.markdown", "source.mdx"],
  },
  {
    scopeName: "source.css.postcss",
    path: "./src/grammars/syntaxes/svelte-postcss.json",
    injectTo: ["source.svelte"],
  },

  // MDX
  {
    scopeName: "source.markdown.mdx.codeblock",
    path: "./src/grammars/syntaxes/mdx.markdown.tmLanguage.json",
    injectTo: ["text.html.markdown"],
    embeddedLanguages: { "meta.embedded.block.mdx": "mdx" },
  },

  // Angular templates (inject into HTML + TypeScript)
  {
    scopeName: "inline-template.ng",
    path: "./src/grammars/syntaxes/angular-inline-template.json",
    injectTo: ["source.ts"],
    embeddedLanguages: {
      "text.html.derivative": "html",
      "source.css": "css",
      "source.js": "javascript",
    },
  },
  {
    scopeName: "inline-styles.ng",
    path: "./src/grammars/syntaxes/angular-inline-styles.json",
    injectTo: ["source.ts"],
    embeddedLanguages: { "source.css.scss": "scss" },
  },
  {
    scopeName: "template.ng",
    path: "./src/grammars/syntaxes/angular-template.json",
    injectTo: ["text.html.derivative", "source.ts"],
    embeddedLanguages: {
      "text.html": "html",
      "source.css": "css",
      "expression.ng": "javascript",
    },
  },
  {
    scopeName: "template.blocks.ng",
    path: "./src/grammars/syntaxes/angular-template-blocks.json",
    injectTo: ["text.html.derivative", "source.ts"],
    embeddedLanguages: {
      "text.html": "html",
      "control.block.expression.ng": "javascript",
      "control.block.body.ng": "html",
    },
  },
  {
    scopeName: "template.let.ng",
    path: "./src/grammars/syntaxes/angular-let-declaration.json",
    injectTo: ["text.html.derivative", "source.ts"],
  },
  {
    scopeName: "host-object-literal.ng",
    path: "./src/grammars/syntaxes/angular-host-object-literal.json",
    injectTo: ["source.ts"],
    embeddedLanguages: {
      "text.html.derivative": "html",
      "expression.ng": "javascript",
      "source.ts": "typescript",
    },
  },
  {
    scopeName: "template.tag.ng",
    path: "./src/grammars/syntaxes/angular-template-tag.json",
    injectTo: ["text.html.derivative", "source.ts"],
  },
  {
    scopeName: "expression.ng",
    path: "./src/grammars/syntaxes/angular-expression.json",
  },

  // CSS patches (built-in grammars)
  {
    scopeName: "ether.nested-selector.injection",
    path: "./src/grammars/syntaxes/css-nested-selector.injection.tmLanguage.json",
    injectTo: ["source.css.scss", "source.css", "source.css.less"],
  },
  {
    scopeName: "ether.css-value.injection",
    path: "./src/grammars/syntaxes/css-value-patches.injection.tmLanguage.json",
    injectTo: ["source.css.scss", "source.css", "source.css.less"],
  },
  {
    scopeName: "ether.css-function.injection",
    path: "./src/grammars/syntaxes/css-function-patches.injection.tmLanguage.json",
    injectTo: ["source.css.scss", "source.css", "source.css.less"],
  },
];

/** Number of language catalog entries (must match {@link LANGUAGE_CATALOG}.length). */
export const LANGUAGE_CATALOG_COUNT = 44;

/** Bundled language grammars (must match catalog entries with `grammar`). */
export const BUNDLED_GRAMMAR_LANGUAGE_COUNT = 8;

/** Total grammar contributions (bundled languages + injections). */
export const GRAMMAR_CONTRIBUTION_COUNT = 35;

/**
 * @param {LanguageDefinition[]} catalog
 * @returns {Array<{ id: string, aliases: string[], extensions?: string[], filenames?: string[], filenamePatterns?: string[], configuration?: string }>}
 */
export function buildLanguageContributions(catalog) {
  const merged = new Map();

  for (const entry of catalog) {
    const existing = merged.get(entry.id) ?? {
      id: entry.id,
      aliases: [],
      extensions: [],
      filenames: [],
      filenamePatterns: [],
    };

    const aliases = new Set([...existing.aliases, ...entry.aliases]);
    const extensions = new Set([
      ...existing.extensions,
      ...(entry.extensions ?? []),
    ]);
    const filenames = new Set([
      ...existing.filenames,
      ...(entry.filenames ?? []),
    ]);
    const filenamePatterns = new Set([
      ...existing.filenamePatterns,
      ...(entry.filenamePatterns ?? []),
    ]);

    merged.set(entry.id, {
      id: entry.id,
      aliases: [...aliases].filter(Boolean),
      ...(extensions.size > 0 ? { extensions: [...extensions] } : {}),
      ...(filenames.size > 0 ? { filenames: [...filenames] } : {}),
      ...(filenamePatterns.size > 0
        ? { filenamePatterns: [...filenamePatterns] }
        : {}),
      ...(entry.configuration ? { configuration: entry.configuration } : {}),
      ...(existing.configuration && !entry.configuration
        ? { configuration: existing.configuration }
        : {}),
    });
  }

  return [...merged.values()].sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * @param {LanguageDefinition[]} catalog
 * @returns {Array<{ language: string, scopeName: string, path: string, embeddedLanguages?: Record<string, string> }>}
 */
export function buildGrammarContributions(catalog) {
  const bundled = catalog
    .filter((entry) => entry.grammar)
    .map((entry) => ({
      language: entry.id,
      scopeName: entry.grammar.scopeName,
      path: entry.grammar.path,
      ...(entry.grammar.embeddedLanguages
        ? { embeddedLanguages: entry.grammar.embeddedLanguages }
        : {}),
      ...(entry.grammar.unbalancedBracketScopes
        ? { unbalancedBracketScopes: entry.grammar.unbalancedBracketScopes }
        : {}),
      ...(entry.grammar.tokenTypes
        ? { tokenTypes: entry.grammar.tokenTypes }
        : {}),
    }));

  const injections = GRAMMAR_INJECTIONS.map((grammar) => ({
    scopeName: grammar.scopeName,
    path: grammar.path,
    ...(grammar.injectTo ? { injectTo: grammar.injectTo } : {}),
    ...(grammar.embeddedLanguages
      ? { embeddedLanguages: grammar.embeddedLanguages }
      : {}),
    ...(grammar.unbalancedBracketScopes
      ? { unbalancedBracketScopes: grammar.unbalancedBracketScopes }
      : {}),
  }));

  return [...bundled, ...injections].sort((a, b) => {
    const aKey = a.language ?? a.scopeName;
    const bKey = b.language ?? b.scopeName;
    return aKey.localeCompare(bKey);
  });
}
