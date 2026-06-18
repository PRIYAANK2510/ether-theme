import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { pageTransitionKey } from "@/lib/routing";
import { Footer } from "./Footer";
import { Lightbox } from "./Lightbox";
import { Topbar } from "./Topbar";
import styles from "./Layout.module.scss";

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pageTransitionKey(location.pathname)]);

  return (
    <>
      <Topbar />
      <main className={styles.container}>
        <div key={pageTransitionKey(location.pathname)} className={styles.page}>
          <Outlet />
        </div>
        <Footer />
      </main>
      <Lightbox />
    </>
  );
}
