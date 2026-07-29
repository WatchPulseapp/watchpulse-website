import type { Locale } from '@/lib/blog-locale';

/**
 * VideoObject markup for the trailers an article embeds.
 *
 * The blog competes for text results and nothing else today. A trailer roundup
 * that actually plays its trailers can appear in the video results too, which is
 * a separate surface with far less competition on "X trailer" queries — and one
 * the site is entitled to, because the videos really are on the page.
 *
 * Emitted only where TrailerStrip renders. Declaring a video on a page that does
 * not show one is the same mistake as declaring an FAQ that is not there.
 */

export interface ArticleVideo {
  youtubeKey: string;
  videoName: string;
  titleName: string;
  publishedAt?: string;
}

/**
 * @param fallbackDate the article's own date, used when TMDB gave no publish
 * date. uploadDate is required by Google, and omitting the whole video is worse
 * than dating it the day the article ran.
 */
export function videoSchemas(
  videos: ArticleVideo[],
  articleUrl: string,
  fallbackDate: string,
  locale: Locale = 'en'
): Record<string, unknown>[] {
  return videos.map((video) => {
    const uploaded = video.publishedAt || fallbackDate;
    const date = new Date(uploaded);

    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: `${video.titleName} — ${video.videoName}`,
      description:
        locale === 'tr'
          ? `${video.titleName} için ${video.videoName}.`
          : `${video.videoName} for ${video.titleName}.`,
      thumbnailUrl: [`https://i.ytimg.com/vi/${video.youtubeKey}/hqdefault.jpg`],
      uploadDate: Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeKey}`,
      contentUrl: `https://www.youtube.com/watch?v=${video.youtubeKey}`,
      inLanguage: locale === 'tr' ? 'tr-TR' : 'en-US',
      // Ties the video to the page it is on rather than leaving it floating.
      mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    };
  });
}
