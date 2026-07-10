import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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

type LightboxContextValue = {
  lightbox: LightboxState;
  openLightbox: (payload: { src: string; label: string }) => void;
  closeLightbox: () => void;
};

type ChromeContextValue = {
  themeMenuOpen: boolean;
  setThemeMenuOpen: (open: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const LightboxContext = createContext<LightboxContextValue | null>(null);
const ChromeContext = createContext<ChromeContextValue | null>(null);

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

  const lightboxValue = useMemo<LightboxContextValue>(
    () => ({
      lightbox,
      openLightbox,
      closeLightbox,
    }),
    [lightbox, openLightbox, closeLightbox],
  );

  const chromeValue = useMemo<ChromeContextValue>(
    () => ({
      themeMenuOpen,
      setThemeMenuOpen,
      mobileNavOpen,
      setMobileNavOpen,
    }),
    [themeMenuOpen, mobileNavOpen, setMobileNavOpen],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <LightboxContext.Provider value={lightboxValue}>
        <ChromeContext.Provider value={chromeValue}>
          {children}
        </ChromeContext.Provider>
      </LightboxContext.Provider>
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

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within SiteProvider");
  }
  return context;
}

/** Topbar / theme-menu chrome — does not include lightbox. */
export function useChrome() {
  const context = useContext(ChromeContext);
  if (!context) {
    throw new Error("useChrome must be used within SiteProvider");
  }
  return context;
}

/** @deprecated Prefer useChrome or useLightbox */
export function useSiteUi() {
  const lightbox = useLightbox();
  const chrome = useChrome();
  return { ...lightbox, ...chrome };
}
