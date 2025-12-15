import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const WAITLIST_FILE = path.join(process.cwd(), 'data', 'waitlist.json');
const BLACKLIST_FILE = path.join(process.cwd(), 'data', 'ip-blacklist.json');
const RATE_LIMIT_FILE = path.join(process.cwd(), 'data', 'rate-limits.json');

interface WaitlistEntry {
  email: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

interface RateLimitEntry {
  ip: string;
  count: number;
  lastRequest: string;
  dailyCount: number;
  lastDailyReset: string;
}

// Admin secret key from environment
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'change_this_secret_key';
const MAX_HOURLY_REQUESTS = parseInt(process.env.MAX_REQUESTS_PER_HOUR || '5', 10);
const MAX_DAILY_REQUESTS = parseInt(process.env.MAX_REQUESTS_PER_IP_PER_DAY || '10', 10);

// Enhanced email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Additional checks
  if (!emailRegex.test(email)) return false;
  if (email.length > 254) return false; // RFC 5321
  if (email.includes('..')) return false; // No consecutive dots

  const [local, domain] = email.split('@');
  if (local.length > 64) return false; // RFC 5321
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

// Sanitize input to prevent injection attacks
function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[<>\"\']/g, ''); // Remove potentially dangerous characters
}

// Ensure all data files exist
async function ensureDataFiles() {
  try {
    const dataDir = path.join(process.cwd(), 'data');

    // Create data directory
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Create files if they don't exist
    const files = [
      { path: WAITLIST_FILE, content: [] },
      { path: BLACKLIST_FILE, content: [] },
      { path: RATE_LIMIT_FILE, content: [] },
    ];

    for (const file of files) {
      try {
        await fs.access(file.path);
      } catch {
        await fs.writeFile(file.path, JSON.stringify(file.content, null, 2));
      }
    }
  } catch (error) {
    console.error('Error ensuring data files:', error);
  }
}

// Check if IP is blacklisted
async function isBlacklisted(ip: string): Promise<boolean> {
  try {
    const data = await fs.readFile(BLACKLIST_FILE, 'utf-8');
    const blacklist: string[] = JSON.parse(data);
    return blacklist.includes(ip);
  } catch {
    return false;
  }
}

// Rate limiting check
async function checkRateLimit(ip: string): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const data = await fs.readFile(RATE_LIMIT_FILE, 'utf-8');
    const rateLimits: RateLimitEntry[] = JSON.parse(data);

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const today = now.toISOString().split('T')[0];

    let entry = rateLimits.find(e => e.ip === ip);

    if (!entry) {
      entry = {
        ip,
        count: 1,
        lastRequest: now.toISOString(),
        dailyCount: 1,
        lastDailyReset: today,
      };
      rateLimits.push(entry);
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
      const lastRequest = new Date(entry.lastRequest);
      if (lastRequest > oneHourAgo) {
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

      entry.lastRequest = now.toISOString();
    }

    // Save updated rate limits
    await fs.writeFile(RATE_LIMIT_FILE, JSON.stringify(rateLimits, null, 2));

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true }; // Fail open
  }
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

    await ensureDataFiles();
    const data = await fs.readFile(WAITLIST_FILE, 'utf-8');
    const waitlist: WaitlistEntry[] = JSON.parse(data);

    // Sort by timestamp (newest first)
    waitlist.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      success: true,
      count: waitlist.length,
      emails: waitlist,
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

    // Check if IP is blacklisted
    if (await isBlacklisted(ip)) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(ip);
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

    await ensureDataFiles();

    // Read current waitlist
    const data = await fs.readFile(WAITLIST_FILE, 'utf-8');
    const waitlist: WaitlistEntry[] = JSON.parse(data);

    // Check if email already exists
    const emailExists = waitlist.some(
      (entry) => entry.email === sanitizedEmail
    );

    if (emailExists) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Get user agent for analytics
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Add new entry
    const newEntry: WaitlistEntry = {
      email: sanitizedEmail,
      timestamp: new Date().toISOString(),
      ip,
      userAgent: userAgent.substring(0, 200), // Limit length
    };

    waitlist.push(newEntry);

    // Save updated waitlist
    await fs.writeFile(WAITLIST_FILE, JSON.stringify(waitlist, null, 2));

    console.log(`✅ New waitlist signup: ${sanitizedEmail} from ${ip}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      count: waitlist.length,
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

    await ensureDataFiles();
    const data = await fs.readFile(WAITLIST_FILE, 'utf-8');
    let waitlist: WaitlistEntry[] = JSON.parse(data);

    const originalLength = waitlist.length;
    waitlist = waitlist.filter(entry => entry.email !== email.toLowerCase().trim());

    if (waitlist.length === originalLength) {
      return NextResponse.json(
        { success: false, message: 'Email not found' },
        { status: 404 }
      );
    }

    await fs.writeFile(WAITLIST_FILE, JSON.stringify(waitlist, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Email removed from waitlist',
      count: waitlist.length,
    });
  } catch (error) {
    console.error('Error deleting from waitlist:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove email' },
      { status: 500 }
    );
  }
}
