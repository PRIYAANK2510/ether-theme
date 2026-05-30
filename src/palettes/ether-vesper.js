
// ══════════════════════════════════════════════════════════════════════════════
// Ether Vesper
//
// A twilight garden, scent of night-blooming flowers. Deep violet-black
// with rose accent and dusk lavender text. Romantic without sentimentality —
// writing code here should feel like writing poetry.
// ══════════════════════════════════════════════════════════════════════════════
export default {
    id: "ether-vesper",
    label: "Ether Vesper",
    type: "dark",
    uiTheme: "vs-dark",
   
    ui: {
      // ── Accent (deep rose) ─────────────────────────────────────────────────
      accent:       "#F068A8",
      accentHover:  "#F888C0",
   
      // ── Surfaces (deep violet-black) ───────────────────────────────────────
      surfaceBorder:        "#0A0810",
      surfaceShell:         "#0F0C16",
      surfacePanel:         "#14101E",
      surfaceAgent:         "#1A1426",
      surfaceEditor:        "#1A1426",
      surfaceLineHighlight: "#221832",
      surfaceInput:         "#130F1A",
      surfaceHover:         "#1E162A",
      surfacePeek:          "#0F0C16",
      surfaceWidget:        "#12101E",
      surfaceNotification:  "#18122A",
      surfaceListFocus:     "#201638",
   
      // ── Text ───────────────────────────────────────────────────────────────
      fgPrimary:    "#F0E8F8",
      fgMuted:      "#4C3A60",
      fgActivity:   "#8870A0",
      fgOnAccent:   "#0A0810",
      fgOnButton:   "#0A0810",
      fgListFocus:  "#FBF4FF",
   
      // ── Depth ──────────────────────────────────────────────────────────────
      shadow: "#05040A",
   
      // ── Semantic ───────────────────────────────────────────────────────────
      error:     "#F07080",
      warning:   "#F0A050",
      findMatch: "#F8D860",
   
      // ── Git gutter ─────────────────────────────────────────────────────────
      gitAdded:    "#70C090",
      gitModified: "#7888F8",
      gitDeleted:  "#F07080",
   
      // ── In-editor structure ────────────────────────────────────────────────
      scrollbar:         "#2A1E40",
      indentGuide:       "#1E1430",
      indentGuideActive: "#301E50",
      ruler:             "#2C1848",
      cursor:            "#F0E8F8",
   
      // ── Inputs & DnD ───────────────────────────────────────────────────────
      dropdownBorder:         "#2A1E40",
      dropTarget:             "#221848",
      editorGroupDrop:        "#2E2058",
      inputValidationError:   "#881830",
      inputValidationInfo:    "#283888",
      inputValidationWarning: "#783818",
   
      // ── Diff & merge ───────────────────────────────────────────────────────
      diffInserted: "#70C090",
      diffRemoved:  "#F07080",
      mergeCurrent: "#F068A8",
   
      // ── Terminal ANSI ──────────────────────────────────────────────────────
      terminalRed:           "#F07080",
      terminalGreen:         "#70C090",
      terminalYellow:        "#F8D860",
      terminalBlue:          "#7888F8",
      terminalMagenta:       "#F068A8",
      terminalCyan:          "#60D0D8",
      terminalBrightRed:     "#F898A8",
      terminalBrightGreen:   "#90D8A8",
      terminalBrightYellow:  "#FAE898",
      terminalBrightBlue:    "#98A8FF",
      terminalBrightMagenta: "#F898CC",
      terminalBrightCyan:    "#80E0E8",
    },
   
    syntax: {
      default:  "#F0E8F8",
      comment:  "#3E2C52",
      string:   "#88CC88",
      number:   "#F0A050",
      cyan:     "#60D0D8",
      keyword:  "#C880E8",
      variable: "#F068A8",
      function: "#80C0F8",
      type:     "#F8D860",
      red:      "#F07888",
      pink:     "#F068A8",
    },
  };