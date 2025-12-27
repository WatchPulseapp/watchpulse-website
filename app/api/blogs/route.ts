import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';

// GET - List published blogs (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
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
        .select('slug title excerpt date readTime category')
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
