import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const PKG_PATH = "package.json";
const RELEASES_DIR = "releases";
const vsceBin = join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "vsce.cmd" : "vsce",
);
const ovsxBin = join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "ovsx.cmd" : "ovsx",
);

for (const key of ["OVSX_PAT", "VSCE_PAT"]) {
  if (typeof process.env[key] === "string") {
    process.env[key] = process.env[key].trim();
  }
}

function run(command) {
  execSync(command, { stdio: "inherit", env: process.env, shell: true });
}

const ALREADY_PUBLISHED =
  /already exists|already been published|duplicate version|version .* is already/i;

/** @param {string} command */
function tryRun(command) {
  try {
    execSync(command, {
      stdio: "pipe",
      env: process.env,
      shell: true,
      encoding: "utf8",
    });
    return true;
  } catch (error) {
    const output = [
      error instanceof Error ? error.message : String(error),
      error && typeof error === "object" && "stdout" in error
        ? String(error.stdout)
        : "",
      error && typeof error === "object" && "stderr" in error
        ? String(error.stderr)
        : "",
    ].join("\n");

    if (
      error &&
      typeof error === "object" &&
      "stdout" in error &&
      error.stdout
    ) {
      process.stdout.write(String(error.stdout));
    }
    if (
      error &&
      typeof error === "object" &&
      "stderr" in error &&
      error.stderr
    ) {
      process.stderr.write(String(error.stderr));
    }

    if (ALREADY_PUBLISHED.test(output)) {
      console.warn(
        `Publish skipped (this version is already on the registry): ${command}`,
      );
      return true;
    }

    return false;
  }
}

function readPackage() {
  return JSON.parse(readFileSync(PKG_PATH, "utf8"));
}

function latestVsix() {
  const packageJson = readPackage();
  const expected = `ether-theme-${packageJson.version}.vsix`;
  const files = readdirSync(RELEASES_DIR).filter((file) =>
    file.endsWith(".vsix"),
  );

  if (files.includes(expected)) {
    return expected;
  }

  return files.sort(
    (a, b) =>
      statSync(join(RELEASES_DIR, b)).mtimeMs -
      statSync(join(RELEASES_DIR, a)).mtimeMs,
  )[0];
}

mkdirSync(RELEASES_DIR, { recursive: true });
process.env.SKIP_PREPUBLISH = "1";
run("node scripts/strip-readme-logo.js package");

const vsix = latestVsix();
if (!vsix) {
  throw new Error(`No VSIX found in ${RELEASES_DIR}/.`);
}

const vsixPath = join(RELEASES_DIR, vsix);
const vsceOk = tryRun(`"${vsceBin}" publish --packagePath "${vsixPath}"`);
const ovsxOk = tryRun(`"${ovsxBin}" publish "${vsixPath}"`);

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
