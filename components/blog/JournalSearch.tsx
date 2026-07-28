'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { strings } from '@/lib/blog-i18n';
import { localePrefix, type Locale } from '@/lib/blog-locale';

interface Result {
  slug: string;
  title: string;
  category: string;
}

/**
 * Title search across the whole archive.
 *
 * Queries the server rather than holding an index in the browser. The previous
 * version shipped every post's title inside the HTML of every index page, which
 * grows with the archive; this ships nothing and asks only when someone types.
 */
export default function JournalSearch({ locale = 'en' }: { locale?: Locale }) {
  const t = strings(locale);
  const prefix = localePrefix(locale);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  // Tracks the latest request so a slow earlier response cannot overwrite the
  // results of a later, more specific query.
  const latest = useRef(0);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const id = ++latest.current;
    setLoading(true);

    // Debounced so a typed word is one request, not one per keystroke.
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/blog-search?q=${encodeURIComponent(q)}&lang=${locale}`);
        const data = await res.json();
        if (id === latest.current) setResults(data.results || []);
      } catch {
        if (id === latest.current) setResults([]);
      } finally {
        if (id === latest.current) setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query, locale]);

  const open = query.trim().length >= 2;

  return (
    <div className="relative shrink-0 lg:w-72">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: 'var(--ink-faint)' }}
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchAria}
        className="w-full rounded-full border py-2 pl-10 pr-9 text-[14px] outline-none transition-colors"
        style={{ borderColor: 'var(--rule)', background: 'var(--card)', color: 'var(--ink)' }}
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          aria-label={t.clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--ink-faint)' }}
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {open && (
        <div
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border"
          style={{ borderColor: 'var(--rule)', background: 'var(--card)', boxShadow: 'var(--shadow-lift)' }}
        >
          {loading && results.length === 0 ? (
            <p className="journal-meta px-4 py-3">{t.searching}</p>
          ) : results.length === 0 ? (
            <p className="journal-meta px-4 py-3">{t.noMatch(query.trim())}</p>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`${prefix}/blog/${r.slug}`}
                    onClick={() => setQuery('')}
                    className="block border-b px-4 py-2.5 last:border-b-0"
                    style={{ borderColor: 'var(--rule)' }}
                  >
                    <span
                      className="block text-[14px] leading-snug"
                      style={{ color: 'var(--ink)', fontFamily: 'var(--font-serif), Georgia, serif' }}
                    >
                      {r.title}
                    </span>
                    <span className="journal-meta text-[12px]">{r.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
