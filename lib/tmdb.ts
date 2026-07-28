/**
 * TMDB data layer for the blog generator.
 *
 * Every generated article is grounded in real data pulled from here rather than
 * in whatever the language model happens to remember. That solves two problems
 * at once: articles stay inside the film/TV domain, and release dates, ratings
 * and cast names are facts instead of plausible-sounding inventions.
 *
 * TMDB attribution is already present in the site footer, as their terms require.
 */

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Blog content targets an English-speaking audience, so US release windows and
// US streaming availability are the relevant ones.
const REGION = 'US';
const LANGUAGE = 'en-US';

export interface TmdbTitle {
  id: number;
  mediaType: 'movie' | 'tv';
  name: string;
  year: string | null;
  /** ISO date — release date for films, first air date for series. */
  date: string | null;
  overview: string;
  rating: number | null;
  votes: number;
  genres: string[];
  posterPath: string | null;
  backdropPath: string | null;
  popularity: number;
}

export interface TmdbTitleDetails extends TmdbTitle {
  runtime: number | null;
  director: string | null;
  cast: string[];
  /** Subscription streaming services carrying it in the US. */
  providers: string[];
  tagline: string | null;
}

export function isTmdbConfigured(): boolean {
  return Boolean(TMDB_API_KEY);
}

export function backdropUrl(path: string | null, size: 'w780' | 'w1280' = 'w1280'): string | undefined {
  return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : undefined;
}

/**
 * TMDB accepts either a v3 API key (as a query param) or a v4 read access token
 * (as a bearer). v4 tokens are JWTs, so they are easy to tell apart — accepting
 * both means whichever credential is to hand just works.
 */
function isV4Token(key: string): boolean {
  return key.startsWith('eyJ') && key.split('.').length === 3;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!TMDB_API_KEY) return null;

  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('language', LANGUAGE);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const headers: Record<string, string> = { accept: 'application/json' };
  if (isV4Token(TMDB_API_KEY)) {
    headers.Authorization = `Bearer ${TMDB_API_KEY}`;
  } else {
    url.searchParams.set('api_key', TMDB_API_KEY);
  }

  // Without a timeout a slow TMDB response would hold the request open
  // indefinitely and the run would produce nothing at all. A story brief issues
  // several of these, so the budget per call has to be small.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url.toString(), { headers, cache: 'no-store', signal: controller.signal });
    if (!res.ok) {
      console.error(`[tmdb] ${path} -> HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    const reason = error instanceof Error && error.name === 'AbortError' ? 'timed out after 6s' : error instanceof Error ? error.message : String(error);
    console.error(`[tmdb] ${path} failed: ${reason}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// TMDB returns genre ids on list endpoints and full objects on detail endpoints,
// so the id map is needed to name genres without an extra request per title.
const MOVIE_GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance',
  878: 'Science Fiction', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
};

const TV_GENRES: Record<number, string> = {
  10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 10762: 'Kids', 9648: 'Mystery',
  10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap',
  10767: 'Talk', 10768: 'War & Politics', 37: 'Western',
};

/** Genres worth building an evergreen roundup around. */
export const ROUNDUP_GENRES = [
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 9648, name: 'Mystery' },
  { id: 16, name: 'Animation' },
  { id: 10749, name: 'Romance' },
  { id: 12, name: 'Adventure' },
  { id: 80, name: 'Crime' },
  { id: 14, name: 'Fantasy' },
  { id: 99, name: 'Documentary' },
];

/**
 * Brand-safety net.
 *
 * TMDB's `adult` flag alone is not enough: a measured run of the person
 * spotlight format picked Tinto Brass and produced an article about his erotic
 * filmography (Caligula, Salon Kitty). None of those records carry the adult
 * flag, because TMDB reserves it for pornography rather than for films that are
 * merely unsuitable for a general-audience recommendation app's blog.
 */
const UNSAFE_TERMS = [
  'erotic', 'softcore', 'hardcore', 'pornograph', 'porn star', 'sexploitation',
  'nudity', 'strip club', 'brothel', 'prostitut', 'incest', 'orgy', 'fetish',
  'sexual awakening', 'sexually explicit', 'adult film',
];

function textIsUnsafe(...parts: Array<string | null | undefined>): boolean {
  const haystack = parts.filter(Boolean).join(' ').toLowerCase();
  return UNSAFE_TERMS.some((term) => haystack.includes(term));
}

interface RawTitle {
  id: number;
  adult?: boolean;
  media_type?: string;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  poster_path?: string | null;
  backdrop_path?: string | null;
  popularity?: number;
}

