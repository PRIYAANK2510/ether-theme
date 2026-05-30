import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const PKG_PATH = "package.json";
const VSCE_PUBLISHER = "Priyaank";

function run(command) {
  execSync(command, { stdio: "inherit", env: process.env, shell: true });
}

function readPackage() {
  return JSON.parse(readFileSync(PKG_PATH, "utf8"));
}

function writePackage(pkg) {
  writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`);
}

function latestVsix() {
  const packageJson = readPackage();
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

const pkg = readPackage();
const openVsxPublisher = pkg.publisher;
if (openVsxPublisher !== VSCE_PUBLISHER) {
  writePackage({ ...pkg, publisher: VSCE_PUBLISHER });
  try {
    run("npx vsce publish");
  } finally {
    writePackage(pkg);
  }
} else {
  run("npx vsce publish");
}
