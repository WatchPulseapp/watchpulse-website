import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Waitlist from '@/lib/models/Waitlist';

// Admin secret key from environment
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'change_this_secret_key';
const MAX_HOURLY_REQUESTS = parseInt(process.env.MAX_REQUESTS_PER_HOUR || '5', 10);
const MAX_DAILY_REQUESTS = parseInt(process.env.MAX_REQUESTS_PER_IP_PER_DAY || '10', 10);

// Rate limiting storage (in-memory for simplicity)
const rateLimits = new Map<string, { count: number; lastRequest: Date; dailyCount: number; lastDailyReset: string }>();

// Enhanced email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) return false;
  if (email.length > 254) return false;
  if (email.includes('..')) return false;

  const [local, domain] = email.split('@');
  if (local.length > 64) return false;
  if (domain.length > 255) return false;

  // Block common temporary/disposable email domains
  const disposableDomains = [
    'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
    'throwaway.email', 'temp-mail.org', 'fakeinbox.com'
  ];
  const emailDomain = domain.toLowerCase();
  if (disposableDomains.some(d => emailDomain.includes(d))) {
    return false;
  }

  return true;
}

// Sanitize input
function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[<>"']/g, '');
}

// Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const today = now.toISOString().split('T')[0];

  let entry = rateLimits.get(ip);

  if (!entry) {
    entry = {
      count: 1,
      lastRequest: now,
      dailyCount: 1,
      lastDailyReset: today,
    };
    rateLimits.set(ip, entry);
  } else {
    // Reset daily count if it's a new day
    if (entry.lastDailyReset !== today) {
      entry.dailyCount = 1;
      entry.lastDailyReset = today;
      entry.count = 1;
    } else {
      entry.dailyCount++;
    }

    // Check hourly limit
    if (entry.lastRequest > oneHourAgo) {
      entry.count++;
      if (entry.count > MAX_HOURLY_REQUESTS) {
        return {
          allowed: false,
          reason: `Too many requests. Maximum ${MAX_HOURLY_REQUESTS} per hour.`
        };
      }
    } else {
      entry.count = 1;
    }

    // Check daily limit
    if (entry.dailyCount > MAX_DAILY_REQUESTS) {
      return {
        allowed: false,
        reason: `Daily limit exceeded. Maximum ${MAX_DAILY_REQUESTS} per day.`
      };
    }

    entry.lastRequest = now;
  }

  return { allowed: true };
}

// Verify admin authentication
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const apiKey = request.headers.get('x-api-key');

  // Check Bearer token
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return token === ADMIN_SECRET;
  }

  // Check API key header
  if (apiKey === ADMIN_SECRET) {
    return true;
  }

  return false;
}

// GET - Retrieve waitlist (ADMIN ONLY)
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Admin access required.',
          hint: 'Include Authorization header with Bearer token or X-API-Key header'
        },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all waitlist entries, sorted by newest first
    const waitlist = await Waitlist.find({})
      .sort({ timestamp: -1 })
      .lean();

    // Format the response
    const formattedWaitlist = waitlist.map(entry => ({
      email: entry.email,
      timestamp: entry.timestamp.toISOString(),
      ip: entry.ip || 'unknown',
      userAgent: entry.userAgent || 'unknown',
    }));

    return NextResponse.json({
      success: true,
      count: waitlist.length,
      emails: formattedWaitlist,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error reading waitlist:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to read waitlist' },
      { status: 500 }
    );
  }
}

// POST - Add email to waitlist (PUBLIC with rate limiting)
export async function POST(request: NextRequest) {
  try {
    // Get IP address
    const ip = (
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    ).split(',')[0].trim();

    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: rateLimit.reason },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    // Validate email presence
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Sanitize and validate email
    const sanitizedEmail = sanitizeEmail(email);

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if email already exists
    const existingEntry = await Waitlist.findOne({ email: sanitizedEmail });

    if (existingEntry) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create new entry
    await Waitlist.create({
      email: sanitizedEmail,
      timestamp: new Date(),
      ip,
      userAgent: userAgent.substring(0, 200),
    });

    const totalCount = await Waitlist.countDocuments();

    console.log(`✅ New waitlist signup: ${sanitizedEmail} from ${ip}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      count: totalCount,
    });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    );
  }
}

// DELETE - Remove email from waitlist (ADMIN ONLY)
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email parameter required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Waitlist.deleteOne({ email: email.toLowerCase().trim() });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Email not found' },
        { status: 404 }
      );
    }

    const totalCount = await Waitlist.countDocuments();

    return NextResponse.json({
      success: true,
      message: 'Email removed from waitlist',
      count: totalCount,
    });
  } catch (error) {
    console.error('Error deleting from waitlist:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove email' },
      { status: 500 }
    );
  }
}
