const SITE_URL = 'https://watchpulseapp.com';
const APP_STORE_URL = 'https://apps.apple.com/app/id6759836378';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.watchpulse.app';

/**
 * Site-level structured data, rendered from the root layout.
 *
 * Everything here describes the site or the app as an entity, which is true on
 * whatever URL a crawler happens to be looking at. The FAQPage that used to sit
 * in this list did not: it was emitted on all two hundred and fifty URLs,
 * including the privacy policy and every film page, while the six questions it
 * described exist only on the landing page. Google asks that FAQ markup match
 * content visible on the page claiming it, and the penalty for getting that
 * wrong falls on the whole domain. It now lives in the FAQ section component,
 * built from the same strings that section renders, so the two cannot drift and
 * it can only appear where the questions do.
 */
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

  const schemas = [organizationSchema, websiteSchema, mobileAppSchema, blogSchema];

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
