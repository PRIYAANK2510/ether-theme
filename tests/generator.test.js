import { describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  darken,
  lighten,
  mixColors,
  withAlpha,
  withAlphaByte,
  colorAlphaByte,
  validatePaletteContrast,
  PALETTE_CONTRAST_TARGETS,
} from "../src/utils/color.js";
import etherGraphite from "../src/palettes/ether-graphite.js";
import etherStorm from "../src/palettes/ether-storm.js";
import {
  composeTheme,
  loadPalettes,
  removeOrphanedThemeFiles,
} from "../src/generator/index.js";
import { EXTENSION_WORKBENCH_COLOR_IDS } from "../src/workbench/extension-catalog.js";
import { CORE_WORKBENCH_COLOR_IDS } from "../src/workbench/core-catalog.js";
import { WORKBENCH_COLOR_IDS, EXPECTED_SYNTAX_RULE_COUNT } from "../src/workbench/constants.js";
import { SYNTAX_RULE_COUNT } from "../src/syntax/rules.js";
import { DEPRECATED_THEME_COLOR_IDS } from "../src/utils/color.js";

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
    expect(theme.colors["agentsChatInput.background"].toLowerCase()).toBe(
      composerPane.toLowerCase(),
    );
    expect(theme.colors["input.background"].toLowerCase()).toBe(composerPane.toLowerCase());
    expect(theme.colors["agentSessionsList.background"].toLowerCase()).toBe(
      composerPane.toLowerCase(),
    );
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
    expect(theme.colors["button.secondaryHoverForeground"].toLowerCase()).toBe(
      palette.ui.fgPrimary.toLowerCase(),
    );
    expect(theme.colors["editorSuggestWidget.selectedForeground"].toLowerCase()).toBe(
      palette.ui.fgListFocus.toLowerCase(),
    );
    expect(theme.colors["activityBar.activeForeground"].toLowerCase()).toBe(
      palette.ui.fgPrimary.toLowerCase(),
    );
  });

  it("derives all extension workbench colors", () => {
    for (const key of EXTENSION_WORKBENCH_COLOR_IDS) {
      expect(theme.colors[key]).toMatch(/^#[0-9a-f]{3,8}$/i);
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
      expect(Object.keys(generated.colors)).toHaveLength(
        CORE_WORKBENCH_COLOR_IDS.length + EXTENSION_WORKBENCH_COLOR_IDS.length,
      );
    }
  });

  it("meets minimum contrast on critical palette token pairs", async () => {
    const palettes = await loadPalettes();

    for (const palette of palettes) {
      expect(() => validatePaletteContrast(palette)).not.toThrow();
    }

    expect(PALETTE_CONTRAST_TARGETS.fgPrimary).toBeGreaterThanOrEqual(7);
    expect(PALETTE_CONTRAST_TARGETS.syntaxToken).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps editor and sidebar independent when palette defines them separately", () => {
    const graphite = composeTheme(etherGraphite);
    expect(graphite.colors["sideBar.background"].toLowerCase()).toBe("#161618");
    expect(graphite.colors["editor.background"].toLowerCase()).toBe("#1c1c1e");
    expect(graphite.colors["inlineChat.background"].toLowerCase()).toBe("#1c1c1e");
    expect(graphite.colors["agentsChatInput.background"].toLowerCase()).toBe("#1c1c1e");
    expect(graphite.colors["input.border"].toLowerCase()).toBe("#0e0e1035");

    const storm = composeTheme(etherStorm);
    expect(storm.colors["sideBar.background"].toLowerCase()).toBe("#181c22");
    expect(storm.colors["editor.background"].toLowerCase()).toBe("#1c2028");
  });
});
