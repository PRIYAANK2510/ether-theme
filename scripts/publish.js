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

run(`npx ovsx publish ${vsixPath}`);
