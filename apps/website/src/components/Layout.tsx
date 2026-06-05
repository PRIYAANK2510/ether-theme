import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { hydrateTheme } from "@/store/themeSlice";
import { Footer } from "./Footer";
import { Lightbox } from "./Lightbox";
import { Topbar } from "./Topbar";
import styles from "./Layout.module.scss";

export function Layout() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(hydrateTheme());
  }, [dispatch]);

  return (
    <>
      <Topbar />
      <main className={styles.container}>
        <div key={location.pathname} className={styles.page}>
          <Outlet />
        </div>
        <Footer />
      </main>
      <Lightbox />
    </>
  );
}
