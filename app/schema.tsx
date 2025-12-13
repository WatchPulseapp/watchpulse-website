export default function Schema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WatchPulse",
    "url": "https://watchpulseapp.com",
    "logo": "https://watchpulseapp.com/logo.png",
    "description": "AI-powered movie and TV show recommendations based on your mood. Smart watchlist, TMDB integration, and social features.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/watchpulseapp",
      "https://instagram.com/watchpulseapp",
      "https://tiktok.com/@watchpulseapp"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@watchpulseapp.com"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "WatchPulse",
    "url": "https://watchpulseapp.com",
    "description": "AI-powered movie and TV show recommendations based on your mood",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://watchpulseapp.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const mobileAppSchema = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": "WatchPulse",
    "operatingSystem": "iOS, Android",
    "applicationCategory": "Entertainment",
    "description": "AI-powered movie and TV show recommendations based on your mood. Discover what to watch next with intelligent suggestions.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "WatchPulse",
    "applicationCategory": "Entertainment",
    "operatingSystem": "iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "featureList": [
      "AI-powered mood-based recommendations",
      "Smart watchlist management",
      "TMDB integration",
      "Social features",
      "Cross-platform sync"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
    </>
  );
}
