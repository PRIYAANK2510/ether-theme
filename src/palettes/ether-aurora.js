
// ══════════════════════════════════════════════════════════════════════════════
// Ether Aurora
//
// Northern lights over a frozen inland sea. Deep space navy surfaces,
// electric teal accent. Syntax colors map the full aurora spectrum:
// arctic green, solar amber, electric violet, glacial sky.
// ══════════════════════════════════════════════════════════════════════════════
export default {
    id: "ether-aurora",
    label: "Ether Aurora",
    type: "dark",
    uiTheme: "vs-dark",

    ui: {
        // ── Accent (electric aurora teal) ──────────────────────────────────────
        accent: "#00CEB8",
        accentHover: "#20E4CC",

        // ── Surfaces (deep space navy) ─────────────────────────────────────────
        surfaceBorder: "#070A10",
        surfaceShell: "#0B0F1A",
        surfacePanel: "#0F1422",
        surfaceAgent: "#131928",
        surfaceEditor: "#131928",
        surfaceLineHighlight: "#1A2238",
        surfaceInput: "#101520",
        surfaceHover: "#182030",
        surfacePeek: "#0B0F1A",
        surfaceWidget: "#0D1222",
        surfaceNotification: "#121A30",
        surfaceListFocus: "#182042",

        // ── Text ───────────────────────────────────────────────────────────────
        fgPrimary: "#C8EAF8",
        fgMuted: "#344C68",
        fgActivity: "#5A7E98",
        fgOnAccent: "#070A10",
        fgOnButton: "#070A10",
        fgListFocus: "#E0F4FF",

        // ── Depth ──────────────────────────────────────────────────────────────
        shadow: "#03050A",

        // ── Semantic ───────────────────────────────────────────────────────────
        error: "#F06880",
        warning: "#F0A040",
        findMatch: "#F8E040",

        // ── Git gutter ─────────────────────────────────────────────────────────
        gitAdded: "#48D090",
        gitModified: "#48A8F8",
        gitDeleted: "#F06880",

        // ── In-editor structure ────────────────────────────────────────────────
        scrollbar: "#1C3050",
        indentGuide: "#142030",
        indentGuideActive: "#203850",
        ruler: "#1A3260",
        cursor: "#C8EAF8",

        // ── Inputs & DnD ───────────────────────────────────────────────────────
        dropdownBorder: "#1C2E48",
        dropTarget: "#162840",
        editorGroupDrop: "#223860",
        inputValidationError: "#801828",
        inputValidationInfo: "#184078",
        inputValidationWarning: "#784010",

        // ── Diff & merge ───────────────────────────────────────────────────────
        diffInserted: "#48D090",
        diffRemoved: "#F06880",
        mergeCurrent: "#00CEB8",

        // ── Terminal ANSI ──────────────────────────────────────────────────────
        terminalRed: "#F06880",
        terminalGreen: "#48D090",
        terminalYellow: "#F8E040",
        terminalBlue: "#48A8F8",
        terminalMagenta: "#A870F8",
        terminalCyan: "#00CEB8",
        terminalBrightRed: "#F890A0",
        terminalBrightGreen: "#70E8B0",
        terminalBrightYellow: "#FAF080",
        terminalBrightBlue: "#78C8FF",
        terminalBrightMagenta: "#C898FF",
        terminalBrightCyan: "#38E4D0",
    },

    syntax: {
        default: "#C8EAF8",
        comment: "#283E5C",
        string: "#48D098",
        number: "#F0A840",
        cyan: "#00CEB8", 
        keyword: "#A870F8",
        variable: "#48A8F8",
        function: "#70D0FF",
        type: "#F8E040",
        red: "#F06880",
        pink: "#F070B8",
    },
};