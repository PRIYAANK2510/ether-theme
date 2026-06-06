import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LightboxState = {
  open: boolean;
  src: string;
  label: string;
} | null;

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    lightbox: null as LightboxState,
    themeMenuOpen: false,
    mobileNavOpen: false,
  },
  reducers: {
    openLightbox(state, action: PayloadAction<{ src: string; label: string }>) {
      state.lightbox = { open: true, ...action.payload };
    },
    closeLightbox(state) {
      state.lightbox = null;
    },
    setThemeMenuOpen(state, action: PayloadAction<boolean>) {
      state.themeMenuOpen = action.payload;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
      if (action.payload) state.themeMenuOpen = false;
    },
  },
});

export const { openLightbox, closeLightbox, setThemeMenuOpen, setMobileNavOpen } =
  uiSlice.actions;
