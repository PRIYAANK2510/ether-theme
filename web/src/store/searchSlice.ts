import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    snippetQuery: "",
    themeQuery: "",
  },
  reducers: {
    setSnippetQuery(state, action: PayloadAction<string>) {
      state.snippetQuery = action.payload;
    },
    setThemeQuery(state, action: PayloadAction<string>) {
      state.themeQuery = action.payload;
    },
  },
});

export const { setSnippetQuery, setThemeQuery } = searchSlice.actions;
