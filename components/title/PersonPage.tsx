import Link from 'next/link';
import { Star } from 'lucide-react';
import { GOOGLE_PLAY_URL, APP_STORE_URL } from '@/lib/constants';
import { profileUrl, backdropUrl, type TmdbPerson } from '@/lib/tmdb';
import { localePrefix, type Locale } from '@/lib/blog-locale';
import { titleStrings } from '@/lib/title-i18n';

/**
 * An actor or director page.
 *
 * The credits already come back filtered for notability and content safety by
 * getPersonDetails, so a page only exists for someone with a real body of work —
 * which is also the only case where the page would be worth reading. Each credit
 * links on to its own film or series page, which is what turns a filmography
 * into a route through the site rather than a dead end.
 */
export default function PersonPage({
  person,
  locale = 'en',
}: {
  person: TmdbPerson;
  locale?: Locale;
}) {
  const s = titleStrings(locale);
  const prefix = localePrefix(locale);
  const photo = profileUrl(person.profilePath);
  const hero = backdropUrl(person.credits.find((c) => c.backdropPath)?.backdropPath || null);
  const role = person.department === 'Directing' ? s.personDirector : s.personActor;

  return (
    <main lang={locale} className="min-h-screen bg-background-dark">
      <div className="relative h-[30vh] min-h-[200px] w-full overflow-hidden">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero} alt="" className="h-full w-full object-cover opacity-50" />
        ) : (
          <div className="h-full w-full bg-background-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-background-dark/30" />
      </div>

      <div className="mx-auto -mt-24 w-full max-w-5xl px-5 pb-20 sm:px-6 md:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={person.name}
              width={200}
              height={300}
              className="w-[130px] shrink-0 rounded-xl border border-white/10 object-cover shadow-card sm:w-[180px]"
            />
          )}
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-accent">
              {role}
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-text-primary sm:text-[2.75rem]">
              {person.name}
            </h1>
            {(person.birthday || person.placeOfBirth) && (
              <p className="mt-3 text-[14px] text-text-secondary">
                {person.birthday}
                {person.birthday && person.placeOfBirth && ' · '}
                {person.placeOfBirth}
              </p>
            )}
          </div>
        </div>

        {person.biography && (
          <p className="mt-10 max-w-2xl text-[16.5px] leading-[1.8] text-text-secondary">
            {person.biography}
          </p>
        )}

        <section className="mt-12 border-t border-white/[0.06] pt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
            {s.notableWork}
          </h2>

          <ul className="mt-5 flex flex-col gap-4">
            {person.credits.map((credit) => (
              <li
                key={`${credit.id}-${credit.role}`}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-white/[0.05] pb-4 last:border-b-0"
              >
                <Link
                  href={`${prefix}/${credit.mediaType}/${credit.id}`}
                  className="text-[16px] font-medium text-text-primary underline-offset-4 transition-colors hover:text-brand-accent hover:underline"
                >
                  {credit.name}
                </Link>
                {credit.year && <span className="text-[14px] text-text-secondary">({credit.year})</span>}
                <span className="text-[13px] text-text-secondary">{credit.role}</span>
                {credit.rating !== null && (
                  <span className="ml-auto flex items-center gap-1.5 text-[13px] text-text-secondary">
                    <Star className="h-3.5 w-3.5 text-brand-star" />
                    <span className="tabular-nums text-text-primary">{credit.rating}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <aside className="mt-12 rounded-2xl border border-brand-primary/15 bg-brand-primary/[0.05] p-7 sm:p-8">
          <h2 className="text-[1.35rem] font-semibold leading-tight text-text-primary">
            {s.personCtaHeading}
          </h2>
          <p className="mt-2.5 max-w-lg text-[15px] leading-[1.65] text-text-secondary">
            {s.personCtaBody}
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
              href={`${prefix}/blog`}
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
