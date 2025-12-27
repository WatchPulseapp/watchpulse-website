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
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'tr' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

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
      blog: 'Blog',
      comingSoon: 'Çok Yakında'
    },
    hero: {
      title1: 'Kişisel İzleme',
      title2: 'Asistanınız ile Tanışın',
      subtitle: 'Binlerce film ve dizi arasından size özel öneriler. AI destekli akıllı arama, ruh hali bazlı keşif ve kişiselleştirilmiş deneyim.',
      cta: 'Google Play\'e Çok Yakında',
      launching: '🚀 Yakında Google Play Store\'da'
    },
    features: {
      title: 'Bir Sonraki Favorini Keşfetmek İçin',
      titleHighlight: 'İhtiyacın Olan Her\u00A0Şey',
      subtitle: 'WatchPulse, herhangi bir an için mükemmel film veya diziyi bulmanıza yardımcı olmak için güçlü özellikleri sezgisel tasarımla birleştiriyor.',
      trending: {
        title: 'Trend İçerikler',
        description: 'Her 3 dakikada bir güncellenen trend film ve dizilerde neler popüler keşfet'
      },
      search: {
        title: 'Gelişmiş Arama',
        description: 'Akıllı arama önerileriyle filmleri, dizileri ve oyuncuları anında bul'
      },
      mood: {
        title: 'Ruh Hali Bazlı AI',
        description: '10 farklı ruh haline göre kişiselleştirilmiş öneriler al'
      },
      collections: {
        title: 'Koleksiyonlar',
        description: 'Marvel, DC ve Star Wars serilerini içeren seçkin koleksiyonları keşfet'
      },
      actors: {
        title: 'Favori Oyuncular',
        description: 'Sevdiğin oyuncuları kaydet ve onların film ile dizilerine kolayca eriş'
      },
      language: {
        title: 'Çoklu Dil',
        description: 'Türkçe ve İngilizce için anlık dil değiştirme desteği'
      },
      themes: {
        title: 'Temalar',
        description: 'Sofistike "Midnight Calm" tasarımı ile Koyu ve Açık mod arasında seç'
      },
      reminders: {
        title: 'Akıllı Hatırlatıcılar',
        description: 'İzlemek istediğin film ve diziler için tarih belirle, hatırlatma al ve kaçırma'
      }
    },
    mood: {
      title: 'Bugün Nasıl Hissediyorsun?',
      subtitle: 'AI destekli öneri motorumuzla mevcut ruh haline göre kişiselleştirilmiş öneriler al.',
      moods: {
        tired: 'Yorgun',
        happy: 'Mutlu',
        sad: 'Üzgün',
        excited: 'Heyecanlı',
        romantic: 'Romantik',
        scared: 'Korku',
        nostalgic: 'Nostalji',
        thoughtful: 'Düşünceli',
        adventurous: 'Macera',
        chill: 'Rahat'
      }
    },
    screenshots: {
      title: 'WatchPulse\'u Deneyimle',
      subtitle: 'Mükemmel izleme deneyimi için tasarlanmış sezgisel arayüz ve güçlü özellikleri keşfet.',
      count: '{current} / {total}'
    },
    download: {
      title: 'Yolculuğuna Başlamaya Hazır mısın?',
      subtitle: 'Binlerce film severin mükemmel izlemelerini keşfettiği topluluğa katıl. WatchPulse\'u bugün indir ve ne izleyeceğini asla merak etme.',
      cta: 'Google Play\'e Çok Yakında',
      note: 'WatchPulse\'u size getirmek için çok çalışıyoruz. Takipte kalın!',
      feature1: 'Binlerce Film & Dizi',
      feature2: 'AI Destekli Öneriler',
      feature3: 'Güzel Koyu Tema'
    },
    contact: {
      title: 'İletişime Geç',
      subtitle: '',
      email: 'E-posta',
      twitter: 'Twitter',
      tiktok: 'TikTok',
      instagram: 'Instagram'
    },
    footer: {
      copyright: '© 2025 WatchPulse. Tüm hakları saklıdır.',
      shareText: 'Daha fazla film severe ulaşmamıza yardım et! 🎥'
    },
    viral: {
      featuresTitle: '🎬 Beğendin mi?',
      featuresSubtitle: 'Ne izleyeceğine saatler harcayan arkadaşlarınla WatchPulse\'u paylaş!',
      downloadNote: '💡 Büyümemize yardım et! Film ve dizi seven arkadaşlarınla paylaş'
    },
    waitlist: {
      title: 'İlk Kullananlar Arasında Olun! 🚀',
      subtitle: 'WatchPulse\'un çıkışından haberdar olmak için mail adresinizi bırakın. Uygulama yayına girdiğinde ilk siz öğrenin ve erken erişim avantajlarından yararlanın!',
      placeholder: 'email@ornek.com',
      cta: 'Listeye Katıl',
      submitting: 'Ekleniyor...',
      joined: 'Katıldın! ✓',
      success: '🎉 Harika! Uygulama çıktığında sizi haberdar edeceğiz.',
      error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      invalidEmail: 'Geçerli bir email adresi girin.',
      privacy: '✨ Email adresiniz güvende. Uygulama çıktığında ilk haberdar olan siz olacaksınız!'
    },
    // Engagement components translations
    countdown: {
      title: 'Uygulama Lansmanı',
      days: 'gün',
      hours: 'saat',
      minutes: 'dk',
      seconds: 'sn',
      cta: 'Erken Erişim Al'
    },
    fomo: {
      joined: 'Katıldı',
      spotsLeft: 'Kalan Yer',
      today: 'Bugün',
      progressTitle: 'Erken Erişim Durumu',
      full: 'Dolu',
      almostFull: 'Neredeyse Doldu!',
      urgency: 'Erken erişim yerleri sınırlı - şimdi yerinizi ayırtın!',
      noSpam: 'Spam yok',
      unsubscribe: 'İstediğiniz zaman çıkın',
      free: '%100 Ücretsiz'
    },
    exitPopup: {
      title: 'Dur! Kaçırma!',
      subtitle: 'film sever topluluğumuza katıl ve WatchPulse\'a erken erişim + özel öneriler kazan!',
      joiners: '10.000+',
      placeholder: 'Email adresiniz',
      cta: 'Erken Erişim Al',
      joining: 'Katılıyor...',
      success: 'Katıldın! Emailini kontrol et.',
      privacy: 'Spam yok. İstediğin zaman çıkabilirsin.'
    },
    socialProof: {
      justJoined: 'az önce katıldı',
      names: ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Zeynep', 'Mustafa', 'Elif', 'Hasan', 'Esra', 'Emre', 'Selin', 'Burak', 'Deniz', 'Can', 'Ece'],
      cities: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Gaziantep', 'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Samsun', 'Trabzon']
    },
    floatingCta: {
      cta: 'Listeye Katıl'
    },
    pushNotification: {
      title: 'Lansmanı Kaçırma! 🚀',
      subtitle: 'WatchPulse hazır olduğunda bildirim al. Ruh haline göre film keşfeden ilk sen ol.',
      later: 'Sonra',
      notify: 'Bildir',
      success: 'Hazırsın!',
      successSubtitle: 'WatchPulse yayına girdiğinde seni bilgilendireceğiz'
    }
  },
  en: {
    nav: {
      blog: 'Blog',
      comingSoon: 'Coming Soon'
    },
    hero: {
      title1: 'Meet Your Personal',
      title2: 'Watching Assistant',
      subtitle: 'Personalized recommendations from thousands of movies and shows. AI-powered smart search, mood-based discovery, and a tailored experience.',
      cta: 'Coming Soon to Google Play',
      launching: '🚀 Launching soon on Google Play Store'
    },
    features: {
      title: 'Everything You Need to',
      titleHighlight: 'Discover Your Next Favorite',
      subtitle: 'WatchPulse combines powerful features with an intuitive design to help you find the perfect movie or TV show for any moment.',
      trending: {
        title: 'Trending Content',
        description: 'Discover what\'s hot with trending movies & TV shows updated every 3 minutes'
      },
      search: {
        title: 'Advanced Search',
        description: 'Find movies, TV shows, and actors instantly with smart search suggestions'
      },
      mood: {
        title: 'Mood-Based AI',
        description: 'Get personalized recommendations based on 10 different moods'
      },
      collections: {
        title: 'Collections',
        description: 'Explore curated collections including Marvel, DC, and Star Wars franchises'
      },
      actors: {
        title: 'Favorite Actors',
        description: 'Save your favorite actors and easily access their movies and TV shows'
      },
      language: {
        title: 'Multi-Language',
        description: 'Seamless support for Turkish and English with instant language switching'
      },
      themes: {
        title: 'Themes',
        description: 'Choose between Dark and Light modes with the sophisticated "Midnight Calm" design'
      },
      reminders: {
        title: 'Smart Reminders',
        description: 'Set dates for movies and shows you want to watch, get reminded and never miss them'
      }
    },
    mood: {
      title: 'How Are You Feeling Today?',
      subtitle: 'Get personalized recommendations based on your current mood with our AI-powered suggestion engine.',
      moods: {
        tired: 'Tired',
        happy: 'Happy',
        sad: 'Sad',
        excited: 'Excited',
        romantic: 'Romantic',
        scared: 'Scared',
        nostalgic: 'Nostalgic',
        thoughtful: 'Thoughtful',
        adventurous: 'Adventure',
        chill: 'Chill'
      }
    },
    screenshots: {
      title: 'Experience WatchPulse',
      subtitle: 'Explore the intuitive interface and powerful features designed for the perfect viewing experience.',
      count: '{current} / {total}'
    },
    download: {
      title: 'Ready to Start Your Journey?',
      subtitle: 'Join thousands of movie lovers discovering their perfect watch. Download WatchPulse today and never wonder what to watch again.',
      cta: 'Coming Soon to Google Play',
      note: 'We\'re working hard to bring WatchPulse to you. Stay tuned!',
      feature1: 'Thousands of Movies & Shows',
      feature2: 'AI-Powered Recommendations',
      feature3: 'Beautiful Dark Theme'
    },
    contact: {
      title: 'Get in Touch',
      subtitle: '',
      email: 'Email',
      twitter: 'Twitter',
      tiktok: 'TikTok',
      instagram: 'Instagram'
    },
    footer: {
      copyright: '© 2025 WatchPulse. All rights reserved.',
      shareText: 'Help us reach more movie lovers! 🎥'
    },
    viral: {
      featuresTitle: '🎬 Love what you see?',
      featuresSubtitle: 'Share WatchPulse with friends who spend hours deciding what to watch!',
      downloadNote: '💡 Help us grow! Share with friends who love movies & TV shows'
    },
    waitlist: {
      title: 'Be Among the First to Know! 🚀',
      subtitle: 'Join our waitlist to get notified when WatchPulse launches. Be the first to know and enjoy early access benefits!',
      placeholder: 'your.email@example.com',
      cta: 'Join Waitlist',
      submitting: 'Joining...',
      joined: 'Joined! ✓',
      success: '🎉 Awesome! We\'ll notify you when the app launches.',
      error: 'Something went wrong. Please try again.',
      invalidEmail: 'Please enter a valid email address.',
      privacy: '✨ Your email is safe. You\'ll be the first to know when we launch!'
    },
    // Engagement components translations
    countdown: {
      title: 'App Launch Countdown',
      days: 'days',
      hours: 'hrs',
      minutes: 'min',
      seconds: 'sec',
      cta: 'Get Early Access'
    },
    fomo: {
      joined: 'Joined',
      spotsLeft: 'Spots Left',
      today: 'Today',
      progressTitle: 'Early Access Progress',
      full: 'Full',
      almostFull: 'Almost Full!',
      urgency: 'Early access spots are limited - secure yours now!',
      noSpam: 'No spam, ever',
      unsubscribe: 'Unsubscribe anytime',
      free: '100% Free'
    },
    exitPopup: {
      title: 'Wait! Don\'t Miss Out!',
      subtitle: 'movie lovers and get early access to WatchPulse + exclusive recommendations!',
      joiners: '10,000+',
      placeholder: 'Enter your email',
      cta: 'Get Early Access',
      joining: 'Joining...',
      success: 'You\'re in! Check your email.',
      privacy: 'No spam, ever. Unsubscribe anytime.'
    },
    socialProof: {
      justJoined: 'just joined',
      names: ['Alex', 'Sarah', 'Mike', 'Emma', 'James', 'Olivia', 'Daniel', 'Sophie', 'Chris', 'Isabella', 'David', 'Mia', 'John', 'Ava', 'Ryan', 'Grace'],
      cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Diego', 'Dallas', 'Austin', 'Miami', 'Seattle', 'Denver', 'Boston', 'Atlanta', 'Portland']
    },
    floatingCta: {
      cta: 'Join Waitlist'
    },
    pushNotification: {
      title: 'Don\'t miss the launch! 🚀',
      subtitle: 'Get notified when WatchPulse is ready. Be the first to discover movies based on your mood.',
      later: 'Maybe later',
      notify: 'Notify me',
      success: 'You\'re all set!',
      successSubtitle: 'We\'ll notify you when WatchPulse launches'
    }
  }
};
