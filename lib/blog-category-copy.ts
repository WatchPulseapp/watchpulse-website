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
interface CategoryCopy {
  title: string;
  description: string;
  intro: string;
  /**
   * Standing description set below the article grid.
   *
   * A category page is the surface aimed at a query that never changes — "best
   * horror films", "what is on TV this week" — and a headline plus a grid of
   * card titles gives that query almost nothing to match. These paragraphs say
   * what the category covers and how it is put together, which is both the
   * honest answer and the text the page was missing.
   */
  body?: string[];
}

export const CATEGORY_COPY: Record<string, CategoryCopy> = {
  'TV Shows': {
    title: 'TV Shows — What to Watch and Where to Start',
    description:
      'Series worth starting, what is airing new episodes, and whether to jump in now or binge from the beginning.',
    intro: 'Series worth starting, what is airing now, and where a newcomer should jump in.',
    body: [
      'Television asks more of you than a film does. Committing to a series is committing to twenty hours, sometimes a hundred, and the usual recommendation — "it gets good in season two" — is a poor trade for the evenings it costs. The guides here try to answer the question underneath that: what is this show actually like from the first episode, and is the version of you sitting on the sofa tonight the person it was made for.',
      'The pieces cover series airing new episodes now, shows short enough to finish in a few evenings, and the long-running ones worth starting from the beginning. Each is written from current data — ratings, episode counts, where a series has got to — rather than from memory, and every title links through to its own page here with the cast, the runtime and which services carry it in your country.',
      'If you would rather not read at all: WatchPulse tracks where you left off in every series, tells you the day a new episode lands, and picks the next one when nothing looks right.',
    ],
  },
  'Genre Guide': {
    title: 'Genre Guides — The Best Films by Genre',
    description:
      'Curated guides to the best horror, science fiction, thriller, comedy and drama films, with what each one does well.',
    intro: 'Curated guides to the best of each genre, and what makes each film worth the evening.',
    body: [
      'Genre is a blunt instrument — "horror" holds both a haunted-house slow burn and ninety minutes of chase — so these guides do not stop at the label. Each film gets a paragraph on what it actually does: the tone it keeps, the thing it does better than its neighbours, and the kind of evening it suits. A list without that is just a list of names you already half-recognise.',
      'The selections come from ratings weighted by how many people actually voted, which keeps out both the forgotten films with three glowing reviews and the famous ones nobody rates highly. Horror, science fiction, thriller, comedy, drama, mystery, animation, romance, adventure, crime, fantasy and documentary each get their own guide, and every film named links to its own page with the cast, runtime and where it streams.',
    ],
  },
  Trends: {
    title: 'Coming Soon — Upcoming Films and What Is Trending',
    description:
      'The films arriving in the months ahead, what is trending this week, and the trailers worth two minutes of your time.',
    intro: 'What is arriving next, what everyone is watching now, and which trailers earned the hype.',
    body: [
      'Three kinds of piece live here. Previews of films with a confirmed release date in the months ahead, written about what is known rather than as reviews of something nobody has seen. Rundowns of what is being watched most this week, which is a different and more honest question than what is being marketed hardest. And trailer roundups, covering official trailers released in the last three weeks and what each one gives away.',
      'Release dates and viewing figures come from current data and are named exactly as they stand, so a date here is the date, not an approximation. Anything still unannounced is left out rather than guessed at — a preview that invents a release window is worse than no preview.',
    ],
  },
  Streaming: {
    title: 'Streaming Guides — Where to Watch and What Is Worth It',
    description:
      'Guides to what is worth watching across streaming services, and how to find something without losing an evening to the scroll.',
    intro: 'What is worth watching across the services, without losing an evening to the scroll.',
    body: [
      'The hard part of streaming stopped being "is there anything good" a long time ago. It is that what you want to watch is on a service you do not have, or it was there last month, or it is on three of them in one country and none in another. These guides state plainly which service carries what, and say so when the answer is that a title is rental-only.',
      'Availability is per country and changes constantly, so nothing here is presented as a universal answer. Every title links to its own page, which lists the subscription services carrying it in each of several markets. In the app, WatchPulse detects the country you are in, checks that catalogue live across twenty services, and opens the title in the app that has it.',
    ],
  },
  Entertainment: {
    title: 'Film Features — Deep Dives and Recommendations',
    description:
      'Close looks at individual films and the people who make them, plus what is playing and whether the ticket is worth buying.',
    intro: 'Close looks at the films and the people behind them.',
    body: [
      'Longer pieces about one film or one person, rather than lists. A deep dive covers the premise without spoiling it, who made it, what it does well, and — the part most write-ups skip — who it will not suit. A performer or director profile works through the filmography and recommends a specific place to start, with a reason.',
      'There are also guides to what is in cinemas now, written around the question of which films justify the trip out and which can wait. Everything is grounded in current data: cast, runtime, ratings and release dates are facts here rather than recollections, and every name links through to its own page.',
    ],
  },
  'Hidden Gems': {
    title: 'Hidden Gems — Overlooked Films Worth Finding',
    description:
      'Films that deserved a bigger audience than they got, and where to find them.',
    intro: 'The films that deserved a bigger audience than they got.',
    body: [
      'Films that rate highly with the people who found them and were never found by many others. The reasons are usually dull rather than romantic — a bad release window, no marketing budget, a title nobody could remember — and none of them say anything about the film.',
      'What each guide gives you is the case for a specific film: what it does, who it is for, and where it currently streams. Every title links to its own page with the full cast, the runtime and the services carrying it where you are, because a recommendation you cannot act on is a recommendation you will forget by the weekend.',
    ],
  },
  'Mood Guide': {
    title: 'Mood Guides — What to Watch by How You Feel',
    description:
      'Film and series picks matched to a mood, for the nights when nothing on the homepage looks right.',
    intro: 'Picks matched to a mood, for the nights nothing looks right.',
    body: [
      'Some evenings the question is not what is good. It is what you can face. Tired is not the same as sad, and neither is served by the same film that suits a night when you want to be unsettled on purpose. These guides start from the feeling and work back to the titles.',
      'Each one covers a mood — wanting comfort, wanting a shock, wanting to laugh without thinking, wanting something to sit with afterwards — and explains why each film fits, rather than trusting a genre label to carry it. WatchPulse does the same thing in the app: pick one of ten moods and it lines up films and series that match, with where to watch each one.',
    ],
  },
};

