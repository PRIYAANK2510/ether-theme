import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SITE_BASE } from "@/lib/config";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { SnippetLanguagePage } from "@/pages/SnippetLanguagePage";
import { SnippetsIndexPage } from "@/pages/SnippetsIndexPage";
import { ThemesPage } from "@/pages/ThemesPage";

export function App() {
  return (
    <BrowserRouter basename={SITE_BASE}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="themes" element={<ThemesPage />} />
          <Route path="snippets" element={<SnippetsIndexPage />} />
          <Route path="snippets/:slug" element={<SnippetLanguagePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
