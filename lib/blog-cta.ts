import type { Locale } from '@/lib/blog-locale';

/**
 * Variants for the end-of-article app prompt.
 *
 * Every line is a feature the app actually ships, worded from the site's own
 * showcase copy in contexts/LanguageContext.tsx — which is itself written from
 * the app. Nothing is invented: a reader who installs on the strength of a
 * promise the app does not keep is worse than a reader who never installs.
 *
 * The Turkish set is not a translation of the English one — each is written for
 * its own reader, and the slug picks a different feature on each side so someone
 * switching language meets a second angle rather than the same sentence twice.
 */

export interface CtaVariant {
  /** The feature's own name, as the app uses it. */
  eyebrow: string;
  headline: string;
  body: string;
}

type VariantKey =
  | 'mood'
  | 'taste'
  | 'tracking'
  | 'upcoming'
  | 'collections'
  | 'mini'
  | 'social'
  | 'duels'
  | 'dailyPick'
  | 'actors'
  | 'company'
  | 'platforms';

const EN: Record<VariantKey, CtaVariant> = {
  mood: {
    eyebrow: 'MoodPulse',
    headline: 'Pick a feeling, not a title',
    body: 'WatchPulse asks one question — how do you want to feel tonight? — then lines up films and shows that match it. Ten moods, from Tired to Nostalgic.',
  },
  taste: {
    eyebrow: 'For You',
    headline: 'Recommendations that learn what you like',
    body: 'The For You feed builds a taste profile from what you watch, rate and favourite, then comes back with fresh picks every week. Like and dislike sharpen it.',
  },
  tracking: {
    eyebrow: 'Tracking',
    headline: 'Never lose your place in a series',
    body: 'Mark your progress episode by episode and get a notification the moment a new one drops — or the day a film you are waiting for reaches cinemas.',
  },
  upcoming: {
    eyebrow: 'Upcoming',
    headline: 'Get told when these actually land',
    body: 'Follow what you are waiting for and keep a calendar of everything still to come, with a notification on release day.',
  },
  collections: {
    eyebrow: 'Collections',
    headline: 'Turn this list into your own',
    body: 'Build themed collections — from the Marvel run to "films that fix a bad day" — then send one to a friend with a single code or open it to everyone in Discover.',
  },
  mini: {
    eyebrow: 'MiniPulse',
    headline: 'Short series you can actually finish',
    body: 'MiniPulse surfaces shows you can get through in a few evenings, so you start something instead of scrolling past it.',
  },
  social: {
    eyebrow: 'Social',
    headline: 'Find people who watch what you watch',
    body: 'Match on a fifteen-dimension taste score, then talk about it in real time — voice notes, GIFs, and the recommendation you cannot stop thinking about.',
  },
  duels: {
    eyebrow: 'Duels',
    headline: 'Two films enter, you decide',
    body: 'Every weekend two titles go head to head from Friday evening to Sunday evening, and the winner is settled by vote. Yours counts as much as anyone else’s.',
  },
  dailyPick: {
    eyebrow: 'Daily Pick',
    headline: 'One film, one series, chosen today',
    body: 'When nothing appeals and the scrolling has gone on too long, the daily pick is one of each — already decided, one tap away.',
  },
  actors: {
    eyebrow: 'Favourite Actors',
    headline: 'Follow the people, not just the films',
    body: 'Follow the actors you keep coming back to and hear about their next project before it turns up in a trailer.',
  },
  company: {
    eyebrow: 'Watching With',
    headline: 'The right film depends on who is on the sofa',
    body: 'Tell WatchPulse whether it is a partner, family, friends or just you, and the recommendations change accordingly.',
  },
  platforms: {
    eyebrow: 'Where to Watch',
    headline: 'Stop hunting for which service has it',
    body: 'WatchPulse works out where you are and checks the services that actually stream there, then opens the title straight in the right app.',
  },
};

