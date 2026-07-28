import Link from 'next/link';
import { Clock, Star } from 'lucide-react';
import { GOOGLE_PLAY_URL, APP_STORE_URL } from '@/lib/constants';
import { backdropUrl, posterUrl, type TmdbTitleDetails } from '@/lib/tmdb';

/**
 * A film or series page.
 *
 * These URLs already existed in the wild — the app's shared collections link to
 * /movie/{id} and /tv/{id}, and Google had crawled 229 of them, every one a 404.
 * The data to answer them was already here in the TMDB layer, so the pages exist
 * now: a reader who follows a shared link gets the film, and the query they were
 * most likely searching ("where can I watch X") gets an answer.
 */

const REGION_LABEL: Record<string, string> = {
  TR: 'Turkey',
  US: 'United States',
  GB: 'United Kingdom',
};

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">{label}</dt>
      <dd className="mt-1 text-[15px] text-text-primary">{children}</dd>
    </div>
  );
}

export default function TitlePage({ title }: { title: TmdbTitleDetails }) {
  const backdrop = backdropUrl(title.backdropPath);
  const poster = posterUrl(title.posterPath);
  const isFilm = title.mediaType === 'movie';
  const regions = Object.keys(title.providersByRegion);

  return (
    <main className="min-h-screen bg-background-dark">
      {/* Backdrop, faded into the page rather than sat on top of it. */}
      <div className="relative h-[38vh] min-h-[240px] w-full overflow-hidden sm:h-[46vh]">
        {backdrop ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={backdrop} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-background-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-background-dark/20" />
      </div>

      <div className="mx-auto -mt-28 w-full max-w-5xl px-5 pb-20 sm:px-6 md:px-8">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:gap-8">
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={title.name}
              width={220}
              height={330}
              className="w-[140px] shrink-0 rounded-xl border border-white/10 shadow-card sm:w-[200px]"
            />
          )}

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-accent">
              {isFilm ? 'Film' : 'TV series'}
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-text-primary sm:text-[2.75rem]">
              {title.name}
              {title.year && <span className="ml-2 font-normal text-text-secondary">({title.year})</span>}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-text-secondary">
              {title.rating !== null && (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-brand-star" />
                  <span className="tabular-nums text-text-primary">{title.rating}</span>
                  <span className="text-text-secondary">/ 10</span>
                </span>
              )}
              {title.runtime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-text-secondary" />
                  {title.runtime} min
                </span>
              )}
              {title.genres.length > 0 && <span>{title.genres.join(' · ')}</span>}
            </div>
          </div>
        </div>

        {title.tagline && (
          <p className="mt-10 text-[18px] italic leading-[1.6] text-text-secondary">“{title.tagline}”</p>
        )}

        {title.overview && (
          <p className="mt-6 max-w-2xl text-[16.5px] leading-[1.8] text-text-secondary">{title.overview}</p>
        )}

        {(title.director || title.cast.length > 0) && (
          <dl className="mt-10 grid gap-6 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
            {title.director && <Fact label={isFilm ? 'Director' : 'Created by'}>{title.director}</Fact>}
            {title.cast.length > 0 && <Fact label="Starring">{title.cast.join(', ')}</Fact>}
          </dl>
        )}

        {/* Where to watch — labelled by country, because availability is not the
            same everywhere and an unlabelled list would be wrong for most readers. */}
        <section className="mt-10 border-t border-white/[0.06] pt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
            Where to watch
          </h2>

          {regions.length > 0 ? (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {regions.map((region) => (
                <div key={region}>
                  <dt className="text-[13px] text-text-secondary">{REGION_LABEL[region] || region}</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-2">
                    {title.providersByRegion[region].map((name) => (
                      <span
                        key={name}
                        className="rounded-lg border border-white/[0.08] bg-background-card px-3 py-1.5 text-[13px] text-text-primary"
                      >
                        {name}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3 text-[15px] text-text-secondary">
              Not on a subscription service in Turkey, the US or the UK right now — it may still be
              available to rent or buy.
            </p>
          )}

          <p className="mt-5 text-[13px] text-text-secondary">
            Streaming availability changes often. WatchPulse checks it live for Turkey and links
            straight into the app that has it.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-brand-primary/15 bg-brand-primary/[0.05] p-7 sm:p-8">
          <h2 className="text-[1.35rem] font-semibold leading-tight text-text-primary">
            Track it, or find something like it
          </h2>
          <p className="mt-2.5 max-w-lg text-[15px] leading-[1.65] text-text-secondary">
            WatchPulse remembers where you left off, tells you when a new episode lands, and picks
            something that fits your mood when nothing looks right.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-brand-primary px-5 py-2.5 text-[14px] font-semibold text-background-dark transition-opacity hover:opacity-90"
            >
              App Store
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener"
              className="rounded-full border border-white/15 px-5 py-2.5 text-[14px] font-medium text-text-primary transition-colors hover:border-brand-primary/40"
            >
              Google Play
            </a>
            <Link
              href="/blog"
              className="self-center text-[14px] text-text-secondary underline-offset-4 hover:underline"
            >
              Read the Journal
            </Link>
          </div>
        </aside>

        <p className="mt-10 text-[12px] text-text-secondary">
          Film and television data provided by TMDB. This product uses the TMDB API but is not
          endorsed or certified by TMDB.
        </p>
      </div>
    </main>
  );
}
