import type { Metadata } from 'next';
import { getPersonDetails, profileUrl, type TmdbPerson } from '@/lib/tmdb';
import { localePrefix, type Locale } from '@/lib/blog-locale';

/**
 * Shared loading, metadata and structured data for /person/[id] in both editions.
 */

const SITE_URL = 'https://watchpulseapp.com';

export async function loadPerson(rawId: string): Promise<TmdbPerson | null> {
  if (!/^\d+$/.test(rawId)) return null;
  // A filmography changes far slower than a day.
  const person = await getPersonDetails(Number(rawId), 86400);
  // Fewer than three notable credits makes for a page with nothing on it.
  return person && person.credits.length >= 3 ? person : null;
}

export function personMetadata(
  person: TmdbPerson | null,
  id: string,
  locale: Locale = 'en'
): Metadata {
  if (!person) return { title: 'Not Found | WatchPulse', robots: { index: false, follow: false } };

  const path = `/person/${id}`;
  const url = `${SITE_URL}${localePrefix(locale)}${path}`;
  const best = person.credits.slice(0, 3).map((c) => c.name).join(', ');

  const heading =
    locale === 'tr'
      ? `${person.name} — filmleri, dizileri ve nereden başlamalı`
      : `${person.name} — Films, Series and Where to Start`;
  const description =
    locale === 'tr'
      ? `${person.name} filmleri ve dizileri: ${best} ve dahası. Puanlar, roller ve nereden başlanacağı.`
      : `${person.name}'s films and series, including ${best}. Ratings, roles and where to start.`;

  return {
    title: `${heading} | WatchPulse`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}${path}`,
        tr: `${SITE_URL}/tr${path}`,
        'x-default': `${SITE_URL}${path}`,
      },
    },
    openGraph: {
      title: heading,
      description,
      url,
      siteName: 'WatchPulse',
      type: 'profile',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      images: [{ url: profileUrl(person.profilePath) || `${SITE_URL}/og-image.jpg`, alt: person.name }],
    },
    twitter: { card: 'summary_large_image', title: person.name, description, site: '@watchpulseapp' },
    robots: { index: true, follow: true },
  };
}

export function personSchema(person: TmdbPerson, id: string, locale: Locale = 'en'): string {
  const photo = profileUrl(person.profilePath);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: `${SITE_URL}${localePrefix(locale)}/person/${id}`,
    ...(photo ? { image: photo } : {}),
    ...(person.biography ? { description: person.biography } : {}),
    ...(person.birthday ? { birthDate: person.birthday } : {}),
    ...(person.placeOfBirth ? { birthPlace: person.placeOfBirth } : {}),
    jobTitle: person.department === 'Directing' ? 'Director' : 'Actor',
  };

  // Escape "<" so a biography containing "</script>" cannot break out of the
  // block. The replacement is the two-character escape <, which JSON.parse
  // reads back as "<" — writing '<' here would substitute "<" for itself
  // and do nothing at all.
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
