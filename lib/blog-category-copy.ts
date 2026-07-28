/**
 * Search-facing copy for category pages.
 *
 * Each category page is a landing page for a distinct intent — someone typing
 * "best horror films to watch" is not the same visitor as someone typing "what
 * is on TV this week" — so each gets its own title and description rather than
 * a templated "Posts in X". Anything without an entry falls back to a generic
 * pair, which is still unique per category because the name is interpolated.
 */
export const CATEGORY_COPY: Record<string, { title: string; description: string; intro: string }> = {
  'TV Shows': {
    title: 'TV Shows — What to Watch and Where to Start',
    description:
      'Series worth starting, what is airing new episodes, and whether to jump in now or binge from the beginning.',
    intro: 'Series worth starting, what is airing now, and where a newcomer should jump in.',
  },
  'Genre Guide': {
    title: 'Genre Guides — The Best Films by Genre',
    description:
      'Curated guides to the best horror, science fiction, thriller, comedy and drama films, with what each one does well.',
    intro: 'Curated guides to the best of each genre, and what makes each film worth the evening.',
  },
  Trends: {
    title: 'Coming Soon — Upcoming Films and What Is Trending',
    description:
      'The films arriving in the months ahead, what is trending this week, and the trailers worth two minutes of your time.',
    intro: 'What is arriving next, what everyone is watching now, and which trailers earned the hype.',
  },
  Streaming: {
    title: 'Streaming Guides — Where to Watch and What Is Worth It',
    description:
      'Guides to what is worth watching across streaming services, and how to find something without losing an evening to the scroll.',
    intro: 'What is worth watching across the services, without losing an evening to the scroll.',
  },
  Entertainment: {
    title: 'Film Features — Deep Dives and Recommendations',
    description:
      'Close looks at individual films and the people who make them, plus what is playing and whether the ticket is worth buying.',
    intro: 'Close looks at the films and the people behind them.',
  },
  'Hidden Gems': {
    title: 'Hidden Gems — Overlooked Films Worth Finding',
    description:
      'Films that deserved a bigger audience than they got, and where to find them.',
    intro: 'The films that deserved a bigger audience than they got.',
  },
  'Mood Guide': {
    title: 'Mood Guides — What to Watch by How You Feel',
    description:
      'Film and series picks matched to a mood, for the nights when nothing on the homepage looks right.',
    intro: 'Picks matched to a mood, for the nights nothing looks right.',
  },
};

export function categoryCopy(name: string) {
  return (
    CATEGORY_COPY[name] || {
      title: `${name} — Film and TV Guides`,
      description: `Articles on ${name.toLowerCase()} from the WatchPulse Journal: recommendations, guides and what is worth your evening.`,
      intro: `Everything from the Journal filed under ${name}.`,
    }
  );
}
