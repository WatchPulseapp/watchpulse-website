import Link from 'next/link';
import { Clock, Star } from 'lucide-react';
import StoreLink from '@/components/ui/StoreLink';
import { backdropUrl, posterUrl, type TmdbTitle, type TmdbTitleDetails } from '@/lib/tmdb';
import { tmdbImage, tmdbSrcSet } from '@/lib/tmdb-image';
import { localePrefix, type Locale } from '@/lib/blog-locale';
import { titleStrings } from '@/lib/title-i18n';

/**
 * A film or series page.
 *
 * These URLs already existed in the wild — the app's shared collections link to
 * /movie/{id} and /tv/{id}, and Google had crawled 229 of them, every one a 404.
 * The data to answer them was already here in the TMDB layer, so the pages exist
 * now: a reader who follows a shared link gets the film, and the query they were
 * most likely searching ("where can I watch X") gets an answer.
 */

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">{label}</dt>
      <dd className="mt-1 text-[15px] text-text-primary">{children}</dd>
    </div>
  );
}

export default function TitlePage({
  title,
  similar = [],
  locale = 'en',
}: {
  title: TmdbTitleDetails;
  /** TMDB's own similar-audience recommendations. Empty is fine. */
  similar?: TmdbTitle[];
  locale?: Locale;
}) {
  const backdrop = backdropUrl(title.backdropPath);
  const poster = posterUrl(title.posterPath);
  const isFilm = title.mediaType === 'movie';
  const regions = Object.keys(title.providersByRegion);
  const s = titleStrings(locale);

  return (
    // The root layout hard-codes lang="tr" for the marketing site, so the
    // language is declared here for the subtree that actually knows it.
    <main lang={locale} className="min-h-screen bg-background-dark">
      {/* Backdrop, faded into the page rather than sat on top of it. */}
      <div className="relative h-[38vh] min-h-[240px] w-full overflow-hidden sm:h-[46vh]">
        {backdrop ? (
          // The backdrop is the largest thing on the page and therefore the one
          // the browser measures. It was served at w1280 whatever the screen,
          // so a phone showing it 375 pixels wide fetched a file more than
          // three times the size it could use.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tmdbImage(backdrop, 'w780')}
            srcSet={tmdbSrcSet(backdrop, 'hero')}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
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
              src={tmdbImage(poster, 'w300')}
              srcSet={tmdbSrcSet(poster, 'poster')}
              sizes="(min-width: 640px) 200px, 140px"
              alt={title.name}
              width={220}
              height={330}
              className="w-[140px] shrink-0 rounded-xl border border-white/10 shadow-card sm:w-[200px]"
            />
          )}

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-accent">
              {isFilm ? s.film : s.series}
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
                  {title.runtime} {s.minutes}
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
            {title.director && <Fact label={isFilm ? s.director : s.createdBy}>{title.director}</Fact>}
            {title.cast.length > 0 && <Fact label={s.starring}>{title.cast.join(', ')}</Fact>}
          </dl>
        )}

        {/* Where to watch — labelled by country, because availability is not the
            same everywhere and an unlabelled list would be wrong for most readers. */}
        <section className="mt-10 border-t border-white/[0.06] pt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
            {s.whereToWatch}
          </h2>

          {regions.length > 0 ? (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {regions.map((region) => (
                <div key={region}>
                  <dt className="text-[13px] text-text-secondary">{s.regions[region] || region}</dt>
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
            <p className="mt-3 text-[15px] text-text-secondary">{s.noSubscription}</p>
          )}

          <p className="mt-5 text-[13px] text-text-secondary">{s.availabilityNote}</p>
        </section>

        {/* Somewhere to go next.
            Without this the page is a cul-de-sac: a visitor arriving on "where
            can I watch X" gets their answer and leaves, and a crawler that
            reaches one title page finds no route to any other. These are TMDB's
            own similar-audience recommendations, so the connection is real
            rather than a genre label doing the work. */}
        {similar.length > 0 && (
          <section className="mt-10 border-t border-white/[0.06] pt-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
              {s.moreLikeThis(title.name)}
            </h2>

            <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {similar.map((item) => {
                const poster = posterUrl(item.posterPath, 'w342');
                return (
                  <li key={`${item.mediaType}-${item.id}`}>
                    <Link
                      href={`${localePrefix(locale)}/${item.mediaType}/${item.id}`}
                      className="group block"
                    >
                      {poster ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tmdbImage(poster, 'w300')}
                          srcSet={tmdbSrcSet(poster, 'poster')}
                          sizes="(min-width: 1024px) 160px, (min-width: 640px) 30vw, 45vw"
                          alt=""
                          width={342}
                          height={513}
                          loading="lazy"
                          className="aspect-[2/3] w-full rounded-lg border border-white/[0.08] object-cover transition-opacity group-hover:opacity-80"
                          style={{ backgroundColor: 'var(--background-card, #16181f)' }}
                        />
                      ) : (
                        <div className="aspect-[2/3] w-full rounded-lg border border-white/[0.08] bg-background-card" />
                      )}
                      <p className="mt-2 text-[13px] leading-snug text-text-primary transition-colors group-hover:text-brand-accent">
                        {item.name}
                      </p>
                      {item.year && <p className="text-[12px] text-text-secondary">{item.year}</p>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <aside className="mt-12 rounded-2xl border border-brand-primary/15 bg-brand-primary/[0.05] p-7 sm:p-8">
          <h2 className="text-[1.35rem] font-semibold leading-tight text-text-primary">
            {s.titleCtaHeading}
          </h2>
          <p className="mt-2.5 max-w-lg text-[15px] leading-[1.65] text-text-secondary">
            {s.titleCtaBody}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <StoreLink
              store="appstore"
              source="title-page"
              className="rounded-full bg-brand-primary px-5 py-2.5 text-[14px] font-semibold text-background-dark transition-opacity hover:opacity-90"
            >
              App Store
            </StoreLink>
            <StoreLink
              store="play"
              source="title-page"
              className="rounded-full border border-white/15 px-5 py-2.5 text-[14px] font-medium text-text-primary transition-colors hover:border-brand-primary/40"
            >
              Google Play
            </StoreLink>
            <Link
              href={`${localePrefix(locale)}/blog`}
              className="self-center text-[14px] text-text-secondary underline-offset-4 hover:underline"
            >
              {s.readJournal}
            </Link>
          </div>
        </aside>

        <p className="mt-10 text-[12px] text-text-secondary">{s.tmdbNotice}</p>
      </div>
    </main>
  );
}
