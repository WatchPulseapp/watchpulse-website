import type { Locale } from '@/lib/blog-locale';

/**
 * Chrome strings for the Journal, per language edition.
 *
 * Article bodies are written in their own language by the generator; this covers
 * everything around them — navigation, labels, empty states. A Turkish article
 * framed in English chrome reads as a translated site, which is the impression
 * the whole edition exists to avoid.
 */

export interface JournalStrings {
  brand: string;
  heading: string;
  intro: string;
  articles: (n: number) => string;
  pageOf: (page: number, total: number) => string;
  /** Page number on its own, for a title that has no total to quote. */
  pageLabel: (page: number) => string;
  updatedDaily: string;
  searchPlaceholder: string;
  searchAria: string;
  searching: string;
  noMatch: (q: string) => string;
  clearSearch: string;
  all: string;
  categoriesAria: string;
  emptyTitle: string;
  emptyBody: string;
  notFoundTitle: string;
  notFoundBody: string;
  allArticles: string;
  keepReading: string;
  contents: string;
  sections: (n: number) => string;
  by: (author: string) => string;
  share: string;
  copyLink: string;
  linkCopied: string;
  post: string;
  leadStory: string;
  theApp: string;
  footerHeadline: string;
  footerBody: string;
  footerCta: string;
  home: string;
  journal: string;
  privacy: string;
  terms: string;
  tmdbNotice: string;
  switchTo: string;
  readingProgress: string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  /**
   * Categories are stored under one canonical English name, because that name is
   * the query key, the URL slug and the lookup key for per-category copy.
   * Translating it at write time would fork all three; translating it here keeps
   * one archive and gives each edition its own label.
   */
  categoryLabel: (name: string) => string;
  /** Heading over the standing description at the foot of a category page. */
  aboutCategory: (label: string) => string;
  /** Standfirst on a tag page, where there is no hand-written copy to use. */
  tagIntro: (tag: string, count: number) => string;
  /** Label over the tag list at the foot of an article. */
  taggedWith: string;
  /** The generator writes "5 min read" whatever the language it wrote in. */
  readTime: (value: string) => string;
}

const TR_CATEGORY_LABELS: Record<string, string> = {
  'TV Shows': 'Diziler',
  'Genre Guide': 'Tür Rehberi',
  Trends: 'Gündem',
  Streaming: 'Platformlar',
  Entertainment: 'Sinema',
  'Hidden Gems': 'Keşfedilmeyi Bekleyenler',
  'Mood Guide': 'Ruh Haline Göre',
};

const en: JournalStrings = {
  brand: 'Journal',
  heading: 'The Journal',
  intro:
    'What to watch and why — new releases, streaming guides and the films worth clearing an evening for.',
  articles: (n) => `${n} ${n === 1 ? 'article' : 'articles'}`,
  pageOf: (page, total) => `Page ${page} of ${total}`,
  pageLabel: (page) => `Page ${page}`,
  updatedDaily: 'Updated daily',
  searchPlaceholder: 'Search articles',
  searchAria: 'Search articles',
  searching: 'Searching…',
  noMatch: (q) => `No articles match “${q}”.`,
  clearSearch: 'Clear search',
  all: 'All',
  categoriesAria: 'Article categories',
  emptyTitle: 'Nothing here yet',
  emptyBody: 'Try another category.',
  notFoundTitle: 'That article is not here',
  notFoundBody:
    'The link may be old, or the piece may have moved. Search for what you were after, or pick up one of the latest below.',
  allArticles: 'All articles',
  keepReading: 'Keep reading',
  contents: 'Contents',
  sections: (n) => `${n} sections`,
  by: (author) => `By ${author}`,
  share: 'Share',
  copyLink: 'Copy link',
  linkCopied: 'Link copied',
  post: 'Post',
  leadStory: 'Lead story',
  theApp: 'The app',
  footerHeadline: 'Stop scrolling. Start watching.',
  footerBody: 'WatchPulse reads your mood and picks the film. Free on iOS and Android.',
  footerCta: 'Get the app',
  home: 'Home',
  journal: 'Journal',
  privacy: 'Privacy',
  terms: 'Terms',
  tmdbNotice:
    'Film and television data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.',
  switchTo: 'Türkçe',
  readingProgress: 'Reading progress',
  pagination: 'Pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  categoryLabel: (name) => name,
  aboutCategory: (label) => `About ${label}`,
  tagIntro: (tag, count) =>
    `${count} article${count === 1 ? '' : 's'} from the Journal on ${tag}.`,
  taggedWith: 'Filed under',
  readTime: (value) => value,
};

