import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  composeTheme,
  loadPalettes,
  removeOrphanedThemeFiles,
} from "../src/generator/index.js";
import { writePreviewAssets } from "../src/generator/preview-svg/assets.js";
import { renderThemePreviewSvg } from "../src/generator/preview-svg/compose.js";
import {
  PNG_RENDER_WIDTH,
  PREVIEW_README_EXT,
} from "../src/generator/preview-svg/constants.js";
import { renderReadmePreviewGallery } from "../src/generator/preview-svg/gallery.js";
import { renderSvgToPng } from "../src/generator/preview-svg/rasterize.js";
import { THEME_CHARACTER } from "../src/generator/preview-svg/theme-character.js";
import etherGraphite from "../src/palettes/ether-graphite.js";
import etherStorm from "../src/palettes/ether-storm.js";
import { SYNTAX_RULE_COUNT } from "../src/syntax/rules.js";
import {
  colorAlphaByte,
  darken,
  DEPRECATED_THEME_COLOR_IDS,
  lighten,
  mixColors,
  PALETTE_CONTRAST_TARGETS,
  validatePaletteContrast,
  withAlpha,
  withAlphaByte,
} from "../src/utils/color.js";
import { EXPECTED_SYNTAX_RULE_COUNT, WORKBENCH_COLOR_IDS } from "../src/workbench/constants.js";
import { CORE_WORKBENCH_COLOR_IDS } from "../src/workbench/core-catalog.js";
import { EXTENSION_WORKBENCH_COLOR_IDS } from "../src/workbench/extension-catalog.js";

