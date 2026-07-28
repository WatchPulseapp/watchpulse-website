import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { staticBlogPosts } from '@/data/static-blogs';

/**
 * Title search for the Journal.
 *
 * Search used to run in the browser over an index of every post, which meant
 * the whole archive shipped inside the HTML of every index page — fine at 19
 * posts, roughly 270 KB of dead weight per page load at a year of publishing
 * five a day. The query runs here instead, so the page ships nothing and the
 * cost scales with what is typed rather than with how much has been written.
 */

export const dynamic = 'force-dynamic';

const MAX_RESULTS = 8;

/** Escapes a user string so it cannot act as a regular expression. */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(request: NextRequest) {
  const query = (new URL(request.url).searchParams.get('q') || '').trim();
  if (query.length < 2) return NextResponse.json({ results: [] });

  // A long query is a bad query; capping it keeps the regex bounded.
  const safe = escapeRegex(query.slice(0, 60));
  const pattern = new RegExp(safe, 'i');

  const results: Array<{ slug: string; title: string; category: string }> = [];
  const seen = new Set<string>();

  try {
    await connectDB();
    const matches = await Blog.find({
      isPublished: true,
      $or: [{ 'title.en': pattern }, { category: pattern }, { tags: pattern }],
    })
      .select('slug title category')
      .sort({ createdAt: -1 })
      .limit(MAX_RESULTS)
      .lean();

    for (const m of matches as Array<Record<string, any>>) {
      if (!m.slug || seen.has(m.slug)) continue;
      seen.add(m.slug);
      results.push({ slug: m.slug, title: m.title?.en || m.slug, category: m.category || 'General' });
    }
  } catch (error) {
    console.error('[blog-search] DB query failed, falling back to static:', error);
  }

  // Curated posts live in code, not the DB, so they are matched separately.
  for (const p of staticBlogPosts) {
    if (results.length >= MAX_RESULTS) break;
    if (seen.has(p.slug)) continue;
    if (pattern.test(p.title.en) || pattern.test(p.category)) {
      seen.add(p.slug);
      results.push({ slug: p.slug, title: p.title.en, category: p.category });
    }
  }

  return NextResponse.json({ results: results.slice(0, MAX_RESULTS) });
}
