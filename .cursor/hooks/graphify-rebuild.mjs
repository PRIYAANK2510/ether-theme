/**
 * Cursor hook: queue Graphify rebuild after agent edits, run on agent stop.
 * Handles `afterFileEdit` (mark pending) and `stop` (rebuild if pending).
 */
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const PENDING = join(ROOT, '.graphify', '.agent-rebuild-pending');
const GRAPHIFY_CLI = join(
  ROOT,
  'node_modules',
  '@sentropic',
  'graphify',
  'dist',
  'cli.js',
);

const SOURCE_MARKERS = [
  '/src/',
  '/apps/website/src/',
  '/shared/',
  '/tests/',
];
const SOURCE_EXT = /\.(js|ts|tsx|mjs|jsx|scss)$/i;

/** @param {string} filePath */
function isRelevantSourceEdit(filePath) {
  const normalized = filePath.replace(/\\/g, '/').toLowerCase();
  if (!SOURCE_EXT.test(normalized)) return false;
  return SOURCE_MARKERS.some((marker) => normalized.includes(marker));
}

/** @returns {Promise<string>} */
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

/** @param {string} filePath */
function markPending(filePath) {
  mkdirSync(join(ROOT, '.graphify'), { recursive: true });

  /** @type {{ files: string[], at: number }} */
  let pending = { files: [], at: Date.now() };
  if (existsSync(PENDING)) {
    try {
      pending = JSON.parse(readFileSync(PENDING, 'utf8'));
      if (!Array.isArray(pending.files)) pending.files = [];
    } catch {
      pending = { files: [], at: Date.now() };
    }
  }

  if (!pending.files.includes(filePath)) {
    pending.files.push(filePath);
  }
  pending.at = Date.now();
  writeFileSync(PENDING, `${JSON.stringify(pending, null, 2)}\n`, 'utf8');
}

function rebuildGraph() {
  if (!existsSync(GRAPHIFY_CLI)) {
    process.stderr.write('[graphify hook] CLI not found; run npm install\n');
    return 1;
  }

  const result = spawnSync(
    process.execPath,
    [GRAPHIFY_CLI, 'hook-rebuild'],
    { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' },
  );

  if (result.stdout) process.stderr.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  return result.status ?? 1;
}

const raw = await readStdin();
const payload = raw.trim() ? JSON.parse(raw) : {};
const event = payload.hook_event_name;

if (event === 'afterFileEdit') {
  const filePath = payload.file_path ?? '';
  if (isRelevantSourceEdit(filePath)) {
    markPending(filePath);
  }
  process.exit(0);
}

if (event === 'stop') {
  if (payload.status !== 'completed' || !existsSync(PENDING)) {
    process.exit(0);
  }

  const code = rebuildGraph();
  if (code === 0) {
    try {
      unlinkSync(PENDING);
    } catch {
      // ignore
    }
  }
  process.exit(0);
}

process.exit(0);
