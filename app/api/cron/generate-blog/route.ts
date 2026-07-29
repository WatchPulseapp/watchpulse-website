import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { generateAndPublish, countTodaysAutoPosts, repairMissingTranslation } from '@/lib/blog-generator';
import connectDB from '@/lib/mongodb';
import BlogRun from '@/lib/models/BlogRun';
import { submitToIndexNow, urlsForNewPost, type IndexNowResult } from '@/lib/indexnow';
import { categorySlug } from '@/lib/blog-index';

/**
 * Persists the outcome of an attempt. Deliberately swallows its own errors:
 * failing to write a monitoring record must never turn a successful article
 * into a failed request.
 */
async function recordRun(entry: {
  ok: boolean;
  skipped: boolean;
  slug?: string;
  title?: string;
  format?: string;
  words?: number;
  writerModel?: string;
  reason?: string;
  durationMs: number;
}): Promise<void> {
  try {
    await connectDB();
    await BlogRun.create(entry);
  } catch (error) {
    console.error('[cron/generate-blog] could not record run:', error instanceof Error ? error.message : error);
  }
}

/**
 * Scheduled blog publisher.
 *
 * Triggered by an external scheduler (GitHub Actions) several times a day.
 * One invocation publishes ONE article, so a missed or throttled trigger costs
 * a single post rather than the whole day's output.
 */

export const dynamic = 'force-dynamic';

// Only meaningful on serverless hosts. This site runs behind nginx on its own
// server, where a request is not capped — the ceiling that actually binds here
// is Groq's per-minute token budget, handled below.
export const maxDuration = 60;

// Safety valve: even if the scheduler misfires or someone replays the request,
// we never publish more than this many auto-generated posts per UTC day.
/**
 * Seven, not ten.
 *
 * A writer call costs the 70b roughly 7,500 tokens and Groq's free tier meters
 * that model by the day as well as by the minute — measured, it started
 * refusing with "12,000 tokens left, retry-after 514s", which is the daily
 * budget talking, not the per-minute one. Ten articles sat on the edge of that
 * before any retry, so the day's budget ran out early and the late slots fell
 * to the weaker model, whose drafts fail the editorial checks more often. Seven
 * leaves room for the retries that keep quality up. Raise it with
 * MAX_AUTO_POSTS_PER_DAY if the Groq plan changes.
 */
const MAX_POSTS_PER_DAY = Number(process.env.MAX_AUTO_POSTS_PER_DAY || 7);

// One article per request, and this is not a tuning knob.
//
// Groq's free tier meters tokens per minute per model. Writing one body costs
// llama-3.3-70b roughly 7,500 of its 12,000 TPM, so a second article inside the
// same minute cannot fit — it fails with HTTP 429 rather than producing anything.
// Backfilling means triggering the workflow repeatedly, not raising this number.
const MAX_COUNT_PER_REQUEST = 1;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  // GitHub Actions sends this header explicitly. Header only — never a query
  // param, which would leak the secret into the nginx access log.
  const header = request.headers.get('authorization') || '';
  return header === `Bearer ${secret}`;
}

/**
 * Repairs one article that published without a Turkish side. Swallows its own
 * errors: this is a background repair, and a failure here must never turn a
 * successful publish into a failed request.
 */
