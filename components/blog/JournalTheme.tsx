'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * Theme control for the Journal.
 *
 * The rest of the site is dark-only, so the attribute is written to <html> on
 * mount and removed on unmount — a reader who leaves the blog for the marketing
 * pages takes no light-mode tokens with them.
 */

export const JOURNAL_THEME_KEY = 'wp-journal-theme';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'dark',
  toggle: () => {},
});

/**
 * Runs before first paint so the correct ground is painted once rather than
 * flashing dark and correcting. Kept as a string because it has to be inlined
 * into the document head, ahead of React.
 */
export const journalThemeScript = `(function(){try{
var s=localStorage.getItem('${JOURNAL_THEME_KEY}');
var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
document.documentElement.setAttribute('data-journal',t);
}catch(e){document.documentElement.setAttribute('data-journal','dark');}})();`;

export function JournalThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-journal');
    setTheme(current === 'light' ? 'light' : 'dark');

    return () => {
      document.documentElement.removeAttribute('data-journal');
    };
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      // Colour transitions that are still running when the tokens change latch
      // onto the old value and never repaint, so they are suppressed across the
      // swap and released on the next frame.
      root.setAttribute('data-journal-switching', '');
      root.setAttribute('data-journal', next);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => root.removeAttribute('data-journal-switching'));
      });

      try {
        localStorage.setItem(JOURNAL_THEME_KEY, next);
      } catch {
        // Private browsing can refuse writes; the theme still applies for this visit.
      }
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);

  // The server cannot know the reader's theme, so the icon is held back until
  // the client confirms it rather than rendering a sun that flips to a moon.
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`grid h-9 w-9 place-items-center rounded-full border transition-colors ${className}`}
      style={{ borderColor: 'var(--rule)', color: 'var(--ink-soft)' }}
    >
      {mounted ? (
        theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
