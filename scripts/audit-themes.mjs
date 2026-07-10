import chroma from "chroma-js";
import { composeTheme, loadPalettes } from "../src/generator/index.js";
import {
  contrastRatio,
  deriveCommentForeground,
  PALETTE_CONTRAST_TARGETS,
  PALETTE_SYNTAX_TOKEN_KEYS,
  validatePalette,
} from "../src/utils/color.js";
import { validateGeneratedTheme } from "../src/workbench/validate-theme.js";
import { writeFileSync } from "node:fs";

const DELTA_E_NEAR = 12;
const DELTA_E_VERY_NEAR = 6;
const BORDERLINE_SLACK = 0.35;
const PANEL_EDITOR_MIN_DELTA_L = 1.5;
const SURFACE_ORDER = [
  "surfaceBorder",
  "surfaceShell",
  "surfacePanel",
  "surfaceEditor",
  "surfaceLineHighlight",
];

function deltaE(a, b) {
  return chroma.deltaE(a, b);
}

const findings = [];
function add(severity, theme, category, message, detail = {}) {
  findings.push({ severity, theme, category, message, ...detail });
}

const palettes = await loadPalettes();
console.log(`Loaded ${palettes.length} palettes\n`);

const hardFailures = [];
const contrastTable = [];
const accentMap = new Map();
const editorMap = new Map();
const panelMap = new Map();

