'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';

export interface BlogListItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  coverImage?: string;
}

const POSTS_PER_PAGE = 12;

/**
 * The Journal index.
 *
 * Search and filters share one rail rather than stacking into two full-width
 * bands — on an index page the controls are a tool, not a section, and giving
 * them their own headline-sized real estate pushes the actual stories below the
 * fold.
 */
export default function BlogList({ posts }: { posts: BlogListItem[] }) {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  );

  const isBrowsing = !query && category === 'All';
  const lead = isBrowsing ? posts[0] : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.slice(isBrowsing ? 1 : 0).filter((post) => {
      const inCategory = category === 'All' || post.category === category;
      if (!q) return inCategory;
      return (
        inCategory &&
        (post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.category.toLowerCase().includes(q))
      );
    });
  }, [posts, query, category, isBrowsing]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const visible = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const reset = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const goToPage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const out: (number | 'gap')[] = [1];
    if (page > 3) out.push('gap');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) out.push(i);
    if (page < totalPages - 2) out.push('gap');
    out.push(totalPages);
    return out;
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 md:px-8">
      {/* Controls rail */}
      <div
        className="flex flex-col gap-4 border-y py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
        style={{ borderColor: 'var(--rule)' }}
      >
        <div
          className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0"
          style={{ scrollbarWidth: 'none' }}
          role="tablist"
          aria-label="Filter by category"
        >
          {categories.map((name) => {
            const active = category === name;
            return (
              <button
                key={name}
                role="tab"
                aria-selected={active}
                onClick={() => reset(() => setCategory(name))}
                className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors"
                style={
                  active
                    ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
                    : { color: 'var(--ink-soft)' }
                }
              >
                {name}
              </button>
            );
          })}
        </div>

        <div className="relative shrink-0 lg:w-72">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--ink-faint)' }}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => reset(() => setQuery(e.target.value))}
            placeholder="Search articles"
            aria-label="Search articles"
            className="w-full rounded-full border py-2 pl-10 pr-9 text-[14px] outline-none transition-colors"
            style={{
              borderColor: 'var(--rule)',
              background: 'var(--card)',
              color: 'var(--ink)',
            }}
          />
          {query && (
            <button
              onClick={() => reset(() => setQuery(''))}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--ink-faint)' }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {(query || category !== 'All') && (
        <p className="journal-meta mt-4">
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          {category !== 'All' && ` in ${category}`}
          {query && ` matching “${query}”`}
        </p>
      )}

      {lead && (
        <div className="mt-8">
          <BlogCard {...lead} featured />
        </div>
      )}

      {visible.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      ) : (
        !lead && (
          <div className="py-24 text-center">
            <p className="journal-headline text-[1.25rem]">Nothing here yet</p>
            <p className="journal-meta mt-2">
              Try a different category, or clear the search to see everything.
            </p>
          </div>
        )
      )}

      {totalPages > 1 && (
        <nav className="mt-14 flex items-center justify-center gap-1" aria-label="Pagination">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className="grid h-9 w-9 place-items-center rounded-full transition-colors disabled:opacity-30"
            style={{ color: 'var(--ink-soft)' }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pageNumbers().map((n, i) =>
            n === 'gap' ? (
              <span key={`gap-${i}`} className="journal-meta px-1">
                …
              </span>
            ) : (
              <button
                key={n}
                onClick={() => goToPage(n)}
                aria-current={page === n ? 'page' : undefined}
                className="h-9 min-w-9 rounded-full px-3 text-[13px] font-medium tabular-nums transition-colors"
                style={
                  page === n
                    ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
                    : { color: 'var(--ink-soft)' }
                }
              >
                {n}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
            className="grid h-9 w-9 place-items-center rounded-full transition-colors disabled:opacity-30"
            style={{ color: 'var(--ink-soft)' }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
