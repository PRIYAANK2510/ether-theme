import { readFileSync } from "node:fs";
import { writeFileIfChanged } from "./fs.js";

/**
 * Patch `package.json` contributes without clobbering unrelated contribute keys.
 *
 * @param {string} packageJsonPath
 * @param {Record<string, unknown>} contributesPatch
 */
export function mergePackageContributes(packageJsonPath, contributesPatch) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  packageJson.contributes = {
    ...packageJson.contributes,
    ...contributesPatch,
  };
  writeFileIfChanged(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
}
