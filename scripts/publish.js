import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PKG_PATH = "package.json";
const VSCE_PUBLISHER = "Priyaank";
const RELEASES_DIR = "releases";

for (const key of ["OVSX_PAT", "VSCE_PAT"]) {
  if (typeof process.env[key] === "string") {
    process.env[key] = process.env[key].trim();
  }
}

function run(command) {
  execSync(command, { stdio: "inherit", env: process.env, shell: true });
}

/** @param {string} command */
function tryRun(command) {
  try {
    run(command);
    return true;
  } catch {
    return false;
  }
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
  const files = readdirSync(RELEASES_DIR).filter((file) => file.endsWith(".vsix"));

  if (files.includes(expected)) {
    return expected;
  }

  return files.sort(
    (a, b) => statSync(join(RELEASES_DIR, b)).mtimeMs - statSync(join(RELEASES_DIR, a)).mtimeMs,
  )[0];
}

mkdirSync(RELEASES_DIR, { recursive: true });
run("npm run package");

const vsix = latestVsix();
if (!vsix) {
  throw new Error(`No VSIX found in ${RELEASES_DIR}/.`);
}

const vsixPath = join(RELEASES_DIR, vsix);
const pkg = readPackage();
const openVsxPublisher = pkg.publisher;

let vsceOk = false;
if (openVsxPublisher !== VSCE_PUBLISHER) {
  writePackage({ ...pkg, publisher: VSCE_PUBLISHER });
  vsceOk = tryRun("npx vsce publish");
  writePackage(pkg);
} else {
  vsceOk = tryRun("npx vsce publish");
}

const ovsxOk = tryRun(`npx ovsx publish ${vsixPath}`);

if (!vsceOk && !ovsxOk) {
  console.error("Publish failed on both VS Code Marketplace and Open VSX.");
  process.exit(1);
}

if (!vsceOk) {
  console.error("VS Code Marketplace publish failed. Check VSCE_PAT.");
  process.exit(1);
}

if (!ovsxOk) {
  console.warn(
    "Open VSX publish failed (VS Code Marketplace succeeded). Update OVSX_PAT in GitHub Secrets.",
  );
}
