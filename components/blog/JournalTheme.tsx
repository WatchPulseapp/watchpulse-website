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

/** The same choice the pre-paint script makes: stored preference, else the OS. */
function resolveTheme(): Theme {
  try {
    const stored = localStorage.getItem(JOURNAL_THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function JournalThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const root = document.documentElement;
    let current = root.getAttribute('data-journal');

    // Normally the pre-paint script has already resolved this. It cannot on a
    // surface React renders entirely on the client — the not-found boundary,
    // where the script arrives as markup rather than as HTML the browser
    // parsed, and so never executes. Resolving it here as well costs one
    // repaint on those surfaces and keeps the reader's theme everywhere.
    if (current !== 'light' && current !== 'dark') {
      current = resolveTheme();
      root.setAttribute('data-journal', current);
    }

    setTheme(current === 'light' ? 'light' : 'dark');

    return () => {
      root.removeAttribute('data-journal');
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

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {/* The script lives here rather than in a route layout because a layout
          can be forgotten: the Turkish routes were added without one, so that
          whole edition ignored the stored theme, and the not-found boundary
          missed it even where the layout existed. Rendering it from the
          provider means any surface that can show a theme also resolves one.
          It runs at parse time, before the markup below it is styled. */}
      <script dangerouslySetInnerHTML={{ __html: journalThemeScript }} />
      {children}
    </ThemeContext.Provider>
  );
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
