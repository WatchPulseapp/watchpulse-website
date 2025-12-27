'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

// Bot ve crawler user agent'larını tespit et
function isBot(): boolean {
  if (typeof window === 'undefined') return true;

  const userAgent = window.navigator.userAgent.toLowerCase();

  // Bot ve crawler listesi
  const botPatterns = [
    // Vercel botları
    'vercel',
    'vercel-screenshot',
    'prerender',

    // Arama motoru botları
    'googlebot',
    'google-inspectiontool',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'sogou',
    'exabot',
    'facebot',
    'facebookexternalhit',
    'ia_archiver',

    // SEO ve analiz araçları
    'semrushbot',
    'ahrefsbot',
    'mj12bot',
    'dotbot',
    'rogerbot',
    'screaming frog',
    'seokicks',
    'sistrix',

    // Headless browser'lar
    'headlesschrome',
    'phantomjs',
    'selenium',
    'puppeteer',
    'playwright',
    'webdriver',

    // Diğer botlar
    'bot',
    'crawler',
    'spider',
    'scraper',
    'curl',
    'wget',
    'python-requests',
    'axios',
    'node-fetch',
    'go-http-client',
    'java/',
    'libwww',
    'httpunit',
    'nutch',
    'biglotron',
    'teoma',
    'convera',
    'gigablast',
    'ia_archiver',
    'webmon',
    'httrack',
    'grub.org',
    'netresearchserver',
    'speedy',
    'fluffy',
    'findlink',
    'panscient',
    'ips-agent',
    'yanga',
    'cyberpatrol',
    'postrank',
    'page2rss',
    'linkdex',
    'ezooms',
    'heritrix',
    'findthatfile',
    'europarchive.org',
    'nerdbynature',
    'sistrix',
    'ahrefsbot',
    'aboundex',
    'domaincrawler',
    'wbsearchbot',
    'summify',
    'ccbot',
    'edisterbot',
    'seznambot',
    'ec2linkfinder',
    'gslfbot',
    'aihitbot',
    'intelium_bot',
    'yeti',
    'retrevopageanalyzer',
    'lb-spider',
    'sogou',
    'lssbot',
    'careerbot',
    'wotbox',
    'wocbot',
    'ichiro',
    'duckduckgo',
    'lssrocketcrawler',
    'drupact',
    'webcompanycrawler',
    'acoonbot',
    'openindexspider',
    'gnam gnam spider',
    'web-hierarchie-archive',
    'apachebench',
    'benchmarkbot',
    'loadtimebot',
    'pingdom',
    'gtmetrix',
    'lighthouse',
    'pagespeed',
    'updown.io',
    'uptimerobot',
  ];

  // User agent'ta bot pattern'ı var mı kontrol et
  for (const pattern of botPatterns) {
    if (userAgent.includes(pattern)) {
      return true;
    }
  }

  // WebDriver kontrolü (Selenium, Puppeteer vs.)
  if (window.navigator.webdriver) {
    return true;
  }

  // Headless Chrome kontrolü
  if (/headless/i.test(userAgent)) {
    return true;
  }

  // Ek bot tespiti - bazı botlar normal user agent kullanır
  // ama belirli özellikleri eksiktir
  try {
    // Plugin sayısı 0 ise muhtemelen bot
    if (window.navigator.plugins && window.navigator.plugins.length === 0) {
      // Mobil cihazlar da 0 olabilir, o yüzden ek kontrol
      if (!/mobile|android|iphone|ipad/i.test(userAgent)) {
        // Languages kontrolü
        if (!window.navigator.languages || window.navigator.languages.length === 0) {
          return true;
        }
      }
    }
  } catch {
    // Hata olursa devam et
  }

  return false;
}

// Vercel preview/development ortamı kontrolü
function isPreviewEnvironment(): boolean {
  if (typeof window === 'undefined') return true;

  const hostname = window.location.hostname;

  // Localhost veya preview URL'leri
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('vercel.app') ||
    hostname.includes('vercel.sh') ||
    hostname.includes('.preview.') ||
    hostname.includes('-git-') ||
    hostname.endsWith('.local')
  ) {
    return true;
  }

  return false;
}

export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = 'G-D7FMWEVNDV';
  const [shouldTrack, setShouldTrack] = useState(false);

  useEffect(() => {
    // Sadece gerçek kullanıcıları ve production ortamını takip et
    const canTrack = !isBot() && !isPreviewEnvironment();
    setShouldTrack(canTrack);

    if (!canTrack) {
      console.log('[GA] Tracking disabled: Bot or preview environment detected');
    }
  }, []);

  // Bot veya preview ortamında GA yükleme
  if (!shouldTrack) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              // Bot trafiğini filtrele
              send_page_view: true,
              // Gerçek kullanıcı metrikleri
              allow_google_signals: true,
              allow_ad_personalization_signals: false
            });
          `,
        }}
      />
    </>
  );
}
