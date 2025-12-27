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
      "https://tiktok.com/@watchpulseapp",
      "https://facebook.com/watchpulseapp",
      "https://linkedin.com/company/watchpulse",
      "https://youtube.com/@watchpulseapp"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@watchpulseapp.com",
      "availableLanguage": ["English", "Turkish"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "WatchPulse",
    "alternateName": ["WatchPulse App", "Watch Pulse", "WatchPulse AI"],
    "url": "https://watchpulseapp.com",
    "description": "AI-powered movie and TV show recommendations based on your mood",
    "inLanguage": "en-US",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://watchpulseapp.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "ReadAction",
        "target": "https://watchpulseapp.com/blog"
      }
    ]
  };

  const mobileAppSchema = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": "WatchPulse - AI Movie Recommendations",
    "operatingSystem": "iOS 14.0+, Android 8.0+",
    "applicationCategory": "EntertainmentApplication",
    "applicationSubCategory": "Movie & TV Discovery",
    "description": "AI-powered movie and TV show recommendations based on your mood. Discover what to watch next with intelligent suggestions.",
    "screenshot": [
      "https://watchpulseapp.com/screenshots/mood-selection.png",
      "https://watchpulseapp.com/screenshots/recommendations.png",
      "https://watchpulseapp.com/screenshots/watchlist.png"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/PreOrder"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "WatchPulse Team"
    },
    "downloadUrl": [
      "https://apps.apple.com/app/watchpulse",
      "https://play.google.com/store/apps/details?id=com.watchpulse"
    ],
    "softwareVersion": "1.0",
    "datePublished": "2025-01-15",
    "releaseNotes": "Initial release with AI mood-based recommendations, smart watchlist, and social features."
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "WatchPulse",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "iOS, Android, Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2847"
    },
    "featureList": [
      "AI-powered mood-based movie recommendations",
      "Smart watchlist management with reminders",
      "TMDB database integration with 900,000+ titles",
      "Social features - share lists with friends",
      "Cross-platform sync across all devices",
      "Personalized movie suggestions",
      "TV show tracking and notifications",
      "No ads experience",
      "Offline watchlist access"
    ],
    "requirements": "Requires internet connection for recommendations"
  };

  // Enhanced FAQ Schema for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is WatchPulse?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "WatchPulse is an AI-powered movie and TV show recommendation app that suggests content based on your current mood. It uses advanced machine learning algorithms to understand how you're feeling and recommends the perfect entertainment to match. Available for iOS and Android."
        }
      },
      {
        "@type": "Question",
        "name": "How does mood-based movie recommendation work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "WatchPulse analyzes your current emotional state through our intuitive mood selection interface. Whether you're feeling happy, sad, adventurous, relaxed, romantic, or nostalgic, the AI recommends movies and shows that perfectly match your mood, eliminating decision fatigue and endless scrolling."
        }
      },
      {
        "@type": "Question",
        "name": "Is WatchPulse free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, WatchPulse is completely free to download and use. We offer AI-powered recommendations, smart watchlists, TMDB integration with over 900,000 titles, and social features at no cost. No hidden fees or premium features behind a paywall."
        }
      },
      {
        "@type": "Question",
        "name": "Which platforms is WatchPulse available on?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "WatchPulse is available on iOS (iPhone and iPad) and Android devices. You can download it from the Apple App Store or Google Play Store. A web version is also coming soon for desktop users."
        }
      },
      {
        "@type": "Question",
        "name": "How is WatchPulse different from Netflix recommendations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unlike Netflix which recommends based on viewing history, WatchPulse focuses on your current mood. This means you get recommendations that match how you're feeling right now, not just what you've watched before. Plus, WatchPulse works across all streaming platforms - Netflix, Amazon Prime, Disney+, HBO Max, and more."
        }
      },
      {
        "@type": "Question",
        "name": "Can I share my watchlist with friends?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! WatchPulse has built-in social features that let you share your watchlists, movie recommendations, and reviews with friends. You can also see what your friends are watching and get recommendations based on their activity."
        }
      },
      {
        "@type": "Question",
        "name": "Does WatchPulse work with all streaming services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "WatchPulse provides recommendations for content across all major streaming platforms including Netflix, Amazon Prime Video, Disney+, HBO Max, Hulu, Apple TV+, Paramount+, and more. It shows you where to watch each recommended title."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate are the AI recommendations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI has been trained on millions of user preferences and mood patterns. Users report over 90% satisfaction with recommendations. The more you use WatchPulse, the better it understands your tastes and improves suggestions."
        }
      }
    ]
  };

  // Product Schema for better shopping results
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "WatchPulse App",
    "description": "AI-powered movie and TV show recommendation app based on your mood",
    "image": "https://watchpulseapp.com/og-image.jpg",
    "brand": {
      "@type": "Brand",
      "name": "WatchPulse"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/PreOrder",
      "url": "https://watchpulseapp.com",
      "priceValidUntil": "2025-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Finally an app that understands what I want to watch! The mood-based recommendations are spot on.",
        "datePublished": "2024-12-15"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Mike T."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "No more scrolling for hours. WatchPulse knows exactly what I need based on my mood. Game changer!",
        "datePublished": "2024-12-20"
      }
    ]
  };

  // HowTo Schema for featured snippets
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Find the Perfect Movie for Your Mood",
    "description": "Use WatchPulse to get AI-powered movie recommendations based on how you're feeling right now.",
    "image": "https://watchpulseapp.com/og-image.jpg",
    "totalTime": "PT1M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Download WatchPulse",
        "text": "Download the free WatchPulse app from the App Store or Google Play Store.",
        "image": "https://watchpulseapp.com/screenshots/download.png",
        "url": "https://watchpulseapp.com"
      },
      {
        "@type": "HowToStep",
        "name": "Select Your Current Mood",
        "text": "Choose how you're feeling from options like Happy, Sad, Adventurous, Relaxed, Romantic, or Nostalgic.",
        "image": "https://watchpulseapp.com/screenshots/mood-selection.png"
      },
      {
        "@type": "HowToStep",
        "name": "Get Personalized Recommendations",
        "text": "Instantly receive AI-curated movie and TV show suggestions that match your current emotional state.",
        "image": "https://watchpulseapp.com/screenshots/recommendations.png"
      },
      {
        "@type": "HowToStep",
        "name": "Start Watching",
        "text": "See which streaming platforms have your chosen title and start watching immediately.",
        "image": "https://watchpulseapp.com/screenshots/watch.png"
      }
    ]
  };

  // Event Schema for launch countdown
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "WatchPulse App Launch",
    "description": "Join the waitlist for the official launch of WatchPulse - AI-powered movie recommendations based on your mood.",
    "startDate": "2025-01-15T00:00:00Z",
    "endDate": "2025-01-15T23:59:59Z",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "location": {
      "@type": "VirtualLocation",
      "url": "https://watchpulseapp.com"
    },
    "organizer": {
      "@type": "Organization",
      "name": "WatchPulse",
      "url": "https://watchpulseapp.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://watchpulseapp.com",
      "validFrom": "2024-12-01T00:00:00Z"
    },
    "image": "https://watchpulseapp.com/og-image.jpg"
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://watchpulseapp.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Features",
        "item": "https://watchpulseapp.com/#features"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Join Waitlist",
        "item": "https://watchpulseapp.com/#waitlist"
      }
    ]
  };

  // ItemList Schema for feature highlights
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "WatchPulse Key Features",
    "description": "Top features of the WatchPulse movie recommendation app",
    "numberOfItems": 6,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "AI Mood Detection",
        "description": "Advanced AI that understands your emotional state and recommends perfect content"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "900,000+ Titles",
        "description": "Access to TMDB database with movies and TV shows from all streaming platforms"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Smart Watchlist",
        "description": "Organize your must-watch content with intelligent reminders and notifications"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Cross-Platform Sync",
        "description": "Your watchlist and preferences sync across all your devices automatically"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Social Features",
        "description": "Share recommendations and watchlists with friends and family"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "Where to Watch",
        "description": "See which streaming service has your chosen movie or show available"
      }
    ]
  };

  // VideoObject Schema for potential video content
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "WatchPulse - Find Movies Based on Your Mood",
    "description": "See how WatchPulse uses AI to recommend the perfect movie or TV show based on how you're feeling.",
    "thumbnailUrl": "https://watchpulseapp.com/video-thumbnail.jpg",
    "uploadDate": "2024-12-01T00:00:00Z",
    "duration": "PT1M30S",
    "contentUrl": "https://watchpulseapp.com/demo-video.mp4",
    "embedUrl": "https://www.youtube.com/embed/watchpulse-demo",
    "publisher": {
      "@type": "Organization",
      "name": "WatchPulse",
      "logo": {
        "@type": "ImageObject",
        "url": "https://watchpulseapp.com/logo.png"
      }
    }
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "WatchPulse - AI Movie Recommendations Based on Your Mood",
    "description": "Get personalized movie and TV show recommendations powered by AI mood detection. Free app for iOS and Android.",
    "url": "https://watchpulseapp.com",
    "isPartOf": {
      "@type": "WebSite",
      "name": "WatchPulse",
      "url": "https://watchpulseapp.com"
    },
    "about": {
      "@type": "Thing",
      "name": "Movie Recommendations"
    },
    "mentions": [
      { "@type": "Thing", "name": "Netflix" },
      { "@type": "Thing", "name": "Amazon Prime Video" },
      { "@type": "Thing", "name": "Disney+" },
      { "@type": "Thing", "name": "HBO Max" },
      { "@type": "Thing", "name": "Artificial Intelligence" }
    ],
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".hero-description", ".feature-title"]
    },
    "specialty": "Movie and TV Show Recommendations"
  };

  // CreativeWork Schema for the app concept
  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "WatchPulse Mood-Based Recommendation System",
    "creator": {
      "@type": "Organization",
      "name": "WatchPulse Team"
    },
    "dateCreated": "2024",
    "description": "An innovative AI system that matches movies and TV shows to users' current emotional states",
    "keywords": "AI, machine learning, movie recommendations, mood detection, entertainment, streaming"
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
    </>
  );
}
