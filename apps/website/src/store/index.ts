import { configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./themeSlice";
import { searchSlice } from "./searchSlice";
import { uiSlice } from "./uiSlice";

export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    search: searchSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
