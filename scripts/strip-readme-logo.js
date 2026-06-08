import { execSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const readmePath = join(rootDir, "README.md");
const backupPath = join(rootDir, ".readme-github.bak");

const START = "<!-- marketplace-omit-start -->";
const END = "<!-- marketplace-omit-end -->";

function stripReadmeLogo() {
  const readme = readFileSync(readmePath, "utf8");
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);

  if (start === -1 || end === -1 || end < start) {
    return false;
  }

  writeFileSync(backupPath, readme, "utf8");

  const stripped =
    readme.slice(0, start).replace(/\n$/, "") +
    readme.slice(end + END.length).replace(/^\n/, "\n");

  writeFileSync(readmePath, stripped, "utf8");
  return true;
}

function restoreReadmeLogo() {
  if (!existsSync(backupPath)) {
    return false;
  }

  writeFileSync(readmePath, readFileSync(backupPath, "utf8"), "utf8");
  unlinkSync(backupPath);
  return true;
}

const mode = process.argv[2];

if (mode === "strip") {
  stripReadmeLogo();
} else if (mode === "restore") {
  restoreReadmeLogo();
} else if (mode === "package") {
  stripReadmeLogo();
  try {
    execSync("npx vsce package --out releases/", {
      stdio: "inherit",
      shell: true,
      cwd: rootDir,
    });
  } finally {
    restoreReadmeLogo();
  }
} else {
  console.error("Usage: node scripts/strip-readme-logo.js <strip|restore|package>");
  process.exit(1);
}
