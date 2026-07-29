import {
  getTrending,
  getUpcomingMovies,
  getNowPlaying,
  getOnTheAirTV,
  getTopRatedByGenre,
  getTitleDetails,
  getProviders,
  getRecommendations,
  getRecentTrailers,
  buildTrailerSheet,
  getTrendingPeople,
  getPersonDetails,
  buildFactSheet,
  buildDetailSheet,
  buildPersonSheet,
  backdropUrl,
  ROUNDUP_GENRES,
  isTmdbConfigured,
  type TmdbTitle,
} from '@/lib/tmdb';

/**
 * Story formats for the blog generator.
 *
 * Each format is backed by a real TMDB query, so an article can only ever be
 * about films and television — the model is handed a fact sheet and told it is
 * the sole permitted source of titles, dates and figures. This replaces the
 * earlier approach of letting the model invent its own topic, which drifted
 * into generic "algorithmic personalization" essays with invented statistics.
 */

/**
 * A TMDB record the article is built from, kept with its id.
 *
 * requiredTitles carries the same names but only as strings, which is all the
 * translator needs. Linking needs the id: the site already renders /movie/[id],
 * /tv/[id] and /person/[id] from this same data, and without the id there is no
 * way back from "the article mentions Sinners" to the page about Sinners.
 */
export interface TitleRef {
  id: number;
  type: 'movie' | 'tv' | 'person';
  name: string;
}

export interface StoryBrief {
  format: string;
  /** Working topic, also used for de-duplication against past posts. */
  topic: string;
  factSheet: string;
  /** Format-specific structural guidance appended to the writer prompt. */
  instructions: string;
  /** Real titles the finished article must actually mention (domain guard). */
  requiredTitles: string[];
  /** The same records, with ids, so the finished article can link to them. */
  sourceRefs: TitleRef[];
  coverImage?: string;
  category: string;
  /** News formats age quickly; evergreen ones keep pulling traffic. */
  evergreen: boolean;
}

