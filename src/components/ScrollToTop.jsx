/**
 * ScrollToTop — scrolls the window to the top on every route change.
 * Renders nothing; place once inside <BrowserRouter>.
 */
import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
