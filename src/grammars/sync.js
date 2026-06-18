import { mergePackageContributes } from "../utils/package-json.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildGrammarContributions,
  buildLanguageContributions,
  LANGUAGE_CATALOG,
} from "./catalog.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "../..");
const packageJsonPath = join(rootDir, "package.json");

/**
 * @returns {{ languages: ReturnType<typeof buildLanguageContributions>, grammars: ReturnType<typeof buildGrammarContributions> }}
 */
export function composeGrammarContributions() {
  return {
    languages: buildLanguageContributions(LANGUAGE_CATALOG),
    grammars: buildGrammarContributions(LANGUAGE_CATALOG),
  };
}

/**
 * @param {{ languages: ReturnType<typeof buildLanguageContributions>, grammars: ReturnType<typeof buildGrammarContributions> }} contributions
 */
export function syncGrammarContributions(contributions) {
  mergePackageContributes(packageJsonPath, {
    languages: contributions.languages,
    grammars: contributions.grammars,
  });
}

/**
 * @returns {{ languages: ReturnType<typeof buildLanguageContributions>, grammars: ReturnType<typeof buildGrammarContributions> }}
 */
export function generateAllGrammars() {
  const contributions = composeGrammarContributions();
  syncGrammarContributions(contributions);
  return contributions;
}
