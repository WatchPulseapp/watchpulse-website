import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { staticBlogPosts } from '@/data/static-blogs';

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

/** Category names become URL segments: "TV Shows" -> "tv-shows". */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getAllPosts(): Promise<BlogListItem[]> {
  const items: BlogListItem[] = [];
  const seen = new Set<string>();

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
  for (const p of staticBlogPosts) {
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

/** Categories that actually have posts, most populated first. */
export function collectCategories(posts: BlogListItem[]): CategoryInfo[] {
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.category, (counts.get(p.category) || 0) + 1);

  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: categorySlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function findCategoryBySlug(posts: BlogListItem[], slug: string): CategoryInfo | null {
  return collectCategories(posts).find((c) => c.slug === slug) || null;
}

export function paginate<T>(items: T[], page: number, perPage = POSTS_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  return {
    items: items.slice((safePage - 1) * perPage, safePage * perPage),
    page: safePage,
    totalPages,
    total: items.length,
  };
}
