import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildGrammarContributions,
  buildLanguageContributions,
  LANGUAGE_CATALOG,
  LANGUAGE_CATALOG_COUNT,
} from "../src/grammars/catalog.js";
import { composeGrammarContributions } from "../src/grammars/sync.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("grammar catalog", () => {
  it("tracks the language catalog size", () => {
    expect(LANGUAGE_CATALOG).toHaveLength(LANGUAGE_CATALOG_COUNT);
  });

  it("bundles kotlin, aidl, proguard, and dotenv grammars", () => {
    const grammars = buildGrammarContributions(LANGUAGE_CATALOG);
    const languages = new Set(grammars.map((entry) => entry.language));

    expect(languages).toEqual(
      new Set(["aidl", "dotenv", "kotlin", "proguard"]),
    );
  });

  it("maps android project file patterns to the right languages", () => {
    const languages = buildLanguageContributions(LANGUAGE_CATALOG);
    const byId = Object.fromEntries(
      languages.map((entry) => [entry.id, entry]),
    );

    expect(byId.kotlin.extensions).toContain(".kts");
    expect(byId.kotlin.filenamePatterns).toContain("build.gradle.kts");
    expect(byId.aidl.extensions).toContain(".aidl");
    expect(byId.proguard.extensions).toContain(".keep");
    expect(byId.proguard.filenamePatterns).toContain("consumer-rules.pro");
    expect(byId.groovy.filenamePatterns).toContain("build.gradle");
    expect(byId.java.extensions).toContain(".java");
    expect(byId.properties.filenames).toContain("gradle.properties");
    expect(byId.properties.filenamePatterns).toContain(
      "**/gradle/wrapper/gradle-wrapper.properties",
    );
    expect(byId.toml.filenamePatterns).toContain(
      "**/gradle/libs.versions.toml",
    );
    expect(byId.xml.filenamePatterns).toContain("**/res/layout/**/*.xml");
    expect(byId.xml.filenames).toContain("network_security_config.xml");
    expect(byId.json.filenames).toContain("google-services.json");
  });

  it("references grammar files that exist on disk", () => {
    const grammars = buildGrammarContributions(LANGUAGE_CATALOG);

    for (const grammar of grammars) {
      expect(existsSync(join(rootDir, grammar.path.replace(/^\.\//, "")))).toBe(
        true,
      );
    }
  });

  it("uses unique language ids and grammar scope names", () => {
    const languages = buildLanguageContributions(LANGUAGE_CATALOG);
    const grammars = buildGrammarContributions(LANGUAGE_CATALOG);

    expect(new Set(languages.map((entry) => entry.id)).size).toBe(
      languages.length,
    );
    expect(new Set(grammars.map((entry) => entry.scopeName)).size).toBe(
      grammars.length,
    );
  });

  it("composes stable package.json contributions", () => {
    const first = composeGrammarContributions();
    const second = composeGrammarContributions();

    expect(first).toEqual(second);
    expect(first.languages.length).toBeGreaterThan(20);
    expect(first.grammars).toHaveLength(4);
  });

  it("keeps bundled grammars in the published VSIX", () => {
    const vscodeignore = readFileSync(join(rootDir, ".vscodeignore"), "utf8");

    expect(vscodeignore).toMatch(/!src\/grammars\/syntaxes\/\*\*/);
    expect(vscodeignore).toMatch(/!src\/grammars\/language-configs\/\*\*/);
  });
});