const TR: Record<VariantKey, CtaVariant> = {
  mood: {
    eyebrow: 'MoodPulse',
    headline: 'Film seçme, ruh halini seç',
    body: 'WatchPulse tek bir soru sorar: bu akşam ne hissetmek istiyorsun? Cevabını seç, sana o duyguya uyan film ve dizileri getirsin. Yorgun’dan Nostaljik’e on ruh hali.',
  },
  taste: {
    eyebrow: 'Sana Özel',
    headline: 'Zevkinizi öğrenen öneriler',
    body: 'Sana Özel akışı; izlediklerinizden, puanladıklarınızdan ve favorilerinizden zevk profilinizi çıkarır, her hafta yenilenen önerilerle karşınıza gelir. Beğen–beğenme geri bildiriminizle daha da isabetli olur.',
  },
  tracking: {
    eyebrow: 'Takip',
    headline: 'Dizide nerede kaldığınızı bir daha unutmayın',
    body: 'İlerlemenizi bölüm bölüm işaretleyin; yeni bölüm yayınlandığında ya da beklediğiniz film vizyona girdiğinde bildirim gelsin.',
  },
  upcoming: {
    eyebrow: 'Yaklaşanlar',
    headline: 'Ne zaman çıktığını size haber versin',
    body: 'Beklediklerinizi takibe alın, yaklaşan yayınlar takviminde hepsini bir arada tutun; çıktığı gün bildirim gelsin.',
  },
  collections: {
    eyebrow: 'Koleksiyonlar',
    headline: 'Bu listeyi kendi koleksiyonunuza çevirin',
    body: 'Marvel Evreni’nden “kötü günü toparlayan filmler”e temalı koleksiyonlar kurun; tek bir WP kodu ile arkadaşınıza gönderin ya da Keşfet’te herkese açın.',
  },
  mini: {
    eyebrow: 'MiniPulse',
    headline: 'Gerçekten bitirebileceğiniz kısa diziler',
    body: 'MiniPulse birkaç akşamda bitirebileceğiniz dizileri öne çıkarır; böylece listede gezinmek yerine bir şeye başlarsınız.',
  },
  social: {
    eyebrow: 'Sosyal',
    headline: 'Sizinle aynı filmleri sevenler burada',
    body: 'On beş boyutlu uyum puanıyla zevkiniz tutan insanlarla eşleşin, sonra gerçek zamanlı konuşun — sesli mesaj, GIF ve aklınızdan çıkmayan o öneriyle.',
  },
  duels: {
    eyebrow: 'Düellolar',
    headline: 'İki yapım kapışır, kararı siz verirsiniz',
    body: 'Her hafta sonu Cuma akşamından Pazar akşamına iki yapım karşı karşıya gelir; kazananı oylar belirler. Sizinki de diğerleri kadar sayar.',
  },
  dailyPick: {
    eyebrow: 'Bugünün Seçimi',
    headline: 'Bugün için bir film, bir dizi',
    body: 'Hiçbiri çekmediğinde ve listede gezinmek uzadığında, günün seçimi birer tane hazır bekliyor — karar verilmiş, tek dokunuş uzakta.',
  },
  actors: {
    eyebrow: 'Favori Oyuncular',
    headline: 'Sadece filmleri değil, oyuncuları da takip edin',
    body: 'Dönüp dönüp izlediğiniz oyuncuları takibe alın; yeni projelerinden fragman çıkmadan haberdar olun.',
  },
  company: {
    eyebrow: 'Kime Göre',
    headline: 'Doğru film, kanepede kimin olduğuna bağlı',
    body: 'Sevgilinizle mi, ailenizle mi, arkadaşlarınızla mı, yoksa tek başınıza mı — WatchPulse’a söyleyin, öneriler ona göre değişsin.',
  },
  platforms: {
    eyebrow: 'Nerede Ne Var',
    headline: 'Hangi platformda olduğunu aramayı bırakın',
    body: 'WatchPulse bulunduğunuz ülkeyi tespit eder, orada gerçekten yayında olan servisleri tarar ve yapımı tek dokunuşla doğrudan ilgili uygulamada açar.',
  },
};

