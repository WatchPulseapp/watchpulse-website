import Link from 'next/link';
import type { ReactNode } from 'react';
import { localePrefix, type Locale } from '@/lib/blog-locale';

/**
 * Links the film, series and people an article names to the site's own pages
 * for them.
 *
 * The site renders /movie/[id], /tv/[id] and /person/[id] from the same TMDB
 * data the articles are written from, but nothing pointed at those pages: they
 * were reachable only from links shared out of the app, so a crawler arriving
 * at the Journal had no way through to them and they earned no internal link
 * equity at all. Every generated article already knows exactly which records it
 * is grounded in — the ids ride along on the document as sourceRefs — so the
 * connection is a lookup rather than a guess.
 *
 * Deliberately restrained. A body where every title is blue reads as an affiliate
 * page, so each record is linked once per article, on its first mention, and the
 * whole article is capped. Headings are left alone: they carry the anchor ids the
 * table of contents scrolls to, and a link inside one competes with that.
 */

export interface TitleRef {
  id: number;
  type: 'movie' | 'tv' | 'person';
  name: string;
}

/** At most this many links per article, however many titles it names. */
const MAX_LINKS = 8;

/**
 * Names shorter than this are skipped. Short titles ("Up", "It", "Her") are
 * ordinary words far more often than they are the film, and linking the word
 * "up" in the middle of a sentence is worse than not linking at all.
 */
const MIN_NAME_LENGTH = 5;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hrefFor(ref: TitleRef, locale: Locale): string {
  return `${localePrefix(locale)}/${ref.type}/${ref.id}`;
}

export interface TitleLinker {
  /** Returns the text with first mentions linked, or the text unchanged. */
  (text: string): ReactNode;
}

/**
 * Builds a linker for one article. Stateful by design — it remembers what it has
 * already linked, so the caller can hand it one block at a time and still get
 * one link per record across the whole piece.
 */
export function createTitleLinker(
  refs: TitleRef[] | undefined,
  locale: Locale = 'en'
): TitleLinker | null {
  if (!refs?.length) return null;

  const byName = new Map<string, TitleRef>();
  for (const ref of refs) {
    const name = (ref.name || '').trim();
    if (name.length < MIN_NAME_LENGTH) continue;
    const key = name.toLowerCase();
    // A name that appears twice in one brief (a person and their self-titled
    // documentary, say) keeps the first record rather than flip-flopping.
    if (!byName.has(key)) byName.set(key, { ...ref, name });
  }
  if (byName.size === 0) return null;

  // Longest first, so "Fall 2: Deadpoint" is matched as itself rather than
  // having its first two characters claimed by a shorter title.
  const names = [...byName.values()]
    .map((r) => r.name)
    .sort((a, b) => b.length - a.length);

  // The boundaries are letter/digit classes rather than \b: \b sits happily
  // inside "Sinners'" and after an apostrophe in Turkish possessives
  // ("Sinners'ı"), which would slice a link through the middle of a word.
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${names.map(escapeRegExp).join('|')})(?![\\p{L}\\p{N}])`, 'giu');

  const linked = new Set<number>();

  return function link(text: string): ReactNode {
    if (linked.size >= MAX_LINKS || !text) return text;

    const parts: ReactNode[] = [];
    let cursor = 0;
    pattern.lastIndex = 0;

    for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
      const ref = byName.get(match[0].toLowerCase());
      if (!ref || linked.has(ref.id)) continue;
      if (linked.size >= MAX_LINKS) break;

      linked.add(ref.id);
      if (match.index > cursor) parts.push(text.slice(cursor, match.index));
      parts.push(
        <Link key={`${ref.type}-${ref.id}`} href={hrefFor(ref, locale)} className="journal-title-link">
          {match[0]}
        </Link>
      );
      cursor = match.index + match[0].length;
    }

    // Nothing matched — hand back the original string so React renders a plain
    // text node instead of a single-element array.
    if (parts.length === 0) return text;

    if (cursor < text.length) parts.push(text.slice(cursor));
    return parts;
  };
}
