import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SITE_DATA } from "@/generated/site-data";
import {
  applyThemeById,
  loadSavedThemeId,
  saveThemeId,
} from "@/lib/theme";

type LightboxState = {
  src: string;
  label: string;
} | null;

type ThemeContextValue = {
  activeThemeId: string;
  setActiveTheme: (themeId: string) => void;
};

type SiteUiContextValue = {
  lightbox: LightboxState;
  openLightbox: (payload: { src: string; label: string }) => void;
  closeLightbox: () => void;
  themeMenuOpen: boolean;
  setThemeMenuOpen: (open: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const SiteUiContext = createContext<SiteUiContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [activeThemeId, setActiveThemeId] = useState(loadSavedThemeId);
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpenState] = useState(false);

  const setActiveTheme = useCallback((themeId: string) => {
    applyThemeById(themeId);
    saveThemeId(themeId);
    setActiveThemeId(themeId);
  }, []);

  const openLightbox = useCallback(
    (payload: { src: string; label: string }) => {
      setLightbox(payload);
    },
    [],
  );

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const setMobileNavOpen = useCallback((open: boolean) => {
    setMobileNavOpenState(open);
    if (open) setThemeMenuOpen(false);
  }, []);

  const themeValue = useMemo<ThemeContextValue>(
    () => ({
      activeThemeId,
      setActiveTheme,
    }),
    [activeThemeId, setActiveTheme],
  );

  const uiValue = useMemo<SiteUiContextValue>(
    () => ({
      lightbox,
      openLightbox,
      closeLightbox,
      themeMenuOpen,
      setThemeMenuOpen,
      mobileNavOpen,
      setMobileNavOpen,
    }),
    [
      lightbox,
      openLightbox,
      closeLightbox,
      themeMenuOpen,
      mobileNavOpen,
      setMobileNavOpen,
    ],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <SiteUiContext.Provider value={uiValue}>{children}</SiteUiContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within SiteProvider");
  }
  return context;
}

export function useSiteUi() {
  const context = useContext(SiteUiContext);
  if (!context) {
    throw new Error("useSiteUi must be used within SiteProvider");
  }
  return context;
}

export function useDefaultThemeId() {
  return SITE_DATA.defaultThemeId;
}
