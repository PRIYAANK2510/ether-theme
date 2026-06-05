import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LightboxState = {
  open: boolean;
  src: string;
  label: string;
  character: string;
} | null;

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    lightbox: null as LightboxState,
    themeMenuOpen: false,
  },
  reducers: {
    openLightbox(
      state,
      action: PayloadAction<{ src: string; label: string; character: string }>,
    ) {
      state.lightbox = { open: true, ...action.payload };
    },
    closeLightbox(state) {
      state.lightbox = null;
    },
    setThemeMenuOpen(state, action: PayloadAction<boolean>) {
      state.themeMenuOpen = action.payload;
    },
  },
});

export const { openLightbox, closeLightbox, setThemeMenuOpen } = uiSlice.actions;
