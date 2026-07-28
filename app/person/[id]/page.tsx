import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import { GOOGLE_PLAY_URL, APP_STORE_URL } from '@/lib/constants';
import { getPersonDetails, profileUrl, backdropUrl } from '@/lib/tmdb';

/**
 * An actor or director page.
 *
 * The last of the three URL shapes Search Console was reporting as 404s. The
 * credits already come back filtered for notability and content safety by
 * getPersonDetails, so a page only exists for someone with a real body of work —
 * which is also the only case where the page would be worth reading.
 */

// A filmography changes far less often than an hour, and without caching every
// view would cost a TMDB request and an extra round trip before first paint.
export const revalidate = 86400;

const SITE_URL = 'https://watchpulseapp.com';

type Props = { params: Promise<{ id: string }> };

async function load(rawId: string) {
  if (!/^\d+$/.test(rawId)) return null;
  const person = await getPersonDetails(Number(rawId));
  // Fewer than three notable credits makes for a page with nothing on it.
  return person && person.credits.length >= 3 ? person : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const person = await load(id);
  if (!person) return { title: 'Not Found | WatchPulse', robots: { index: false, follow: false } };

  const url = `${SITE_URL}/person/${id}`;
  const best = person.credits.slice(0, 3).map((c) => c.name).join(', ');
  const description = `${person.name}'s films and series, including ${best}. Ratings, roles and where to start.`;

  return {
    title: `${person.name} — Films, Series and Where to Start | WatchPulse`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: `${person.name} — Films and Series`,
      description,
      url,
      siteName: 'WatchPulse',
      type: 'profile',
      images: [{ url: profileUrl(person.profilePath) || `${SITE_URL}/og-image.jpg`, alt: person.name }],
    },
    twitter: { card: 'summary_large_image', title: person.name, description, site: '@watchpulseapp' },
    robots: { index: true, follow: true },
  };
}

export default async function PersonPage({ params }: Props) {
  const { id } = await params;
  const person = await load(id);
  if (!person) notFound();

  const photo = profileUrl(person.profilePath);
  const hero = backdropUrl(person.credits.find((c) => c.backdropPath)?.backdropPath || null);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: `${SITE_URL}/person/${id}`,
    ...(photo ? { image: photo } : {}),
    ...(person.biography ? { description: person.biography } : {}),
    ...(person.birthday ? { birthDate: person.birthday } : {}),
    ...(person.placeOfBirth ? { birthPlace: person.placeOfBirth } : {}),
    jobTitle: person.department === 'Directing' ? 'Director' : 'Actor',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />

      <main className="min-h-screen bg-background-dark">
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
                {person.department === 'Directing' ? 'Director' : 'Actor'}
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
              Notable work
            </h2>

            <ul className="mt-5 flex flex-col gap-4">
              {person.credits.map((credit) => (
                <li
                  key={`${credit.name}-${credit.year}`}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-white/[0.05] pb-4 last:border-b-0"
                >
                  <span className="text-[16px] font-medium text-text-primary">{credit.name}</span>
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
              Work through the filmography
            </h2>
            <p className="mt-2.5 max-w-lg text-[15px] leading-[1.65] text-text-secondary">
              Save what you want to watch, mark off what you have seen, and let WatchPulse pick the
              next one when you cannot decide.
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
    </>
  );
}
