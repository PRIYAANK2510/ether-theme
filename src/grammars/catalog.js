/** @typedef {{ scopeName: string, path: string, embeddedLanguages?: Record<string, string> }} GrammarDefinition */

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
        aliases: ["Kotlin"],
        extensions: [".kt", ".kts"],
        filenamePatterns: ["*.gradle.kts"],
        configuration: "./src/grammars/language-configs/kotlin-language-configuration.json",
        grammar: {
            scopeName: "source.kotlin",
            path: "./src/grammars/syntaxes/kotlin.tmLanguage.json",
        },
    },
    {
        id: "proguard",
        aliases: ["ProGuard", "R8"],
        extensions: [".pro", ".keep"],
        filenamePatterns: ["proguard-rules.pro", "**/proguard-rules.pro"],
        configuration: "./src/grammars/language-configs/proguard-language-configuration.json",
        grammar: {
            scopeName: "source.proguard",
            path: "./src/grammars/syntaxes/proguard.tmLanguage.json",
        },
    },
    {
        id: "dotenv",
        aliases: ["Dotenv", "Environment"],
        extensions: [".env"],
        filenamePatterns: [".env.*", "*.env.local", "*.env.development", "*.env.production", "*.env.test"],
        grammar: {
            scopeName: "source.dotenv",
            path: "./src/grammars/syntaxes/dotenv.tmLanguage.json",
        },
    },

    // Android / JVM — built-in grammars
    {
        id: "groovy",
        aliases: ["Groovy", "Gradle"],
        filenamePatterns: ["build.gradle", "settings.gradle"],
    },
    {
        id: "java",
        aliases: ["Java"],
        extensions: [".aidl"],
    },
    {
        id: "properties",
        aliases: ["Properties"],
        extensions: [".properties"],
        filenames: ["gradle.properties", "local.properties"],
    },

    // Config & markup — built-in grammars
    {
        id: "ini",
        aliases: ["Ini", "EditorConfig"],
        extensions: [".editorconfig", ".cfg", ".conf", ".ini"],
    },
    {
        id: "toml",
        aliases: ["TOML"],
        extensions: [".toml"],
        filenames: ["Cargo.toml", "pyproject.toml"],
    },
    {
        id: "yaml",
        aliases: ["YAML"],
        extensions: [".yaml", ".yml"],
        filenames: [".yarnrc.yml"],
    },
    {
        id: "xml",
        aliases: ["XML"],
        extensions: [".svg", ".plist", ".xaml", ".csproj", ".vbproj", ".proj", ".wxs", ".wxi"],
        filenames: ["AndroidManifest.xml"],
    },
    {
        id: "json",
        aliases: ["JSON"],
        extensions: [".jsonc", ".json5", ".webmanifest", ".code-workspace"],
        filenames: ["package-lock.json", "composer.lock"],
    },
    {
        id: "markdown",
        aliases: ["Markdown"],
        extensions: [".mdx", ".mdown", ".mkd", ".markdown"],
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
        extensions: [".gitignore", ".dockerignore", ".npmignore", ".prettierignore", ".eslintignore"],
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
        id: "typescript",
        aliases: ["TypeScript"],
        extensions: [".mts", ".cts"],
    },
    {
        id: "javascript",
        aliases: ["JavaScript"],
        extensions: [".mjs", ".cjs"],
    },
];

/** Number of language catalog entries. */
export const LANGUAGE_CATALOG_COUNT = LANGUAGE_CATALOG.length;

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
        const extensions = new Set([...existing.extensions, ...(entry.extensions ?? [])]);
        const filenames = new Set([...existing.filenames, ...(entry.filenames ?? [])]);
        const filenamePatterns = new Set([
            ...existing.filenamePatterns,
            ...(entry.filenamePatterns ?? []),
        ]);

        merged.set(entry.id, {
            id: entry.id,
            aliases: [...aliases].filter(Boolean),
            ...(extensions.size > 0 ? { extensions: [...extensions] } : {}),
            ...(filenames.size > 0 ? { filenames: [...filenames] } : {}),
            ...(filenamePatterns.size > 0 ? { filenamePatterns: [...filenamePatterns] } : {}),
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
    return catalog
        .filter((entry) => entry.grammar)
        .map((entry) => ({
            language: entry.id,
            scopeName: entry.grammar.scopeName,
            path: entry.grammar.path,
            ...(entry.grammar.embeddedLanguages
                ? { embeddedLanguages: entry.grammar.embeddedLanguages }
                : {}),
        }))
        .sort((a, b) => a.language.localeCompare(b.language));
}
