'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
}

/**
 * Contents list.
 *
 * Open by default on wide screens where it costs nothing, collapsed on phones
 * where it would otherwise push the first paragraph off the screen. The numbers
 * stay because an article's sections genuinely are a sequence — the reader uses
 * them to judge how far in a section sits.
 */
export default function TableOfContents({ items }: { items: TOCItem[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    setOpen(window.matchMedia('(min-width: 768px)').matches);
  }, []);

  // Tracks which section the reader is in, so the list doubles as a position
  // indicator rather than a static index.
  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-88px 0px -70% 0px' }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav
      className="rounded-xl border px-5 py-4"
      style={{ borderColor: 'var(--rule)', background: 'var(--paper-sunken)' }}
      aria-label="Table of contents"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 text-left"
      >
        <span className="journal-eyebrow" style={{ color: 'var(--ink-soft)' }}>
          Contents
        </span>
        <span className="journal-meta text-[12px]" style={{ color: 'var(--ink-faint)' }}>
          {items.length} sections
        </span>
        <ChevronDown
          className={`ml-auto h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--ink-faint)' }}
        />
      </button>

      {open && (
        <ol className="mt-4 flex flex-col gap-0.5">
          {items.map((item, i) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => jumpTo(item.id)}
                  className="flex w-full items-baseline gap-3 rounded-md py-1.5 text-left transition-colors"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--ink-soft)' }}
                >
                  <span
                    className="shrink-0 text-[11px] tabular-nums"
                    style={{ color: isActive ? 'var(--accent)' : 'var(--ink-faint)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[14.5px] leading-snug">{item.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
