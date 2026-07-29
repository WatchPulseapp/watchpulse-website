const SITE_URL = 'https://watchpulseapp.com';
const APP_STORE_URL = 'https://apps.apple.com/app/id6759836378';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.watchpulse.app';

export default function Schema() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WatchPulse',
    // Two thirds of the impressions this brand earns are for the spaced
    // spelling, which converts none of them. Declaring it here is how the two
    // spellings are read as one entity rather than as a near-miss.
    alternateName: ['Watch Pulse', 'WatchPulse App'],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'Movie & TV tracking app with AI recommendations, mood-based discovery, a where-to-watch finder that follows the streaming catalogue of whichever country you open it in, and taste-based social matching.',
    sameAs: [
      'https://x.com/watchpulseapp',
      'https://instagram.com/watchpulseapp',
      'https://tiktok.com/@watchpulseapp',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'watchpulseapp@gmail.com',
      availableLanguage: ['Turkish', 'English'],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WatchPulse',
    alternateName: ['WatchPulse App', 'Watch Pulse'],
    url: SITE_URL,
    description:
      'Film & dizi takip, yapay zeka önerileri ve film zevkine göre sosyal eşleşme uygulaması.',
    inLanguage: ['tr-TR', 'en-US'],
  };

  const mobileAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'WatchPulse',
    operatingSystem: 'ANDROID, IOS',
    applicationCategory: 'EntertainmentApplication',
    description:
      'Track movies and TV shows, get AI recommendations by mood, see which streaming service has a title in your own country, and match with people who share your taste.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    author: {
      '@type': 'Organization',
      name: 'WatchPulse',
    },
    downloadUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
    installUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
    inLanguage: ['tr-TR', 'en-US'],
  };

  // Mirrors the on-page FAQ (Turkish-first landing content)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'WatchPulse ücretsiz mi?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Evet. İndirmek ve kullanmak tamamen ücretsiz: takip, öneriler, sosyal özellikler, 3 koleksiyon ve 2 tema ücretsiz sürümde. Premium; sınırsız koleksiyon, 20 ek tema, dizi takip ekranı ve reklamsız deneyim ekler.',
        },
      },
      {
        '@type': 'Question',
        name: 'Hangi cihazlarda çalışıyor?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Android telefonlarda (Google Play) ve iPhone'da (App Store) çalışır. Uygulama Türkçe ve İngilizce'dir.",
        },
      },
      {
        '@type': 'Question',
        name: "Türkiye'deki platformları destekliyor mu?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Evet. Uygulama bulunduğunuz ülkeyi algılar ve o ülkenin kataloğunu yükler. Türkiye'de Netflix, Prime Video, Disney+ gibi küresel servislerin yanında Exxen, Tabii, TOD, puhutv, MUBI gibi yerel platformlar dahil 20 servisi tarar.",
        },
      },
      {
        '@type': 'Question',
        name: 'Öneriler nasıl çalışıyor?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'İzlediklerin, puanladıkların ve seçtiğin ruh hali zevk profilini oluşturur; yapay zeka önerilerini bu profile göre yapar. Beğen/beğenme geri bildirimlerinle zamanla daha isabetli olur.',
        },
      },
      {
        '@type': 'Question',
        name: 'Sosyal özellikler neler?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Film zevkine göre eşleşme, gerçek zamanlı sohbet (sesli mesaj ve GIF destekli), gönderiler, anketler ve takip sistemi. Hesabını gizli yapabilir, istediğin kullanıcıyı engelleyebilirsin.',
        },
      },
      {
        '@type': 'Question',
        name: 'Verilerim güvende mi?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Verilerin şifreli bağlantıyla taşınır ve üçüncü taraflara satılmaz. Hesabını ve tüm verilerini istediğin an uygulamadan ya da web sitesinden kalıcı olarak silebilirsin.',
        },
      },
    ],
  };

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'WatchPulse Blog',
    description:
      'Guides on movie recommendations, streaming platforms and what to watch next.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'WatchPulse',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  const schemas = [organizationSchema, websiteSchema, mobileAppSchema, faqSchema, blogSchema];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
