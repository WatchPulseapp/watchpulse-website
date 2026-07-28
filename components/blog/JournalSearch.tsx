'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

/**
 * Title search across the whole archive.
 *
 * Now that the grid is server-rendered per page, search cannot filter it in
 * place without contradicting the URL, so it works as an overlay: it holds a
 * title-only index of every post and shows matches as links. Titles alone keep
 * the payload small enough to ship on every index page.
 */
export default function JournalSearch({
  index,
}: {
  index: Array<{ slug: string; title: string; category: string }>;
}) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return index
      .filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, index]);

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
        placeholder="Search articles"
        aria-label="Search articles"
        className="w-full rounded-full border py-2 pl-10 pr-9 text-[14px] outline-none transition-colors"
        style={{ borderColor: 'var(--rule)', background: 'var(--card)', color: 'var(--ink)' }}
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          aria-label="Clear search"
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
          {results.length === 0 ? (
            <p className="journal-meta px-4 py-3">No articles match “{query.trim()}”.</p>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
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