const tr: JournalStrings = {
  brand: 'Günlük',
  heading: 'Günlük',
  intro:
    'Bu akşam ne izlensin — yeni çıkanlar, platform rehberleri ve bir akşamınızı ayırmaya değer filmler.',
  articles: (n) => `${n} yazı`,
  pageOf: (page, total) => `Sayfa ${page} / ${total}`,
  pageLabel: (page) => `Sayfa ${page}`,
  updatedDaily: 'Her gün güncelleniyor',
  searchPlaceholder: 'Yazılarda ara',
  searchAria: 'Yazılarda ara',
  searching: 'Aranıyor…',
  noMatch: (q) => `“${q}” ile eşleşen yazı yok.`,
  clearSearch: 'Aramayı temizle',
  all: 'Tümü',
  categoriesAria: 'Yazı kategorileri',
  emptyTitle: 'Burada henüz bir şey yok',
  emptyBody: 'Başka bir kategoriye bakın.',
  notFoundTitle: 'Aradığınız yazı burada değil',
  notFoundBody:
    'Bağlantı eski olabilir ya da yazı taşınmış olabilir. Aradığınızı aratın, ya da aşağıdaki son yazılardan birine göz atın.',
  allArticles: 'Tüm yazılar',
  keepReading: 'Okumaya devam',
  contents: 'İçindekiler',
  sections: (n) => `${n} bölüm`,
  by: (author) => `${author}`,
  share: 'Paylaş',
  copyLink: 'Bağlantıyı kopyala',
  linkCopied: 'Bağlantı kopyalandı',
  post: 'Paylaş',
  leadStory: 'Öne çıkan',
  theApp: 'Uygulama',
  footerHeadline: 'Gezinmeyi bırakın, izlemeye başlayın.',
  footerBody: 'WatchPulse ruh halinize göre filmi seçer. iOS ve Android’de ücretsiz.',
  footerCta: 'Uygulamayı indir',
  home: 'Ana sayfa',
  journal: 'Günlük',
  privacy: 'Gizlilik',
  terms: 'Koşullar',
  tmdbNotice:
    'Film ve dizi verileri TMDB tarafından sağlanmaktadır. Bu ürün TMDB API’sini kullanır, ancak TMDB tarafından onaylanmış veya sertifikalandırılmış değildir.',
  switchTo: 'English',
  readingProgress: 'Okuma ilerlemesi',
  pagination: 'Sayfalama',
  previousPage: 'Önceki sayfa',
  nextPage: 'Sonraki sayfa',
  categoryLabel: (name) => TR_CATEGORY_LABELS[name] || name,
  aboutCategory: (label) => `${label} hakkında`,
  tagIntro: (tag, count) => `Günlük'te ${tag} üzerine ${count} yazı.`,
  taggedWith: 'Konular',
  readTime: (value) => {
    const minutes = value.match(/\d+/);
    return minutes ? `${minutes[0]} dk okuma` : value;
  },
};

const DICTIONARIES: Record<Locale, JournalStrings> = { en, tr };

export function strings(locale: Locale): JournalStrings {
  return DICTIONARIES[locale] || en;
}

/** The other edition of the same surface, for the language switch and hreflang. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'tr' ? 'en' : 'tr';
}

/**
 * Maps a path in one edition to the same surface in the other.
 *
 * Both editions serve the same articles under the same slugs, so switching
 * language on an article keeps the reader on that article instead of dropping
 * them back at the index.
 */
export function switchPath(pathname: string, to: Locale): string {
  const bare = pathname.replace(/^\/tr(?=\/|$)/, '') || '/blog';
  return to === 'tr' ? `/tr${bare}` : bare;
}