function normalize(raw: RawTitle, fallbackType: 'movie' | 'tv'): TmdbTitle | null {
  const mediaType = (raw.media_type === 'tv' || raw.media_type === 'movie' ? raw.media_type : fallbackType) as
    | 'movie'
    | 'tv';
  const name = raw.title || raw.name;
  if (!name || !raw.id) return null;

  const date = raw.release_date || raw.first_air_date || null;
  const genreMap = mediaType === 'tv' ? TV_GENRES : MOVIE_GENRES;

  return {
    id: raw.id,
    mediaType,
    name,
    year: date ? date.slice(0, 4) : null,
    date,
    overview: (raw.overview || '').trim(),
    rating: typeof raw.vote_average === 'number' && raw.vote_average > 0 ? Number(raw.vote_average.toFixed(1)) : null,
    votes: raw.vote_count || 0,
    genres: (raw.genre_ids || []).map((id) => genreMap[id]).filter(Boolean),
    posterPath: raw.poster_path || null,
    backdropPath: raw.backdrop_path || null,
    popularity: raw.popularity || 0,
  };
}

// Talk shows, news bulletins, soaps, reality and kids' programming dominate
// TMDB's "on the air" list — a third of page one is daytime soap opera from
// other markets. None of it belongs in a "what to watch" article.
const JUNK_TV_GENRES = [10763, 10764, 10766, 10767, 10762];

interface ListOptions {
  fallbackType: 'movie' | 'tv';
  params?: Record<string, string>;
  limit: number;
  /** TMDB pages to merge. One page rarely yields enough usable titles. */
  pages?: number;
  minVotes?: number;
  /** Popularity floor — the only useful quality signal for unreleased films. */
  minPopularity?: number;
  excludeGenreIds?: number[];
  sortBy?: 'popularity' | 'votes';
}

async function fetchList(path: string, opts: ListOptions): Promise<TmdbTitle[]> {
  const { fallbackType, params = {}, limit, pages = 1, minVotes = 0, minPopularity = 0, excludeGenreIds, sortBy = 'popularity' } = opts;

  const raw: RawTitle[] = [];
  for (let page = 1; page <= pages; page++) {
    const data = await tmdbFetch<{ results?: RawTitle[] }>(path, { ...params, page: String(page) });
    if (!data?.results?.length) break;
    raw.push(...data.results);
  }

  const filtered = excludeGenreIds
    ? raw.filter((r) => !(r.genre_ids || []).some((g) => excludeGenreIds.includes(g)))
    : raw;

  return filtered
    .filter((r) => !r.adult && !textIsUnsafe(r.title, r.name, r.overview))
    .map((r) => normalize(r, fallbackType))
    .filter(
      (t): t is TmdbTitle =>
        // A title with no synopsis gives the writer nothing to work with.
        t !== null && t.overview.length > 40 && t.votes >= minVotes && t.popularity >= minPopularity
    )
    .sort((a, b) => (sortBy === 'votes' ? b.votes - a.votes : b.popularity - a.popularity))
    .slice(0, limit);
}

/** What the world is actually watching right now — films and series mixed. */
export function getTrending(limit = 12): Promise<TmdbTitle[]> {
  return fetchList('/trending/all/week', { fallbackType: 'movie', limit, minVotes: 50 });
}

/**
 * Genuinely anticipated films with a future US release date.
 *
 * NOT `/movie/upcoming`: that endpoint mixes in re-releases whose release_date
 * is decades in the past (La La Land, Willy Wonka), and its narrow theatrical
 * window turned up exactly one notable title against a dozen zero-vote unknowns.
 * A popularity-sorted discover query over the next eight months surfaces the
 * films readers actually care about instead.
 */
export function getUpcomingMovies(limit = 12): Promise<TmdbTitle[]> {
  const today = new Date();
  const horizon = new Date(today);
  horizon.setMonth(horizon.getMonth() + 8);

  return fetchList('/discover/movie', {
    fallbackType: 'movie',
    params: {
      'primary_release_date.gte': today.toISOString().slice(0, 10),
      'primary_release_date.lte': horizon.toISOString().slice(0, 10),
      sort_by: 'popularity.desc',
      include_adult: 'false',
      // Theatrical releases only — skips straight-to-digital filler.
      with_release_type: '2|3',
      region: REGION,
    },
    limit,
    pages: 2,
    // Unreleased films have no votes yet, so popularity is the only signal.
    minPopularity: 10,
  });
}

/** Currently in US theatres. */
export function getNowPlaying(limit = 12): Promise<TmdbTitle[]> {
  return fetchList('/movie/now_playing', {
    fallbackType: 'movie',
    params: { region: REGION },
    limit,
    pages: 2,
    minVotes: 20,
  });
}

