import connectDB from '@/lib/mongodb';
import TitleSeed from '@/lib/models/TitleSeed';
import {
  getTrending,
  getNowPlaying,
  getOnTheAirTV,
  getPopularMovies,
  getPopularTVPaged,
  isTmdbConfigured,
  type TmdbTitle,
} from '@/lib/tmdb';

/**
 * Decides which film and series pages the site publishes.
 *
 * "Where can I watch X" is the highest-intent question in this whole subject,
 * and the site answers it on a page it already renders for any title. The gap
 * was never the pages — it was that nothing told a crawler they existed. Only
 * the forty-odd titles the articles happened to name were in the sitemap.
 *
 * Grown in batches on purpose. Every id TMDB knows could be listed tomorrow,
 * and a site with no authority publishing tens of thousands of near-identical
 * URLs overnight is the shape of a doorway farm whether or not it means to be.
 * A few dozen a run, added to a sitemap that also carries real writing, is a
 * catalogue growing — which is what it actually is.
 */

/**
 * How many new titles one run may claim.
 *
 * Raised from fifty once the ratio became obvious: the Journal publishes seven
 * pages a day and this was adding fifty a week, so the surface that answers the
 * highest-intent question in the subject was growing an order of magnitude
 * slower than the one that answers the vaguest. A hundred and fifty a week is
 * roughly two thousand pages a quarter — still a catalogue filling in rather
 * than a site that appeared overnight.
 */
export const DEFAULT_BATCH = Number(process.env.TITLE_SEED_BATCH || 150);

/**
 * TMDB pages each deep source reads per run.
 *
 * Forty a page. At one page each the two deep sources plus the three "what is
 * hot" queries could only ever surface about 140 candidates, most of them
 * already held — so a batch of 150 was arithmetically unreachable and the run
 * would have quietly under-delivered while reporting success.
 */
const DEEP_PAGES = 4;

/** The sources that page through the ranking, as opposed to sampling the top. */
const DEEP_SOURCES = ['popular-film', 'popular-tv'];

/**
 * A title has to clear this to get a page. Both numbers are about the page
 * being worth landing on: without a synopsis there is nothing to read, and
 * below the vote floor nobody is searching for it anyway.
 */
const MIN_VOTES = 100;
const MIN_OVERVIEW = 80;

export interface SeedResult {
  ok: boolean;
  added: number;
  considered: number;
  total: number;
  /** The pages added this run, ready for IndexNow. */
  paths: string[];
  bySource: Record<string, number>;
  reason?: string;
}

interface Source {
  label: string;
  load: (deepPage: number) => Promise<TmdbTitle[]>;
}

/**
 * Two kinds of query.
 *
 * The first four are what is hot right now; they return different titles week
 * to week on their own, so they keep the catalogue current without any state.
 * The last two page steadily deeper into the popularity ranking, which is where
 * the evergreen "where to watch" demand actually lives — and they need to know
 * how far in we already are, or every run would rediscover the same first
 * hundred and add nothing.
 */
const SOURCES: Source[] = [
  { label: 'trending', load: () => getTrending(20) },
  { label: 'now-playing', load: () => getNowPlaying(20) },
  { label: 'on-the-air', load: () => getOnTheAirTV(20) },
  { label: 'popular-film', load: (page) => getPopularMovies(40 * DEEP_PAGES, page, DEEP_PAGES) },
  { label: 'popular-tv', load: (page) => getPopularTVPaged(40 * DEEP_PAGES, page, DEEP_PAGES) },
];

function usable(title: TmdbTitle): boolean {
  return title.votes >= MIN_VOTES && title.overview.length >= MIN_OVERVIEW;
}

export async function seedTitles(batch = DEFAULT_BATCH): Promise<SeedResult> {
  const empty: SeedResult = { ok: false, added: 0, considered: 0, total: 0, paths: [], bySource: {} };

  if (!isTmdbConfigured()) {
    return { ...empty, reason: 'TMDB_API_KEY is not set' };
  }

  await connectDB();
  const total = await TitleSeed.countDocuments();

  // Derived rather than stored: the deep sources read 40 a page, so the number
  // of titles they have already contributed says how far in we have read. A
  // stored cursor would be one more thing to drift out of step with the
  // collection it describes.
  //
  // Counted by source, not from the total. The "what is hot" queries add
  // titles too, and including those advanced the cursor faster than the deep
  // sources were actually reading — so whole pages of the popularity ranking
  // were being skipped and would never have been seeded at all.
  const deepHeld = await TitleSeed.countDocuments({ source: { $in: DEEP_SOURCES } });
  const deepPage = Math.floor(deepHeld / 40) + 1;

  const batches = await Promise.all(
    SOURCES.map(async (source) => {
      try {
        return { label: source.label, titles: await source.load(deepPage) };
      } catch (error) {
        console.error(`[title-seeds] ${source.label} failed:`, error instanceof Error ? error.message : error);
        return { label: source.label, titles: [] as TmdbTitle[] };
      }
    })
  );

  // Deduplicated across sources before touching the database: trending this week
  // is also popular this week, and one title is one page either way.
  const candidates = new Map<string, { title: TmdbTitle; source: string }>();
  let considered = 0;

  for (const { label, titles } of batches) {
    for (const title of titles) {
      considered++;
      if (!usable(title)) continue;
      const key = `${title.mediaType}/${title.id}`;
      if (!candidates.has(key)) candidates.set(key, { title, source: label });
    }
  }

  if (candidates.size === 0) {
    return { ...empty, ok: true, total, reason: 'no usable candidates this run' };
  }

  // Ask once which of these we already hold, rather than attempting an insert
  // per title and reading the duplicate-key errors back as an answer.
  const known = await TitleSeed.find({
    $or: [...candidates.values()].map(({ title }) => ({ tmdbId: title.id, type: title.mediaType })),
  })
    .select('tmdbId type')
    .lean();

  const knownKeys = new Set((known as Array<{ tmdbId: number; type: string }>).map((k) => `${k.type}/${k.tmdbId}`));

  const fresh = [...candidates.entries()]
    .filter(([key]) => !knownKeys.has(key))
    // Most popular first, so a batch that hits the cap takes the titles most
    // people are actually looking for.
    .sort((a, b) => b[1].title.popularity - a[1].title.popularity)
    .slice(0, batch);

  if (fresh.length === 0) {
    return { ...empty, ok: true, total, considered, reason: 'nothing new at this depth' };
  }

  const bySource: Record<string, number> = {};
  for (const [, { source }] of fresh) bySource[source] = (bySource[source] || 0) + 1;

  try {
    await TitleSeed.insertMany(
      fresh.map(([, { title, source }]) => ({
        tmdbId: title.id,
        type: title.mediaType,
        name: title.name,
        popularity: title.popularity,
        source,
      })),
      // A title added by a run happening in parallel is not a failure; take the
      // rest rather than losing the batch to one collision.
      { ordered: false }
    );
  } catch (error) {
    const written = (error as { insertedDocs?: unknown[] })?.insertedDocs?.length;
    if (written === undefined) {
      return { ...empty, total, considered, reason: error instanceof Error ? error.message : 'insert failed' };
    }
  }

  const paths = fresh.map(([key]) => `/${key}`);
  console.log(`[title-seeds] claimed ${paths.length} page(s) at depth ${deepPage}: ${JSON.stringify(bySource)}`);

  return {
    ok: true,
    added: paths.length,
    considered,
    total: total + paths.length,
    paths,
    bySource,
  };
}
