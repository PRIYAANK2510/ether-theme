import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SiteProvider } from "@/context/SiteContext";
import { bootstrapTheme } from "@/lib/theme";
import { App } from "./App";
import "@/styles/global.scss";

bootstrapTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SiteProvider>
      <App />
    </SiteProvider>
  </StrictMode>,
);
