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

  it("bundles kotlin, aidl, proguard, dotenv, and css selector injection", () => {
    const grammars = buildGrammarContributions(LANGUAGE_CATALOG);
    const languages = new Set(
      grammars.map((entry) => entry.language).filter(Boolean),
    );

    expect(languages).toEqual(
      new Set(["aidl", "dotenv", "kotlin", "proguard"]),
    );
    expect(grammars).toHaveLength(7);
    expect(
      grammars.some(
        (entry) => entry.scopeName === "ether.nested-selector.injection",
      ),
    ).toBe(true);
    expect(
      grammars.find(
        (entry) => entry.scopeName === "ether.nested-selector.injection",
      )?.injectTo,
    ).toEqual(["source.css.scss", "source.css", "source.css.less"]);
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

  it("patches built-in CSS grammars for selectors, values, and functions", () => {
    const nested = JSON.parse(
      readFileSync(
        join(
          rootDir,
          "src/grammars/syntaxes/css-nested-selector.injection.tmLanguage.json",
        ),
        "utf8",
      ),
    );
    const values = JSON.parse(
      readFileSync(
        join(
          rootDir,
          "src/grammars/syntaxes/css-value-patches.injection.tmLanguage.json",
        ),
        "utf8",
      ),
    );
    const functions = JSON.parse(
      readFileSync(
        join(
          rootDir,
          "src/grammars/syntaxes/css-function-patches.injection.tmLanguage.json",
        ),
        "utf8",
      ),
    );

    expect(nested.repository["nested-type-selector"].beginCaptures["1"].name).toBe(
      "entity.name.tag.custom.css",
    );
    expect(values.repository["transition-sub-property"].beginCaptures["1"].name).toBe(
      "support.type.property-name.transition-sub.css",
    );
    expect(functions.repository["modern-css-functions"].beginCaptures["1"].name).toBe(
      "support.function.var.css",
    );
    expect(nested.injectionSelector).toContain("meta.property-list");
    expect(values.injectionSelector).toContain("meta.property-value");
    expect(functions.injectionSelector).toContain("meta.property-list");
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
    expect(
      grammars.filter((entry) => entry.injectTo).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("composes stable package.json contributions", () => {
    const first = composeGrammarContributions();
    const second = composeGrammarContributions();

    expect(first).toEqual(second);
    expect(first.languages.length).toBeGreaterThan(20);
    expect(first.grammars).toHaveLength(7);
  });

  it("keeps bundled grammars in the published VSIX", () => {
    const vscodeignore = readFileSync(join(rootDir, ".vscodeignore"), "utf8");

    expect(vscodeignore).toMatch(/!src\/grammars\/syntaxes\/\*\*/);
    expect(vscodeignore).toMatch(/!src\/grammars\/language-configs\/\*\*/);
  });
});
