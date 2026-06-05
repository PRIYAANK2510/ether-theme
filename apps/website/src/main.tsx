import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { bootstrapTheme } from "@/lib/theme";
import { store } from "@/store";
import { App } from "./App";
import "@/styles/global.scss";

void bootstrapTheme().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  );
});