/** Scripted series airing new episodes this week. */
export function getOnTheAirTV(limit = 12): Promise<TmdbTitle[]> {
  return fetchList('/tv/on_the_air', {
    fallbackType: 'tv',
    limit,
    pages: 3,
    minVotes: 200,
    excludeGenreIds: JUNK_TV_GENRES,
    sortBy: 'votes',
  });
}

export function getPopularTV(limit = 12): Promise<TmdbTitle[]> {
  return fetchList('/tv/popular', {
    fallbackType: 'tv',
    limit,
    pages: 2,
    minVotes: 200,
    excludeGenreIds: JUNK_TV_GENRES,
    sortBy: 'votes',
  });
}

/** Well-reviewed films in one genre — the basis for evergreen roundups. */
export function getTopRatedByGenre(genreId: number, limit = 12): Promise<TmdbTitle[]> {
  // Documentaries and TV movies are normally excluded, but excluding the very
  // genre being requested is self-defeating: the documentary roundup silently
  // returned zero results every time until this filtered the id back out.
  const excluded = [99, 10770].filter((id) => id !== genreId);

  return fetchList('/discover/movie', {
    fallbackType: 'movie',
    params: {
      with_genres: String(genreId),
      sort_by: 'vote_average.desc',
      include_adult: 'false',
      'vote_count.gte': '800',
      ...(excluded.length ? { without_genres: excluded.join(',') } : {}),
    },
    limit,
    sortBy: 'votes',
  });
}

/** "If you liked X" — TMDB's own similar-audience recommendations. */
export function getRecommendations(id: number, mediaType: 'movie' | 'tv', limit = 8): Promise<TmdbTitle[]> {
  return fetchList(`/${mediaType}/${id}/recommendations`, {
    fallbackType: mediaType,
    limit,
    minVotes: 200,
  });
}

export interface TmdbPerson {
  id: number;
  name: string;
  department: string;
  profilePath: string | null;
  /** Notable titles, most-voted first, with the role they played. */
  credits: Array<{
    name: string;
    year: string | null;
    role: string;
    rating: number | null;
    overview: string;
    backdropPath: string | null;
  }>;
  biography: string;
  birthday: string | null;
  placeOfBirth: string | null;
}

interface RawPerson {
  id: number;
  name?: string;
  adult?: boolean;
  known_for_department?: string;
  profile_path?: string | null;
  biography?: string;
  birthday?: string | null;
  place_of_birth?: string | null;
  combined_credits?: {
    cast?: Array<RawTitle & { character?: string }>;
    crew?: Array<RawTitle & { job?: string }>;
  };
}

/** Actors and directors trending this week. */
export async function getTrendingPeople(limit = 10): Promise<Array<{ id: number; name: string }>> {
  const data = await tmdbFetch<{
    results?: Array<{
      id: number;
      name?: string;
      adult?: boolean;
      known_for_department?: string;
      known_for?: Array<{ title?: string; name?: string; overview?: string; adult?: boolean }>;
    }>;
  }>('/trending/person/week');

  return (data?.results || [])
    .filter((p) => p.name && !p.adult && (p.known_for_department === 'Acting' || p.known_for_department === 'Directing'))
    // Screen on what they are known for, since the person record itself carries
    // no signal about the nature of their work.
    .filter((p) => !(p.known_for || []).some((k) => k.adult || textIsUnsafe(k.title, k.name, k.overview)))
    .map((p) => ({ id: p.id, name: p.name as string }))
    .slice(0, limit);
}

