import { NextRequest, NextResponse } from 'next/server';
import { seedTitles, DEFAULT_BATCH } from '@/lib/title-seeds';
import { submitToIndexNow } from '@/lib/indexnow';

/**
 * Claims another batch of film and series pages for the sitemap.
 *
 * Meant to run weekly, not hourly. The pages themselves already render for any
 * TMDB id; what a run does is decide which ones the site puts its name to, and
 * doing that in steady batches is the difference between a catalogue growing
 * and a sudden flood of near-identical URLs from a site with no standing.
 *
 * Same auth as the blog publisher: a bearer token in the header, never a query
 * parameter, because query strings land in the nginx access log.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return (request.headers.get('authorization') || '') === `Bearer ${secret}`;
}

/** Bounded so a mistyped query parameter cannot turn one run into a flood. */
const MAX_BATCH = 200;

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const requested = Number(new URL(request.url).searchParams.get('batch') || DEFAULT_BATCH);
  const batch = Math.min(Math.max(Number.isFinite(requested) ? requested : DEFAULT_BATCH, 1), MAX_BATCH);
  const startedAt = Date.now();

  try {
    const result = await seedTitles(batch);

    // Both editions of each new page. Google does not take IndexNow, so this
    // reaches Bing and the rest; Google gets them from the sitemap, which picks
    // them up on its own five-minute revalidate.
    let indexNow = null;
    if (result.paths.length > 0) {
      const urls = result.paths.flatMap((path) => [
        `https://watchpulseapp.com${path}`,
        `https://watchpulseapp.com/tr${path}`,
      ]);
      indexNow = await submitToIndexNow(urls);
    }

    return NextResponse.json({
      success: result.ok,
      added: result.added,
      considered: result.considered,
      total: result.total,
      bySource: result.bySource,
      reason: result.reason,
      indexNow,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[cron/seed-titles]', message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
