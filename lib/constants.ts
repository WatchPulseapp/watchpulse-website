export const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.watchpulse.app';
export const APP_STORE_URL = 'https://apps.apple.com/app/id6759836378';

export const SOCIAL_LINKS = {
  email: 'watchpulseapp@gmail.com',
  twitter: 'https://x.com/watchpulseapp',
  tiktok: 'https://www.tiktok.com/@watchpulseapp?lang=tr-TR',
  instagram: 'https://www.instagram.com/watchpulseapp/',
};

// The 14 streaming services the app actually supports for "Nerede Ne Var" /
// where-to-watch. Kept in sync with the backend platformRegistry.js — TMDB
// providers outside this set are filtered out, so this list must not be inflated.
export const PLATFORM_NAMES = [
  'Netflix',
  'Prime Video',
  'Disney+',
  'Max',
  'Apple TV+',
  'Paramount+',
  'Exxen',
  'Tabii',
  'TOD',
  'MUBI',
  'Hulu',
  'Crunchyroll',
  'Peacock',
  'TV+',
];

// Landing showcase sections: translation key + screenshot file.
// Screenshot filenames don't always match their content — verified visually:
//   tracking.jpg  = "Sana Özel" AI feed, personalized.jpg = "Nerede Ne Var" hub,
//   duel.jpg      = "Takip" (upcoming episodes) screen.
export const SHOWCASES = [
  { key: 'mood', screenshot: 'moodpulse.jpg', reversed: false },
  { key: 'ai', screenshot: 'tracking.jpg', reversed: true },
  { key: 'platforms', screenshot: 'personalized.jpg', reversed: false },
  { key: 'tracking', screenshot: 'duel.jpg', reversed: true },
  { key: 'collections', screenshot: 'collections.jpg', reversed: false },
] as const;