/** Full profile plus their most notable, best-reviewed work. */
export async function getPersonDetails(id: number): Promise<TmdbPerson | null> {
  const raw = await tmdbFetch<RawPerson>(`/person/${id}`, { append_to_response: 'combined_credits' });
  if (!raw?.name) return null;
  if (raw.adult || textIsUnsafe(raw.biography)) {
    console.warn(`[tmdb] skipping person ${raw.name} — fails the content safety check`);
    return null;
  }

  const cast = (raw.combined_credits?.cast || []).map((c) => ({ ...c, role: c.character ? `as ${c.character}` : 'cast' }));
  const crew = (raw.combined_credits?.crew || [])
    .filter((c) => c.job === 'Director' || c.job === 'Writer')
    .map((c) => ({ ...c, role: c.job as string }));

  // Someone who both directed and wrote a film appears twice in combined
  // credits, which would give the article two sections about the same title.
  // Roles are merged so "Interstellar, Interstellar" becomes one entry.
  const byTitle = new Map<number, (typeof cast)[number] & { role: string }>();
  for (const credit of [...cast, ...crew]) {
    const existing = byTitle.get(credit.id);
    if (existing) {
      if (!existing.role.includes(credit.role)) existing.role = `${existing.role} and ${credit.role}`;
    } else {
      byTitle.set(credit.id, { ...credit });
    }
  }

  const credits = [...byTitle.values()]
    // Vote count is the only reliable "is this notable" signal on a filmography
    // otherwise padded out with uncredited bit parts and TV guest spots. 300 is
    // low enough that character actors still yield a usable article.
    .filter((c) => (c.vote_count || 0) >= 300 && (c.overview || '').length > 40)
    .filter((c) => !c.adult && !textIsUnsafe(c.title, c.name, c.overview))
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .slice(0, 8)
    .map((c) => {
      const date = c.release_date || c.first_air_date || null;
      return {
        name: c.title || c.name || '',
        year: date ? date.slice(0, 4) : null,
        role: c.role,
        rating: typeof c.vote_average === 'number' && c.vote_average > 0 ? Number(c.vote_average.toFixed(1)) : null,
        overview: (c.overview || '').slice(0, 200),
        backdropPath: c.backdrop_path || null,
      };
    });

  return {
    id: raw.id,
    name: raw.name,
    department: raw.known_for_department || 'Acting',
    profilePath: raw.profile_path || null,
    credits,
    biography: (raw.biography || '').slice(0, 800),
    birthday: raw.birthday || null,
    placeOfBirth: raw.place_of_birth || null,
  };
}

/** Fact sheet for a person and their notable work. */
export function buildPersonSheet(p: TmdbPerson): string {
  return [
    `Name: ${p.name}`,
    `Known for: ${p.department}`,
    p.birthday ? `Born: ${p.birthday}${p.placeOfBirth ? `, ${p.placeOfBirth}` : ''}` : null,
    p.biography ? `Biography: ${p.biography}` : null,
    '',
    'Notable work:',
    ...p.credits.map(
      (c, i) =>
        `${i + 1}. "${c.name}" (${c.year || 'TBA'}) — ${c.role}${c.rating ? `, TMDB rating ${c.rating}/10` : ''}\n   ${c.overview}`
    ),
  ]
    .filter((line) => line !== null)
    .join('\n');
}

interface RawDetails extends RawTitle {
  runtime?: number;
  episode_run_time?: number[];
  tagline?: string;
  genres?: Array<{ id: number; name: string }>;
  credits?: {
    cast?: Array<{ name: string }>;
    crew?: Array<{ name: string; job: string }>;
  };
  'watch/providers'?: {
    results?: Record<string, { flatrate?: Array<{ provider_name: string }> }>;
  };
}

/** Full detail for one title: cast, director, runtime and US streaming homes. */
export async function getTitleDetails(id: number, mediaType: 'movie' | 'tv'): Promise<TmdbTitleDetails | null> {
  const raw = await tmdbFetch<RawDetails>(`/${mediaType}/${id}`, {
    append_to_response: 'credits,watch/providers',
  });
  if (!raw) return null;

  const base = normalize(raw, mediaType);
  if (!base) return null;

  // Detail responses carry genre objects rather than the ids the list endpoints return.
  if (raw.genres?.length) base.genres = raw.genres.map((g) => g.name);

  const crew = raw.credits?.crew || [];
  const director = crew.find((c) => c.job === 'Director')?.name || crew.find((c) => c.job === 'Executive Producer')?.name || null;

  return {
    ...base,
    runtime: raw.runtime || raw.episode_run_time?.[0] || null,
    tagline: raw.tagline?.trim() || null,
    director,
    cast: (raw.credits?.cast || []).slice(0, 6).map((c) => c.name),
    providers: (raw['watch/providers']?.results?.[REGION]?.flatrate || []).map((p) => p.provider_name).slice(0, 6),
  };
}

export interface TmdbTrailer {
  title: TmdbTitle;
  videoName: string;
  youtubeKey: string;
  publishedAt: string;
  daysAgo: number;
}

interface RawVideo {
  site?: string;
  type?: string;
  name?: string;
  key?: string;
  official?: boolean;
  published_at?: string;
}

/**
 * Official trailers published in the last `withinDays` days — the closest thing
 * to real film news that a data API can supply, since every field is verifiable.
 *
 * Only `type === 'Trailer'` counts. TMDB files a lot of social-media marketing
 * under 'Teaser' ("Incoming!", "1 week until a Brand New Day begins"); those are
 * ad clips, not news, and an article built on them would read like one.
 */