for (const palette of palettes) {
  const id = palette.id;

  try {
    validatePalette(palette);
    const theme = composeTheme(palette);
    validateGeneratedTheme(theme, id);
  } catch (err) {
    hardFailures.push({ id, error: err.message });
    add("error", id, "validation", err.message);
    continue;
  }

  const ui = palette.ui;
  const editor = ui.surfaceEditor;
  const comment = deriveCommentForeground(ui);

  const checks = [
    ["ui.fgPrimary", ui.fgPrimary, editor, PALETTE_CONTRAST_TARGETS.fgPrimary],
    ["ui.fgMuted", ui.fgMuted, editor, PALETTE_CONTRAST_TARGETS.fgMuted],
    ["ui.fgActivity", ui.fgActivity, editor, 3],
    [
      "ui.fgOnAccent",
      ui.fgOnAccent,
      ui.accent,
      PALETTE_CONTRAST_TARGETS.fgOnAccent,
    ],
    ["ui.fgListFocus", ui.fgListFocus, ui.surfaceListFocus, 4.5],
    [
      "syntax.default",
      palette.syntax.default,
      editor,
      PALETTE_CONTRAST_TARGETS.syntaxDefault,
    ],
    [
      "syntax.comment",
      comment,
      editor,
      PALETTE_CONTRAST_TARGETS.syntaxComment,
    ],
    ...PALETTE_SYNTAX_TOKEN_KEYS.filter((k) => k !== "default").map((k) => [
      `syntax.${k}`,
      palette.syntax[k],
      editor,
      PALETTE_CONTRAST_TARGETS.syntaxToken,
    ]),
  ];

  for (const [path, fg, bg, min] of checks) {
    const ratio = Number(contrastRatio(fg, bg).toFixed(2));
    contrastTable.push({
      id,
      path,
      ratio,
      min,
      margin: Number((ratio - min).toFixed(2)),
    });
    if (ratio < min) {
      add("error", id, "contrast", `${path}: ${ratio}:1 < ${min}:1`);
    } else if (ratio - min <= BORDERLINE_SLACK) {
      add(
        "warn",
        id,
        "borderline-contrast",
        `${path}: ${ratio}:1 (min ${min}:1, margin ${(ratio - min).toFixed(2)})`,
      );
    }
  }

  if (ui.fgOnButton) {
    const r = Number(contrastRatio(ui.fgOnButton, ui.accent).toFixed(2));
    if (r < 4.5) {
      add("error", id, "contrast", `ui.fgOnButton on accent: ${r}:1 < 4.5:1`);
    } else if (r - 4.5 <= BORDERLINE_SLACK) {
      add("warn", id, "borderline-contrast", `ui.fgOnButton on accent: ${r}:1`);
    }
  }

  const Lp = chroma(ui.surfacePanel).get("lab.l");
  const Le = chroma(ui.surfaceEditor).get("lab.l");
  const dL = Le - Lp;
  if (dL < 0) {
    add(
      "warn",
      id,
      "surface-hierarchy",
      `surfaceEditor darker than surfacePanel (ΔL=${dL.toFixed(2)}) — convention expects panel darker`,
    );
  } else if (dL < PANEL_EDITOR_MIN_DELTA_L) {
    add(
      "warn",
      id,
      "surface-hierarchy",
      `panel→editor ΔL=${dL.toFixed(2)} (weak hierarchy, <${PANEL_EDITOR_MIN_DELTA_L})`,
    );
  }

  const Ls = SURFACE_ORDER.map((k) => ({
    k,
    L: chroma(ui[k]).get("lab.l"),
  }));
  for (let i = 0; i < Ls.length - 1; i++) {
    if (Ls[i].L > Ls[i + 1].L + 0.5) {
      add(
        "info",
        id,
        "surface-order",
        `${Ls[i].k} (L=${Ls[i].L.toFixed(1)}) lighter than ${Ls[i + 1].k} (L=${Ls[i + 1].L.toFixed(1)})`,
      );
    }
  }

  const listDelta = deltaE(ui.surfaceListFocus, ui.surfacePanel);
  if (listDelta < 8) {
    add(
      "warn",
      id,
      "interactive",
      `surfaceListFocus ≈ surfacePanel (ΔE=${listDelta.toFixed(1)}) — hover may be hard to see`,
    );
  }

  const lhDelta = deltaE(ui.surfaceLineHighlight, ui.surfaceEditor);
  if (lhDelta < 4) {
    add(
      "warn",
      id,
      "interactive",
      `surfaceLineHighlight ≈ surfaceEditor (ΔE=${lhDelta.toFixed(1)})`,
    );
  }

  const igDelta = deltaE(ui.indentGuide, ui.surfaceEditor);
  if (igDelta < 3) {
    add(
      "info",
      id,
      "chrome",
      `indentGuide nearly invisible on editor (ΔE=${igDelta.toFixed(1)})`,
    );
  }

  const syntaxEntries = [
    ...PALETTE_SYNTAX_TOKEN_KEYS.map((k) => [k, palette.syntax[k]]),
    ["comment", comment],
  ];
  for (let i = 0; i < syntaxEntries.length; i++) {
    for (let j = i + 1; j < syntaxEntries.length; j++) {
      const [ka, ca] = syntaxEntries[i];
      const [kb, cb] = syntaxEntries[j];
      const d = deltaE(ca, cb);
      if (d < DELTA_E_VERY_NEAR) {
        add(
          "warn",
          id,
          "syntax-collision",
          `syntax.${ka} ≈ syntax.${kb} (ΔE=${d.toFixed(1)})`,
          { deltaE: d },
        );
      } else if (d < DELTA_E_NEAR) {
        add(
          "info",
          id,
          "syntax-similarity",
          `syntax.${ka} ~ syntax.${kb} (ΔE=${d.toFixed(1)})`,
          { deltaE: d },
        );
      }
    }
  }

  if (deltaE(ui.accent, ui.error) < DELTA_E_NEAR) {
    add(
      "warn",
      id,
      "semantic",
      `accent ≈ error (ΔE=${deltaE(ui.accent, ui.error).toFixed(1)})`,
    );
  }

  const ah = deltaE(ui.accent, ui.accentHover);
  if (ah < 3) {
    add(
      "info",
      id,
      "accent",
      `accentHover nearly identical to accent (ΔE=${ah.toFixed(1)})`,
    );
  }

  const accentKey = ui.accent.toLowerCase();
  if (!accentMap.has(accentKey)) accentMap.set(accentKey, []);
  accentMap.get(accentKey).push(id);

  const editorKey = ui.surfaceEditor.toLowerCase();
  if (!editorMap.has(editorKey)) editorMap.set(editorKey, []);
  editorMap.get(editorKey).push(id);

  const panelKey = ui.surfacePanel.toLowerCase();
  if (!panelMap.has(panelKey)) panelMap.set(panelKey, []);
  panelMap.get(panelKey).push(id);

  if (palette.type !== "dark") {
    add("error", id, "meta", `type is "${palette.type}", expected dark`);
  }
  if (palette.uiTheme !== "vs-dark") {
    add("error", id, "meta", `uiTheme is "${palette.uiTheme}"`);
  }
  if ("comment" in palette.syntax) {
    add(
      "warn",
      id,
      "meta",
      "palette authors syntax.comment — should be derived at build",
    );
  }

  const actOnPanel = Number(
    contrastRatio(ui.fgActivity, ui.surfacePanel).toFixed(2),
  );
  if (actOnPanel < 3) {
    add(
      "warn",
      id,
      "contrast",
      `ui.fgActivity on surfacePanel: ${actOnPanel}:1 < 3:1 (soft)`,
    );
  }

  const mutedOnPanel = Number(
    contrastRatio(ui.fgMuted, ui.surfacePanel).toFixed(2),
  );
  if (mutedOnPanel < 4.5) {
    add(
      "info",
      id,
      "contrast",
      `ui.fgMuted on surfacePanel: ${mutedOnPanel}:1 (sidebar chrome; soft)`,
    );
  }
}

