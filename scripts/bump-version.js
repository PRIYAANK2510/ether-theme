import { readFileSync, writeFileSync } from "node:fs";

const pkgPath = "package.json";
const changelogPath = "CHANGELOG.md";
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

const [major, minor, patch] = pkg.version.split(".").map(Number);
const nextVersion = `${major}.${minor}.${patch + 1}`;
const today = new Date().toISOString().slice(0, 10);

pkg.version = nextVersion;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

let changelog = readFileSync(changelogPath, "utf8");

if (!changelog.includes(`## [${nextVersion}]`)) {
  const entry = [
    `## [${nextVersion}] - ${today}`,
    "",
    "### Changed",
    "",
    "- Theme palette updates (auto-release)",
    "",
  ].join("\n");

  const insertAfter = changelog.indexOf("\n## [");
  changelog =
    insertAfter === -1
      ? `${changelog.trimEnd()}\n\n${entry}`
      : `${changelog.slice(0, insertAfter)}\n\n${entry}${changelog.slice(insertAfter + 1)}`;

  const link = `[${nextVersion}]: https://github.com/PRIYAANK2510/ether-theme/releases/tag/v${nextVersion}`;
  if (!changelog.includes(link)) {
    changelog = `${changelog.trimEnd()}\n${link}\n`;
  }

  writeFileSync(changelogPath, changelog.endsWith("\n") ? changelog : `${changelog}\n`);
}

console.log(nextVersion);