const TR_COPY: Record<string, CategoryCopy> = {
  'TV Shows': {
    title: 'Diziler — Ne İzlenir, Nereden Başlanır',
    description:
      'Başlamaya değer diziler, bu hafta yeni bölüm yayınlayanlar ve şimdi mi başlamalı yoksa baştan mı izlemeli.',
    intro: 'Başlamaya değer diziler ve yeni bir izleyicinin nereden gireceği.',
    body: [
      'Dizi, filmden çok daha fazlasını ister sizden. Bir diziye başlamak yirmi saati, bazen yüz saati göze almak demek; “ikinci sezondan sonra açılıyor” cümlesi de bunun karşılığında pek adil bir teklif değil. Buradaki rehberler asıl soruyu cevaplamaya çalışıyor: bu dizi ilk bölümünden itibaren nasıl bir şey ve bu akşam kanepede oturan siz, onun yazıldığı izleyici misiniz?',
      'Yazılar şu an yeni bölüm yayınlayan dizileri, birkaç akşamda bitebilecek kısa olanları ve baştan başlamaya değer uzun soluklu yapımları kapsıyor. Hepsi hafızadan değil güncel veriden yazılıyor — puanlar, bölüm sayıları, dizinin nereye geldiği — ve adı geçen her yapım kendi sayfasına bağlanıyor: oyuncular, süre ve bulunduğunuz ülkede hangi serviste olduğu.',
      'Okumak istemiyorsanız: WatchPulse her dizide nerede kaldığınızı tutar, yeni bölüm çıktığı gün haber verir ve hiçbiri gözünüze girmediğinde sıradakini kendisi seçer.',
    ],
  },
  'Genre Guide': {
    title: 'Tür Rehberleri — Türlere Göre En İyi Filmler',
    description:
      'Korku, bilim kurgu, gerilim, komedi ve dram türlerinde en iyi filmler; her birinin neyi iyi yaptığıyla birlikte.',
    intro: 'Her türün en iyileri ve hangisinin akşamınıza değdiği.',
    body: [
      'Tür kaba bir ölçü: “korku” hem yavaş yavaş sinen bir perili ev hikâyesini hem de doksan dakikalık bir kovalamacayı içine alıyor. Bu yüzden rehberler etikette durmuyor. Her film için asıl yaptığı şey yazılıyor — tuttuğu ton, benzerlerinden daha iyi becerdiği şey ve nasıl bir akşama uygun olduğu. Bunlar olmadan geriye yarısını zaten duyduğunuz bir isim listesi kalıyor.',
      'Seçkiler, oy sayısıyla ağırlıklandırılmış puanlardan çıkıyor; böylece hem üç kişinin övdüğü unutulmuş filmler hem de ünlü ama kimsenin beğenmediği yapımlar eleniyor. Korku, bilim kurgu, gerilim, komedi, dram, gizem, animasyon, romantik, macera, suç, fantastik ve belgeselin her biri kendi rehberine sahip; adı geçen her film oyuncu kadrosu, süresi ve nerede yayında olduğuyla birlikte kendi sayfasına bağlanıyor.',
    ],
  },
  Trends: {
    title: 'Yakında — Vizyona Girecek Filmler ve Gündemdekiler',
    description:
      'Önümüzdeki aylarda gelecek filmler, bu hafta konuşulanlar ve iki dakikanıza değen fragmanlar.',
    intro: 'Sırada ne var, şu an herkes ne izliyor.',
    body: [
      'Burada üç tür yazı var. Vizyon tarihi belli olan filmlerin ön izlemeleri — kimsenin izlemediği bir yapımı incelemek yerine bilinenler üzerinden yazılmış olanlar. Bu hafta en çok izlenenlerin dökümü ki bu, “en çok pazarlaması yapılan ne” sorusundan farklı ve daha dürüst bir soru. Ve son üç haftada yayınlanan resmî fragmanları ele alan, her birinin neyi ele verdiğini anlatan yazılar.',
      'Vizyon tarihleri ve izlenme verileri güncel kaynaktan geliyor ve olduğu gibi yazılıyor; yani buradaki bir tarih yaklaşık değil, tarihin kendisi. Henüz açıklanmamış olan tahmin edilmiyor, dışarıda bırakılıyor — uydurma bir vizyon tarihi veren bir ön izleme, hiç olmamasından kötüdür.',
    ],
  },
  Streaming: {
    title: 'Platform Rehberleri — Nerede Ne İzlenir',
    description:
      'Platformlarda izlemeye değer olanlar ve bir akşamı gezinerek harcamadan bir şey bulmanın yolu.',
    intro: 'Platformlarda izlemeye değenler, gezinerek vakit kaybetmeden.',
    body: [
      'Platformların zor tarafı “izlenecek iyi bir şey var mı” olmaktan çoktan çıktı. Asıl mesele, izlemek istediğiniz şeyin sizde olmayan bir serviste olması, geçen ay orada olup şimdi olmaması ya da bir ülkede üç serviste birden dururken başka bir ülkede hiçbirinde bulunmaması. Bu rehberler hangi yapımın hangi serviste olduğunu açıkça yazıyor; cevap “sadece kiralık” olduğunda da bunu söylüyor.',
      'Yayın hakları ülkeye göre değişiyor ve sürekli hareket ediyor, o yüzden buradaki hiçbir şey evrensel bir cevap gibi sunulmuyor. Her yapım kendi sayfasına bağlanıyor; o sayfa, farklı ülkelerde onu taşıyan abonelikli servisleri listeliyor. Uygulamada ise WatchPulse bulunduğunuz ülkeyi tespit ediyor, o ülkenin kataloğunu yirmi servis üzerinden anlık kontrol ediyor ve yapımı doğrudan onu taşıyan uygulamada açıyor.',
    ],
  },
  Entertainment: {
    title: 'Sinema Dosyaları — İnceleme ve Öneriler',
    description:
      'Tek tek filmlere ve onları yapanlara yakın bakış, vizyondakiler ve bileti hak edenler.',
    intro: 'Filmlere ve arkalarındaki isimlere yakın bakış.',
    body: [
      'Liste değil, tek bir film ya da tek bir isim üzerine uzun yazılar. Bir inceleme, konuyu ele vermeden anlatır; kimin yaptığını, neyi iyi becerdiğini ve çoğu yazının atladığı kısmı — kime uymayacağını — söyler. Oyuncu ya da yönetmen dosyaları filmografiyi baştan sona gezer ve nereden başlanacağını gerekçesiyle önerir.',
      'Bir de vizyondakiler var: hangi filmin dışarı çıkmayı hak ettiği, hangisinin bekleyebileceği sorusu etrafında yazılmış rehberler. Hepsi güncel veriye dayanıyor; oyuncu kadrosu, süre, puan ve tarihler burada hatırlanan şeyler değil, kayıtlı bilgiler. Adı geçen her isim kendi sayfasına bağlanıyor.',
    ],
  },
  'Hidden Gems': {
    title: 'Gözden Kaçanlar — Keşfedilmeyi Bekleyen Filmler',
    description: 'Hak ettiğinden az izleyiciye ulaşmış filmler ve onları nerede bulacağınız.',
    intro: 'Hak ettiğinden az izleyiciye ulaşmış filmler.',
    body: [
      'Bulanların çok beğendiği, ama pek az kişinin bulduğu filmler. Sebepleri genelde romantik değil sıkıcıdır: kötü bir vizyon takvimi, olmayan bir tanıtım bütçesi, kimsenin aklında kalmayan bir isim. Hiçbiri filmin kendisi hakkında bir şey söylemez.',
      'Her rehberin verdiği şey, belirli bir film için ortaya konmuş bir gerekçe: ne yaptığı, kime hitap ettiği ve şu an nerede yayında olduğu. Adı geçen her yapım tam oyuncu kadrosu, süresi ve bulunduğunuz yerde onu taşıyan servislerle birlikte kendi sayfasına bağlanıyor — çünkü harekete geçemediğiniz bir öneri, hafta sonuna kalmadan unutulan bir öneridir.',
    ],
  },
  'Mood Guide': {
    title: 'Ruh Haline Göre — Nasıl Hissediyorsanız Ona Göre İzleyin',
    description:
      'Ruh halinize göre film ve dizi seçkileri; ana sayfadaki hiçbir şeyin doğru gelmediği akşamlar için.',
    intro: 'Ruh halinize göre seçkiler, hiçbir şeyin doğru gelmediği akşamlar için.',
    body: [
      'Bazı akşamlar soru “iyi olan ne” değildir. “Neye dayanabilirim” dir. Yorgunluk üzgünlükle aynı şey değildir; ikisi de, bilerek tedirgin olmak istediğiniz bir gecenin filmiyle idare edilmez. Bu rehberler duygudan başlayıp yapımlara doğru gidiyor.',
      'Her biri bir ruh halini ele alıyor — sarılınacak bir şey isteme, sarsılmak isteme, düşünmeden gülmek isteme, sonrasında üzerine oturulacak bir şey isteme — ve her filmin neden uyduğunu tür etiketine güvenmek yerine tek tek anlatıyor. WatchPulse uygulamada da aynısını yapıyor: on ruh halinden birini seçin, size ona uyan film ve dizileri, her birinin nerede izleneceğiyle birlikte getirsin.',
    ],
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
