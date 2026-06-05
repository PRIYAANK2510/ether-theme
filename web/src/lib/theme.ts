import { SITE_DATA } from "@/generated/site-data";

const STORAGE_KEY = "ether-site-theme";

export function paintTheme(themeId: string) {
  const theme = SITE_DATA.themes[themeId as keyof typeof SITE_DATA.themes];
  if (!theme) return;

  const root = document.documentElement;
  root.setAttribute("data-ether-theme", themeId);
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme.color);
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
