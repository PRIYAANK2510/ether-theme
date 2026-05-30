// ══════════════════════════════════════════════════════════════════════════════
// Ether Obsidian
//
// A luxury watchmaker's workshop at midnight. Pure obsidian surfaces with
// zero chromatic noise — only the burnished-gold accent breaks monochrome.
// The warmest dark theme in the set: ivory text, never clinical blue-white.
// ══════════════════════════════════════════════════════════════════════════════
export default {
    id: "ether-obsidian",
    label: "Ether Obsidian",
    type: "dark",
    uiTheme: "vs-dark",

    ui: {
        // ── Accent (burnished gold) — the sole chromatic presence ──────────────
        accent: "#C9974A",
        accentHover: "#DFB060",

        // ── Surfaces (neutral obsidian, faint warm undertone) ──────────────────
        surfaceBorder: "#08080A",
        surfaceShell: "#0D0D10",
        surfacePanel: "#111114",
        surfaceAgent: "#161619",
        surfaceEditor: "#161619",
        surfaceLineHighlight: "#1D1D23",
        surfaceInput: "#131316",
        surfaceHover: "#1B1B22",
        surfacePeek: "#0D0D10",
        surfaceWidget: "#101013",
        surfaceNotification: "#14141F",
        surfaceListFocus: "#1A1A2A",

        // ── Text ───────────────────────────────────────────────────────────────
        fgPrimary: "#F2EFE8",
        fgMuted: "#565264",
        fgActivity: "#8A8498",
        fgOnAccent: "#0D0D10",
        fgOnButton: "#0D0D10",
        fgListFocus: "#FAF7F0",

        // ── Depth ──────────────────────────────────────────────────────────────
        shadow: "#040406",

        // ── Semantic ───────────────────────────────────────────────────────────
        error: "#E06060",
        warning: "#C98840",
        findMatch: "#C9974A",

        // ── Git gutter ─────────────────────────────────────────────────────────
        gitAdded: "#6AAE7E",
        gitModified: "#6A98E0",
        gitDeleted: "#E06060",

        // ── In-editor structure ────────────────────────────────────────────────
        scrollbar: "#28242E",
        indentGuide: "#1A1820",
        indentGuideActive: "#2C2838",
        ruler: "#28203C",
        cursor: "#F2EFE8",

        // ── Inputs & DnD ───────────────────────────────────────────────────────
        dropdownBorder: "#28242E",
        dropTarget: "#1C1C2C",
        editorGroupDrop: "#2A2840",
        inputValidationError: "#8A2020",
        inputValidationInfo: "#284870",
        inputValidationWarning: "#784820",

        // ── Diff & merge ───────────────────────────────────────────────────────
        diffInserted: "#6AAE7E",
        diffRemoved: "#E06060",
        mergeCurrent: "#C9974A",

        // ── Terminal ANSI ──────────────────────────────────────────────────────
        terminalRed: "#E06060",
        terminalGreen: "#6AAE7E",
        terminalYellow: "#C9974A",
        terminalBlue: "#6A98E0",
        terminalMagenta: "#B07ED0",
        terminalCyan: "#4ABDB8",
        terminalBrightRed: "#F07878",
        terminalBrightGreen: "#88C898",
        terminalBrightYellow: "#DFB060",
        terminalBrightBlue: "#88B4F8",
        terminalBrightMagenta: "#CC9AEA",
        terminalBrightCyan: "#68D5CF",
    },

    syntax: {
        default: "#F2EFE8",
        comment: "#504C5E",
        string: "#90C078",
        number: "#C9974A",
        cyan: "#4ABDB8",
        keyword: "#B87ED0",
        variable: "#8AA4F0",
        function: "#78C4F8",
        type: "#C9974A",
        red: "#E87878",
        pink: "#D888A8",
    },
};