describe("color-utils", () => {
  it("applies alpha via chroma", () => {
    expect(withAlpha("#6366f1", 0.5)).toMatch(/^#[0-9a-f]{8}$/i);
  });

  it("applies exact alpha bytes", () => {
    expect(withAlphaByte("#4285F4", 0x40)).toBe("#4285F440");
  });

  it("mixes two colors", () => {
    const mixed = mixColors("#000000", "#ffffff", 0.5);
    expect(mixed.toLowerCase()).toMatch(/^#[0-9a-f]{6}$/i);
    expect(mixed).not.toBe("#000000");
    expect(mixed).not.toBe("#ffffff");
  });

  it("lightens and darkens colors", () => {
    expect(lighten("#000000", 0.5)).not.toBe("#000000");
    expect(darken("#ffffff", 0.5)).not.toBe("#ffffff");
  });

});

describe("theme generator", () => {
  const palette = etherGraphite;
  const theme = composeTheme(palette);

  it("removes orphaned theme JSON when palette is deleted", () => {
    const dir = mkdtempSync(join(tmpdir(), "ether-themes-"));
    writeFileSync(join(dir, "ether-graphite.color-theme.json"), "{}");
    writeFileSync(join(dir, "removed-theme.color-theme.json"), "{}");

    const removed = removeOrphanedThemeFiles(["ether-graphite"], dir);

    expect(removed).toHaveLength(1);
    expect(removed[0]).toMatch(/removed-theme\.color-theme\.json$/);
    expect(existsSync(join(dir, "ether-graphite.color-theme.json"))).toBe(true);
    expect(existsSync(join(dir, "removed-theme.color-theme.json"))).toBe(false);
  });

  it("syntax rule count matches generator manifest", () => {
    expect(SYNTAX_RULE_COUNT).toBe(EXPECTED_SYNTAX_RULE_COUNT);
  });

  it("uses unique syntax rule names", () => {
    const names = theme.tokenColors.slice(1).map((rule) => rule.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("composes a complete theme from palette tokens", () => {
    expect(theme.name).toBe("Ether Graphite");
    expect(theme.type).toBe("dark");
    expect(Object.keys(theme.colors)).toHaveLength(
      WORKBENCH_COLOR_IDS.length + EXTENSION_WORKBENCH_COLOR_IDS.length,
    );
    expect(theme.tokenColors).toHaveLength(EXPECTED_SYNTAX_RULE_COUNT);
    expect(theme.semanticHighlighting).toBe(true);
    expect(theme).not.toHaveProperty("semanticTokenColors");
  });

  it("uses modern workbench keys without deprecated tokens", () => {
    for (const key of DEPRECATED_THEME_COLOR_IDS) {
      expect(theme.colors).not.toHaveProperty(key);
    }
    expect(theme.colors["button.foreground"].toLowerCase()).toBe(
      palette.ui.fgOnButton.toLowerCase(),
    );
    expect(theme.colors["extensionButton.prominentForeground"].toLowerCase()).toBe(
      palette.ui.fgOnButton.toLowerCase(),
    );
    expect(theme.colors["activityBar.dropBorder"]).toBe(theme.colors["list.dropBackground"]);
    expect(theme.colors["notifications.background"].toLowerCase()).toBe(
      palette.ui.surfaceNotification.toLowerCase(),
    );
    expect(theme.colors["editorHoverWidget.border"].toLowerCase()).toBe(
      withAlphaByte(palette.ui.surfaceHover, 0).toLowerCase(),
    );
  });

  it("omits empty token fontStyle values", () => {
    for (const rule of theme.tokenColors) {
      expect(rule.settings?.fontStyle).not.toBe("");
    }
  });

  it("omits unsupported token and chat schema keys", () => {
    for (const rule of theme.tokenColors) {
      expect(rule.settings).not.toHaveProperty("background");
    }
    expect(theme.colors).not.toHaveProperty("chat.requestBubbleBackground");
    expect(theme.colors).not.toHaveProperty("chat.requestBubbleHoverBackground");
    expect(theme.colors).not.toHaveProperty("chat.requestCodeBorder");
    expect(colorAlphaByte(theme.colors["editor.hoverHighlightBackground"])).toBeLessThan(
      0xff,
    );
    expect(colorAlphaByte(theme.colors["merge.currentHeaderBackground"])).toBeLessThan(
      0xff,
    );
    expect(theme.colors).toHaveProperty("editorIndentGuide.background1");
    expect(theme.colors).not.toHaveProperty("editorIndentGuide.background");
  });

  it("maps palette surfaces to sidebar, editor, and agent chat chrome", () => {
    const composerPane = palette.ui.surfaceEditor;

    expect(theme.colors["sideBar.background"].toLowerCase()).toBe(
      palette.ui.surfacePanel.toLowerCase(),
    );
    expect(theme.colors["editor.background"].toLowerCase()).toBe(composerPane.toLowerCase());
    expect(theme.colors["inlineChat.background"].toLowerCase()).toBe(composerPane.toLowerCase());
    expect(theme.colors["inlineChatInput.background"].toLowerCase()).toBe(
      composerPane.toLowerCase(),
    );
    expect(theme.colors["input.background"].toLowerCase()).toBe(composerPane.toLowerCase());
    expect(theme.colors).not.toHaveProperty("agentsChatInput.background");
    expect(theme.colors).not.toHaveProperty("agentSessionsList.background");
    expect(theme.colors["chat.requestBackground"].toLowerCase()).toBe(
      mixColors(composerPane, palette.ui.surfacePanel, 0.22).toLowerCase(),
    );
    expect(theme.colors["textLink.foreground"].toLowerCase()).toBe(
      palette.ui.accent.toLowerCase(),
    );
    expect(theme.colors["editorGroup.emptyBackground"].toLowerCase()).toBe(
      palette.ui.surfacePanel.toLowerCase(),
    );
  });

  it("uses visible interactive hover and selection states", () => {
    const panel = palette.ui.surfacePanel.toLowerCase();
    const listFocus = palette.ui.surfaceListFocus.toLowerCase();

    expect(theme.colors["list.hoverBackground"].toLowerCase()).toBe(listFocus);
    expect(theme.colors["list.hoverBackground"].toLowerCase()).not.toBe(panel);
    expect(theme.colors["list.activeSelectionBackground"].toLowerCase()).toBe(listFocus);
    expect(theme.colors["statusBarItem.hoverForeground"].toLowerCase()).toBe(
      palette.ui.fgPrimary.toLowerCase(),
    );
    expect(theme.colors["button.secondaryForeground"].toLowerCase()).toBe(
      palette.ui.fgPrimary.toLowerCase(),
    );
    expect(theme.colors).not.toHaveProperty("button.secondaryHoverForeground");
    expect(theme.colors["editorSuggestWidget.selectedForeground"].toLowerCase()).toBe(
      palette.ui.fgListFocus.toLowerCase(),
    );
    expect(theme.colors["activityBar.foreground"].toLowerCase()).toBe(
      palette.ui.fgPrimary.toLowerCase(),
    );
    expect(theme.colors).not.toHaveProperty("activityBar.activeForeground");
    expect(theme.colors).toHaveProperty("activityBar.activeBackground");
  });

  it("emits only catalog workbench color keys (VS Code schema safe)", () => {
    const allowed = new Set([
      ...WORKBENCH_COLOR_IDS,
      ...EXTENSION_WORKBENCH_COLOR_IDS,
    ]);
    for (const key of Object.keys(theme.colors)) {
      expect(allowed.has(key)).toBe(true);
    }
    expect(Object.keys(theme.colors)).toHaveLength(allowed.size);
  });

  it("derives all extension workbench colors", () => {
    for (const key of EXTENSION_WORKBENCH_COLOR_IDS) {
      expect(theme.colors[key]).toMatch(/^#[0-9a-f]{3,8}$/i);
    }
  });

  it("separates diff file headers from the editor surface for every palette", async () => {
    const palettes = await loadPalettes();
    const diffKeys = [
      "multiDiffEditor.headerBackground",
      "multiDiffEditor.background",
      "multiDiffEditor.border",
      "diffEditor.unchangedRegionBackground",
      "diffEditor.unchangedRegionForeground",
      "diffEditor.unchangedRegionShadow",
      "diffEditor.unchangedCodeBackground",
      "editorGroupHeader.border",
      "breadcrumb.foreground",
      "breadcrumb.background",
      "breadcrumb.focusForeground",
      "breadcrumb.activeSelectionForeground",
    ];

    for (const palette of palettes) {
      const theme = composeTheme(palette);
      const editorBg = theme.colors["editor.background"].toLowerCase();
      const headerBg =
        theme.colors["multiDiffEditor.headerBackground"].toLowerCase();
      const panelBg = palette.ui.surfacePanel.toLowerCase();
      const foldedBg =
        theme.colors["diffEditor.unchangedRegionBackground"].toLowerCase();

      for (const key of diffKeys) {
        expect(theme.colors[key], `${palette.id}:${key}`).toMatch(
          /^#[0-9a-f]{3,8}$/i,
        );
      }

      expect(theme.colors["multiDiffEditor.background"].toLowerCase()).toBe(
        editorBg,
      );
      if (panelBg !== editorBg) {
        expect(headerBg).toBe(panelBg);
      }
      expect(headerBg).not.toBe(editorBg);
      expect(theme.colors["breadcrumb.background"].toLowerCase()).toBe(headerBg);
      expect(foldedBg).not.toBe(headerBg);
      expect(foldedBg).not.toBe(editorBg);
    }
  });

  it("resolves all core workbench colors", () => {
    for (const key of WORKBENCH_COLOR_IDS) {
      expect(theme.colors[key]).toMatch(/^#[0-9a-f]{3,8}$/i);
    }
  });

  it("generates every discovered palette", async () => {
    const palettes = await loadPalettes();
    expect(palettes.length).toBeGreaterThan(0);

    for (const item of palettes) {
      const generated = composeTheme(item);
      expect(generated.name).toBe(item.label);
      expect(generated.type).toBe(item.type);
      expect(Object.keys(generated.colors)).toHaveLength(
        CORE_WORKBENCH_COLOR_IDS.length + EXTENSION_WORKBENCH_COLOR_IDS.length,
      );
    }
  });

  it("loads only dark palettes", async () => {
    const palettes = await loadPalettes();

    expect(palettes).toHaveLength(25);
    expect(palettes.every((p) => p.type === "dark")).toBe(true);
    expect(palettes.every((p) => p.uiTheme === "vs-dark")).toBe(true);
  });

  it("matches comment color to active gutter line numbers", () => {
    const graphite = composeTheme(etherGraphite);
    const commentRule = graphite.tokenColors.find((r) => r.name === "Comment");
    expect(commentRule?.settings?.foreground?.toLowerCase()).toBe(
      graphite.colors["editorLineNumber.activeForeground"].toLowerCase(),
    );
  });

  it("meets minimum contrast on critical palette token pairs", async () => {
    const palettes = await loadPalettes();

    for (const palette of palettes) {
      expect(() => validatePaletteContrast(palette)).not.toThrow();
    }

    expect(PALETTE_CONTRAST_TARGETS.fgPrimary).toBeGreaterThanOrEqual(7);
    expect(PALETTE_CONTRAST_TARGETS.syntaxToken).toBeGreaterThanOrEqual(4.5);
    expect(PALETTE_CONTRAST_TARGETS.syntaxComment).toBe(2.5);
  });

  it("renders README gallery with PNG previews in a responsive flex layout", async () => {
    const palettes = await loadPalettes();
    const gallery = renderReadmePreviewGallery(palettes);

    expect(PREVIEW_README_EXT).toBe("png");
    expect(gallery).toContain(
      `<img src="docs/previews/ether-aurora.${PREVIEW_README_EXT}"`,
    );
    expect(gallery).toContain("max-width:420px");
    expect(gallery).toContain("display:flex");
    expect(gallery).toContain("flex-wrap:wrap");
    expect(gallery).toContain("text-align:left");
    expect(gallery).toContain("margin:0 0 10px");
    expect(gallery).toContain("margin:0 0 64px");
    expect(gallery).toMatch(/<strong>Ether Aurora<\/strong>[\s\S]*docs\/previews\/ether-aurora\.png/);
    expect(gallery).not.toContain("<table>");
    expect(gallery).not.toContain("data:image");
    expect(gallery).not.toContain("gallery-row");
  });

  it("writes high-DPI PNG previews for README gallery", () => {
    const dir = mkdtempSync(join(tmpdir(), "ether-previews-"));
    const { pngPath } = writePreviewAssets(etherGraphite, dir);

    expect(pngPath).toMatch(/ether-graphite\.png$/);
    expect(existsSync(pngPath)).toBe(true);
    const png = renderSvgToPng(renderThemePreviewSvg(etherGraphite));
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(PNG_RENDER_WIDTH).toBe(2100);
  });

  it("renders SVG previews with palette surfaces and syntax colors", async () => {
    const palettes = await loadPalettes();
    const aurora = palettes.find((item) => item.id === "ether-aurora");
    expect(aurora).toBeDefined();

    const svg = renderThemePreviewSvg(aurora);
    expect(svg).toContain('<?xml version="1.0"');
    expect(svg).toContain(aurora.ui.surfaceEditor);
    expect(svg).toContain(aurora.syntax.keyword);
    expect(svg).toContain(`aria-label="${aurora.label} theme preview"`);
    expect(svg).toContain("<tspan");
    expect(svg).toContain("normalizeId");
    expect(svg).toContain("syncRecords");
    expect(svg).toContain("store");
    expect(svg).toContain("<circle");
    expect(svg).not.toContain("syntaxGlow");
    expect(svg).toContain('class="title"');

    for (const palette of palettes) {
      expect(THEME_CHARACTER[palette.id]).toBeTruthy();
    }
  });

  it("keeps editor and sidebar independent when palette defines them separately", () => {
    const graphite = composeTheme(etherGraphite);
    expect(graphite.colors["sideBar.background"].toLowerCase()).toBe("#161618");
    expect(graphite.colors["editor.background"].toLowerCase()).toBe("#1c1c1e");
    expect(graphite.colors["inlineChat.background"].toLowerCase()).toBe("#1c1c1e");
    expect(graphite.colors["inlineChatInput.background"].toLowerCase()).toBe("#1c1c1e");
    expect(graphite.colors["input.border"].toLowerCase()).toBe("#0e0e1035");

    const storm = composeTheme(etherStorm);
    expect(storm.colors["sideBar.background"].toLowerCase()).toBe("#181c22");
    expect(storm.colors["editor.background"].toLowerCase()).toBe("#1c2028");
  });
});
