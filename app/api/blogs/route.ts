import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';

/**
 * Paging values are attacker-controlled: this endpoint takes no credentials and
 * is reachable by anyone. Unclamped, `?page=-5` produced a negative skip that
 * Mongo rejects — a 500 anybody could trigger at will — and `?limit=100000`
 * returned the entire collection in one response, which is seventeen documents
 * today and several thousand within a year of publishing ten a day. parseInt
 * also yields NaN for junk, and `.limit(NaN)` is read as no limit at all, so
 * `?limit=abc` had the same effect as asking for everything.
 */
function positiveInt(raw: string | null, fallback: number, max: number): number {
  const value = Number.parseInt(raw || '', 10);
  if (!Number.isFinite(value) || value < 1) return fallback;
  return Math.min(value, max);
}

const MAX_LIMIT = 50;
const MAX_PAGE = 500;

// GET - List published blogs (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = positiveInt(searchParams.get('page'), 1, MAX_PAGE);
    const limit = positiveInt(searchParams.get('limit'), 12, MAX_LIMIT);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    // If slug is provided, return single blog
    if (slug) {
      const blog = await Blog.findOne({ slug, isPublished: true }).lean();

      if (!blog) {
        return NextResponse.json({
          success: false,
          message: 'Blog not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        blog
      });
    }

    // List blogs
    const query: Record<string, unknown> = { isPublished: true };
    if (category && category !== 'All') {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .select('slug title excerpt date readTime category coverImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query)
    ]);

    // Get all unique categories
    const categories = await Blog.distinct('category', { isPublished: true });

    return NextResponse.json({
      success: true,
      blogs,
      categories: ['All', ...categories],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch blogs'
    }, { status: 500 });
  }
}
