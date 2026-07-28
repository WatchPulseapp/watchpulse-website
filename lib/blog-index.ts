import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { staticBlogPosts } from '@/data/static-blogs';
import { localePrefix, categorySlug, type Locale } from '@/lib/blog-locale';
import { strings } from '@/lib/blog-i18n';

export { localePrefix, categorySlug };
export type { Locale };

/**
 * Shared reader for the Journal index.
 *
 * The index, the paginated pages and the category pages all need the same list,
 * and all three need it to include the curated static posts alongside whatever
 * the generator has published. Keeping one implementation means a post can
 * never appear on one surface and be missing from another.
 */

export interface BlogListItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  coverImage?: string;
}

export const POSTS_PER_PAGE = 12;

/**
 * Curated static posts are English-only, so they join the English edition and
 * are absent from the Turkish one — which is correct, not a gap: the Turkish
 * edition is written in Turkish rather than translated.
 */
function staticFor(locale: Locale) {
  return locale === 'en' ? staticBlogPosts : [];
}

/**
 * Turns a stored post into what the edition displays.
 *
 * Every article exists once and is served by both editions, so this is where a
 * document becomes an English or a Turkish list entry: the language-specific
 * title and excerpt are selected, and the category and read time — written once
 * in English because one is a query key and the other a computed number — are
 * translated on the way out. Left alone they would put "Genre Guide · 5 min
 * read" under a Turkish headline, the one detail that gives a translation away.
 */
function display(locale: Locale) {
  const t = strings(locale);
  const pick = (field: { en?: string; tr?: string } | undefined): string =>
    (locale === 'tr' ? field?.tr || field?.en : field?.en || field?.tr) || '';

  return {
    title: pick,
    excerpt: pick,
    category: (name: string) => t.categoryLabel(name),
    readTime: (value: string) => t.readTime(value),
  };
}

/**
 * One page of posts, fetched with skip/limit rather than by loading the archive
 * and slicing it.
 *
 * The DB holds the generated posts newest-first and the curated static posts sit
 * after them, so the combined list is just those two runs concatenated — which
 * means a page can be resolved with a count and a bounded query instead of
 * pulling every document on every request. At five posts a day the difference is
 * a few kilobytes today and megabytes per request within the year.
 */
export async function getPostsPage(
  page: number,
  perPage = POSTS_PER_PAGE,
  category?: string,
  locale: Locale = 'en'
): Promise<{ items: BlogListItem[]; page: number; totalPages: number; total: number }> {
  const query: Record<string, unknown> = { isPublished: true };
  if (category) query.category = category;

  const base = staticFor(locale);
  const staticMatching = category ? base.filter((p) => p.category === category) : base;

  let dbCount = 0;
  try {
    await connectDB();
    dbCount = await Blog.countDocuments(query);
  } catch (error) {
    console.error('Blog count failed, serving static posts only:', error);
  }

  const total = dbCount + staticMatching.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * perPage;

  const items: BlogListItem[] = [];
  const seen = new Set<string>();
  const show = display(locale);

  // The window may start inside the DB run, inside the static run, or span both.
  if (start < dbCount) {
    try {
      const dbBlogs = await Blog.find(query)
        .select('slug title excerpt date readTime category coverImage')
        .sort({ createdAt: -1 })
        .skip(start)
        .limit(perPage)
        .lean();

      for (const b of dbBlogs as Array<Record<string, any>>) {
        if (!b.slug || seen.has(b.slug)) continue;
        seen.add(b.slug);
        items.push({
          slug: b.slug,
          title: show.title(b.title),
          excerpt: show.excerpt(b.excerpt),
          category: show.category(b.category || 'General'),
          date: b.date || '',
          readTime: show.readTime(b.readTime || '5 min read'),
          coverImage: b.coverImage,
        });
      }
    } catch (error) {
      console.error('Blog page fetch failed, falling back to static:', error);
    }
  }

  const staticStart = Math.max(0, start - dbCount);
  for (const p of staticMatching.slice(staticStart)) {
    if (items.length >= perPage) break;
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    items.push({
      slug: p.slug,
      title: p.title.en,
      excerpt: p.excerpt.en,
      category: p.category,
      date: p.date,
      readTime: p.readTime,
      coverImage: p.coverImage,
    });
  }

  return { items, page: safePage, totalPages, total };
}

/**
 * Distinct categories with their counts, read from the DB rather than derived
 * from a full document scan.
 */
export async function getCategories(locale: Locale = 'en'): Promise<CategoryInfo[]> {
  const counts = new Map<string, number>();

  try {
    await connectDB();
    const grouped = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    for (const g of grouped as Array<{ _id: string; count: number }>) {
      if (g._id) counts.set(g._id, g.count);
    }
  } catch (error) {
    console.error('Category aggregation failed, using static categories:', error);
  }

  for (const p of staticFor(locale)) counts.set(p.category, (counts.get(p.category) || 0) + 1);

  const t = strings(locale);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, label: t.categoryLabel(name), slug: categorySlug(name), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, locale));
}

/** Full archive. Only for surfaces that genuinely need every post, like the sitemap. */
export async function getAllPosts(locale?: Locale): Promise<BlogListItem[]> {
  const items: BlogListItem[] = [];
  const seen = new Set<string>();
  const show = display(locale || 'en');

  try {
    await connectDB();
    const dbBlogs = await Blog.find({ isPublished: true })
      .select('slug title excerpt date readTime category coverImage')
      .sort({ createdAt: -1 })
      .lean();

    for (const b of dbBlogs as Array<Record<string, any>>) {
      if (!b.slug || seen.has(b.slug)) continue;
      seen.add(b.slug);
      items.push({
        slug: b.slug,
        title: show.title(b.title),
        excerpt: show.excerpt(b.excerpt),
        category: show.category(b.category || 'General'),
        date: b.date || '',
        readTime: show.readTime(b.readTime || '5 min read'),
        coverImage: b.coverImage,
      });
    }
  } catch (error) {
    console.error('Blog list DB fetch failed, falling back to static:', error);
  }

  // Curated static posts, skipping any the DB already served.
  for (const p of locale === 'tr' ? [] : staticBlogPosts) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    items.push({
      slug: p.slug,
      title: p.title.en,
      excerpt: p.excerpt.en,
      category: p.category,
      date: p.date,
      readTime: p.readTime,
      coverImage: p.coverImage,
    });
  }

  return items;
}

export interface CategoryInfo {
  /** Canonical English name. The query value and the key for per-category copy. */
  name: string;
  /** What the reader sees, in this edition's language. */
  label: string;
  slug: string;
  count: number;
}


