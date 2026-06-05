import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { hydrateTheme } from "@/store/themeSlice";
import { Footer } from "./Footer";
import { Lightbox } from "./Lightbox";
import { Topbar } from "./Topbar";

export function Layout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateTheme());
  }, [dispatch]);

  return (
    <>
      <Topbar />
      <main className="container">
        <Outlet />
        <Footer />
      </main>
      <Lightbox />
    </>
  );
}
