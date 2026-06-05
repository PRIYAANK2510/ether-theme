import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { SITE_DATA } from "@/generated/site-data";
import { loadSavedThemeId, paintTheme, saveThemeId } from "@/lib/theme";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    activeId: loadSavedThemeId(),
    defaultId: SITE_DATA.defaultThemeId,
  },
  reducers: {
    setTheme(state, action: PayloadAction<string>) {
      state.activeId = action.payload;
      paintTheme(action.payload);
      saveThemeId(action.payload);
    },
    hydrateTheme(state) {
      paintTheme(state.activeId);
    },
  },
});

export const { setTheme, hydrateTheme } = themeSlice.actions;
