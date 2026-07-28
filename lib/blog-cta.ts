/**
 * Variants for the end-of-article app prompt.
 *
 * Every line here is derived from a feature the app actually ships, as worded
 * in the site's own showcase copy (contexts/LanguageContext.tsx). Nothing is
 * invented: if a claim is not backed by a real screen, it does not belong here,
 * because a reader who installs on the strength of a promise the app does not
 * keep is worse than a reader who never installs.
 *
 * One feature is deliberately absent. The where-to-watch finder scans "the
 * streaming services available in Turkey"; the Journal publishes in English to
 * a global audience, so promising it here would mislead most of the people
 * reading. It stays out until the coverage matches the audience.
 */

export interface CtaVariant {
  /** The feature's own name, as used in the app. */
  eyebrow: string;
  headline: string;
  body: string;
}

export const CTA_VARIANTS: Record<string, CtaVariant> = {
  mood: {
    eyebrow: 'MoodPulse',
    headline: 'Pick a feeling, not a title',
    body: 'WatchPulse asks how you want to feel tonight, then lines up films and shows that match it — ten moods, from Tired to Nostalgic.',
  },
  taste: {
    eyebrow: 'For You',
    headline: 'Recommendations that learn what you like',
    body: 'The For You feed builds a taste profile from what you watch, rate and favourite, then comes back with fresh picks every week.',
  },
  tracking: {
    eyebrow: 'Tracking',
    headline: 'Never lose your place in a series',
    body: 'Mark your progress season by season and get a notification the moment a new episode drops.',
  },
  upcoming: {
    eyebrow: 'Upcoming',
    headline: 'Get told when these actually land',
    body: 'Follow the films you are waiting for and get a notification on release day, with a calendar of everything still to come.',
  },
  collections: {
    eyebrow: 'Collections',
    headline: 'Turn this list into your own',
    body: 'Build themed collections, send one to a friend with a single code, or publish it to Discover for everyone to browse.',
  },
  mini: {
    eyebrow: 'MiniPulse',
    headline: 'Short series you can actually finish',
    body: 'MiniPulse surfaces shows you can get through in a few evenings — so you start something instead of scrolling past it.',
  },
  social: {
    eyebrow: 'Social',
    headline: 'Find people who watch what you watch',
    body: 'Match with viewers whose taste lines up with yours, then talk about what you are both watching in real time.',
  },
};

/** Categories map to the feature a reader of that category would actually use. */
const BY_CATEGORY: Record<string, keyof typeof CTA_VARIANTS> = {
  'TV Shows': 'tracking',
  'Binge Worthy': 'mini',
  'Trends': 'upcoming',
  'Genre Guide': 'collections',
  'Hidden Gems': 'collections',
  'Mood Guide': 'mood',
  'Psychology': 'mood',
  'Weekend Watch': 'mood',
  'Date Night': 'mood',
  'Family Time': 'collections',
  'Entertainment': 'taste',
  'Streaming': 'taste',
  'AI & Technology': 'taste',
  'Technology': 'taste',
};

const ROTATION: Array<keyof typeof CTA_VARIANTS> = ['mood', 'taste', 'tracking', 'collections', 'social'];

/**
 * Picks a variant for a post. Category first, since that is the strongest
 * signal about what the reader came for; otherwise the slug is hashed so the
 * choice is stable — the same article always shows the same prompt, which keeps
 * it cacheable and stops it changing under a returning reader.
 */
export function pickCtaVariant(category: string, slug: string): CtaVariant {
  const byCategory = BY_CATEGORY[category];
  if (byCategory) return CTA_VARIANTS[byCategory];

  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return CTA_VARIANTS[ROTATION[hash % ROTATION.length]];
}
