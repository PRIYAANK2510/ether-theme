import { existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * @param {string} text
 */
function normalizeTextEol(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/**
 * Write a file only when content changed. String comparison is LF-normalized
 * so Windows CRLF working copies do not cause redundant writes or phantom diffs.
 *
 * @param {string} filePath
 * @param {string | Buffer} content
 * @param {BufferEncoding} [encoding]
 * @returns {boolean} `true` when the file was written
 */
export function writeFileIfChanged(filePath, content, encoding = "utf8") {
  if (typeof content === "string") {
    if (existsSync(filePath)) {
      const existing = normalizeTextEol(readFileSync(filePath, encoding));
      const next = normalizeTextEol(content);
      if (existing === next) {
        return false;
      }
    }
    writeFileSync(filePath, content, encoding);
    return true;
  }

  if (!Buffer.isBuffer(content)) {
    throw new TypeError("content must be a string or Buffer");
  }

  if (existsSync(filePath)) {
    const existing = readFileSync(filePath);
    if (existing.equals(content)) {
      return false;
    }
  }

  writeFileSync(filePath, content);
  return true;
}
