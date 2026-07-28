import { strings } from '@/lib/blog-i18n';

/**
 * Search-facing copy for category pages.
 *
 * Each category page is a landing page for a distinct intent — someone typing
 * "best horror films to watch" is not the same visitor as someone typing "what
 * is on TV this week" — so each gets its own title and description rather than
 * a templated "Posts in X". Anything without an entry falls back to a generic
 * pair, which is still unique per category because the name is interpolated.
 */
export const CATEGORY_COPY: Record<string, { title: string; description: string; intro: string }> = {
  'TV Shows': {
    title: 'TV Shows — What to Watch and Where to Start',
    description:
      'Series worth starting, what is airing new episodes, and whether to jump in now or binge from the beginning.',
    intro: 'Series worth starting, what is airing now, and where a newcomer should jump in.',
  },
  'Genre Guide': {
    title: 'Genre Guides — The Best Films by Genre',
    description:
      'Curated guides to the best horror, science fiction, thriller, comedy and drama films, with what each one does well.',
    intro: 'Curated guides to the best of each genre, and what makes each film worth the evening.',
  },
  Trends: {
    title: 'Coming Soon — Upcoming Films and What Is Trending',
    description:
      'The films arriving in the months ahead, what is trending this week, and the trailers worth two minutes of your time.',
    intro: 'What is arriving next, what everyone is watching now, and which trailers earned the hype.',
  },
  Streaming: {
    title: 'Streaming Guides — Where to Watch and What Is Worth It',
    description:
      'Guides to what is worth watching across streaming services, and how to find something without losing an evening to the scroll.',
    intro: 'What is worth watching across the services, without losing an evening to the scroll.',
  },
  Entertainment: {
    title: 'Film Features — Deep Dives and Recommendations',
    description:
      'Close looks at individual films and the people who make them, plus what is playing and whether the ticket is worth buying.',
    intro: 'Close looks at the films and the people behind them.',
  },
  'Hidden Gems': {
    title: 'Hidden Gems — Overlooked Films Worth Finding',
    description:
      'Films that deserved a bigger audience than they got, and where to find them.',
    intro: 'The films that deserved a bigger audience than they got.',
  },
  'Mood Guide': {
    title: 'Mood Guides — What to Watch by How You Feel',
    description:
      'Film and series picks matched to a mood, for the nights when nothing on the homepage looks right.',
    intro: 'Picks matched to a mood, for the nights nothing looks right.',
  },
};

const TR_COPY: Record<string, { title: string; description: string; intro: string }> = {
  'TV Shows': {
    title: 'Diziler — Ne İzlenir, Nereden Başlanır',
    description:
      'Başlamaya değer diziler, bu hafta yeni bölüm yayınlayanlar ve şimdi mi başlamalı yoksa baştan mı izlemeli.',
    intro: 'Başlamaya değer diziler ve yeni bir izleyicinin nereden gireceği.',
  },
  'Genre Guide': {
    title: 'Tür Rehberleri — Türlere Göre En İyi Filmler',
    description:
      'Korku, bilim kurgu, gerilim, komedi ve dram türlerinde en iyi filmler; her birinin neyi iyi yaptığıyla birlikte.',
    intro: 'Her türün en iyileri ve hangisinin akşamınıza değdiği.',
  },
  Trends: {
    title: 'Yakında — Vizyona Girecek Filmler ve Gündemdekiler',
    description:
      'Önümüzdeki aylarda gelecek filmler, bu hafta konuşulanlar ve iki dakikanıza değen fragmanlar.',
    intro: 'Sırada ne var, şu an herkes ne izliyor.',
  },
  Streaming: {
    title: 'Platform Rehberleri — Nerede Ne İzlenir',
    description:
      'Platformlarda izlemeye değer olanlar ve bir akşamı gezinerek harcamadan bir şey bulmanın yolu.',
    intro: 'Platformlarda izlemeye değenler, gezinerek vakit kaybetmeden.',
  },
  Entertainment: {
    title: 'Sinema Dosyaları — İnceleme ve Öneriler',
    description:
      'Tek tek filmlere ve onları yapanlara yakın bakış, vizyondakiler ve bileti hak edenler.',
    intro: 'Filmlere ve arkalarındaki isimlere yakın bakış.',
  },
  'Hidden Gems': {
    title: 'Gözden Kaçanlar — Keşfedilmeyi Bekleyen Filmler',
    description: 'Hak ettiğinden az izleyiciye ulaşmış filmler ve onları nerede bulacağınız.',
    intro: 'Hak ettiğinden az izleyiciye ulaşmış filmler.',
  },
  'Mood Guide': {
    title: 'Ruh Haline Göre — Nasıl Hissediyorsanız Ona Göre İzleyin',
    description:
      'Ruh halinize göre film ve dizi seçkileri; ana sayfadaki hiçbir şeyin doğru gelmediği akşamlar için.',
    intro: 'Ruh halinize göre seçkiler, hiçbir şeyin doğru gelmediği akşamlar için.',
  },
};

export function categoryCopy(name: string, locale: 'en' | 'tr' = 'en') {
  if (locale === 'tr') {
    // A category with no hand-written entry still gets Turkish copy, so the
    // fallback must interpolate the Turkish label rather than the stored
    // English name — otherwise it reads "Genre Guide başlığı altındaki yazılar".
    const label = strings('tr').categoryLabel(name);
    return (
      TR_COPY[name] || {
        title: `${label} — Film ve Dizi Rehberleri`,
        description: `WatchPulse Günlük'te ${label} başlığı altındaki yazılar: öneriler, rehberler ve akşamınıza değecekler.`,
        intro: `Günlük'te ${label} başlığı altındaki her şey.`,
      }
    );
  }

  return (
    CATEGORY_COPY[name] || {
      title: `${name} — Film and TV Guides`,
      description: `Articles on ${name.toLowerCase()} from the WatchPulse Journal: recommendations, guides and what is worth your evening.`,
      intro: `Everything from the Journal filed under ${name}.`,
    }
  );
}
