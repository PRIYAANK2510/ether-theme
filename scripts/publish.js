import { readFileSync, readdirSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

function run(command) {
  execSync(command, { stdio: "inherit", env: process.env, shell: true });
}

function latestVsix() {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const expected = `ether-theme-${packageJson.version}.vsix`;
  const files = readdirSync("releases").filter((file) => file.endsWith(".vsix"));

  if (files.includes(expected)) {
    return expected;
  }

  return files.sort(
    (a, b) => statSync(join("releases", b)).mtimeMs - statSync(join("releases", a)).mtimeMs,
  )[0];
}

run("npm run package");

const vsix = latestVsix();
if (!vsix) {
  throw new Error("No VSIX found in releases/.");
}

run(`npx ovsx publish ${join("releases", vsix)}`);
run("npx vsce publish");
