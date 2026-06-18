import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

if (process.env.SKIP_PREPUBLISH === "1") {
  console.log("Skipping vscode:prepublish (extension already built).");
} else {
  execSync("node src/build.js --skip-previews --skip-site", {
    stdio: "inherit",
    cwd: rootDir,
  });
}
