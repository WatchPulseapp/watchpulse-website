'use client';

import { Analytics } from '@vercel/analytics/react';
import { useEffect, useState } from 'react';

// Bot kontrolü - Google Analytics ile aynı mantık
function shouldTrack(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const hostname = window.location.hostname;

  // Production domain kontrolü - sadece ana domain'de çalış
  if (hostname !== 'watchpulseapp.com' && hostname !== 'www.watchpulseapp.com') {
    return false;
  }

  // Bot patterns
  const botPatterns = [
    'vercel', 'bot', 'crawler', 'spider', 'scraper',
    'googlebot', 'bingbot', 'slurp', 'duckduckbot',
    'headlesschrome', 'phantomjs', 'selenium', 'puppeteer',
    'lighthouse', 'pagespeed', 'gtmetrix', 'pingdom',
    'curl', 'wget', 'python', 'node-fetch', 'axios'
  ];

  for (const pattern of botPatterns) {
    if (userAgent.includes(pattern)) {
      return false;
    }
  }

  // WebDriver kontrolü
  if (window.navigator.webdriver) {
    return false;
  }

  return true;
}

export default function VercelAnalytics() {
  const [canTrack, setCanTrack] = useState(false);

  useEffect(() => {
    setCanTrack(shouldTrack());
  }, []);

  if (!canTrack) {
    return null;
  }

  return <Analytics />;
}