async function repairTurkish(): Promise<{ slug: string; ok: boolean } | null> {
  try {
    const result = await repairMissingTranslation();
    return result.slug ? { slug: result.slug, ok: result.ok } : null;
  } catch (error) {
    console.error('[cron/generate-blog] translation repair failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;

  const requested = Number(params.get('count') || 1);
  const count = Math.min(Math.max(Number.isFinite(requested) ? requested : 1, 1), MAX_COUNT_PER_REQUEST);
  const startedAt = Date.now();

  try {
    const alreadyToday = await countTodaysAutoPosts();
    const remaining = MAX_POSTS_PER_DAY - alreadyToday;

    if (remaining <= 0) {
      // Nothing to publish, but the slot is still worth using: if an earlier
      // article went out without a Turkish side, this is free capacity to fix it.
      const repaired = await repairTurkish();

      await recordRun({
        ok: true,
        skipped: true,
        reason: `Daily limit reached (${alreadyToday}/${MAX_POSTS_PER_DAY})`,
        durationMs: Date.now() - startedAt,
      });
      return NextResponse.json({
        success: true,
        skipped: true,
        message: `Daily limit reached (${alreadyToday}/${MAX_POSTS_PER_DAY})`,
        published: [],
        repaired,
      });
    }

    const results = [];
    for (let i = 0; i < Math.min(count, remaining); i++) {
      const attemptStart = Date.now();
      const result = await generateAndPublish();
      results.push(result);

      // Recorded per attempt, success or failure, so the admin view can answer
      // "what went wrong at 15:17?" long after the logs have rotated away.
      await recordRun({
        ok: result.ok,
        skipped: false,
        slug: result.slug,
        title: result.title,
        format: result.format ?? undefined,
        words: result.words,
        writerModel: result.model,
        reason: result.reason,
        durationMs: Date.now() - attemptStart,
      });
    }

    const published = results.filter((r) => r.ok);
    const failed = results.filter((r) => !r.ok);

    // Runs after the publish so the fresh article gets first claim on the best
    // translator; the repair starts one model along and has its own budget.
    // An article that just published without a Turkish side is the newest
    // candidate, so it gets a second attempt within seconds rather than waiting
    // for the next scheduled run.
    const repaired = await repairTurkish();

    // A repair rewrites the Turkish title and excerpt, which the index renders,
    // so that listing is stale even when nothing new was published.
    if (repaired?.ok) revalidatePath('/tr/blog');

    let indexNow: IndexNowResult | null = null;

    if (published.length > 0) {
      // Refresh the Next data cache for the surfaces that list posts — both
      // editions, since the same article appears in each.
      revalidatePath('/blog');
      revalidatePath('/tr/blog');
      // Deliberately not revalidating /sitemap.xml or /feed.xml here: measured
      // on Next 14.2, revalidatePath leaves a metadata route's cached copy in
      // place with or without the 'page' type. Both carry a five-minute
      // revalidate of their own instead, and IndexNow is already told about the
      // new URLs below, so nothing waits on a crawler noticing the sitemap.

      // Tell the IndexNow engines the article exists rather than waiting to be
      // crawled. Failures are reported, never thrown: the article is already
      // published and a search engine being unreachable must not fail the run.
      const urls = published.flatMap((r) =>
        r.slug
          ? [
              ...urlsForNewPost(r.slug, categorySlug(r.category || ''), 'en'),
              ...urlsForNewPost(r.slug, categorySlug(r.category || ''), 'tr'),
            ]
          : []
      );
      indexNow = await submitToIndexNow([...new Set(urls)]);
    }

    return NextResponse.json(
      {
        success: published.length > 0,
        publishedToday: alreadyToday + published.length,
        dailyLimit: MAX_POSTS_PER_DAY,
        published: published.map((r) => ({
          slug: r.slug,
          title: r.title,
          format: r.format,
          words: r.words,
          model: r.model,
          translated: r.translated,
        })),
        failed: failed.map((r) => ({ topic: r.topic, reason: r.reason })),
        repaired,
        indexNow,
      },
      { status: published.length > 0 ? 200 : 502 }
    );
  } catch (error) {
    await recordRun({
      ok: false,
      skipped: false,
      reason: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
    });
    console.error('[cron/generate-blog] fatal:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Generation failed',
      },
      { status: 500 }
    );
  }
}

// GET for schedulers that can only issue plain GETs (cron-job.org, uptime pingers).
export async function GET(request: NextRequest) {
  return handle(request);
}

// POST for GitHub Actions / manual curl.
export async function POST(request: NextRequest) {
  return handle(request);
}
