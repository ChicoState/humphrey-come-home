/**
 * Layout — page shell wrapping Header + <Outlet> + Footer.
 * Always renders immediately. Loading is handled inline by each component.
 */
import { Suspense } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import Spinner from "@/components/ui/Spinner";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Suspense fallback={<div className={styles.loading}><Spinner size="lg" /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