const DICTIONARIES: Record<Locale, Partial<Record<VariantKey, CtaVariant>>> = { en: EN, tr: TR };

/**
 * Categories map to the features a reader of that category would actually use.
 *
 * A list rather than a single key, because the generator's output is not evenly
 * spread — "Genre Guide" alone covers two of the ten story formats, so pinning
 * it to one feature meant nearly half the archive signed off with the same
 * paragraph. Each list holds only features that genuinely fit the category, and
 * the slug picks between them, so the choice stays stable per article while the
 * archive as a whole varies.
 */
const BY_CATEGORY: Record<string, VariantKey[]> = {
  'TV Shows': ['tracking', 'mini', 'social'],
  'Binge Worthy': ['mini', 'tracking'],
  'Trends': ['upcoming', 'duels', 'taste'],
  'Genre Guide': ['collections', 'mood', 'dailyPick', 'taste'],
  'Hidden Gems': ['collections', 'dailyPick', 'taste'],
  'Mood Guide': ['mood', 'dailyPick', 'company'],
  'Psychology': ['mood', 'taste'],
  'Weekend Watch': ['duels', 'company', 'dailyPick'],
  'Date Night': ['company', 'mood'],
  'Family Time': ['company', 'collections'],
  'Entertainment': ['taste', 'actors', 'dailyPick'],
  // A streaming article leaves the reader holding one question — which service
  // actually has this where I live — and the finder is the answer to it.
  'Streaming': ['platforms', 'taste', 'collections'],
  'AI & Technology': ['taste', 'mood'],
  'Technology': ['taste', 'social'],
};

/** Stable per-slug hash, so an article always signs off the same way. */
function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return hash;
}

/**
 * The rotation for articles whose category has no obvious feature. The two
 * editions start at different points so a reader who switches language is not
 * shown the same feature twice; the Turkish one leads with where-to-watch,
 * which is the most concrete thing the app does for a reader who already knows
 * the local services by name.
 */
const ROTATION: Record<Locale, VariantKey[]> = {
  en: ['mood', 'taste', 'platforms', 'tracking', 'collections', 'social', 'dailyPick', 'duels'],
  tr: ['platforms', 'mood', 'taste', 'tracking', 'collections', 'social', 'dailyPick', 'duels'],
};

/**
 * Picks a variant for a post. Category first, since that is the strongest signal
 * about what the reader came for; otherwise the slug is hashed so the choice is
 * stable — the same article always shows the same prompt, which keeps the page
 * cacheable and stops it changing under a returning reader.
 *
 * The Turkish edition offsets the hash, so an article does not show the same
 * feature in both languages. A reader who switches language gets a second angle
 * on the app rather than the same sentence twice.
 */
export function pickCtaVariant(category: string, slug: string, locale: Locale = 'en'): CtaVariant {
  const variants = DICTIONARIES[locale] || EN;
  // Present in both editions, so an edition that has no entry for the chosen
  // key falls back to a real prompt rather than rendering an empty sign-off.
  const fallback = variants.taste || EN.taste;

  // Offset so an article does not lead with the same feature in both editions.
  // A reader who switches language gets a second angle on the app rather than
  // the same sentence twice.
  const hash = hashSlug(slug) + (locale === 'tr' ? 1 : 0);

  const forCategory = BY_CATEGORY[category];
  if (forCategory?.length) return variants[forCategory[hash % forCategory.length]] || fallback;

  const rotation = ROTATION[locale] || ROTATION.en;
  return variants[rotation[hash % rotation.length]] || fallback;
}

/** Store buttons and their surrounding words, per edition. */
export const CTA_CHROME: Record<Locale, { getIt: string; alsoOn: (store: string) => string }> = {
  en: { getIt: 'Get it free', alsoOn: (store) => `Also on ${store}` },
  tr: { getIt: 'Ücretsiz indir', alsoOn: (store) => `${store}’da da var` },
};