export async function getRecentTrailers(candidates: TmdbTitle[], withinDays = 21, limit = 7): Promise<TmdbTrailer[]> {
  const now = Date.now();

  const perTitle = await Promise.all(
    candidates.slice(0, 14).map(async (title) => {
      const data = await tmdbFetch<{ results?: RawVideo[] }>(`/${title.mediaType}/${title.id}/videos`);

      const trailers = (data?.results || [])
        .filter((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official !== false && v.key && v.published_at)
        .map((v) => ({
          title,
          videoName: v.name || 'Official Trailer',
          youtubeKey: v.key as string,
          publishedAt: v.published_at as string,
          daysAgo: Math.round((now - new Date(v.published_at as string).getTime()) / 86400000),
        }))
        .filter((t) => t.daysAgo >= 0 && t.daysAgo <= withinDays);

      // One trailer per title — a marketing push drops several in a week and
      // they would otherwise crowd out every other film.
      return trailers.sort((a, b) => a.daysAgo - b.daysAgo)[0] || null;
    })
  );

  return perTitle
    .filter((t): t is TmdbTrailer => t !== null)
    .sort((a, b) => a.daysAgo - b.daysAgo)
    .slice(0, limit);
}

export function buildTrailerSheet(trailers: TmdbTrailer[]): string {
  return trailers
    .map((t, i) =>
      [
        `${i + 1}. "${t.title.name}" (${t.title.year || 'TBA'}) — ${t.title.mediaType === 'tv' ? 'TV series' : 'film'}`,
        `Trailer "${t.videoName}" published ${t.daysAgo === 0 ? 'today' : `${t.daysAgo} day${t.daysAgo === 1 ? '' : 's'} ago`}`,
        t.title.date ? `Release date: ${formatDate(t.title.date)}` : null,
        t.title.genres.length ? `Genres: ${t.title.genres.join(', ')}` : null,
        `Synopsis: ${t.title.overview.slice(0, 280)}`,
      ]
        .filter(Boolean)
        .join('\n   ')
    )
    .join('\n\n');
}

/** Subscription services streaming a title in the US. */
export async function getProviders(id: number, mediaType: 'movie' | 'tv'): Promise<string[]> {
  const data = await tmdbFetch<{ results?: Record<string, { flatrate?: Array<{ provider_name: string }> }> }>(
    `/${mediaType}/${id}/watch/providers`
  );
  return (data?.results?.[REGION]?.flatrate || []).map((p) => p.provider_name).slice(0, 6);
}

function formatDate(iso: string | null): string {
  if (!iso) return 'date TBA';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'date TBA';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Renders titles as a fact sheet for the prompt. The writer is instructed to
 * treat this as the only permitted source of names, dates and numbers.
 */
export function buildFactSheet(titles: TmdbTitle[], opts: { withDate?: boolean } = {}): string {
  return titles
    .map((t, i) => {
      const bits = [
        `${i + 1}. "${t.name}" (${t.year || 'TBA'}) — ${t.mediaType === 'tv' ? 'TV series' : 'film'}`,
        t.genres.length ? `Genres: ${t.genres.join(', ')}` : null,
        t.rating ? `TMDB rating: ${t.rating}/10 from ${t.votes.toLocaleString('en-US')} votes` : null,
        opts.withDate && t.date ? `Release date: ${formatDate(t.date)}` : null,
        `Synopsis: ${t.overview.slice(0, 300)}`,
      ].filter(Boolean);
      return bits.join('\n   ');
    })
    .join('\n\n');
}

/** Fact sheet for a single title, including cast and where it streams. */
export function buildDetailSheet(d: TmdbTitleDetails): string {
  return [
    `Title: "${d.name}" (${d.year || 'TBA'}) — ${d.mediaType === 'tv' ? 'TV series' : 'film'}`,
    d.tagline ? `Tagline: ${d.tagline}` : null,
    d.genres.length ? `Genres: ${d.genres.join(', ')}` : null,
    d.director ? `Director: ${d.director}` : null,
    d.cast.length ? `Main cast: ${d.cast.join(', ')}` : null,
    d.runtime ? `Runtime: ${d.runtime} minutes` : null,
    d.rating ? `TMDB rating: ${d.rating}/10 from ${d.votes.toLocaleString('en-US')} votes` : null,
    d.date ? `Released: ${formatDate(d.date)}` : null,
    d.providers.length ? `Streaming in the US on: ${d.providers.join(', ')}` : 'US streaming availability: not on a subscription service right now',
    `Synopsis: ${d.overview}`,
  ]
    .filter(Boolean)
    .join('\n');
}
