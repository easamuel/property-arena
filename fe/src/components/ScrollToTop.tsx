import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reset scroll on every client-side navigation.
 * Without this, SPA routes keep the previous page's scroll (often the footer).
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = id ? document.getElementById(id) : null;
      if (el) {
        el.scrollIntoView();
        return;
      }
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Also reset layout scroll panes (UserLayout / AdminLayout mains)
    document.querySelectorAll('main').forEach((node) => {
      (node as HTMLElement).scrollTop = 0;
    });
  }, [pathname, search, hash]);

  return null;
}
