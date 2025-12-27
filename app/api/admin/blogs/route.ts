import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Auth helper
function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  return token === ADMIN_SECRET_KEY;
}

// GET - List all blogs
export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (published !== null) query.isPublished = published === 'true';

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      blogs,
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

// POST - Create new blog
export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { slug, title, excerpt, content, category, readTime, tags, author, isPublished = true } = body;

    // Validate required fields
    if (!slug || !title?.en || !title?.tr || !excerpt?.en || !excerpt?.tr || !content || !category) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: slug.toLowerCase() });
    if (existingBlog) {
      return NextResponse.json({
        success: false,
        message: 'Blog with this slug already exists'
      }, { status: 409 });
    }

    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const blog = new Blog({
      slug: slug.toLowerCase(),
      title,
      excerpt,
      content,
      date,
      readTime: readTime || '5 min read',
      category,
      tags: tags || [],
      author: author || 'WatchPulse Team',
      isPublished
    });

    await blog.save();

    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      blog
    }, { status: 201 });

  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create blog'
    }, { status: 500 });
  }
}

// DELETE - Delete blog by slug
export async function DELETE(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Slug is required'
      }, { status: 400 });
    }

    const result = await Blog.findOneAndDelete({ slug });

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Blog not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete blog'
    }, { status: 500 });
  }
}

// PATCH - Update blog
export async function PATCH(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { slug, ...updates } = body;

    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Slug is required'
      }, { status: 400 });
    }

    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $set: updates },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json({
        success: false,
        message: 'Blog not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      blog
    });

  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update blog'
    }, { status: 500 });
  }
}
