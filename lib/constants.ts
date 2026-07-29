export const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.watchpulse.app';
export const APP_STORE_URL = 'https://apps.apple.com/app/id6759836378';

export const SOCIAL_LINKS = {
  email: 'watchpulseapp@gmail.com',
  twitter: 'https://x.com/watchpulseapp',
  tiktok: 'https://www.tiktok.com/@watchpulseapp?lang=tr-TR',
  instagram: 'https://www.instagram.com/watchpulseapp/',
};

// The streaming services the app supports for "Nerede Ne Var" / where-to-watch,
// mirroring the deep-link registry in the app (streaming_launcher.dart) — TMDB
// providers outside this set are filtered out, so this list must not be inflated.
// It said fourteen while the app shipped twenty.
export const PLATFORM_NAMES = [
  'Netflix',
  'Prime Video',
  'Disney+',
  'Max',
  'HBO',
  'Apple TV+',
  'Paramount+',
  'Hulu',
  'Peacock',
  'Crunchyroll',
  'MUBI',
  'Google Play',
  'Exxen',
  'Tabii',
  'TOD',
  'puhutv',
  'TV+',
  'FilmBox',
  'D-Smart',
  'Tivibu',
];

// Landing showcase sections: translation key + screenshot file.
//
// The file names describe what is in the picture. They used not to — the "Sana
// Özel" screen was in tracking.jpg, the where-to-watch hub was in
// personalized.jpg and the tracking screen was in duel.jpg — which meant
// replacing one screenshot required checking every file to find out which was
// which. Each name is verified against the image it points at.
//
// Both language folders carry the same six names, because the path is built as
// /images/screenshots/{language}/{file}: a name that exists in one and not the
// other is a broken image in that edition.
export const SHOWCASES = [
  { key: 'mood', screenshot: 'moodpulse.jpg', reversed: false },
  { key: 'ai', screenshot: 'for-you.jpg', reversed: true },
  { key: 'platforms', screenshot: 'where-to-watch.jpg', reversed: false },
  { key: 'tracking', screenshot: 'episode-tracking.jpg', reversed: true },
  { key: 'collections', screenshot: 'collections.jpg', reversed: false },
] as const;

// The hero's phone shows home.jpg from the same folders (see HeroSection).
