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

  // FAQ Schema for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is WatchPulse?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "WatchPulse is an AI-powered movie and TV show recommendation app that suggests content based on your current mood. It uses advanced algorithms to understand how you're feeling and recommends the perfect entertainment to match."
        }
      },
      {
        "@type": "Question",
        "name": "How does mood-based movie recommendation work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "WatchPulse analyzes your current emotional state through our intuitive mood selection interface. Whether you're feeling happy, sad, adventurous, or relaxed, the AI recommends movies and shows that perfectly match your mood, eliminating decision fatigue."
        }
      },
      {
        "@type": "Question",
        "name": "Is WatchPulse free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, WatchPulse is completely free to download and use. We offer AI-powered recommendations, smart watchlists, and TMDB integration at no cost."
        }
      },
      {
        "@type": "Question",
        "name": "Which platforms is WatchPulse available on?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "WatchPulse is available on iOS and Android devices. You can download it from the App Store or Google Play Store."
        }
      },
      {
        "@type": "Question",
        "name": "How is WatchPulse different from Netflix recommendations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unlike Netflix which recommends based on viewing history, WatchPulse focuses on your current mood. This means you get recommendations that match how you're feeling right now, not just what you've watched before."
        }
      }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
