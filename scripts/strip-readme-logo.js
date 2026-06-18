import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const readmePath = join(rootDir, "README.md");
const backupPath = join(rootDir, ".readme-github.bak");
const vsceBin = join(
  rootDir,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "vsce.cmd" : "vsce",
);

const START = "<!-- marketplace-omit-start -->";
const END = "<!-- marketplace-omit-end -->";

function stripReadmeForMarketplace() {
  const readme = readFileSync(readmePath, "utf8");
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);

  if (start === -1 || end === -1 || end < start) {
    return false;
  }

  writeFileSync(backupPath, readme, "utf8");

  const body = readme
    .slice(end + END.length)
    .replace(/^\n+/, "")
    .replace(/^---\n\n?/, "");

  writeFileSync(readmePath, body, "utf8");
  return true;
}

function restoreReadmeForGitHub() {
  if (!existsSync(backupPath)) {
    return false;
  }

  writeFileSync(readmePath, readFileSync(backupPath, "utf8"), "utf8");
  unlinkSync(backupPath);
  return true;
}

const mode = process.argv[2];

if (mode === "package") {
  mkdirSync(join(rootDir, "releases"), { recursive: true });
  stripReadmeForMarketplace();
  try {
    execSync(`"${vsceBin}" package --out releases/`, {
      stdio: "inherit",
      shell: true,
      cwd: rootDir,
    });
  } finally {
    restoreReadmeForGitHub();
  }
} else {
  console.error("Usage: node scripts/strip-readme-logo.js package");
  process.exit(1);
}