function refsFor(titles: TmdbTitle[]): TitleRef[] {
  return titles.map((t) => ({ id: t.id, type: t.mediaType, name: t.name }));
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Takes a random window of the results rather than always the top N. With five
 * posts a day the same endpoint gets queried repeatedly, and always featuring
 * the same top titles would produce near-duplicate articles.
 */
function sample(titles: TmdbTitle[], count: number): TmdbTitle[] {
  if (titles.length <= count) return titles;
  return shuffle(titles).slice(0, count);
}

function monthLabel(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function cover(titles: TmdbTitle[]): string | undefined {
  const withBackdrop = titles.find((t) => t.backdropPath);
  return backdropUrl(withBackdrop?.backdropPath || null);
}

// ---------------------------------------------------------------------------
// Formats
// ---------------------------------------------------------------------------

async function upcomingReleases(): Promise<StoryBrief | null> {
  const titles = await getUpcomingMovies(16);
  const chosen = sample(titles, 7);
  if (chosen.length < 4) return null;

  return {
    format: 'upcoming-releases',
    topic: `Most anticipated films coming to theaters after ${monthLabel()}`,
    factSheet: buildFactSheet(chosen, { withDate: true }),
    instructions: `Write a preview of these upcoming releases. Give each film its own section covering what is known about it, who it will appeal to, and why it is worth putting in the calendar. Use the exact release dates from the fact sheet. These films are not out yet, so write about anticipation and what we know — never review them as if you have seen them, and never describe reactions or reviews that cannot exist yet.`,
    requiredTitles: chosen.map((t) => t.name),
    sourceRefs: refsFor(chosen),
    coverImage: cover(chosen),
    category: 'Trends',
    evergreen: false,
  };
}

async function trendingNow(): Promise<StoryBrief | null> {
  const titles = await getTrending(18);
  const chosen = sample(titles, 7);
  if (chosen.length < 4) return null;

  return {
    format: 'trending-now',
    topic: `What everyone is watching right now — the week's biggest films and series`,
    factSheet: buildFactSheet(chosen),
    instructions: `Write a rundown of what is trending this week. For each title explain why it is catching on now and who will enjoy it. Group films and series sensibly rather than listing them mechanically.`,
    requiredTitles: chosen.map((t) => t.name),
    sourceRefs: refsFor(chosen),
    coverImage: cover(chosen),
    category: 'Trends',
    evergreen: false,
  };
}

async function inTheaters(): Promise<StoryBrief | null> {
  const titles = await getNowPlaying(16);
  const chosen = sample(titles, 6);
  if (chosen.length < 4) return null;

  return {
    format: 'in-theaters',
    topic: `What is playing in theaters right now and which ticket is worth buying`,
    factSheet: buildFactSheet(chosen, { withDate: true }),
    instructions: `Write a guide to what is currently in cinemas. Be genuinely useful about which films justify a trip out versus which can wait for streaming, and match each to the kind of viewer who will love it.`,
    requiredTitles: chosen.map((t) => t.name),
    sourceRefs: refsFor(chosen),
    coverImage: cover(chosen),
    category: 'Entertainment',
    evergreen: false,
  };
}

async function tvThisWeek(): Promise<StoryBrief | null> {
  const titles = await getOnTheAirTV(16);
  const chosen = sample(titles, 6);
  if (chosen.length < 4) return null;

  return {
    format: 'tv-this-week',
    topic: `Series airing new episodes this week and which ones to start`,
    factSheet: buildFactSheet(chosen),
    instructions: `Write about the series currently airing new episodes. Cover what each show is, how far along it is, and whether a newcomer should jump in now or binge from the start.`,
    requiredTitles: chosen.map((t) => t.name),
    sourceRefs: refsFor(chosen),
    coverImage: cover(chosen),
    category: 'TV Shows',
    evergreen: false,
  };
}

async function titleDeepDive(): Promise<StoryBrief | null> {
  const trending = await getTrending(18);
  if (!trending.length) return null;

  // Try a few candidates — not every title has usable detail data.
  for (const candidate of shuffle(trending).slice(0, 4)) {
    const details = await getTitleDetails(candidate.id, candidate.mediaType);
    if (details && details.overview.length > 80) {
      return {
        format: 'title-deep-dive',
        topic: `${details.name} (${details.year || 'TBA'}) — what it is, who made it, and whether it is worth your evening`,
        factSheet: buildDetailSheet(details),
        instructions: `Write an in-depth piece about this single title. Cover the premise without spoiling the plot, the people who made it, what it does well, who it will and will not suit, and where to watch it. If the fact sheet lists streaming services, name them; if it says the title is not on a subscription service, say so plainly instead of guessing.`,
        requiredTitles: [details.name, ...details.cast.slice(0, 2)],
        // Only the title itself — the cast names are in requiredTitles so the
        // translator leaves them alone, but a name is not a page here.
        sourceRefs: refsFor([details]),
        coverImage: backdropUrl(details.backdropPath),
        category: details.mediaType === 'tv' ? 'TV Shows' : 'Entertainment',
        evergreen: true,
      };
    }
  }
  return null;
}

async function genreRoundup(): Promise<StoryBrief | null> {
  const genre = pick(ROUNDUP_GENRES);
  const titles = await getTopRatedByGenre(genre.id, 18);
  const chosen = sample(titles, 8);
  if (chosen.length < 5) return null;

  return {
    format: 'genre-roundup',
    topic: `The best ${genre.name.toLowerCase()} films worth your time`,
    factSheet: buildFactSheet(chosen),
    instructions: `Write a curated guide to the best of this genre. Give each film a section explaining what makes it stand out and the mood it suits. Order them so the piece builds rather than reading as a flat list.`,
    requiredTitles: chosen.map((t) => t.name),
    sourceRefs: refsFor(chosen),
    coverImage: cover(chosen),
    category: 'Genre Guide',
    evergreen: true,
  };
}

async function streamingSpotlight(): Promise<StoryBrief | null> {
  const trending = await getTrending(18);
  const chosen = sample(trending, 6);
  if (chosen.length < 4) return null;

  // Resolve real US streaming homes so the article can answer "where do I watch this".
  const withProviders = await Promise.all(
    chosen.map(async (t) => ({ title: t, providers: await getProviders(t.id, t.mediaType) }))
  );

  const factSheet = withProviders
    .map(({ title, providers }, i) =>
      [
        `${i + 1}. "${title.name}" (${title.year || 'TBA'}) — ${title.mediaType === 'tv' ? 'TV series' : 'film'}`,
        title.genres.length ? `Genres: ${title.genres.join(', ')}` : null,
        title.rating ? `TMDB rating: ${title.rating}/10` : null,
        providers.length
          ? `Streaming in the US on: ${providers.join(', ')}`
          : `Not on a US subscription service right now (rental or purchase only)`,
        `Synopsis: ${title.overview.slice(0, 260)}`,
      ]
        .filter(Boolean)
        .join('\n   ')
    )
    .join('\n\n');

  return {
    format: 'streaming-spotlight',
    topic: `Where to stream the titles everyone is talking about`,
    factSheet,
    instructions: `Write a where-to-watch guide. For each title state plainly which service carries it, or say clearly that it is rental-only. Never guess at availability that is not in the fact sheet — that is the one thing readers come to this kind of article for.`,
    requiredTitles: chosen.map((t) => t.name),
    sourceRefs: refsFor(chosen),
    coverImage: cover(chosen),
    category: 'Streaming',
    evergreen: false,
  };
}

/**
 * "If you liked X, watch these" — one of the highest-intent search patterns in
 * entertainment, and TMDB's recommendation graph answers it with real data
 * rather than the model's guesswork.
 */
async function ifYouLiked(): Promise<StoryBrief | null> {
  const trending = await getTrending(18);

  for (const seed of shuffle(trending).slice(0, 4)) {
    const similar = await getRecommendations(seed.id, seed.mediaType, 10);
    const chosen = sample(similar, 6);
    if (chosen.length < 4) continue;

    return {
      format: 'if-you-liked',
      topic: `What to watch next if you loved ${seed.name} (${seed.year || 'TBA'})`,
      factSheet: `THE STARTING POINT — the title the reader already loves:\n"${seed.name}" (${seed.year || 'TBA'})${seed.genres.length ? ` — ${seed.genres.join(', ')}` : ''}\n${seed.overview}\n\nRECOMMENDED NEXT WATCHES:\n\n${buildFactSheet(chosen)}`,
      instructions: `Write a "what to watch next" guide for someone who just finished the starting-point title. Open by pinning down what specifically makes that title work — its tone, its themes, the feeling it leaves. Then give each recommendation its own section explaining which of those qualities it shares and where it goes somewhere different. Be precise about the connection; "it's also good" is not a reason.`,
      requiredTitles: [seed.name, ...chosen.map((t) => t.name)],
      sourceRefs: refsFor([seed, ...chosen]),
      coverImage: cover([seed, ...chosen]),
      category: 'Genre Guide',
      evergreen: true,
    };
  }
  return null;
}

/**
 * The closest this system gets to actual film news: official trailers that
 * dropped in the last few weeks, with verified publish dates and release dates.
 */
async function newTrailers(): Promise<StoryBrief | null> {
  const [trending, upcoming] = await Promise.all([getTrending(14), getUpcomingMovies(14)]);

  // De-duplicate: a film can be both trending and upcoming.
  const seen = new Set<number>();
  const candidates = [...upcoming, ...trending].filter((t) => (seen.has(t.id) ? false : (seen.add(t.id), true)));

  const trailers = await getRecentTrailers(candidates, 21, 7);
  if (trailers.length < 4) return null;

  return {
    format: 'new-trailers',
    topic: `New trailers that dropped this month and what they reveal`,
    factSheet: buildTrailerSheet(trailers),
    instructions: `Write a roundup of these newly released trailers. Give each its own section: what the trailer shows, what it tells us about the film, and who should be excited. Use the exact "published X days ago" timing and release dates from the fact sheet. These are trailers, not finished films — describe what has been revealed, never review a film you have not seen or invent footage that is not described in the synopsis.`,
    requiredTitles: trailers.map((t) => t.title.name),
    sourceRefs: refsFor(trailers.map((t) => t.title)),
    coverImage: cover(trailers.map((t) => t.title)),
    category: 'Trends',
    evergreen: false,
  };
}

/** Actor and director spotlights — newsy while they trend, evergreen after. */
async function personSpotlight(): Promise<StoryBrief | null> {
  const people = await getTrendingPeople(14);

  // Trending people include newcomers with no substantial filmography yet, so
  // several candidates get tried before giving up on the format.
  for (const candidate of shuffle(people).slice(0, 6)) {
    const person = await getPersonDetails(candidate.id);
    if (!person || person.credits.length < 4) continue;

    const isDirector = person.department === 'Directing';

    return {
      format: 'person-spotlight',
      topic: `${person.name}'s essential films and where to start`,
      factSheet: buildPersonSheet(person),
      instructions: `Write a guide to this ${isDirector ? "director's" : "performer's"} work for someone who knows the name but has not worked through the filmography. Give the standout titles their own sections covering what the film is and what ${person.name} brings to it. Recommend a specific starting point and say why. Use only the biography and credits in the fact sheet — no anecdotes, awards or personal details that are not listed there.`,
      requiredTitles: [person.name, ...person.credits.slice(0, 5).map((c) => c.name)],
      sourceRefs: [
        { id: person.id, type: 'person', name: person.name },
        ...person.credits.map((c) => ({ id: c.id, type: c.mediaType, name: c.name })),
      ],
      // Their best-known film's backdrop stands in for a portrait — TMDB profile
      // images are tall headshots and would crop badly in a 16:9 blog card.
      coverImage: backdropUrl(person.credits.find((c) => c.backdropPath)?.backdropPath || null),
      category: 'Entertainment',
      evergreen: true,
    };
  }
  return null;
}

/** Exported so each format can be exercised individually by the test harness. */
export const STORY_FORMATS: Record<string, () => Promise<StoryBrief | null>> = {
  'trending-now': trendingNow,
  'upcoming-releases': upcomingReleases,
  'title-deep-dive': titleDeepDive,
  'genre-roundup': genreRoundup,
  'streaming-spotlight': streamingSpotlight,
  'in-theaters': inTheaters,
  'tv-this-week': tvThisWeek,
  'if-you-liked': ifYouLiked,
  'person-spotlight': personSpotlight,
  'new-trailers': newTrailers,
};

// News formats appear more often than evergreen ones, but evergreen pieces keep
// earning traffic long after publication, so both stay in rotation.
const FORMAT_WEIGHTS: Record<keyof typeof STORY_FORMATS, number> = {
  'trending-now': 3,
  'upcoming-releases': 3,
  'title-deep-dive': 3,
  'genre-roundup': 2,
  'streaming-spotlight': 2,
  'in-theaters': 2,
  'tv-this-week': 2,
  'if-you-liked': 3,
  'person-spotlight': 2,
  'new-trailers': 3,
};

/**
 * Builds a story brief from live TMDB data. Formats are tried in weighted-random
 * order so a temporarily empty endpoint (TMDB's upcoming list runs dry between
 * release waves) falls through to another format instead of failing the run.
 */
export async function buildStoryBrief(): Promise<StoryBrief | null> {
  if (!isTmdbConfigured()) return null;

  const pool = Object.entries(FORMAT_WEIGHTS).flatMap(([name, weight]) =>
    Array<string>(weight).fill(name)
  );
  const tried = new Set<string>();

  for (const name of shuffle(pool)) {
    if (tried.has(name)) continue;
    tried.add(name);

    try {
      const brief = await STORY_FORMATS[name]();
      if (brief) return brief;
      console.warn(`[blog-stories] ${name} returned no usable data, trying another format`);
    } catch (error) {
      console.error(`[blog-stories] ${name} failed:`, error instanceof Error ? error.message : error);
    }
  }

  return null;
}
