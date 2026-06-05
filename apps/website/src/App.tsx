import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SITE_BASE } from "@/lib/config";
import { Layout } from "@/components/Layout";

const HomePage = lazy(() =>
  import("@/pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const ThemesPage = lazy(() =>
  import("@/pages/ThemesPage").then((module) => ({
    default: module.ThemesPage,
  })),
);
const SnippetsPage = lazy(() =>
  import("@/pages/SnippetsPage").then((module) => ({
    default: module.SnippetsPage,
  })),
);

export function App() {
  return (
    <BrowserRouter basename={SITE_BASE}>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="themes" element={<ThemesPage />} />
            <Route path="snippets/:slug?" element={<SnippetsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
