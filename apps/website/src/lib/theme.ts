import { SITE_DATA } from "@/generated/site-data";

const STORAGE_KEY = "ether-site-theme";

export type ThemePayload = {
  label: string;
  accent: string;
  color: string;
  vars: Record<string, string>;
};

const themeCache = new Map<string, ThemePayload>(
  Object.entries(SITE_DATA.themes as Record<string, ThemePayload>),
);

function applyThemeVars(themeId: string, theme: ThemePayload) {
  const root = document.documentElement;
  root.classList.add("ether-theme-switching");
  root.setAttribute("data-ether-theme", themeId);
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, String(value));
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme.color);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove("ether-theme-switching");
    });
  });
}

export function paintTheme(themeId: string, theme?: ThemePayload) {
  const resolved = theme ?? themeCache.get(themeId);
  if (!resolved) return;
  themeCache.set(themeId, resolved);
  applyThemeVars(themeId, resolved);
}

export function getThemePayload(themeId: string): ThemePayload | undefined {
  return themeCache.get(themeId);
}

export function applyThemeById(themeId: string) {
  const theme = getThemePayload(themeId);
  if (!theme) return undefined;
  paintTheme(themeId, theme);
  return theme;
}

export function loadSavedThemeId() {
  try {
    return localStorage.getItem(STORAGE_KEY) || SITE_DATA.defaultThemeId;
  } catch {
    return SITE_DATA.defaultThemeId;
  }
}

export function saveThemeId(themeId: string) {
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    /* storage unavailable */
  }
}

export function getThemeList() {
  return SITE_DATA.palettes.map((palette) => ({
    id: palette.id,
    label: palette.label,
    accent: palette.accent,
    color: palette.shell,
  }));
}

export function bootstrapTheme() {
  applyThemeById(loadSavedThemeId());
}
