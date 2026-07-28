import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { staticBlogPosts } from '@/data/static-blogs';
import { localePrefix, categorySlug, type Locale } from '@/lib/blog-locale';

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
 * Posts written before the Turkish edition existed carry no `lang` field, and
 * they are all English — so the English filter has to accept a missing value
 * or the archive would vanish from its own index.
 */
function langFilter(locale: Locale): Record<string, unknown> {
  return locale === 'tr' ? { lang: 'tr' } : { lang: { $ne: 'tr' } };
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
  const query: Record<string, unknown> = { isPublished: true, ...langFilter(locale) };
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
          title: b.title?.en || b.title?.tr || '',
          excerpt: b.excerpt?.en || b.excerpt?.tr || '',
          category: b.category || 'General',
          date: b.date || '',
          readTime: b.readTime || '5 min read',
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
      { $match: { isPublished: true, ...langFilter(locale) } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    for (const g of grouped as Array<{ _id: string; count: number }>) {
      if (g._id) counts.set(g._id, g.count);
    }
  } catch (error) {
    console.error('Category aggregation failed, using static categories:', error);
  }

  for (const p of staticFor(locale)) counts.set(p.category, (counts.get(p.category) || 0) + 1);

  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: categorySlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Full archive. Only for surfaces that genuinely need every post, like the sitemap. */
export async function getAllPosts(locale?: Locale): Promise<BlogListItem[]> {
  const items: BlogListItem[] = [];
  const seen = new Set<string>();

  try {
    await connectDB();
    const dbBlogs = await Blog.find({ isPublished: true, ...(locale ? langFilter(locale) : {}) })
      .select('slug title excerpt date readTime category coverImage')
      .sort({ createdAt: -1 })
      .lean();

    for (const b of dbBlogs as Array<Record<string, any>>) {
      if (!b.slug || seen.has(b.slug)) continue;
      seen.add(b.slug);
      items.push({
        slug: b.slug,
        title: b.title?.en || b.title?.tr || '',
        excerpt: b.excerpt?.en || b.excerpt?.tr || '',
        category: b.category || 'General',
        date: b.date || '',
        readTime: b.readTime || '5 min read',
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
  name: string;
  slug: string;
  count: number;
}


