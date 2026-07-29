'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'tr' || savedLang === 'en') {
      setLanguageState(savedLang);
    } else if (typeof navigator !== 'undefined' && !navigator.language.toLowerCase().startsWith('tr')) {
      setLanguageState('en');
    }
  }, []);

  // Keep <html lang> in sync: Turkish casing rules (i -> İ) must not apply to
  // English text when CSS text-transform: uppercase is used, and vice versa.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

const translations = {
  tr: {
    nav: {
      features: 'Özellikler',
      social: 'Sosyal',
      howItWorks: 'Nasıl Çalışır',
      faq: 'SSS',
      blog: 'Blog',
      download: 'İndir',
    },
    hero: {
      // The brand leads here because the H1 below is the question, not the name —
      // without this the highest-authority page on the site never says what it
      // is called in visible text above the fold.
      badge: "WatchPulse · Google Play ve App Store'da yayında",
      title1: 'BU AKŞAM',
      title2: 'NE İZLESEM?',
      subtitle: 'Yarım saat gezinip hiçbir şey seçememek yok artık. WatchPulse ruh haline göre önerir, kaldığın bölümü hatırlar, filmin hangi platformda olduğunu söyler.',
      getItOn: 'Şuradan indir',
      downloadOn: 'Şuradan indir',
      trust: 'Ücretsiz · Türkçe & İngilizce · Android ve iOS',
      chipQuestion: 'İzlerken ne hissetmek istersin?',
      chip1: 'Nostaljik',
      chip2: 'Romantik',
      chip3: 'Heyecanlı',
      chip4: 'Rahat',
      scrollDown: 'Keşfet',
    },
    facts: {
      moods: '10',
      moodsLabel: 'ruh hali',
      themes: '22',
      themesLabel: 'tema',
      platforms: '14',
      platformsLabel: 'platform',
      catalog: 'Binlerce',
      catalogLabel: 'film & dizi',
    },
    showcase: {
      mood: {
        eyebrow: 'MoodPulse',
        title: 'RUH HALİNE GÖRE İZLE',
        desc: 'Uygulama tek bir soru sorar: "İzlerken ne hissetmek istersin?" Cevabını seç, MoodPulse o duyguya uyan film ve dizileri önüne getirsin.',
        b1: "Yorgun'dan Nostaljik'e 10 farklı ruh hali",
        b2: 'Film ve dizi için ayrı öneri akışları',
        b3: 'MiniPulse: hızlıca bitirebileceğin kısa diziler',
      },
      ai: {
        eyebrow: 'Sana Özel',
        title: 'ZEVKİNİ ÖĞRENEN YAPAY ZEKA',
        desc: 'Sana Özel akışı; izlediklerinden, puanladıklarından ve favorilerinden zevk profilini çıkarır, her hafta yenilenen önerilerle karşına gelir.',
        b1: 'Haftalık ve anlık olmak üzere iki öneri modu',
        b2: 'Beğen / beğenme geri bildirimiyle her hafta daha isabetli',
        b3: 'Google Gemini destekli öneri motoru',
      },
      platforms: {
        eyebrow: 'Nerede Ne Var',
        title: 'HANGİ PLATFORMDA? ANINDA GÖR',
        desc: "Filmi bulup bir de hangi platformda diye aramak devri bitti. WatchPulse bulunduğun ülkeyi algılar, orada gerçekten yayında olan servisleri tarar; tek dokunuşla seni doğrudan izleme uygulamasına götürür.",
        b1: "Netflix'ten Tabii'ye, MUBI'den TOD'a 20 platform",
        b2: 'Her platformun orijinal içerik vitrini',
        b3: 'Deep link ile tek dokunuşta izlemeye geç',
      },
      tracking: {
        eyebrow: 'Takip',
        title: 'HİÇBİR BÖLÜMÜ KAÇIRMA',
        desc: 'Nerde kaldın? WatchPulse hatırlıyor. Sezon sezon ilerlemeni işaretle; yeni bölüm yayınlandığında, beklediğin film vizyona girdiğinde bildirim gelsin.',
        b1: 'Bölüm bölüm ilerleme takibi',
        b2: 'Yeni bölüm ve vizyon bildirimleri',
        b3: 'Yaklaşan yayınlar takvimi',
      },
      collections: {
        eyebrow: 'Koleksiyonlar',
        title: 'KOLEKSİYONUNU KUR, PAYLAŞ',
        desc: "Marvel Evreni'nden \"İyi Hissettiren Filmler\"e: temalı koleksiyonlar oluştur, tek kodla arkadaşına gönder, istersen keşfette herkese aç.",
        b1: 'WP-XXXX koduyla anında paylaşım',
        b2: 'Keşfet akışında topluluğa açık listeler',
        b3: "Premium'da arkadaşlarınla ortak koleksiyon",
      },
    },
    social: {
      eyebrow: 'Sosyal',
      title: 'AYNI FİLMLERİ SEVEN İNSANLAR BURADA',
      desc: 'WatchPulse aynı zamanda film severlerin sosyal ağı: zevkine göre eşleş, gerçek zamanlı sohbet et, düşünceni paylaş.',
      match: {
        title: 'Eşleşme',
        desc: 'Uyum, ortak filmlerden tür ve yönetmen tercihine, izleme alışkanlığından zevkinin zaman içinde nasıl değiştiğine kadar 15 ayrı boyutta hesaplanır — ve kiminle neden eşleştiğin tek tek gösterilir.',
      },
      chat: {
        title: 'Gerçek Zamanlı Sohbet',
        desc: 'Eşleştikten sonra anlık mesajlaşma: metin, görsel, GIF ve sesli mesaj.',
      },
      posts: {
        title: 'Gönderiler & Anketler',
        desc: 'Her gönderi bir yapıma bağlıdır. Beş tür var: tartışma, inceleme, öneri, soru ve süreli anket. Spoiler etiketlediğin içerik, karşı taraf dokunana kadar kapalı kalır.',
      },
      follow: {
        title: 'Takip Sistemi',
        desc: 'Takip et, istekleri onayla; hesabını gizliye alabilir, istediğini engelleyebilirsin.',
      },
      chatDemo: {
        name: 'Elif',
        status: 'çevrimiçi',
        msg1: 'Bu akşam film gecesi mi? 🍿',
        msg2: 'MoodPulse "Nostaljik" önerdi: Cinema Paradiso',
        msg3: 'Uyum puanımız %92 boşuna değil 😄',
        typing: 'yazıyor…',
      },
    },
    grid: {
      title: 'DAHA BİTMEDİ',
      subtitle: 'Küçük görünen, vazgeçilmez olan detaylar.',
      duels: {
        title: 'Hafta Sonu Düelloları',
        desc: 'Cuma 20:00\'den Pazar 20:00\'ye iki yapım kapışır; kazananı senin oyun belirler.',
      },
      recommendFor: {
        title: 'Kime Göre Öneri',
        desc: 'Sevgilinle, ailenle, arkadaşlarınla ya da tek başına: kiminle izleyeceğine göre öneri al.',
      },
      dailyPick: {
        title: 'Bugünün Seçimi',
        desc: 'Her gün seçilen bir film ve bir dizi; kararsız kaldığında tek dokunuş yeter.',
      },
      actors: {
        title: 'Favori Oyuncular',
        desc: 'Sevdiğin oyuncuları takip et, yeni projelerinden ilk sen haberdar ol.',
      },
      themes: {
        title: '22 Tema',
        desc: 'Spotify yeşilinden Blade Runner neonuna: uygulama senin tarzına bürünsün.',
      },
    },
    how: {
      eyebrow: 'Nasıl Çalışır',
      title: 'ÜÇ ADIMDA HAZIRSIN',
      step1: {
        title: 'İndir, hesabını aç',
        desc: "Google Play ya da App Store'dan ücretsiz indir; e-posta veya Google ile giriş yap.",
      },
      step2: {
        title: 'Zevkini öğret',
        desc: 'Birkaç film puanla, favori türlerini seç; profilin oturmaya başlasın.',
      },
      step3: {
        title: 'İzle, takip et, paylaş',
        desc: 'Önerini al, bölümlerini işaretle, koleksiyonunu arkadaşlarına gönder.',
      },
    },
    premium: {
      eyebrow: 'Premium',
      title: 'İSTEYENE TAM GAZ',
      desc: 'WatchPulse ücretsiz; premium, deneyimi genişletmek isteyenler için.',
      f1: '20 premium tema',
      f2: 'Sınırsız ve ortak koleksiyonlar',
      f3: 'Dizi takip ekranı',
      f4: 'Sınırsız eşleşme hakkı',
      f5: 'Reklamsız deneyim',
      note: 'Aylık, 6 aylık veya yıllık; istediğin zaman iptal et.',
    },
    faq: {
      eyebrow: 'SSS',
      title: 'MERAK EDİLENLER',
      q1: 'WatchPulse ücretsiz mi?',
      a1: 'Evet. İndirmek ve kullanmak tamamen ücretsiz: takip, öneriler, sosyal özellikler, 3 koleksiyon ve 2 tema ücretsiz sürümde. Premium; sınırsız koleksiyon, 20 ek tema, dizi takip ekranı ve reklamsız deneyim ekler.',
      q2: 'Hangi cihazlarda çalışıyor?',
      a2: "Android telefonlarda (Google Play) ve iPhone'da (App Store) çalışır. Uygulama Türkçe ve İngilizce'dir.",
      q3: "Türkiye'deki platformları destekliyor mu?",
      a3: "Evet. Uygulama bulunduğunuz ülkeyi algılar ve o ülkenin kataloğunu yükler. Türkiye'de Netflix, Prime Video, Disney+ gibi küresel servislerin yanında Exxen, Tabii, TOD, puhutv, MUBI gibi yerel platformlar dahil 20 servisi tarar.",
      q4: 'Öneriler nasıl çalışıyor?',
      a4: 'İzlediklerin, puanladıkların ve seçtiğin ruh hali zevk profilini oluşturur; yapay zeka önerilerini bu profile göre yapar. Beğen/beğenme geri bildirimlerinle zamanla daha isabetli olur.',
      q5: 'Sosyal özellikler neler?',
      a5: 'Film zevkine göre eşleşme, gerçek zamanlı sohbet (sesli mesaj ve GIF destekli), gönderiler, anketler ve takip sistemi. Hesabını gizli yapabilir, istediğin kullanıcıyı engelleyebilirsin.',
      q6: 'Verilerim güvende mi?',
      a6: 'Verilerin şifreli bağlantıyla taşınır ve üçüncü taraflara satılmaz. Hesabını ve tüm verilerini istediğin an uygulamadan ya da web sitesinden kalıcı olarak silebilirsin.',
    },
    download: {
      title: 'NABZINI TUTMAYA BAŞLA',
      subtitle: "İndirmesi bir dakika; 'bu akşam ne izlesem' derdini bitirmesi ömürlük.",
    },
    footer: {
      description: 'Film & dizi takibi, yapay zeka önerileri, platform bulucu ve film zevkine göre sosyal eşleşme; hepsi tek uygulamada.',
      product: 'Ürün',
      features: 'Özellikler',
      howItWorks: 'Nasıl Çalışır',
      faqLink: 'SSS',
      blog: 'Blog',
      legal: 'Yasal',
      privacy: 'Gizlilik Politikası',
      terms: 'Kullanım Koşulları',
      deleteAccount: 'Hesap Silme',
      contact: 'İletişim',
      downloadTitle: 'İndir',
      copyright: 'Tüm hakları saklıdır.',
      tmdb: 'Bu ürün TMDB API kullanır ancak TMDB tarafından onaylanmış veya sertifikalandırılmış değildir.',
    },
  },
  en: {
    nav: {
      features: 'Features',
      social: 'Social',
      howItWorks: 'How It Works',
      faq: 'FAQ',
      blog: 'Blog',
      download: 'Download',
    },
    hero: {
      badge: 'WatchPulse · now on Google Play and the App Store',
      title1: 'WHAT SHOULD',
      title2: 'I WATCH TONIGHT?',
      subtitle: 'No more scrolling for half an hour and picking nothing. WatchPulse recommends by mood, remembers where you left off, and tells you which platform has the movie.',
      getItOn: 'Get it on',
      downloadOn: 'Download on the',
      trust: 'Free · Turkish & English · Android and iOS',
      chipQuestion: 'How do you want to feel while watching?',
      chip1: 'Nostalgic',
      chip2: 'Romantic',
      chip3: 'Excited',
      chip4: 'Relaxed',
      scrollDown: 'Explore',
    },
    facts: {
      moods: '10',
      moodsLabel: 'moods',
      themes: '22',
      themesLabel: 'themes',
      platforms: '14',
      platformsLabel: 'platforms',
      catalog: 'Thousands of',
      catalogLabel: 'movies & shows',
    },
    showcase: {
      mood: {
        eyebrow: 'MoodPulse',
        title: 'WATCH BY MOOD',
        desc: 'The app asks one question: "How do you want to feel while watching?" Pick your answer and MoodPulse lines up movies and shows that match the feeling.',
        b1: '10 moods, from Tired to Nostalgic',
        b2: 'Separate feeds for movies and TV shows',
        b3: 'MiniPulse: short series you can finish fast',
      },
      ai: {
        eyebrow: 'For You',
        title: 'AI THAT LEARNS YOUR TASTE',
        desc: 'The For You feed builds a taste profile from what you watch, rate and favorite, and comes back with fresh picks every week.',
        b1: 'Two modes: weekly and instant picks',
        b2: 'Like / dislike feedback sharpens it every week',
        b3: 'Recommendation engine powered by Google Gemini',
      },
      platforms: {
        eyebrow: 'Where to Watch',
        title: 'WHICH PLATFORM? SEE INSTANTLY',
        desc: 'Done finding a movie only to hunt for where it streams. WatchPulse works out which country you are in, scans the services that actually carry it there, and takes you straight to the right app with one tap.',
        b1: '20 platforms, from Netflix and Disney+ to MUBI and Crunchyroll',
        b2: "Every platform's originals showcase",
        b3: 'Deep links jump you straight into watching',
      },
      tracking: {
        eyebrow: 'Tracking',
        title: 'NEVER MISS AN EPISODE',
        desc: 'Where did you leave off? WatchPulse remembers. Mark your progress season by season and get notified when a new episode drops or a movie you have been waiting for hits theaters.',
        b1: 'Episode-by-episode progress tracking',
        b2: 'New episode and release notifications',
        b3: 'Upcoming releases calendar',
      },
      collections: {
        eyebrow: 'Collections',
        title: 'BUILD AND SHARE COLLECTIONS',
        desc: 'From the Marvel Universe to "Feel-Good Movies": create themed collections, send them to a friend with a single code, or publish them to Discover.',
        b1: 'Instant sharing with a WP-XXXX code',
        b2: 'Public lists in the community Discover feed',
        b3: 'Collaborative collections with Premium',
      },
    },
    social: {
      eyebrow: 'Social',
      title: 'PEOPLE WHO LOVE THE SAME MOVIES',
      desc: 'WatchPulse is also a social network for film lovers: match by taste, chat in real time, share what you think.',
      match: {
        title: 'Matching',
        desc: 'Compatibility is worked out across fifteen separate dimensions — titles you both love, genres, directors, what you actually finish, even how your taste has shifted over time — and you are shown which of them you have in common.',
      },
      chat: {
        title: 'Real-Time Chat',
        desc: 'Once you match, messaging in real time: text, images, GIFs and voice notes.',
      },
      posts: {
        title: 'Posts & Polls',
        desc: 'Every post is attached to a title. Five kinds: discussion, review, recommendation, question and a poll that runs for a set time. Anything you tag as a spoiler stays covered until the reader taps it.',
      },
      follow: {
        title: 'Follow System',
        desc: 'Follow, approve requests, go private, block anyone. All of it is yours to set.',
      },
      chatDemo: {
        name: 'Elif',
        status: 'online',
        msg1: 'Movie night tonight? 🍿',
        msg2: 'MoodPulse suggested "Nostalgic": Cinema Paradiso',
        msg3: 'Our 92% match score exists for a reason 😄',
        typing: 'typing…',
      },
    },
    grid: {
      title: "THERE'S MORE",
      subtitle: 'The details that look small and become essential.',
      duels: {
        title: 'Weekend Duels',
        desc: 'From Friday 8pm to Sunday 8pm two titles face off; your vote decides.',
      },
      recommendFor: {
        title: 'Recommend For',
        desc: "With your partner, family, friends or solo: get picks tuned to who you're watching with.",
      },
      dailyPick: {
        title: "Today's Pick",
        desc: "One movie and one show picked every day, for when you can't decide.",
      },
      actors: {
        title: 'Favorite Actors',
        desc: 'Follow the actors you love and hear about their new projects first.',
      },
      themes: {
        title: '22 Themes',
        desc: 'From Spotify green to Blade Runner neon: make the app look like you.',
      },
    },
    how: {
      eyebrow: 'How It Works',
      title: 'READY IN THREE STEPS',
      step1: {
        title: 'Download and sign up',
        desc: 'Free on Google Play and the App Store; sign in with e-mail or Google.',
      },
      step2: {
        title: 'Teach it your taste',
        desc: 'Rate a few movies and pick favorite genres; your profile starts to settle.',
      },
      step3: {
        title: 'Watch, track, share',
        desc: 'Get your picks, mark your episodes, send collections to friends.',
      },
    },
    premium: {
      eyebrow: 'Premium',
      title: 'FULL THROTTLE, IF YOU WANT IT',
      desc: 'WatchPulse is free; Premium is for those who want to go further.',
      f1: '20 premium themes',
      f2: 'Unlimited & collaborative collections',
      f3: 'TV show tracking screen',
      f4: 'Unlimited match slots',
      f5: 'Ad-free experience',
      note: 'Monthly, 6-month or yearly; cancel anytime.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'GOOD QUESTIONS',
      q1: 'Is WatchPulse free?',
      a1: 'Yes. Downloading and using it is completely free: tracking, recommendations, social features, 3 collections and 2 themes are in the free version. Premium adds unlimited collections, 20 extra themes, the TV tracking screen and an ad-free experience.',
      q2: 'Which devices does it run on?',
      a2: 'Android phones (Google Play) and iPhone (App Store). The app is available in Turkish and English.',
      q3: 'Does the where-to-watch finder work in my country?',
      a3: 'Yes. WatchPulse detects the country you open it in and loads that catalogue, so the services it lists are the ones you can actually subscribe to. It covers 20 in all — Netflix, Prime Video, Disney+, Max, Apple TV+, Paramount+, Hulu, Peacock, Crunchyroll and MUBI among them, alongside local services where they exist.',
      q4: 'How do recommendations work?',
      a4: 'What you watch, rate and the mood you pick build your taste profile; the AI recommends against that profile. Like/dislike feedback makes it sharper over time.',
      q5: 'What are the social features?',
      a5: 'Taste-based matching, real-time chat (with voice messages and GIFs), posts, polls and a follow system. You can set your account to private and block anyone you want.',
      q6: 'Is my data safe?',
      a6: 'Your data travels over encrypted connections and is never sold to third parties. You can permanently delete your account and all your data anytime, from the app or the website.',
    },
    download: {
      title: 'START TAKING YOUR PULSE',
      subtitle: "Takes a minute to install; ends the 'what should I watch tonight' problem for good.",
    },
    footer: {
      description: 'Movie & TV tracking, AI recommendations, a where-to-watch finder and taste-based social matching; all in one app.',
      product: 'Product',
      features: 'Features',
      howItWorks: 'How It Works',
      faqLink: 'FAQ',
      blog: 'Blog',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      deleteAccount: 'Delete Account',
      contact: 'Contact',
      downloadTitle: 'Download',
      copyright: 'All rights reserved.',
      tmdb: 'This product uses the TMDB API but is not endorsed or certified by TMDB.',
    },
  },
};
