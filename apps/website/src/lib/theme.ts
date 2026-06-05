import { SITE_BASE } from "@/lib/config";
import { SITE_DATA } from "@/generated/site-data";

const STORAGE_KEY = "ether-site-theme";

export type ThemePayload = {
  label: string;
  accent: string;
  color: string;
  vars: Record<string, string>;
};

const themeCache = new Map<string, ThemePayload>([
  [SITE_DATA.defaultThemeId, SITE_DATA.defaultTheme],
]);

function applyThemeVars(themeId: string, theme: ThemePayload) {
  const root = document.documentElement;
  root.setAttribute("data-ether-theme", themeId);
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, String(value));
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme.color);
}

export function paintTheme(themeId: string, theme?: ThemePayload) {
  const resolved = theme ?? themeCache.get(themeId);
  if (!resolved) return;
  themeCache.set(themeId, resolved);
  applyThemeVars(themeId, resolved);
}

export async function ensureThemeLoaded(themeId: string) {
  const cached = themeCache.get(themeId);
  if (cached) return cached;

  const response = await fetch(`${SITE_BASE}/data/themes/${themeId}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load theme "${themeId}"`);
  }

  const theme = (await response.json()) as ThemePayload;
  themeCache.set(themeId, theme);
  return theme;
}

export async function applyThemeById(themeId: string) {
  const theme = await ensureThemeLoaded(themeId);
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

export async function bootstrapTheme() {
  const themeId = loadSavedThemeId();
  await applyThemeById(themeId);
}