for (const [hex, ids] of accentMap) {
  if (ids.length > 1) {
    add(
      "warn",
      "cross-theme",
      "uniqueness",
      `Identical accent ${hex}: ${ids.join(", ")}`,
    );
  }
}
for (const [hex, ids] of editorMap) {
  if (ids.length > 1) {
    add(
      "info",
      "cross-theme",
      "uniqueness",
      `Identical surfaceEditor ${hex}: ${ids.join(", ")}`,
    );
  }
}
for (const [hex, ids] of panelMap) {
  if (ids.length > 1) {
    add(
      "info",
      "cross-theme",
      "uniqueness",
      `Identical surfacePanel ${hex}: ${ids.join(", ")}`,
    );
  }
}

for (let i = 0; i < palettes.length; i++) {
  for (let j = i + 1; j < palettes.length; j++) {
    const a = palettes[i];
    const b = palettes[j];
    const dEditor = deltaE(a.ui.surfaceEditor, b.ui.surfaceEditor);
    const dPanel = deltaE(a.ui.surfacePanel, b.ui.surfacePanel);
    const dAccent = deltaE(a.ui.accent, b.ui.accent);
    if (dEditor < 5 && dPanel < 5 && dAccent < 8) {
      add(
        "warn",
        "cross-theme",
        "similarity",
        `${a.id} ≈ ${b.id} (editor ΔE=${dEditor.toFixed(1)}, panel ΔE=${dPanel.toFixed(1)}, accent ΔE=${dAccent.toFixed(1)})`,
      );
    }
  }
}

const bySev = { error: 0, warn: 0, info: 0 };
for (const f of findings) bySev[f.severity]++;

console.log("=== HARD FAILURES ===");
console.log(
  hardFailures.length
    ? hardFailures
    : "None — all palettes pass validatePalette + validateGeneratedTheme",
);

console.log("\n=== FINDINGS BY SEVERITY ===");
console.log(bySev);

console.log("\n=== ERRORS ===");
for (const f of findings.filter((x) => x.severity === "error")) {
  console.log(`[${f.theme}] ${f.category}: ${f.message}`);
}

console.log("\n=== WARNINGS ===");
for (const f of findings.filter((x) => x.severity === "warn")) {
  console.log(`[${f.theme}] ${f.category}: ${f.message}`);
}

console.log("\n=== INFO ===");
for (const f of findings.filter((x) => x.severity === "info")) {
  console.log(`[${f.theme}] ${f.category}: ${f.message}`);
}

console.log("\n=== TIGHTEST CONTRAST MARGINS (top 20) ===");
for (const r of contrastTable
  .filter((row) => row.path.startsWith("syntax.") || row.path.startsWith("ui.fg"))
  .sort((a, b) => a.margin - b.margin)
  .slice(0, 20)) {
  console.log(
    `${r.id} ${r.path}: ${r.ratio}:1 (min ${r.min}, margin ${r.margin})`,
  );
}

if (process.argv.includes("--json")) {
  writeFileSync(
    new URL("../theme-audit-results.json", import.meta.url),
    JSON.stringify(
      { bySev, findings, contrastTable, paletteCount: palettes.length },
      null,
      2,
    ),
  );
  console.log("\nWrote theme-audit-results.json");
}

const exitCode = bySev.error > 0 || bySev.warn > 0 ? 1 : 0;
process.exit(exitCode);
