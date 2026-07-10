import chroma from "chroma-js";
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
import etherGraphite from "../src/palettes/ether-graphite.js";
import etherStorm from "../src/palettes/ether-storm.js";
import { SYNTAX_RULE_COUNT } from "../src/syntax/rules.js";
import {
  colorAlphaByte,
  PALETTE_CONTRAST_TARGETS,
  validatePaletteContrast,
  withAlphaByte,
} from "../src/utils/color.js";
import { writeFileIfChanged } from "../src/utils/fs.js";
import {
  EXPECTED_SYNTAX_RULE_COUNT,
  WORKBENCH_COLOR_IDS,
} from "../src/workbench/constants.js";
import { CORE_WORKBENCH_COLOR_IDS } from "../src/workbench/core-catalog.js";
import { EXTENSION_WORKBENCH_COLOR_IDS } from "../src/workbench/extension-catalog.js";

describe("fs-utils", () => {
  it("skips writes when LF-normalized text is unchanged", () => {
    const dir = mkdtempSync(join(tmpdir(), "ether-fs-"));
    const filePath = join(dir, "sample.json");
    writeFileSync(filePath, '{\n  "a": 1\n}\n');

    expect(writeFileIfChanged(filePath, '{\n  "a": 1\n}\n')).toBe(false);
    expect(writeFileIfChanged(filePath, '{\r\n  "a": 1\r\n}\r\n')).toBe(false);
    expect(writeFileIfChanged(filePath, '{\n  "a": 2\n}\n')).toBe(true);
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

  it("derives distinct stylesheet syntax colors for CSS/SCSS rules", () => {
    const cssPropertyRule = theme.tokenColors.find(
      (rule) => rule.name === "CSS / SCSS Property Name",
    );
    const classRule = theme.tokenColors.find(
      (rule) => rule.name === "CSS Selector — Class",
    );
    const valueRule = theme.tokenColors.find(
      (rule) => rule.name === "CSS / SCSS Value Keyword",
    );
    const valuePropertyRule = theme.tokenColors.find(
      (rule) => rule.name === "CSS Value — Sub-Property Name",
    );
    const shorthandValueRule = theme.tokenColors.find(
      (rule) => rule.name === "CSS / SCSS Shorthand Value Identifier",
    );
    const tagCollisionRule = theme.tokenColors.find(
      (rule) => rule.name === "CSS Property — Tag Name Collision",
    );
    const nestedTagRule = theme.tokenColors.find(
      (rule) => rule.name === "CSS / SCSS Custom Tag Selector",
    );
    const objectPropertyRule = theme.tokenColors.find(
      (rule) => rule.name === "Object Property",
    );

    expect(cssPropertyRule).toBeDefined();
    expect(cssPropertyRule.scope).toContain("support.type.property-name.scss");
    expect(tagCollisionRule).toBeDefined();
    expect(tagCollisionRule.scope).toContain(
      "meta.property-list.scss entity.name.tag.css",
    );
    expect(nestedTagRule).toBeDefined();
    expect(nestedTagRule.scope).toContain("entity.name.tag.custom.css");
    expect(valuePropertyRule).toBeDefined();
    expect(valuePropertyRule.scope).toContain(
      "meta.property-value.scss invalid.deprecated.color.system.css",
    );
    expect(shorthandValueRule).toBeDefined();
    expect(shorthandValueRule.scope).toContain(
      "meta.property-list.scss meta.property-value.scss",
    );
    expect(objectPropertyRule.scope).not.toContain(
      "support.type.property-name",
    );

    const property = cssPropertyRule.settings.foreground;
    const selector = classRule.settings.foreground;
    const value = valueRule.settings.foreground;
    const valueProperty = valuePropertyRule.settings.foreground;
    const tagCollision = tagCollisionRule.settings.foreground;
    const nestedTag = nestedTagRule.settings.foreground;

    expect(property.toLowerCase()).not.toBe(selector.toLowerCase());
    expect(property.toLowerCase()).not.toBe(value.toLowerCase());
    expect(property.toLowerCase()).not.toBe(nestedTag.toLowerCase());
    expect(selector.toLowerCase()).not.toBe(value.toLowerCase());
    expect(tagCollision.toLowerCase()).toBe(property.toLowerCase());
    expect(valueProperty.toLowerCase()).not.toBe(value.toLowerCase());
  });

  it("keeps stylesheet hues separated across every palette", async () => {
    const palettes = await loadPalettes();

    for (const entry of palettes) {
      const composed = composeTheme(entry);
      const property = composed.tokenColors.find(
        (rule) => rule.name === "CSS / SCSS Property Name",
      );
      const selector = composed.tokenColors.find(
        (rule) => rule.name === "CSS Selector — Class",
      );
      const number = composed.tokenColors.find(
        (rule) => rule.name === "CSS / SCSS Numeric Value",
      );
      const keyword = composed.tokenColors.find(
        (rule) => rule.name === "CSS / SCSS Value Keyword",
      );

      const hues = [
        property.settings.foreground,
        selector.settings.foreground,
        number.settings.foreground,
        keyword.settings.foreground,
      ].map((hex) => chroma(hex).get("hsl.h"));

      for (let i = 0; i < hues.length; i += 1) {
        for (let j = i + 1; j < hues.length; j += 1) {
          const delta = Math.abs(((hues[i] - hues[j] + 540) % 360) - 180);
          expect(delta).toBeGreaterThanOrEqual(18);
        }
      }
    }
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

  it("uses modern workbench key mappings", () => {
    expect(theme.colors["button.foreground"].toLowerCase()).toBe(
      palette.ui.fgOnButton.toLowerCase(),
    );
    expect(
      theme.colors["extensionButton.prominentForeground"].toLowerCase(),
    ).toBe(palette.ui.fgOnButton.toLowerCase());
    expect(theme.colors["activityBar.dropBorder"]).toBe(
      theme.colors["list.dropBackground"],
    );
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
    expect(theme.colors).not.toHaveProperty("chat.requestBackground");
    expect(theme.colors).not.toHaveProperty("chat.requestBorder");
    expect(theme.colors).not.toHaveProperty("inlineChat.background");
    expect(theme.colors).not.toHaveProperty("inlineChatInput.background");
    expect(theme.colors).not.toHaveProperty("chat.requestBubbleBackground");
    expect(theme.colors).not.toHaveProperty(
      "chat.requestBubbleHoverBackground",
    );
    expect(theme.colors).not.toHaveProperty("chat.requestCodeBorder");
    expect(
      colorAlphaByte(theme.colors["editor.hoverHighlightBackground"]),
    ).toBeLessThan(0xff);
    expect(
      colorAlphaByte(theme.colors["merge.currentHeaderBackground"]),
    ).toBeLessThan(0xff);
    expect(theme.colors).toHaveProperty("editorIndentGuide.background1");
    expect(theme.colors).not.toHaveProperty("editorIndentGuide.background");
  });

  it("maps palette surfaces to sidebar, editor, and composer input", () => {
    const composerPane = palette.ui.surfaceEditor;

    expect(theme.colors["sideBar.background"].toLowerCase()).toBe(
      palette.ui.surfacePanel.toLowerCase(),
    );
    expect(theme.colors["editor.background"].toLowerCase()).toBe(
      composerPane.toLowerCase(),
    );
    expect(theme.colors["input.background"].toLowerCase()).toBe(
      composerPane.toLowerCase(),
    );
    expect(theme.colors).not.toHaveProperty("agentsChatInput.background");
    expect(theme.colors).not.toHaveProperty("agentSessionsList.background");
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
    expect(theme.colors["list.activeSelectionBackground"].toLowerCase()).toBe(
      listFocus,
    );
    expect(theme.colors["statusBarItem.hoverForeground"].toLowerCase()).toBe(
      palette.ui.fgPrimary.toLowerCase(),
    );
    expect(theme.colors["button.secondaryForeground"].toLowerCase()).toBe(
      palette.ui.fgPrimary.toLowerCase(),
    );
    expect(theme.colors).not.toHaveProperty("button.secondaryHoverForeground");
    expect(
      theme.colors["editorSuggestWidget.selectedForeground"].toLowerCase(),
    ).toBe(palette.ui.fgListFocus.toLowerCase());
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
      expect(theme.colors["breadcrumb.background"].toLowerCase()).toBe(
        editorBg,
      );
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
      `<img src="docs/previews/ether-abyss.${PREVIEW_README_EXT}"`,
    );
    expect(gallery).toContain("max-width:420px");
    expect(gallery).toContain("display:flex");
    expect(gallery).toContain("flex-wrap:wrap");
    expect(gallery).toContain("text-align:left");
    expect(gallery).toContain("margin:0 0 10px");
    expect(gallery).toContain("margin:0 0 64px");
    expect(gallery).toMatch(
      /<strong>Ether Abyss<\/strong>[\s\S]*docs\/previews\/ether-abyss\.png/,
    );
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
    const abyss = palettes.find((item) => item.id === "ether-abyss");
    expect(abyss).toBeDefined();

    const svg = renderThemePreviewSvg(abyss);
    expect(svg).toContain('<?xml version="1.0"');
    expect(svg).toContain(abyss.ui.surfaceEditor);
    expect(svg).toContain(abyss.syntax.keyword);
    expect(svg).toContain(`aria-label="${abyss.label} theme preview"`);
    expect(svg).toContain("<tspan");
    expect(svg).toContain("normalizeId");
    expect(svg).toContain("syncRecords");
    expect(svg).toContain("store");
    expect(svg).toContain("<circle");
    expect(svg).not.toContain("syntaxGlow");
    expect(svg).toContain('class="title"');
  });

  it("keeps editor and sidebar independent when palette defines them separately", () => {
    const graphite = composeTheme(etherGraphite);
    expect(graphite.colors["sideBar.background"].toLowerCase()).toBe("#161618");
    expect(graphite.colors["editor.background"].toLowerCase()).toBe("#1c1c1e");
    expect(graphite.colors["input.background"].toLowerCase()).toBe("#1c1c1e");
    expect(graphite.colors["input.border"].toLowerCase()).toBe("#0e0e1035");

    const storm = composeTheme(etherStorm);
    expect(storm.colors["sideBar.background"].toLowerCase()).toBe("#0e1a28");
    expect(storm.colors["editor.background"].toLowerCase()).toBe("#162438");
  });
});
