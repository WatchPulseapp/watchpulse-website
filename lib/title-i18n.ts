import type { Locale } from '@/lib/blog-locale';

/**
 * Copy for the film, series and person pages, in both editions.
 *
 * These pages became worth translating the moment the Journal started linking to
 * them: half the archive is Turkish, and a Turkish article that hands its reader
 * an English page loses them at the click. The data on the page — poster, cast,
 * providers — is language-neutral; only the frame around it was not.
 */

export interface TitleStrings {
  film: string;
  series: string;
  minutes: string;
  director: string;
  createdBy: string;
  starring: string;
  whereToWatch: string;
  /** Shown when no country in the list carries it on subscription. */
  noSubscription: string;
  availabilityNote: string;
  titleCtaHeading: string;
  titleCtaBody: string;
  personActor: string;
  personDirector: string;
  notableWork: string;
  personCtaHeading: string;
  personCtaBody: string;
  readJournal: string;
  tmdbNotice: string;
  regions: Record<string, string>;
}

const REGIONS_EN: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  IN: 'India',
  TR: 'Turkey',
};

const REGIONS_TR: Record<string, string> = {
  US: 'Amerika Birleşik Devletleri',
  GB: 'Birleşik Krallık',
  CA: 'Kanada',
  AU: 'Avustralya',
  DE: 'Almanya',
  FR: 'Fransa',
  IN: 'Hindistan',
  TR: 'Türkiye',
};

const EN: TitleStrings = {
  film: 'Film',
  series: 'TV series',
  minutes: 'min',
  director: 'Director',
  createdBy: 'Created by',
  starring: 'Starring',
  whereToWatch: 'Where to watch',
  noSubscription:
    'Not on a subscription service in any of the countries listed here right now — it may still be available to rent or buy.',
  availabilityNote:
    'Streaming availability changes often, and it is different in every country. WatchPulse works out where you are, checks it live for that catalogue, and links straight into the app that has it.',
  titleCtaHeading: 'Track it, or find something like it',
  titleCtaBody:
    'WatchPulse remembers where you left off, tells you when a new episode lands, and picks something that fits your mood when nothing looks right.',
  personActor: 'Actor',
  personDirector: 'Director',
  notableWork: 'Notable work',
  personCtaHeading: 'Work through the filmography',
  personCtaBody:
    'Save what you want to watch, mark off what you have seen, and let WatchPulse pick the next one when you cannot decide.',
  readJournal: 'Read the Journal',
  tmdbNotice:
    'Film and television data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.',
  regions: REGIONS_EN,
};

const TR: TitleStrings = {
  film: 'Film',
  series: 'Dizi',
  minutes: 'dk',
  director: 'Yönetmen',
  createdBy: 'Yaratıcı',
  starring: 'Oyuncular',
  whereToWatch: 'Nerede izlenir',
  noSubscription:
    'Şu anda buradaki ülkelerin hiçbirinde abonelikli bir serviste değil — kiralama ya da satın alma seçeneği olabilir.',
  availabilityNote:
    'Yayın hakları sık değişir ve her ülkede farklıdır. WatchPulse bulunduğunuz ülkeyi tespit eder, o ülkenin kataloğunu anlık kontrol eder ve sizi doğrudan yapımı taşıyan uygulamaya götürür.',
  titleCtaHeading: 'Takibe al ya da benzerini bul',
  titleCtaBody:
    'WatchPulse nerede kaldığınızı hatırlar, yeni bölüm çıktığında haber verir ve hiçbiri gözünüze girmediğinde ruh halinize uyanı seçer.',
  personActor: 'Oyuncu',
  personDirector: 'Yönetmen',
  notableWork: 'Öne çıkan işleri',
  personCtaHeading: 'Filmografiyi baştan sona gezin',
  personCtaBody:
    'İzlemek istediklerinizi kaydedin, izlediklerinizi işaretleyin; karar veremediğinizde sıradakini WatchPulse seçsin.',
  readJournal: 'Günlük’ü okuyun',
  tmdbNotice:
    'Film ve dizi verileri TMDB tarafından sağlanmaktadır. Bu ürün TMDB API’sini kullanır; TMDB tarafından onaylanmış ya da sertifikalandırılmış değildir.',
  regions: REGIONS_TR,
};

export function titleStrings(locale: Locale): TitleStrings {
  return locale === 'tr' ? TR : EN;
}
